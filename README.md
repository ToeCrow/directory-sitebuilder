# Directory Sitebuilder

Multi-tenant affiliate directory sites (Next.js) with a Postgres-backed CMS on branch `backend`.

Public `[siteSlug]` content is hydrated from PostgreSQL. Static TypeScript under `src/data/sites` remains the **seed / sitemap** source only — do not delete it in this MVP.

## Prerequisites

- Node.js 20+
- Docker Desktop (for local Postgres)

## Quick start (local)

```bash
cp .env.example .env
# Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (>= 16 chars)

npm install
npm run db:up
npm run db:migrate
npm run db:seed
npm run db:verify
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)
- Postgres host port: **5435** (mapped from container `5432` to avoid clashing with other local Postgres)

### Useful scripts

| Script | Purpose |
|--------|---------|
| `npm run db:up` / `db:down` | Start/stop Docker Postgres |
| `npm run db:generate` | Generate Drizzle migrations from schema |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Seed from static `src/data/sites` (aborts if sites already exist) |
| `npm run db:reset` | Truncate + re-seed (local only; blocks Neon-like URLs) |
| `npm run db:verify` | Integrity + hydrate parity checks |
| `npm run db:studio` | Drizzle Studio |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run build` | Production build (must succeed **without** Postgres running) |

### Environment

See `.env.example`:

- `DATABASE_URL` — runtime Postgres (local Docker or Neon pooled)
- `ADMIN_PASSWORD` — checked at login only (never stored in the session cookie)
- `ADMIN_SESSION_SECRET` — HMAC secret for the signed admin cookie

## Architecture (CMS MVP)

```
Postgres → repositories / hydrateSiteData → SiteData → public UI + SiteProvider
```

- Draft/published controls **visibility only**; saving a published row updates the public site immediately.
- Top-pick products cannot be unpublished/deleted until removed from top picks.
- Content routes use `force-dynamic` (no build-time DB queries).
- Sitemap / robots still use static seed modules (no DB at build). See [docs/cms-data-contract.md](docs/cms-data-contract.md).

## Neon (docs only — not wired)

When you move off Docker, use two URLs. Details: [docs/neon.md](docs/neon.md).

- `DATABASE_URL` — pooled connection for the Next.js app
- `DATABASE_URL_DIRECT` — direct connection for migrations (`drizzle-kit` / `db:migrate`)

Do **not** point local `db:reset` at Neon.

## Allowed static seed imports

| Location | Why |
|----------|-----|
| `scripts/db-seed.ts`, `scripts/db-verify.ts` | Seed + parity |
| `src/lib/sitemap.ts`, `src/app/robots.ts` | MVP sitemap/robots without build-time DB |

Public `[siteSlug]` pages and admin data UIs must use `@/lib/site` / admin repositories (Postgres), not `@/data/sites`.

## Phase 6 status

Docs + verification checklist: [docs/phase-6-verify.md](docs/phase-6-verify.md) · Neon notes: [docs/neon.md](docs/neon.md).

After `npm run build` (or stopping Postgres while `next dev` is running), restart the dev server so route caches stay fresh.
