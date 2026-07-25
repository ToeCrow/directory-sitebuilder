import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
  drizzleDb?: Db;
};

function requireDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Start Postgres (npm run db:up) and copy .env.example to .env.",
    );
  }
  return url;
}

function getPool(): Pool {
  if (!globalForDb.pgPool) {
    globalForDb.pgPool = new Pool({ connectionString: requireDatabaseUrl() });
  }
  return globalForDb.pgPool;
}

/** Lazy Drizzle client — no connection on module import. */
export function getDb(): Db {
  if (!globalForDb.drizzleDb) {
    globalForDb.drizzleDb = drizzle(getPool(), { schema });
  }
  return globalForDb.drizzleDb;
}

export type { Db };
export type DbOrTx = Db | Parameters<Parameters<Db["transaction"]>[0]>[0];
export * from "./schema";
