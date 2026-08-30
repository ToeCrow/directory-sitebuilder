import { defineConfig } from "drizzle-kit";
import { resolveMigrationDatabaseUrl } from "./src/lib/db/connection";

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url:
      resolveMigrationDatabaseUrl() ??
      "postgresql://directory:directory@localhost:5435/directory_cms",
  },
});
