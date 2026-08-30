function firstDefined(
  env: NodeJS.Dict<string | undefined>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = env[key]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
}

/** App runtime: Vercel/Supabase pooled URL, then local Docker. */
export function resolveRuntimeDatabaseUrl(
  env: NodeJS.Dict<string | undefined> = process.env,
): string | undefined {
  return firstDefined(env, "POSTGRES_URL", "DATABASE_URL");
}

/**
 * Migrations, seed, reset, verify, drizzle-kit.
 * Prefer the Supabase direct URL when the integration provides it.
 */
export function resolveMigrationDatabaseUrl(
  env: NodeJS.Dict<string | undefined> = process.env,
): string | undefined {
  return firstDefined(
    env,
    "POSTGRES_URL_NON_POOLING",
    "POSTGRES_URL",
    "DATABASE_URL",
  );
}

export function requireRuntimeDatabaseUrl(
  env: NodeJS.Dict<string | undefined> = process.env,
): string {
  const url = resolveRuntimeDatabaseUrl(env);
  if (!url) {
    throw new Error(
      "POSTGRES_URL or DATABASE_URL is not set. For local Docker, copy .env.example to .env and run npm run db:up. On Vercel, use the Supabase integration (POSTGRES_URL) — do not add a manual DATABASE_URL.",
    );
  }
  return url;
}

export function requireMigrationDatabaseUrl(
  env: NodeJS.Dict<string | undefined> = process.env,
): string {
  const url = resolveMigrationDatabaseUrl(env);
  if (!url) {
    throw new Error(
      "POSTGRES_URL_NON_POOLING, POSTGRES_URL, or DATABASE_URL is not set. For local Docker, copy .env.example to .env and run npm run db:up.",
    );
  }
  return url;
}

export function looksLikeRemoteDatabaseUrl(url: string): boolean {
  const lower = url.toLowerCase();
  if (lower.includes("supabase.co") || lower.includes("supabase.com")) {
    return true;
  }
  if (lower.includes("neon.tech")) {
    return true;
  }
  if (lower.includes("sslmode=require") && !lower.includes("localhost")) {
    return true;
  }
  return false;
}

export function describeDatabaseTarget(url: string): string {
  const withoutProtocol = url.replace(/^[a-z]+:\/\//i, "");
  const at = withoutProtocol.lastIndexOf("@");
  const hostPart =
    at === -1 ? withoutProtocol : withoutProtocol.slice(at + 1);
  return hostPart.split(/[/?]/)[0] || "unknown-host";
}

/** postgres.js options: transaction pooler needs prepare: false. */
export function createRuntimeClientOptions(
  url: string,
  env: NodeJS.Dict<string | undefined> = process.env,
) {
  const remote = looksLikeRemoteDatabaseUrl(url);
  const serverless = env.VERCEL === "1";
  return {
    prepare: false as const,
    max: remote || serverless ? 1 : 10,
    idle_timeout: remote || serverless ? 20 : 0,
    connect_timeout: 10,
    ...(remote ? { ssl: "require" as const } : {}),
  };
}

export function sanitizeDatabaseError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "postgres://redacted")
    .replace(/password[=:]\S+/gi, "password=redacted");
}

export function formatDatabaseLoadError(error: unknown): string {
  const url = resolveRuntimeDatabaseUrl();
  const target = url
    ? describeDatabaseTarget(url)
    : "POSTGRES_URL/DATABASE_URL is not set";
  return `${target}\n${sanitizeDatabaseError(error)}`;
}
