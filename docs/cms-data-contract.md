# CMS data contract (Phase 0)

Branch: `backend`. Storage decisions for hydrating a complete `SiteData` from PostgreSQL.

## Publication semantics

Publication status controls visibility only. Editing and saving an already published entity updates the public content immediately. Separate draft revisions of published content are outside this MVP.

- `draft` — not shown on the public site
- `published` — shown on the public site
- Applies to: `sites`, `products`, `articles`

## Top picks

A product referenced by a top pick cannot be unpublished or deleted until the top-pick relation has been removed.

- Top picks have no separate publish status
- Public when site is published **and** product is published
- Admin must not create/keep a top pick pointing at a draft product

## Field → storage map

| SiteData path | Storage | Notes |
|---------------|---------|-------|
| `slug`, `title`, `metaTitle`, `metaDescription`, `niche`, `siteUrl` | `sites` columns | |
| `headerBrandImage` | `sites.header_brand_image` | public asset path |
| `affiliateDisclosure` | `sites.affiliate_disclosure` | |
| `newsletter.*` | `sites.newsletter_*` columns | |
| `ads.slots.primary/secondary` | `sites.ads_primary/secondary` | |
| `status` / publish | `sites.status`, `published_at` | |
| Research Score feature flag | `sites.features` jsonb `{ researchScorePage: true }` | page body stays in code |
| `hero.*` | `site_heroes` 1:1 | |
| `topPicks.title/description` | `site_sections` key `top-picks` | |
| `productDirectory.*` | `site_sections` key `product-directory` | |
| `comparisonTable` title/description/rowHeaderLabel | `site_sections` key `comparison-table` (+ config) | |
| `buyingGuide.title` | `site_sections` key `buying-guide` | |
| `footer.tagline` | `site_sections` key `footer` | |
| `comparisonTable.rows` | `comparison_rows` | sort_order |
| `products[]` | `products` | |
| `products[].features/pros/cons` | `text[]` | |
| `products[].comparison` | `jsonb` | admin forms for known keys |
| `products[].researchScoreBreakdown` | `jsonb` nullable | storage only |
| `products[].featuredRank` | derived from `site_top_picks.sort_order` | |
| `products[].directoryOrder` | `products.directory_sort_order` | |
| `products[].comparisonRank` | `products.comparison_rank` | |
| Top pick membership | `site_top_picks` | FK product RESTRICT |
| `faqs[]` | `faqs` | sort_order |
| `buyingGuide.sections[]` | `buying_guide_sections` | sort_order |
| `footer.links[]` | `footer_links` | sort_order |
| `articles[]` | `articles` | intro `text[]` |
| `articles[].products[]` | `article_product_sections` | **no** product FK; why/where `text[]` |
| Domains | `site_domains` | schema only; routing stays hardcoded |

## Asset paths (not editable raster text)

Under `/public/sites/side-sleeper/`: hero, hero-mobile, header-brand, og-default, article images, favicon. Paths stored as text; PNG text is not CMS-editable.

## Runtime-derived / code-owned (not DB content)

- Research Score page body (`research-score/page.tsx`)
- Affiliate page intro copy
- Header nav structure/labels (articles list from data)
- Footer year
- Schema.org builders
- `getComparisonValue` helper

## Sitemap (MVP)

`src/lib/sitemap.ts` continues to import **static** `src/data/sites` seed modules — no DB at build time. TODO after Neon: DB-backed sitemap.

## Local Postgres (branch `backend`)

1. Copy `.env.example` → `.env` (set `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `DATABASE_URL`)
2. Host port is **5435** (avoids clash with other local Postgres on 5432)
3. `npm run db:up` → `db:migrate` → `db:seed` → `db:verify`
4. Public `[siteSlug]` routes read Postgres (`force-dynamic`). Sitemap/robots stay on static seed.
5. Admin CMS: Sites (settings/hero/sections), Products, Top picks, Comparison, FAQ, Buying guide, Footer, Articles.

## Neon (docs only)

See [neon.md](./neon.md). Dual URL (`DATABASE_URL` pooled + `DATABASE_URL_DIRECT` for migrations) is documented but not wired. Local Docker remains the supported runtime.

## Allowed `@/data/sites` imports (Phase 6)

| Path | Role |
|------|------|
| `scripts/db-seed.ts`, `scripts/db-verify.ts` | Seed + verify |
| `src/lib/sitemap.ts`, `src/app/robots.ts` | Sitemap / robots without build-time DB |

Everything else (public content, platform hub, admin) uses Postgres via `@/lib/site` or `src/lib/admin/*`. Static seed modules are **not** deleted in this MVP.

