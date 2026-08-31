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

/** Host + port from a postgres URL, without credentials. */
export function parseDatabaseHostPort(url: string): {
  host: string;
  port: string | undefined;
} {
  const target = describeDatabaseTarget(url);
  const colon = target.lastIndexOf(":");
  if (colon === -1) {
    return { host: target, port: undefined };
  }
  return { host: target.slice(0, colon), port: target.slice(colon + 1) };
}

/** Supabase transaction pooler (PgBouncer transaction mode), typically :6543. */
export function looksLikeTransactionPooler(url: string): boolean {
  const { host, port } = parseDatabaseHostPort(url);
  return host.toLowerCase().includes("pooler") && port === "6543";
}

/** Session-mode pooler (same host family, port 5432) — not a stable session for SET. */
export function looksLikeSessionPooler(url: string): boolean {
  const { host, port } = parseDatabaseHostPort(url);
  return host.toLowerCase().includes("pooler") && port === "5432";
}

export const RUNTIME_PING_TIMEOUT_MS = 2000;
export const RUNTIME_RECENT_LIVE_MS = 15_000;
export const RUNTIME_CONNECT_TIMEOUT_S = 5;
export const LOCAL_STATEMENT_TIMEOUT_MS = 8000;
export const LOCAL_LOCK_TIMEOUT_MS = 5000;

/** `next build` / prerender — not a frozen serverless isolate. */
export function isProductionBuild(
  env: NodeJS.Dict<string | undefined> = process.env,
): boolean {
  return (
    env.NEXT_PHASE === "phase-production-build" ||
    env.NEXT_PHASE === "phase-export"
  );
}

const NON_RETRYABLE_SQLSTATES = new Set([
  "23505",
  "23503",
  "23502",
  "23514",
  "23P01",
  "42601",
  "42501",
  "42P01",
  "42703",
  "42883",
  "22P02",
]);

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

/** Race a promise against a timer; always clear the timer so it cannot leak. */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new TimeoutError(`${label} timed out after ${ms}ms`));
    }, ms);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

function errorCode(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return undefined;
  }
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" ? code : undefined;
}

function flattenErrors(error: unknown): unknown[] {
  const out: unknown[] = [];
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && !seen.has(current)) {
    out.push(current);
    seen.add(current);
    if (typeof current === "object" && current !== null && "cause" in current) {
      current = (current as { cause?: unknown }).cause;
    } else {
      break;
    }
  }
  return out;
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      return message;
    }
  }
  return String(error);
}

const RETRYABLE_DRIVER_CODES = new Set([
  "CONNECTION_DESTROYED",
  "CONNECTION_CLOSED",
  "CONNECT_TIMEOUT",
  "53300",
  "57P01",
  "57P02",
  "57P03",
]);

export function isRetryableDbError(error: unknown): boolean {
  const chain = flattenErrors(error);
  if (chain.some((item) => item instanceof TimeoutError)) {
    return true;
  }

  const codes = chain.map(errorCode).filter((code): code is string => Boolean(code));
  if (codes.some((code) => NON_RETRYABLE_SQLSTATES.has(code))) {
    return false;
  }
  if (
    codes.some(
      (code) => code.startsWith("08") || RETRYABLE_DRIVER_CODES.has(code),
    )
  ) {
    return true;
  }

  const message = chain.map(errorMessage).join("\n");
  if (
    /unique violation|duplicate key|foreign key|violates foreign key constraint|syntax error|invalid input syntax/i.test(
      message,
    )
  ) {
    return false;
  }

  return /ECONNRESET|ECONNREFUSED|ETIMEDOUT|ENOTFOUND|CONNECT_TIMEOUT|CONNECTION_DESTROYED|CONNECTION_CLOSED|connection terminated|connection closed|Client has already been closed|too many clients|liveness ping|timed out after/i.test(
    message,
  );
}

/** postgres.js options: transaction pooler needs prepare: false. */
export function createRuntimeClientOptions(
  url: string,
  env: NodeJS.Dict<string | undefined> = process.env,
) {
  const remote = looksLikeRemoteDatabaseUrl(url);
  const serverless = env.VERCEL === "1";
  const constrained = remote || serverless;
  const sessionTimeoutsReliable = !remote;
  const productionBuild = isProductionBuild(env);
  const lifetimeCaps = constrained && !productionBuild;

  return {
    prepare: false as const,
    fetch_types: false as const,
    max: constrained ? 3 : 10,
    idle_timeout: lifetimeCaps ? 20 : 0,
    connect_timeout: RUNTIME_CONNECT_TIMEOUT_S,
    ...(lifetimeCaps ? { max_lifetime: 60 as const } : {}),
    ...(remote ? { ssl: "require" as const } : {}),
    ...(sessionTimeoutsReliable
      ? {
          connection: {
            statement_timeout: LOCAL_STATEMENT_TIMEOUT_MS,
            lock_timeout: LOCAL_LOCK_TIMEOUT_MS,
          },
        }
      : {}),
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
