import { config } from "dotenv";
config({ override: true });
import { sql } from "drizzle-orm";
import {
  getMigrateDb,
  looksLikeRemoteDatabaseUrl,
  requireMigrationDatabaseUrl,
} from "@/lib/db";
import { seedDatabase } from "./db-seed";

async function resetDatabase() {
  const db = getMigrateDb();

  await db.execute(sql`
    TRUNCATE TABLE
      daily_link_clicks,
      tracked_links,
      article_product_sections,
      articles,
      site_top_picks,
      products,
      comparison_rows,
      site_sections,
      site_heroes,
      site_domains,
      faqs,
      buying_guide_sections,
      footer_links,
      sites
    RESTART IDENTITY CASCADE
  `);
}

async function main() {
  const databaseUrl = requireMigrationDatabaseUrl();

  if (looksLikeRemoteDatabaseUrl(databaseUrl)) {
    console.error(
      "Reset refused: the migration URL looks like a remote/production database.",
    );
    console.error(
      "Reset is allowed only for local databases (not Supabase, not neon.tech, and not sslmode=require without localhost).",
    );
    process.exit(1);
  }

  console.log("Truncating all CMS tables...");
  await resetDatabase();
  console.log("Tables truncated. Re-seeding...");

  const counts = await seedDatabase();
  console.log("Reset and re-seed complete:");
  for (const [key, value] of Object.entries(counts)) {
    console.log(`  ${key}: ${value}`);
  }
}

main().catch((error: unknown) => {
  console.error("Reset failed:", error);
  process.exit(1);
});
