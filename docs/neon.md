# Hosted Postgres (Supabase)

Local development continues to use Docker Postgres via `DATABASE_URL` (see `.env.example` and `docker-compose.yml`).

On Vercel, use the Supabase integration. It provides `POSTGRES_URL` (pooled) and `POSTGRES_URL_NON_POOLING` (direct). Do **not** add a manual `DATABASE_URL` in Vercel.

## URL resolution

| Use | Resolution |
|-----|------------|
| Next.js runtime (`getDb()`) | `POSTGRES_URL` ?? `DATABASE_URL` |
| `db:migrate` / `db:seed` / `db:reset` / `db:verify` / drizzle-kit | `POSTGRES_URL_NON_POOLING` ?? `POSTGRES_URL` ?? `DATABASE_URL` |

Never run `npm run db:reset` against Supabase — the reset script refuses remote URLs.
