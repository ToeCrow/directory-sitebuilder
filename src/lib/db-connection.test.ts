import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createPoolConfig,
  describeDatabaseTarget,
  looksLikeRemoteDatabaseUrl,
  rewriteTransactionPoolerToSession,
  resolveMigrationDatabaseUrl,
  resolveRuntimeDatabaseUrl,
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

describe("rewriteTransactionPoolerToSession", () => {
  it("moves shared pooler traffic off transaction port 6543", () => {
    assert.equal(
      rewriteTransactionPoolerToSession(
        "postgresql://postgres.abc:pass@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require",
      ),
      "postgresql://postgres.abc:pass@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require",
    );
  });

  it("leaves direct and local URLs unchanged", () => {
    assert.equal(
      rewriteTransactionPoolerToSession(
        "postgresql://postgres:pass@db.abc.supabase.co:5432/postgres?sslmode=require",
      ),
      "postgresql://postgres:pass@db.abc.supabase.co:5432/postgres?sslmode=require",
    );
    assert.equal(
      rewriteTransactionPoolerToSession(
        "postgresql://postgres:pass@db.abc.supabase.co:6543/postgres?sslmode=require",
      ),
      "postgresql://postgres:pass@db.abc.supabase.co:6543/postgres?sslmode=require",
    );
    assert.equal(
      rewriteTransactionPoolerToSession(
        "postgresql://directory:directory@localhost:5435/directory_cms",
      ),
      "postgresql://directory:directory@localhost:5435/directory_cms",
    );
  });
});

describe("createPoolConfig", () => {
  it("uses a single connection on Vercel", () => {
    const config = createPoolConfig(
      "postgresql://directory:directory@localhost:5435/directory_cms",
      { VERCEL: "1" },
    );
    assert.equal(config.max, 1);
    assert.equal(config.connectionTimeoutMillis, 8_000);
  });

  it("keeps a larger local pool", () => {
    const config = createPoolConfig(
      "postgresql://directory:directory@localhost:5435/directory_cms",
      {},
    );
    assert.equal(config.max, 10);
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
