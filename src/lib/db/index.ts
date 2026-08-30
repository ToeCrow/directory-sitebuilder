import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  createPoolConfig,
  describeDatabaseTarget,
  requireMigrationDatabaseUrl,
  requireRuntimeDatabaseUrl,
} from "./connection";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  runtimePool?: Pool;
  runtimeDb?: Db;
  migratePool?: Pool;
  migrateDb?: Db;
};

function getOrCreateDb(
  url: string,
  slot: "runtime" | "migrate",
): Db {
  const poolKey = slot === "runtime" ? "runtimePool" : "migratePool";
  const dbKey = slot === "runtime" ? "runtimeDb" : "migrateDb";

  if (!globalForDb[poolKey]) {
    const config = createPoolConfig(url);
    const pool = new Pool(config);
    pool.on("error", (error) => {
      console.error("[db] pool error", error);
    });
    if (slot === "runtime") {
      console.info(
        `[db] runtime pool → ${describeDatabaseTarget(config.connectionString ?? url)}`,
      );
    }
    globalForDb[poolKey] = pool;
  }
  if (!globalForDb[dbKey]) {
    globalForDb[dbKey] = drizzle(globalForDb[poolKey]!, { schema });
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
  const runtimePool = globalForDb.runtimePool;
  const migratePool = globalForDb.migratePool;
  globalForDb.runtimePool = undefined;
  globalForDb.runtimeDb = undefined;
  globalForDb.migratePool = undefined;
  globalForDb.migrateDb = undefined;
  await Promise.all([runtimePool?.end(), migratePool?.end()]);
}

export type { Db };
export type DbOrTx = Db | Parameters<Parameters<Db["transaction"]>[0]>[0];
export * from "./schema";
export {
  createPoolConfig,
  describeDatabaseTarget,
  looksLikeRemoteDatabaseUrl,
  requireMigrationDatabaseUrl,
  requireRuntimeDatabaseUrl,
  resolveMigrationDatabaseUrl,
  resolveRuntimeDatabaseUrl,
  rewriteTransactionPoolerToSession,
} from "./connection";
