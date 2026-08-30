import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import {
  createRuntimeClientOptions,
  describeDatabaseTarget,
  requireMigrationDatabaseUrl,
  requireRuntimeDatabaseUrl,
} from "./connection";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  runtimeSql?: Sql;
  runtimeDb?: Db;
  migrateSql?: Sql;
  migrateDb?: Db;
};

function getOrCreateDb(
  url: string,
  slot: "runtime" | "migrate",
): Db {
  const sqlKey = slot === "runtime" ? "runtimeSql" : "migrateSql";
  const dbKey = slot === "runtime" ? "runtimeDb" : "migrateDb";

  if (!globalForDb[sqlKey]) {
    const sql = postgres(url, createRuntimeClientOptions(url));
    if (slot === "runtime") {
      console.info(
        `[db] runtime client → ${describeDatabaseTarget(url)}`,
      );
    }
    globalForDb[sqlKey] = sql;
  }
  if (!globalForDb[dbKey]) {
    globalForDb[dbKey] = drizzle({ client: globalForDb[sqlKey]!, schema });
  }
  return globalForDb[dbKey]!;
}

/** Lazy Drizzle client for the Next.js app — no connection on module import. */
export function getDb(): Db {
  return getOrCreateDb(requireRuntimeDatabaseUrl(), "runtime");
}

/** Direct/non-pooling connection for migrate, seed, reset, and verify. */
export function getMigrateDb(): Db {
  return getOrCreateDb(requireMigrationDatabaseUrl(), "migrate");
}

export async function closeDb(): Promise<void> {
  const runtimeSql = globalForDb.runtimeSql;
  const migrateSql = globalForDb.migrateSql;
  globalForDb.runtimeSql = undefined;
  globalForDb.runtimeDb = undefined;
  globalForDb.migrateSql = undefined;
  globalForDb.migrateDb = undefined;
  await Promise.all([
    runtimeSql?.end({ timeout: 5 }),
    migrateSql?.end({ timeout: 5 }),
  ]);
}

export type { Db };
export type DbOrTx = Db | Parameters<Parameters<Db["transaction"]>[0]>[0];
export * from "./schema";
export {
  createRuntimeClientOptions,
  describeDatabaseTarget,
  looksLikeRemoteDatabaseUrl,
  requireMigrationDatabaseUrl,
  requireRuntimeDatabaseUrl,
  resolveMigrationDatabaseUrl,
  resolveRuntimeDatabaseUrl,
  sanitizeDatabaseError,
  formatDatabaseLoadError,
} from "./connection";
