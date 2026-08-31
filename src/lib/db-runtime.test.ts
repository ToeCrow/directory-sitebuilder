import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { TimeoutError, isRetryableDbError, withTimeout } from "./db/connection";
import { createRuntimeLifecycle } from "./db/runtime-lifecycle";

describe("withTimeout", () => {
  it("resolves when the work finishes first and does not leak a timer", async () => {
    const value = await withTimeout(Promise.resolve("ok"), 50, "fast");
    assert.equal(value, "ok");
  });

  it("rejects with TimeoutError when the work hangs", async () => {
    await assert.rejects(
      () => withTimeout(new Promise(() => undefined), 20, "hanging ping"),
      (error: unknown) => {
        assert.equal(error instanceof TimeoutError, true);
        assert.match((error as Error).message, /hanging ping timed out after 20ms/);
        return true;
      },
    );
  });
});

describe("isRetryableDbError", () => {
  it("retries connection failures and ping timeouts", () => {
    assert.equal(isRetryableDbError(new TimeoutError("runtime db liveness ping timed out after 2000ms")), true);
    assert.equal(isRetryableDbError(new Error("ECONNRESET")), true);
    assert.equal(isRetryableDbError(new Error("connection terminated unexpectedly")), true);
    assert.equal(isRetryableDbError({ code: "08006", message: "connection failure" }), true);
    assert.equal(
      isRetryableDbError(
        Object.assign(new Error("write CONNECTION_DESTROYED host:6543"), {
          code: "CONNECTION_DESTROYED",
        }),
      ),
      true,
    );
  });

  it("retries drizzle-wrapped CONNECTION_DESTROYED on the cause chain", () => {
    const cause = Object.assign(
      new Error("write CONNECTION_DESTROYED aws-0-us-east-1.pooler.supabase.com:6543"),
      { code: "CONNECTION_DESTROYED" },
    );
    const wrapped = Object.assign(
      new Error('Failed query: select "id" from "sites" where "sites"."slug" = $1'),
      { cause },
    );
    assert.equal(isRetryableDbError(wrapped), true);
  });

  it("does not retry unique, foreign-key, or syntax errors", () => {
    assert.equal(isRetryableDbError({ code: "23505", message: "duplicate key" }), false);
    assert.equal(isRetryableDbError({ code: "23503", message: "foreign key" }), false);
    assert.equal(isRetryableDbError({ code: "42601", message: "syntax error" }), false);
    assert.equal(isRetryableDbError(new Error("duplicate key value violates unique constraint")), false);
  });
});

