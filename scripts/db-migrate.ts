import { config } from "dotenv";
config({ override: true });
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { getMigrateDb } from "@/lib/db";

async function main() {
  const db = getMigrateDb();
  console.log("Running migrations from ./drizzle ...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
}

main().catch((error: unknown) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
