# Site architecture

How we build and extend directory sites in this app. Read this before adding a fourth site or a new page.

The three live sites — Construction Software, Side Sleeper, FindWorthNow — are reference implementations, not special cases. New sites reuse their **theme**, **features**, **sections**, and **components**. They do not get `if (slug === "...")` branches.

Capability logic lives in [`src/lib/site-config.ts`](../src/lib/site-config.ts). UI asks the site what it can do; it does not ask which historical site it is.

## Site

A site is identity plus capabilities:

- identity: slug, name, domain, status (DB `sites` + seed)
- `theme`
- `features`
- `articleConfig` (when `articles` is on)
- `homepageSections`

In this milestone the capability map is still keyed by slug **only** in `SITE_CAPABILITIES`. That is the single allowed slug→behavior table. Frontend code uses `siteHasFeature`, `getSiteTheme`, `getArticleConfig`, `getEnabledHomepageSections`, `getRouteAccess`, and `getSiteNavigation`.

Do not add a `site.type` that replaces slug checks (`site.type === "findworthnow"`).

## Features

Features are capabilities, not niches.

| Feature | Meaning |
| --- | --- |
| `products` | Product index `/products` |
| `catalog` | Editorial category routes `/{category}` and catalog UI |
| `articles` | Long-form editorial content (one content system) |
| `faq` | FAQ block / `#faq` nav |
| `comparison` | Comparison table / `#compare` |
| `buying-guide` | `/buying-guide` |
| `about` | `/about` |
| `privacy` | `/privacy-policy` |
| `affiliate` | `/affiliate` partnerships page |
| `affiliate-disclosure` | `/affiliate-disclosure` |
| `ads` | AdSense script |
| `product-nav` | Mattress/pillow/topper product + review filters in nav |

Query with `siteHasFeature(site, "comparison")`, never `slug === "construction-software"`.

The DB column `sites.features` jsonb is a **different** bag today (`researchScorePage`, `featuredReviewSlugs`). Do not dump platform capabilities into it until we migrate config to Postgres on purpose.

## Article content

Reviews, Blog, and Articles are the **same** content system:

- same backend model (later: one Article table / editor / publish flow)
- different public label and route per site

```ts
articleConfig: { label: "Reviews", route: "reviews" }
// or
articleConfig: { label: "Blog", route: "blog" }
```

Construction and Side Sleeper both use **Reviews** at `/reviews`. FindWorthNow uses **Blog** at `/blog`. There is no `/articles` public route. The proxy still redirects `/articles` → `/reviews`.

FindWorthNow product pages at `/{category}/{reviewSlug}` are **catalog** product reviews, not Article content.

Current data sources (unchanged this milestone):

- Construction / Side Sleeper articles: Postgres
- FindWorthNow blog: `src/data/sites/findworthnow/blog.ts` via `directory-blog.ts`

When the editor is built, it is one Article editor. Extra fields go on `kind` (`editorial`, `roundup`, `product-review`, `guide`), not a second CMS.

## Themes

Presentation only. Independent of slug and of features.

| Theme | Tokens | Used by |
| --- | --- | --- |
| `default` | slate / blue | Construction Software |
| `paper` | `ss-*` | Side Sleeper |
| `editorial-dark` | `fwn-*` | FindWorthNow |

`getThemeClasses(theme)` in [`src/lib/site-theme.ts`](../src/lib/site-theme.ts). Do not rename CSS tokens in a behavior refactor.

## Templates / presets

Presets are **start configuration**, not a runtime type system.

| Preset | Roughly | Theme + notable features |
| --- | --- | --- |
| `directory` | Construction | default, comparison, ratings, full home |
| `review` | Side Sleeper | paper, product-nav, about/privacy, reviews home |
| `editorial-catalog` | FindWorthNow | editorial-dark, catalog, blog route |

Exported as `SITE_PRESETS`. A live site copies a preset into `SITE_CAPABILITIES` and may diverge later. Create Site UI is not built yet.

## Sections

Homepage composition is a list of large blocks, not a page builder.

Examples: `hero`, `featured-reviews`, `top-picks`, `comparison`, `faq`, `category-grid`, `blog-teasers`.

`featured-reviews` and `blog-teasers` are both Article presentation. They stay separate components because the markup differs.

New visual blocks should be extracted as named section components, then added to a site's `homepageSections`.

## Content

- Postgres is the long-term source of truth for site shell, products, and articles.
- FindWorthNow catalog/blog still load from TypeScript files through `directory-catalog.ts` and `directory-blog.ts`. Frontend should keep going through those loaders (or a future repository), not import the data files from components.
- Custom domains: `DOMAIN_SITE_MAP` is still hardcoded; `site_domains` is schema-only. Do not add more hardcoded hosts without a plan to read DB.
- IndexNow site list (`INDEXNOW_SITE_SLUGS`) stays explicit. Sitemap/static params still use the static seed slug list, filtered by capabilities.

## Adding a new site

1. Reuse a preset (or copy and tweak features/theme/sections).
2. Register it in `SITE_CAPABILITIES`.
3. Add seed/DB content.
4. Reuse existing sections and routes.

If the site needs something new, build a reusable feature or section, then enable it in config. Do not special-case the slug.
