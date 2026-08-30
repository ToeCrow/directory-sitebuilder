import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  looksLikeRemoteDatabaseUrl,
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
        "postgresql://directory:directory@localhost:5435/directory_cms",
      ),
      false,
    );
  });
});