describe("createRuntimeLifecycle", () => {
  it("pings a healthy client and does not recycle", async () => {
    const events: string[] = [];
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => events.push("create"),
      ping: async () => {
        events.push("ping");
      },
      recycle: async () => {
        events.push("recycle");
      },
      getDb: () => "db",
    });

    const result = await withRuntimeDb(async (db) => {
      events.push(`fn:${db}`);
      return "ok";
    });

    assert.equal(result, "ok");
    assert.deepEqual(events, ["create", "ping", "fn:db"]);
  });

  it("recycles after a ping timeout then pings the new client", async () => {
    const events: string[] = [];
    let pings = 0;
    const { ensureLiveRuntimeClient } = createRuntimeLifecycle({
      create: () => events.push("create"),
      ping: async () => {
        pings += 1;
        events.push(`ping:${pings}`);
        if (pings === 1) {
          throw new TimeoutError("runtime db liveness ping timed out after 2000ms");
        }
      },
      recycle: async () => {
        events.push("recycle");
      },
      getDb: () => "db",
    });

    await ensureLiveRuntimeClient();
    assert.deepEqual(events, ["create", "ping:1", "recycle", "create", "ping:2"]);
  });

  it("retries a retryable operation error once after recycle", async () => {
    const events: string[] = [];
    let attempts = 0;
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => events.push("create"),
      ping: async () => {
        events.push("ping");
      },
      recycle: async () => {
        events.push("recycle");
      },
      getDb: () => "db",
    });

    const result = await withRuntimeDb(async () => {
      attempts += 1;
      events.push(`fn:${attempts}`);
      if (attempts === 1) {
        throw new Error("ECONNRESET");
      }
      return "ok";
    });

    assert.equal(result, "ok");
    assert.equal(attempts, 2);
    assert.deepEqual(events, [
      "create",
      "ping",
      "fn:1",
      "recycle",
      "create",
      "ping",
      "fn:2",
    ]);
  });

  it("throws when the second attempt fails", async () => {
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => undefined,
      ping: async () => undefined,
      recycle: async () => undefined,
      getDb: () => "db",
    });

    await assert.rejects(
      () =>
        withRuntimeDb(async () => {
          throw new Error("connection terminated");
        }),
      /connection terminated/,
    );
  });

  it("does not retry a non-retryable error", async () => {
    let recycleCount = 0;
    let attempts = 0;
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => undefined,
      ping: async () => undefined,
      recycle: async () => {
        recycleCount += 1;
      },
      getDb: () => "db",
    });

    await assert.rejects(
      () =>
        withRuntimeDb(async () => {
          attempts += 1;
          throw Object.assign(new Error("duplicate key"), { code: "23505" });
        }),
      /duplicate key/,
    );
    assert.equal(attempts, 1);
    assert.equal(recycleCount, 0);
  });

  it("retries the operation at most once", async () => {
    let attempts = 0;
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => undefined,
      ping: async () => undefined,
      recycle: async () => undefined,
      getDb: () => "db",
    });

    await assert.rejects(
      () =>
        withRuntimeDb(async () => {
          attempts += 1;
          throw new Error("ECONNRESET");
        }),
      /ECONNRESET/,
    );
    assert.equal(attempts, 2);
  });

  it("retries a drizzle-wrapped CONNECTION_DESTROYED once", async () => {
    let attempts = 0;
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => undefined,
      ping: async () => undefined,
      recycle: async () => undefined,
      getDb: () => "db",
    });

    const result = await withRuntimeDb(async () => {
      attempts += 1;
      if (attempts === 1) {
        const cause = Object.assign(
          new Error("write CONNECTION_DESTROYED host:6543"),
          { code: "CONNECTION_DESTROYED" },
        );
        throw Object.assign(new Error("Failed query: select 1"), { cause });
      }
      return "ok";
    });

    assert.equal(result, "ok");
    assert.equal(attempts, 2);
  });

  it("skips ping during production build", async () => {
    const events: string[] = [];
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => events.push("create"),
      ping: async () => {
        events.push("ping");
      },
      recycle: async () => {
        events.push("recycle");
      },
      getDb: () => "db",
      shouldPing: () => false,
    });

    await withRuntimeDb(async (db) => {
      events.push(`fn:${db}`);
      return "ok";
    });

    assert.deepEqual(events, ["create", "fn:db"]);
  });

  it("skips ping when the client was live recently", async () => {
    const events: string[] = [];
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => events.push("create"),
      ping: async () => {
        events.push("ping");
      },
      recycle: async () => {
        events.push("recycle");
      },
      getDb: () => "db",
    });

    await withRuntimeDb(async () => "one");
    await withRuntimeDb(async () => "two");

    assert.deepEqual(events, ["create", "ping", "create"]);
  });

  it("shares one ping across concurrent callers", async () => {
    let pingCount = 0;
    let releasePing: (() => void) | undefined;
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => undefined,
      ping: () => {
        pingCount += 1;
        return new Promise<void>((resolve) => {
          releasePing = resolve;
        });
      },
      recycle: async () => undefined,
      getDb: () => "db",
    });

    const first = withRuntimeDb(async () => "a");
    const second = withRuntimeDb(async () => "b");
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert.equal(pingCount, 1);
    assert.equal(typeof releasePing, "function");
    releasePing!();
    assert.deepEqual(await Promise.all([first, second]), ["a", "b"]);
    assert.equal(pingCount, 1);
  });

  it("does not recycle on ping timeout while another query is in flight", async () => {
    let pings = 0;
    let recycleCount = 0;
    let releaseFirst: (() => void) | undefined;
    const { withRuntimeDb } = createRuntimeLifecycle({
      create: () => undefined,
      ping: async () => {
        pings += 1;
        if (pings > 1) {
          throw new TimeoutError("runtime db liveness ping timed out after 2000ms");
        }
      },
      recycle: async () => {
        recycleCount += 1;
      },
      getDb: () => "db",
    });

    const first = withRuntimeDb(async () => {
      await new Promise<void>((resolve) => {
        releaseFirst = resolve;
      });
      return "a";
    });
    await new Promise((resolve) => setTimeout(resolve, 20));

    const second = withRuntimeDb(async () => "b");
    await new Promise((resolve) => setTimeout(resolve, 20));
    releaseFirst!();

    assert.deepEqual(await Promise.all([first, second]), ["a", "b"]);
    assert.equal(pings, 1);
    assert.equal(recycleCount, 0);
  });
});
