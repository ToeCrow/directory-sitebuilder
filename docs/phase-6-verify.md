# Phase 6 verification checklist

Branch: `backend`. Local Docker Postgres + localhost remain the supported runtime. Neon is docs-only.

## Docs delivered

- [README.md](../README.md) — local CMS quick start, scripts, architecture, allowed seed imports
- [docs/neon.md](./neon.md) — `DATABASE_URL` (pooled) vs `DATABASE_URL_DIRECT` (migrations)
- [docs/cms-data-contract.md](./cms-data-contract.md) — Neon + allowed `@/data/sites` imports

## Static seed import audit

Allowed:

- `scripts/db-seed.ts`, `scripts/db-verify.ts`
- `src/lib/sitemap.ts`, `src/app/robots.ts`

Platform hub (`src/app/page.tsx`) uses `@/lib/site` (Postgres). Static seed is **not** deleted.

## Automated checks (run locally)

```bash
npm run typecheck
npm run lint
npm run db:down   # optional: prove build needs no DB
npm run build
npm run db:up
npm run db:verify
```

After `db:down` / `next build`, restart `npm run dev` so the dev server is not stuck on a stale `.next` cache (`x-nextjs-prerender` 404s).

## Smoke (production)

With Postgres up:

```bash
npm run build
npx next start -p 3010
```

Expect HTTP 200 for:

- `/`
- `/side-sleeper`, `/side-sleeper/products/winkbed`, `/side-sleeper/research-score`, `/side-sleeper/affiliate`, article slug
- `/construction-software`, `/construction-software/products/procore`
- `/sitemap.xml`, `/robots.txt`

## Persistence

Docker volume `directory_cms_pgdata` retains data across `db:down` / `db:up`. `db:verify` after restart confirms counts and hydrate parity.

## Explicit non-goals (unchanged)

No Neon connection, no Vercel deploy, no merge to `develop`/`main`, no deletion of `src/data/sites`.
