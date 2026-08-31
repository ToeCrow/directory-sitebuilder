# Hosted Postgres (Supabase)

Local development continues to use Docker Postgres via `DATABASE_URL` (see `.env.example` and `docker-compose.yml`).

On Vercel, use the Supabase integration. It provides `POSTGRES_URL` (transaction pooler, typically port **6543**) and `POSTGRES_URL_NON_POOLING` (direct). Do **not** add a manual `DATABASE_URL` in Vercel. Do **not** point the Next.js runtime at the session-mode pooler (`:5432`) or the direct URL.

The runtime client uses `prepare: false`, `fetch_types: false`, `max: 3`, `connect_timeout: 5`, `idle_timeout: 20`, and `max_lifetime: 60`. It pings with a 2s client-side timeout and recycles a stale postgres.js client instead of hanging. `statement_timeout` / `lock_timeout` are set only on local/direct connections; they are not a reliable session setting through the transaction pooler.

Click tracking (`incrementClick`) retries once on connection failure. That is at-least-once: a rare drop after commit can count the same click twice. Do not reuse that write-retry on critical writes without idempotency.

## URL resolution

| Use | Resolution |
|-----|------------|
| Next.js runtime (`getDb()`) | `POSTGRES_URL` ?? `DATABASE_URL` |
| `db:migrate` / `db:seed` / `db:reset` / `db:verify` / drizzle-kit | `POSTGRES_URL_NON_POOLING` ?? `POSTGRES_URL` ?? `DATABASE_URL` |

Never run `npm run db:reset` against Supabase — the reset script refuses remote URLs.
