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
});
