import { drizzle } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import {
  createRuntimeClientOptions,
  describeDatabaseTarget,
  isProductionBuild,
  looksLikeSessionPooler,
  requireMigrationDatabaseUrl,
  requireRuntimeDatabaseUrl,
} from "./connection";
import { createRuntimeLifecycle } from "./runtime-lifecycle";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  runtimeSql?: Sql;
  runtimeDb?: Db;
  migrateSql?: Sql;
  migrateDb?: Db;
  warnedSessionPooler?: boolean;
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
      if (looksLikeSessionPooler(url) && !globalForDb.warnedSessionPooler) {
        globalForDb.warnedSessionPooler = true;
        console.warn(
          "[db] POSTGRES_URL looks like a session-mode pooler (:5432). Use the transaction pooler (:6543) for the Next.js runtime.",
        );
      }
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

async function pingRuntimeSql(): Promise<void> {
  const sql = globalForDb.runtimeSql;
  if (!sql) {
    throw new Error("runtime db client is missing");
  }
  await sql`SELECT 1`;
}

export async function recycleRuntimeClient(): Promise<void> {
  const sql = globalForDb.runtimeSql;
  globalForDb.runtimeSql = undefined;
  globalForDb.runtimeDb = undefined;
  if (!sql) {
    return;
  }
  try {
    await sql.end({ timeout: 1 });
  } catch {
    // The socket may already be dead; a new client is created on next use.
  }
}

const runtimeLifecycle = createRuntimeLifecycle<Db>({
  create: () => {
    getDb();
  },
  ping: pingRuntimeSql,
  recycle: recycleRuntimeClient,
  getDb,
  shouldPing: () => !isProductionBuild(),
});

/**
 * Run a runtime DB operation after a 2s liveness ping.
 * On a retryable connection failure: recycle the client and retry once.
 */
export const withRuntimeDb = runtimeLifecycle.withRuntimeDb;

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
  isProductionBuild,
  isRetryableDbError,
  looksLikeRemoteDatabaseUrl,
  looksLikeSessionPooler,
  looksLikeTransactionPooler,
  requireMigrationDatabaseUrl,
  requireRuntimeDatabaseUrl,
  resolveMigrationDatabaseUrl,
  resolveRuntimeDatabaseUrl,
  sanitizeDatabaseError,
  formatDatabaseLoadError,
} from "./connection";
