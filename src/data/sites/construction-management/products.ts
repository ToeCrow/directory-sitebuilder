// Future: replace static import with PostgreSQL query (pg driver + Flyway migrations).
// e.g. getProducts(siteId) from src/lib/db/products.ts

import type { Product } from "@/types/product";

const productData: Product[] = [
  {
    name: "Procore",
    slug: "procore",
    description:
      "Enterprise-grade construction management platform used by general contractors and owners on large commercial projects. Strong on RFIs, submittals, and financial tracking.",
    bestFor: "Mid-to-large contractors on commercial projects",
    priceFrom: "Custom pricing",
    features: [
      "Mobile app",
      "Estimating",
      "Job scheduling",
      "Document management",
      "Time tracking",
      "RFI & submittal workflows",
      "Financial management",
    ],
    pros: [
      "Industry-leading document and RFI management",
      "Extensive integrations and app marketplace",
      "Scales well for growing firms",
    ],
    cons: [
      "Expensive for very small teams",
      "Steep learning curve",
      "Overkill for residential-only contractors",
    ],
    affiliateUrl: "https://example.com/affiliate/procore",
    rating: 4.6,
  },
  {
    name: "Fieldwire",
    slug: "fieldwire",
    description:
      "Field-first task and plan management tool built for superintendents and foremen. Excellent for coordinating daily work on site with drawings and punch lists.",
    bestFor: "Field teams and superintendents",
    priceFrom: "$54/user/mo",
    features: [
      "Mobile app",
      "Job scheduling",
      "Document management",
      "Plan markup and versioning",
      "Punch lists",
      "Task assignments",
    ],
    pros: [
      "Best-in-class mobile experience for field crews",
      "Easy plan markup and task tracking",
      "Quick to deploy on active job sites",
    ],
    cons: [
      "Limited estimating and accounting features",
      "Not ideal as a full back-office system",
      "Per-user pricing adds up for large crews",
    ],
    affiliateUrl: "https://example.com/affiliate/fieldwire",
    rating: 4.5,
  },
  {
    name: "Buildertrend",
    slug: "buildertrend",
    description:
      "All-in-one platform popular with residential builders and remodelers. Combines project management, client communication, scheduling, and selections in one place.",
    bestFor: "Residential builders and remodelers",
    priceFrom: "$499/mo",
    features: [
      "Mobile app",
      "Estimating",
      "Job scheduling",
      "Document management",
      "Time tracking",
      "Client portal",
      "Selections and allowances",
    ],
    pros: [
      "Strong client communication and portal",
      "Built specifically for residential construction",
      "Includes scheduling and daily logs",
    ],
    cons: [
      "Higher base price than some competitors",
      "Interface can feel busy for new users",
      "Less suited for heavy commercial work",
    ],
    affiliateUrl: "https://example.com/affiliate/buildertrend",
    rating: 4.4,
  },
  {
    name: "Buildxact",
    slug: "buildxact",
    description:
      "Estimating and takeoff-focused platform designed for small builders and trade contractors. Helps you bid faster and manage jobs from estimate to completion.",
    bestFor: "Small builders focused on estimating",
    priceFrom: "$133/mo",
    features: [
      "Mobile app",
      "Estimating",
      "Job scheduling",
      "Document management",
      "Digital takeoffs",
      "Quote templates",
    ],
    pros: [
      "Fast, accurate estimating and takeoffs",
      "Affordable for solo operators and small teams",
      "Good templates for repeat job types",
    ],
    cons: [
      "Limited advanced project management features",
      "Smaller integration ecosystem",
      "Time tracking requires workarounds",
    ],
    affiliateUrl: "https://example.com/affiliate/buildxact",
    rating: 4.3,
  },
  {
    name: "Contractor Foreman",
    slug: "contractor-foreman",
    description:
      "Budget-friendly all-in-one tool covering estimates, invoices, daily logs, and crew scheduling. A solid entry point for small trade contractors.",
    bestFor: "Budget-conscious small trade contractors",
    priceFrom: "$49/mo",
    features: [
      "Mobile app",
      "Estimating",
      "Job scheduling",
      "Document management",
      "Time tracking",
      "Invoicing",
      "Daily logs",
    ],
    pros: [
      "Very affordable flat-rate pricing",
      "Wide feature set for the price",
      "Good for electricians, plumbers, and HVAC contractors",
    ],
    cons: [
      "UI feels dated compared to newer tools",
      "Mobile app less polished than Fieldwire or Procore",
      "Limited enterprise reporting",
    ],
    affiliateUrl: "https://example.com/affiliate/contractor-foreman",
    rating: 4.2,
  },
];

export const products: Product[] = [...productData].sort(
  (a, b) => b.rating - a.rating,
);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getTopProducts(limit = 3): Product[] {
  return products.slice(0, limit);
}

export function productHasFeature(product: Product, feature: string): boolean {
  return product.features.some(
    (f) => f.toLowerCase() === feature.toLowerCase(),
  );
}
