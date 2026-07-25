# Neon prep (docs only)

Not connected in this MVP. Local development continues to use Docker Postgres via `DATABASE_URL` (see `.env.example` and `docker-compose.yml`).

## Dual URL pattern

Neon (and similar serverless Postgres) typically exposes:

| Variable | Use |
|----------|-----|
| `DATABASE_URL` | **Pooled** connection string for the Next.js runtime (`getDb()` / server actions). Prefer the pooler endpoint. |
| `DATABASE_URL_DIRECT` | **Direct** (non-pooled) connection for schema migrations (`drizzle-kit`, `npm run db:migrate`). |

Why two URLs: migration tools need session-level features that pooled connections may not support; the app benefits from pooling under serverless concurrency.

## Suggested `.env` shape (future)

```bash
# App / runtime (pooled)
DATABASE_URL=postgresql://USER:PASS@HOST-pooler/neondb?sslmode=require

# Migrations only (direct)
DATABASE_URL_DIRECT=postgresql://USER:PASS@HOST/neondb?sslmode=require
```

When wiring this up:

1. Point `drizzle.config.ts` / migrate scripts at `DATABASE_URL_DIRECT` (fallback to `DATABASE_URL` for local Docker).
2. Keep `getDb()` on `DATABASE_URL` only.
3. Never run `npm run db:reset` against Neon — the reset script refuses non-local URLs by design.
4. After Neon: consider DB-backed sitemap + on-demand revalidation (today sitemap stays on static seed).

## Out of scope for this branch

- Creating a Neon project
- Vercel env wiring / deploy
- Merging `backend` into `develop` / `main`
