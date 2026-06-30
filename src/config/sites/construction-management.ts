import type { SiteConfig } from "@/types/site";

export const constructionManagementSite: SiteConfig = {
  id: "construction-management",
  name: "BuildCompare",
  niche: "construction-management",
  url: "https://example.com",

  metadata: {
    title: "Best Construction Management Software for Small Contractors",
    description:
      "Compare construction management tools for small contractors, builders and field teams.",
  },

  hero: {
    headline: "Find the Best Construction Management Software",
    subheadline:
      "Compare top-rated tools for small contractors, builders, and field teams. Independent reviews to help you choose the right platform.",
    ctaText: "Compare tools",
  },

  productGrid: {
    title: "Top picks",
    description:
      "Our highest-rated construction management tools for small contractors and field teams.",
  },

  comparisonFeatures: [
    "Mobile app",
    "Estimating",
    "Job scheduling",
    "Document management",
    "Time tracking",
  ],

  faq: [
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

  affiliateDisclosure:
    "Disclosure: Some links on this page are affiliate links. If you purchase through them, we may earn a commission at no extra cost to you. This does not influence our rankings — we only recommend tools we believe are genuinely useful for small contractors.",

  newsletter: {
    title: "Get the free contractor software guide",
    description:
      "Join our newsletter for a downloadable comparison checklist and tips on choosing the right tool for your team.",
    buttonText: "Get the guide",
    successMessage: "Thanks! Check your inbox for the guide.",
  },

  ads: {
    slots: {
      primary: "",
      secondary: "",
    },
  },
};
