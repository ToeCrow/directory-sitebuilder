// Future: replace static import with PostgreSQL query (pg driver + Flyway migrations).

import type { SiteData } from "@/types/site";

const comparisonRows = [
  { key: "mobile-app", label: "Mobile app", type: "boolean" as const },
  { key: "estimating", label: "Estimating", type: "boolean" as const },
  { key: "job-scheduling", label: "Job scheduling", type: "boolean" as const },
  { key: "document-management", label: "Document management", type: "boolean" as const },
  { key: "time-tracking", label: "Time tracking", type: "boolean" as const },
  { key: "price", label: "Starting price", type: "text" as const },
  { key: "rating", label: "Rating", type: "text" as const },
];

export const siteData: SiteData = {
  slug: "construction-software",
  title: "BuildCompare",
  metaTitle: "Best Construction Management Software for Small Contractors",
  metaDescription:
    "Compare construction management tools for small contractors, builders and field teams.",
  niche: "construction-management",
  siteUrl: "https://example.com",
  ratingScale: 5,

  hero: {
    eyebrow: "Independent comparison guide",
    headline: "Find the Best Construction Management Software",
    subheadline:
      "Compare top-rated tools for small contractors, builders, and field teams. Independent reviews to help you choose the right platform.",
    primaryCta: "Compare tools",
    secondaryCta: "Read buying guide",
    secondaryCtaHref: "#buying-guide",
  },

  topPicks: {
    title: "Top picks",
    description:
      "Our highest-rated construction management tools for small contractors and field teams.",
  },

  productDirectory: {
    title: "Browse Construction Software",
    description: "Compare every tool we've reviewed for small contractors.",
  },

  products: [
    {
      name: "Procore",
      slug: "procore",
      badge: "Best Overall",
      shortDescription:
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
      featuredRank: 1,
      comparisonRank: 1,
      directoryOrder: 1,
      comparison: {
        "mobile-app": true,
        estimating: true,
        "job-scheduling": true,
        "document-management": true,
        "time-tracking": true,
        price: "Custom pricing",
        rating: "4.6/5",
      },
    },
    {
      name: "Fieldwire",
      slug: "fieldwire",
      badge: "Best for Field Teams",
      shortDescription:
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
      featuredRank: 2,
      comparisonRank: 2,
      directoryOrder: 2,
      comparison: {
        "mobile-app": true,
        estimating: false,
        "job-scheduling": true,
        "document-management": true,
        "time-tracking": false,
        price: "$54/user/mo",
        rating: "4.5/5",
      },
    },
    {
      name: "Buildertrend",
      slug: "buildertrend",
      badge: "Best for Residential",
      shortDescription:
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
      featuredRank: 3,
      comparisonRank: 3,
      directoryOrder: 3,
      comparison: {
        "mobile-app": true,
        estimating: true,
        "job-scheduling": true,
        "document-management": true,
        "time-tracking": true,
        price: "$499/mo",
        rating: "4.4/5",
      },
    },
    {
      name: "Buildxact",
      slug: "buildxact",
      shortDescription:
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
      featuredRank: null,
      comparisonRank: 4,
      directoryOrder: 4,
      comparison: {
        "mobile-app": true,
        estimating: true,
        "job-scheduling": true,
        "document-management": true,
        "time-tracking": false,
        price: "$133/mo",
        rating: "4.3/5",
      },
    },
    {
      name: "Contractor Foreman",
      slug: "contractor-foreman",
      shortDescription:
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
      featuredRank: null,
      comparisonRank: 5,
      directoryOrder: 5,
      comparison: {
        "mobile-app": true,
        estimating: true,
        "job-scheduling": true,
        "document-management": true,
        "time-tracking": true,
        price: "$49/mo",
        rating: "4.2/5",
      },
    },
  ],

  comparisonTable: {
    title: "Feature comparison",
    description:
      "Side-by-side look at key features across all tools on this page.",
    rowHeaderLabel: "Feature",
    rows: comparisonRows,
  },

  buyingGuide: {
    title: "Construction software buying guide",
    sections: [
      {
        title: "Why small contractors need dedicated software",
        content:
          "Spreadsheets and group texts break down quickly when you manage multiple jobs, crews, and change orders. Dedicated construction software centralizes schedules, documents, and job costs so you spend less time chasing updates and more time building.",
      },
      {
        title: "Key features to look for",
        content:
          "Prioritize mobile access for field teams, document control for plans and RFIs, scheduling, and cost tracking. Estimating and time tracking matter if you bid work and bill labor frequently.",
      },
      {
        title: "Cloud vs on-premise",
        content:
          "Most modern tools are cloud-based, which means your team can update job sites from anywhere. Look for offline-capable mobile apps if you work in areas with poor connectivity.",
      },
      {
        title: "Pricing models explained",
        content:
          "Pricing varies from flat monthly rates to per-user fees. Factor in how many office staff and field users need access, and whether client portals or accounting integrations cost extra.",
      },
      {
        title: "How to evaluate trials",
        content:
          "Run a real job through the software during the trial period. Test plan markup, daily logs, and how quickly your crew adopts the mobile app before committing.",
      },
      {
        title: "How we compare tools",
        content:
          "We evaluate feature breadth, ease of use for small teams, pricing transparency, and feedback from contractors. Rankings are updated as products evolve.",
      },
    ],
  },

  faqs: [
    {
      question: "What is construction management software?",
      answer:
        "Construction management software helps contractors plan projects, track budgets, manage documents, coordinate field teams, and communicate with clients — all from one platform.",
    },
    {
      question: "Do small contractors need dedicated software?",
      answer:
        "If you manage more than a few jobs at once, dedicated software reduces errors, saves admin time, and gives you visibility into job costs and schedules that spreadsheets cannot match.",
    },
    {
      question: "How much does construction management software cost?",
      answer:
        "Pricing varies widely. Entry-level tools start around $50–$100 per month, while enterprise platforms like Procore can cost several hundred dollars per user. Most vendors offer free trials.",
    },
    {
      question: "Can I use these tools on mobile job sites?",
      answer:
        "Yes. All tools on this page offer mobile apps or mobile-friendly interfaces so field crews can update tasks, upload photos, and log time from the job site.",
    },
    {
      question: "How did you rank these products?",
      answer:
        "Rankings are based on feature breadth, ease of use for small teams, pricing transparency, and user feedback. We update this list regularly as products evolve.",
    },
  ],

  articles: [
    {
      title: "Best Software for Small General Contractors",
      slug: "best-software-small-contractors",
      excerpt: "What to look for when choosing your first platform.",
      intro: ["What to look for when choosing your first platform."],
      researchNote: {
        title: "How we do our research",
        content:
          "We evaluate construction software based on feature breadth, ease of use for small teams, pricing transparency, and contractor feedback.",
      },
      products: [],
    },
    {
      title: "Procore vs Buildertrend",
      slug: "procore-vs-buildertrend",
      excerpt: "How two popular tools compare for different contractor types.",
      intro: [
        "How two popular tools compare for different contractor types.",
      ],
      researchNote: {
        title: "How we do our research",
        content:
          "We evaluate construction software based on feature breadth, ease of use for small teams, pricing transparency, and contractor feedback.",
      },
      products: [],
    },
    {
      title: "Field Management Apps Compared",
      slug: "field-management-apps",
      excerpt: "Top picks for superintendents and foremen on site.",
      intro: ["Top picks for superintendents and foremen on site."],
      researchNote: {
        title: "How we do our research",
        content:
          "We evaluate construction software based on feature breadth, ease of use for small teams, pricing transparency, and contractor feedback.",
      },
      products: [],
    },
    {
      title: "Construction Estimating Software Guide",
      slug: "estimating-software-guide",
      excerpt: "Tools that help you bid faster and more accurately.",
      intro: ["Tools that help you bid faster and more accurately."],
      researchNote: {
        title: "How we do our research",
        content:
          "We evaluate construction software based on feature breadth, ease of use for small teams, pricing transparency, and contractor feedback.",
      },
      products: [],
    },
    {
      title: "Software for Residential Builders",
      slug: "residential-builder-software",
      excerpt: "Platforms built for remodelers and custom home builders.",
      intro: ["Platforms built for remodelers and custom home builders."],
      researchNote: {
        title: "How we do our research",
        content:
          "We evaluate construction software based on feature breadth, ease of use for small teams, pricing transparency, and contractor feedback.",
      },
      products: [],
    },
    {
      title: "How to Choose Contractor Software",
      slug: "how-to-choose-contractor-software",
      excerpt: "A step-by-step checklist for evaluating your options.",
      intro: ["A step-by-step checklist for evaluating your options."],
      researchNote: {
        title: "How we do our research",
        content:
          "We evaluate construction software based on feature breadth, ease of use for small teams, pricing transparency, and contractor feedback.",
      },
      products: [],
    },
  ],

  newsletter: {
    title: "Get the free contractor software guide",
    description:
      "Join our newsletter for a downloadable comparison checklist and tips on choosing the right tool for your team.",
    buttonText: "Get the guide",
    successMessage: "Thanks! Check your inbox for the guide.",
  },

  affiliateDisclosure:
    "Disclosure: Some links on this page are affiliate links. If you purchase through them, we may earn a commission at no extra cost to you. This does not influence our rankings — we only recommend tools we believe are genuinely useful for small contractors.",

  footer: {
    tagline: "Independent software comparisons for contractors.",
    links: [
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Affiliate Disclosure", href: "#affiliate-disclosure" },
      { label: "Terms", href: "#terms" },
    ],
  },

  ads: {
    slots: {
      primary: "",
      secondary: "",
    },
  },
};
