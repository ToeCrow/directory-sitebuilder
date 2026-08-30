import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createRuntimeClientOptions,
  describeDatabaseTarget,
  looksLikeRemoteDatabaseUrl,
  resolveMigrationDatabaseUrl,
  resolveRuntimeDatabaseUrl,
  sanitizeDatabaseError,
} from "./db/connection";

describe("resolveRuntimeDatabaseUrl", () => {
  it("prefers POSTGRES_URL over DATABASE_URL", () => {
    assert.equal(
      resolveRuntimeDatabaseUrl({
        POSTGRES_URL: "postgres://pool",
        DATABASE_URL: "postgres://docker",
      }),
      "postgres://pool",
    );
  });

  it("falls back to DATABASE_URL for local Docker", () => {
    assert.equal(
      resolveRuntimeDatabaseUrl({
        DATABASE_URL: "postgresql://directory:directory@localhost:5435/directory_cms",
      }),
      "postgresql://directory:directory@localhost:5435/directory_cms",
    );
  });

  it("ignores blank POSTGRES_URL", () => {
    assert.equal(
      resolveRuntimeDatabaseUrl({
        POSTGRES_URL: "  ",
        DATABASE_URL: "postgres://docker",
      }),
      "postgres://docker",
    );
  });
});

describe("resolveMigrationDatabaseUrl", () => {
  it("prefers POSTGRES_URL_NON_POOLING, then POSTGRES_URL, then DATABASE_URL", () => {
    assert.equal(
      resolveMigrationDatabaseUrl({
        POSTGRES_URL_NON_POOLING: "postgres://direct",
        POSTGRES_URL: "postgres://pool",
        DATABASE_URL: "postgres://docker",
      }),
      "postgres://direct",
    );
    assert.equal(
      resolveMigrationDatabaseUrl({
        POSTGRES_URL: "postgres://pool",
        DATABASE_URL: "postgres://docker",
      }),
      "postgres://pool",
    );
    assert.equal(
      resolveMigrationDatabaseUrl({
        DATABASE_URL: "postgres://docker",
      }),
      "postgres://docker",
    );
  });
});

describe("looksLikeRemoteDatabaseUrl", () => {
  it("treats Supabase and sslmode=require hosts as remote", () => {
    assert.equal(
      looksLikeRemoteDatabaseUrl(
        "postgresql://postgres.abc:pass@aws-0-eu.pooler.supabase.co:6543/postgres?sslmode=require",
      ),
      true,
    );
    assert.equal(
      looksLikeRemoteDatabaseUrl(
        "postgresql://postgres.abc:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require",
      ),
      true,
    );
    assert.equal(
      looksLikeRemoteDatabaseUrl(
        "postgresql://directory:directory@localhost:5435/directory_cms",
      ),
      false,
    );
  });
});

describe("createRuntimeClientOptions", () => {
  it("disables prepared statements and uses one connection on Vercel", () => {
    const options = createRuntimeClientOptions(
      "postgresql://directory:directory@localhost:5435/directory_cms",
      { VERCEL: "1" },
    );
    assert.equal(options.prepare, false);
    assert.equal(options.max, 1);
    assert.equal(options.ssl, undefined);
  });

  it("requires SSL against the Supabase pooler", () => {
    const options = createRuntimeClientOptions(
      "postgresql://postgres.abc:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require",
      { VERCEL: "1" },
    );
    assert.equal(options.prepare, false);
    assert.equal(options.ssl, "require");
    assert.equal(options.max, 1);
    assert.deepEqual(options.connection, {
      statement_timeout: 15000,
      lock_timeout: 8000,
    });
  });

  it("does not set lock timeouts against local Docker", () => {
    const options = createRuntimeClientOptions(
      "postgresql://directory:directory@localhost:5435/directory_cms",
      {},
    );
    assert.equal("connection" in options, false);
  });

  it("keeps a larger local pool without SSL", () => {
    const options = createRuntimeClientOptions(
      "postgresql://directory:directory@localhost:5435/directory_cms",
      {},
    );
    assert.equal(options.max, 10);
    assert.equal(options.ssl, undefined);
  });
});

describe("describeDatabaseTarget", () => {
  it("returns host and port without credentials", () => {
    assert.equal(
      describeDatabaseTarget(
        "postgresql://postgres.abc:s3cret@aws-0-us-east-1.pooler.supabase.com:6543/postgres",
      ),
      "aws-0-us-east-1.pooler.supabase.com:6543",
    );
  });
});

describe("sanitizeDatabaseError", () => {
  it("redacts connection strings from driver messages", () => {
    assert.equal(
      sanitizeDatabaseError(
        new Error("connect failed postgres://user:pass@host:6543/postgres"),
      ),
      "connect failed postgres://redacted",
    );
  });
});
