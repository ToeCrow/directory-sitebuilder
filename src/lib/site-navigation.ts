import {
  getArticleConfig,
  siteHasFeature,
  type SiteRef,
} from "@/lib/site-config";
import {
  getBlogIndexPath,
  getBuyingGuidePath,
  getProductPath,
  getProductsIndexPath,
  getReviewsIndexPath,
  getSitePath,
} from "@/lib/paths";

export type NavItem = {
  href: string;
  label: string;
};

export type ArticleNav = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type ProductsNav = {
  label: string;
  children: NavItem[];
  featuredProducts: NavItem[];
};

export type SiteNavigation = {
  products?: ProductsNav;
  primaryLinks: NavItem[];
  articles?: ArticleNav;
};

export type CatalogCategoryNav = {
  slug: string;
  name: string;
};

export type FeaturedProductNav = {
  slug: string;
  name: string;
};

export type SiteNavigationInput = {
  site: SiteRef;
  publicBasePath: string;
  hasArticles: boolean;
  catalogCategories?: CatalogCategoryNav[];
  featuredProducts?: FeaturedProductNav[];
};

export function getSiteNavigation({
  site,
  publicBasePath,
  hasArticles,
  catalogCategories = [],
  featuredProducts = [],
}: SiteNavigationInput): SiteNavigation {
  const homeHref = getSitePath(publicBasePath);
  const buyingGuideHref = getBuyingGuidePath(publicBasePath);
  const hasCatalog = siteHasFeature(site, "catalog");
  const hasProductNav = siteHasFeature(site, "product-nav");
  const articleConfig = getArticleConfig(site);

  const products = buildProductsNav({
    publicBasePath,
    hasCatalog,
    hasProductNav,
    catalogCategories,
    featuredProducts,
  });

  const primaryLinks = buildPrimaryLinks({
    site,
    homeHref,
    buyingGuideHref,
    publicBasePath,
    articleConfig,
  });

  const articles = buildArticlesNav({
    publicBasePath,
    articleConfig,
    hasArticles,
    hasProductNav,
  });

  return { products, primaryLinks, articles };
}

function buildProductsNav({
  publicBasePath,
  hasCatalog,
  hasProductNav,
  catalogCategories,
  featuredProducts,
}: {
  publicBasePath: string;
  hasCatalog: boolean;
  hasProductNav: boolean;
  catalogCategories: CatalogCategoryNav[];
  featuredProducts: FeaturedProductNav[];
}): ProductsNav | undefined {
  if (!hasCatalog && !hasProductNav) {
    return undefined;
  }

  const children: NavItem[] = [
    {
      href: getProductsIndexPath(publicBasePath),
      label: "All Products",
    },
  ];

  if (hasCatalog) {
    for (const category of catalogCategories) {
      children.push({
        href: getProductsIndexPath(publicBasePath, category.slug),
        label: category.name,
      });
    }
  } else {
    children.push(
      {
        href: getProductsIndexPath(publicBasePath, "mattress"),
        label: "Mattresses",
      },
      {
        href: getProductsIndexPath(publicBasePath, "pillow"),
        label: "Pillows",
      },
      {
        href: getProductsIndexPath(publicBasePath, "topper"),
        label: "Toppers",
      },
    );
  }

  return {
    label: "Products",
    children,
    featuredProducts: hasProductNav
      ? featuredProducts.map((product) => ({
          href: getProductPath(publicBasePath, product.slug),
          label: product.name,
        }))
      : [],
  };
}

function buildPrimaryLinks({
  site,
  homeHref,
  buyingGuideHref,
  publicBasePath,
  articleConfig,
}: {
  site: SiteRef;
  homeHref: string;
  buyingGuideHref: string;
  publicBasePath: string;
  articleConfig: ReturnType<typeof getArticleConfig>;
}): NavItem[] {
  if (articleConfig?.route === "blog") {
    return [
      {
        href: getBlogIndexPath(publicBasePath),
        label: articleConfig.label,
      },
    ];
  }

  const links: NavItem[] = [];

  if (siteHasFeature(site, "product-nav")) {
    if (siteHasFeature(site, "buying-guide")) {
      links.push({ href: buyingGuideHref, label: "Buying Guide" });
    }
    if (siteHasFeature(site, "faq")) {
      links.push({ href: `${homeHref}#faq`, label: "FAQ" });
    }
    return links;
  }

  if (siteHasFeature(site, "comparison")) {
    links.push({ href: `${homeHref}#compare`, label: "Compare" });
  }
  if (siteHasFeature(site, "buying-guide")) {
    links.push({ href: buyingGuideHref, label: "Buying Guide" });
  }
  if (siteHasFeature(site, "faq")) {
    links.push({ href: `${homeHref}#faq`, label: "FAQ" });
  }
  return links;
}

function buildArticlesNav({
  publicBasePath,
  articleConfig,
  hasArticles,
  hasProductNav,
}: {
  publicBasePath: string;
  articleConfig: ReturnType<typeof getArticleConfig>;
  hasArticles: boolean;
  hasProductNav: boolean;
}): ArticleNav | undefined {
  if (articleConfig?.route !== "reviews" || !hasArticles) {
    return undefined;
  }

  const indexHref = getReviewsIndexPath(publicBasePath);
  return {
    label: articleConfig.label,
    href: indexHref,
    children: hasProductNav
      ? [
          { href: indexHref, label: "All reviews" },
          {
            href: getReviewsIndexPath(publicBasePath, "mattress"),
            label: "Mattress reviews",
          },
          {
            href: getReviewsIndexPath(publicBasePath, "pillow"),
            label: "Pillow reviews",
          },
          {
            href: getReviewsIndexPath(publicBasePath, "science"),
            label: "Science of sleep",
          },
        ]
      : [{ href: indexHref, label: "All reviews" }],
  };
}
