// Future: replace static import with PostgreSQL query (pg driver + Flyway migrations).

import type { SiteData } from "@/types/site";

const comparisonRows = [
  { key: "brand", label: "Brand", type: "text" as const },
  { key: "rating", label: "Rating", type: "text" as const },
  { key: "firmness", label: "Firmness", type: "text" as const },
  { key: "cooling", label: "Cooling", type: "text" as const },
  { key: "pressure-relief", label: "Pressure Relief", type: "text" as const },
  { key: "trial", label: "Trial", type: "text" as const },
  { key: "warranty", label: "Warranty", type: "text" as const },
  { key: "price", label: "Price", type: "text" as const },
  { key: "best-for", label: "Best For", type: "text" as const },
];

export const siteData: SiteData = {
  slug: "side-sleeper-mattresses",
  title: "Side Sleeper Mattress Guide",
  metaTitle: "Best Mattresses for Side Sleepers (2026)",
  metaDescription:
    "Compare the best mattresses for side sleepers based on pressure relief, cooling, spinal alignment, trial periods, warranty and value.",
  niche: "mattresses",
  siteUrl: "https://example.com",
  ratingScale: 10,

  hero: {
    eyebrow: "Independent mattress comparison",
    headline: "Best Mattresses for Side Sleepers (2026)",
    subheadline:
      "We compare the best mattresses for side sleepers based on pressure relief, cooling, spinal alignment, trial periods, warranty and value.",
    primaryCta: "Compare Mattresses",
    secondaryCta: "Read Buying Guide",
    secondaryCtaHref: "#buying-guide",
  },

  topPicks: {
    title: "Top picks",
    description:
      "Our highest-rated mattresses for side sleepers, tested for pressure relief and spinal alignment.",
    picks: [
      { productSlug: "winkbed", label: "Best Overall" },
      { productSlug: "saatva-classic", label: "Luxury Pick" },
      { productSlug: "helix-midnight-luxe", label: "Best Cooling" },
    ],
  },

  products: [
    {
      name: "WinkBed",
      slug: "winkbed",
      badge: "Best Overall",
      shortDescription:
        "A premium hybrid with zoned support and a plush pillow-top feel that cushions shoulders and hips without feeling stuck.",
      bestFor: "Most side sleepers who want strong pressure relief and support",
      priceFrom: "$1,149",
      features: [
        "Zoned lumbar support",
        "Pillow-top comfort layer",
        "Multiple firmness options",
        "Edge support coils",
        "Free shipping and returns",
      ],
      pros: [
        "Excellent pressure relief for shoulders and hips",
        "Durable hybrid construction",
        "Strong edge support for sitting",
      ],
      cons: [
        "Higher price than budget options",
        "May feel too soft for strict stomach sleepers",
        "Heavy and harder to move alone",
      ],
      affiliateUrl: "https://example.com/affiliate/winkbed",
      rating: 9.6,
      comparison: {
        brand: "WinkBed",
        rating: "9.6/10",
        firmness: "Medium Firm",
        cooling: "Good",
        "pressure-relief": "Excellent",
        trial: "120 nights",
        warranty: "Lifetime",
        price: "$1,149",
        "best-for": "Most side sleepers",
      },
    },
    {
      name: "Saatva Classic",
      slug: "saatva-classic",
      badge: "Luxury Pick",
      shortDescription:
        "An innerspring hybrid with a hotel-style feel, organic cotton cover, and multiple firmness levels for personalized comfort.",
      bestFor: "Side sleepers who want a premium hotel-style mattress",
      priceFrom: "$1,395",
      features: [
        "Dual coil system",
        "Organic cotton cover",
        "Free white-glove delivery",
        "Three firmness levels",
        "Reinforced edge support",
      ],
      pros: [
        "Luxurious, responsive feel",
        "Excellent build quality",
        "White-glove setup included",
      ],
      cons: [
        "Premium pricing",
        "Less contouring than all-foam options",
        "Limited motion isolation vs foam hybrids",
      ],
      affiliateUrl: "https://example.com/affiliate/saatva-classic",
      rating: 9.4,
      comparison: {
        brand: "Saatva Classic",
        rating: "9.4/10",
        firmness: "Plush Soft / Luxury Firm / Firm",
        cooling: "Very Good",
        "pressure-relief": "Very Good",
        trial: "365 nights",
        warranty: "Lifetime",
        price: "$1,395",
        "best-for": "Luxury side sleepers",
      },
    },
    {
      name: "Helix Midnight Luxe",
      slug: "helix-midnight-luxe",
      badge: "Best Cooling",
      shortDescription:
        "A cooling hybrid designed for side sleepers and couples, with plush memory foam layers and reinforced coil support.",
      bestFor: "Hot side sleepers and couples",
      priceFrom: "$1,099",
      features: [
        "GlacioTex cooling cover",
        "Memory foam comfort layers",
        "Pocketed coils",
        "Reinforced perimeter",
        "100-night trial",
      ],
      pros: [
        "Sleeps cooler than most memory foam",
        "Great for couples sharing a bed",
        "Balanced pressure relief and bounce",
      ],
      cons: [
        "Not the deepest pressure relief for very light sleepers",
        "Premium tier pricing",
        "May be soft for heavier stomach sleepers",
      ],
      affiliateUrl: "https://example.com/affiliate/helix-midnight-luxe",
      rating: 9.3,
      comparison: {
        brand: "Helix Midnight Luxe",
        rating: "9.3/10",
        firmness: "Medium",
        cooling: "Excellent",
        "pressure-relief": "Very Good",
        trial: "100 nights",
        warranty: "15 years",
        price: "$1,099",
        "best-for": "Hot side sleepers",
      },
    },
    {
      name: "Nolah Natural",
      slug: "nolah-natural",
      badge: "Best Organic",
      shortDescription:
        "A latex hybrid built with natural materials that offers responsive support and breathable comfort for eco-conscious side sleepers.",
      bestFor: "Side sleepers looking for natural materials",
      priceFrom: "$1,199",
      features: [
        "GOLS organic latex",
        "Organic cotton cover",
        "Recycled steel coils",
        "Breathable design",
        "120-night trial",
      ],
      pros: [
        "Natural, breathable materials",
        "Responsive latex feel",
        "Good for allergy-sensitive sleepers",
      ],
      cons: [
        "Less body-hugging than memory foam",
        "Higher price point",
        "Latex feel is not for everyone",
      ],
      affiliateUrl: "https://example.com/affiliate/nolah-natural",
      rating: 9.1,
      comparison: {
        brand: "Nolah Natural",
        rating: "9.1/10",
        firmness: "Medium",
        cooling: "Very Good",
        "pressure-relief": "Good",
        trial: "120 nights",
        warranty: "Lifetime",
        price: "$1,199",
        "best-for": "Eco-conscious sleepers",
      },
    },
    {
      name: "Bear Elite Hybrid",
      slug: "bear-elite-hybrid",
      badge: "Best Pressure Relief",
      shortDescription:
        "A hybrid with copper-infused foam and zoned coils designed to relieve pressure at the shoulders and hips for side sleepers.",
      bestFor: "Side sleepers with shoulder or hip pressure",
      priceFrom: "$1,299",
      features: [
        "Copper-infused foam",
        "Zoned coil support",
        "Three firmness options",
        "Celliant cover option",
        "120-night trial",
      ],
      pros: [
        "Strong pressure relief at contact points",
        "Good spinal alignment",
        "Multiple firmness choices",
      ],
      cons: [
        "Premium pricing",
        "Can sleep warm without cooling sheets",
        "Heavier than all-foam beds",
      ],
      affiliateUrl: "https://example.com/affiliate/bear-elite-hybrid",
      rating: 9.2,
      comparison: {
        brand: "Bear Elite Hybrid",
        rating: "9.2/10",
        firmness: "Soft / Medium / Firm",
        cooling: "Good",
        "pressure-relief": "Excellent",
        trial: "120 nights",
        warranty: "Lifetime",
        price: "$1,299",
        "best-for": "Shoulder & hip pain",
      },
    },
    {
      name: "Leesa Sapira",
      slug: "leesa-sapira",
      badge: "Best Motion Isolation",
      shortDescription:
        "A balanced hybrid combining memory foam comfort with pocket springs for couples who need motion isolation and side-sleeper cushioning.",
      bestFor: "Couples and combination sleepers",
      priceFrom: "$1,349",
      features: [
        "Memory foam top layer",
        "Pocket springs",
        "Reinforced edges",
        "Medium-firm feel",
        "100-night trial",
      ],
      pros: [
        "Excellent motion isolation",
        "Versatile for combination sleepers",
        "Good value for hybrid quality",
      ],
      cons: [
        "Average cooling performance",
        "Limited firmness options",
        "May lack deep contour for lighter sleepers",
      ],
      affiliateUrl: "https://example.com/affiliate/leesa-sapira",
      rating: 9.0,
      comparison: {
        brand: "Leesa Sapira",
        rating: "9.0/10",
        firmness: "Medium Firm",
        cooling: "Good",
        "pressure-relief": "Good",
        trial: "100 nights",
        warranty: "10 years",
        price: "$1,349",
        "best-for": "Couples",
      },
    },
    {
      name: "Brooklyn Bedding Aurora Luxe",
      slug: "brooklyn-bedding-aurora-luxe",
      badge: "Best Hybrid",
      shortDescription:
        "A customizable hybrid with cooling phase-change material and three firmness options to match different side-sleeper preferences.",
      bestFor: "Side sleepers who want cooling and firmness options",
      priceFrom: "$999",
      features: [
        "Phase-change cooling cover",
        "Three firmness levels",
        "Pocketed coils",
        "Made in the USA",
        "120-night trial",
      ],
      pros: [
        "Affordable for a premium hybrid",
        "Customizable firmness",
        "Good cooling technology",
      ],
      cons: [
        "Less luxurious feel than top-tier brands",
        "Edge support is average",
        "Can feel bouncy for some sleepers",
      ],
      affiliateUrl: "https://example.com/affiliate/brooklyn-bedding-aurora-luxe",
      rating: 9.0,
      comparison: {
        brand: "Brooklyn Bedding Aurora Luxe",
        rating: "9.0/10",
        firmness: "Soft / Medium / Firm",
        cooling: "Very Good",
        "pressure-relief": "Good",
        trial: "120 nights",
        warranty: "10 years",
        price: "$999",
        "best-for": "Customizable comfort",
      },
    },
    {
      name: "Nectar Premier",
      slug: "nectar-premier",
      badge: "Best Budget",
      shortDescription:
        "A memory foam mattress with enhanced contouring and a long trial period, ideal for budget-conscious side sleepers who like a hugging feel.",
      bestFor: "Budget-conscious side sleepers who like foam",
      priceFrom: "$949",
      features: [
        "Gel memory foam",
        "Enhanced contouring",
        "365-night trial",
        "Forever warranty",
        "Free shipping",
      ],
      pros: [
        "Excellent value for money",
        "Deep pressure relief",
        "Industry-leading trial and warranty",
      ],
      cons: [
        "Sleeps warmer than hybrids",
        "Slow response can feel stuck",
        "Less support for very heavy sleepers",
      ],
      affiliateUrl: "https://example.com/affiliate/nectar-premier",
      rating: 8.8,
      comparison: {
        brand: "Nectar Premier",
        rating: "8.8/10",
        firmness: "Medium Firm",
        cooling: "Fair",
        "pressure-relief": "Very Good",
        trial: "365 nights",
        warranty: "Forever warranty",
        price: "$949",
        "best-for": "Budget foam lovers",
      },
    },
    {
      name: "DreamCloud Premier",
      slug: "dreamcloud-premier",
      badge: "Best Value",
      shortDescription:
        "A luxury hybrid at a mid-range price with cashmere blend cover and strong support for side sleepers who want premium feel for less.",
      bestFor: "Side sleepers who want a luxury feel for less",
      priceFrom: "$899",
      features: [
        "Cashmere blend cover",
        "Memory foam layers",
        "Pocketed coils",
        "365-night trial",
        "Lifetime warranty",
      ],
      pros: [
        "Outstanding value for a hybrid",
        "Luxurious cover and feel",
        "Long trial and warranty",
      ],
      cons: [
        "Can sleep warm in summer",
        "Heavier and harder to move",
        "Less contouring than all-foam",
      ],
      affiliateUrl: "https://example.com/affiliate/dreamcloud-premier",
      rating: 8.9,
      comparison: {
        brand: "DreamCloud Premier",
        rating: "8.9/10",
        firmness: "Medium Firm",
        cooling: "Good",
        "pressure-relief": "Good",
        trial: "365 nights",
        warranty: "Lifetime",
        price: "$899",
        "best-for": "Value seekers",
      },
    },
    {
      name: "Avocado Green",
      slug: "avocado-green",
      badge: "Eco Friendly",
      shortDescription:
        "An organic latex hybrid with GOLS-certified materials and optional pillow-top for side sleepers who prioritize sustainability.",
      bestFor: "Eco-conscious side sleepers",
      priceFrom: "$1,399",
      features: [
        "GOLS organic latex",
        "Organic wool and cotton",
        "Recycled steel coils",
        "Optional pillow-top",
        "365-night trial",
      ],
      pros: [
        "Certified organic materials",
        "Durable, long-lasting build",
        "Breathable and responsive",
      ],
      cons: [
        "Firm feel without pillow-top",
        "Premium price point",
        "Heavy and requires strong foundation",
      ],
      affiliateUrl: "https://example.com/affiliate/avocado-green",
      rating: 8.7,
      comparison: {
        brand: "Avocado Green",
        rating: "8.7/10",
        firmness: "Medium Firm",
        cooling: "Very Good",
        "pressure-relief": "Good",
        trial: "365 nights",
        warranty: "25 years",
        price: "$1,399",
        "best-for": "Eco-conscious sleepers",
      },
    },
  ],

  comparisonTable: {
    title: "Mattress comparison",
    description:
      "Compare side-sleeper mattresses across the features that matter most.",
    rowHeaderLabel: "Specification",
    rows: comparisonRows,
  },

  buyingGuide: {
    title: "Side sleeper mattress buying guide",
    sections: [
      {
        title: "Why side sleepers need a different mattress",
        content:
          "Side sleeping concentrates weight on your shoulders and hips. Without enough cushioning, pressure builds at those points and your spine can fall out of alignment. Side sleepers need a mattress that contours to curves while keeping the midsection supported.",
      },
      {
        title: "Best firmness for side sleepers",
        content:
          "Most side sleepers do best on medium to medium-soft mattresses. Too firm and you feel pressure at the shoulder and hip. Too soft and your torso sinks, twisting your spine. Look for zoned support that is softer at the shoulders and firmer at the hips.",
      },
      {
        title: "Hybrid vs memory foam for side sleepers",
        content:
          "Memory foam excels at pressure relief and contouring but can sleep warm and feel slow to respond. Hybrids combine foam comfort layers with coils for better airflow, bounce, and edge support. Combination sleepers often prefer hybrids.",
      },
      {
        title: "Pressure relief and spinal alignment",
        content:
          "A good side-sleeper mattress fills the gap at your waist while letting your shoulder and hip sink slightly. This keeps your spine in a neutral line from neck to tailbone. Zoned coils and layered foams are designed specifically for this.",
      },
      {
        title: "How to choose based on body weight",
        content:
          "Lighter side sleepers (under 130 lbs) often need softer surfaces for adequate contouring. Average-weight sleepers suit medium firmness. Heavier side sleepers (over 230 lbs) need firmer support layers to prevent excessive sinkage while still cushioning pressure points.",
      },
      {
        title: "How we compare mattresses",
        content:
          "We evaluate pressure relief, cooling, spinal alignment, trial periods, warranty, and overall value. Ratings reflect how well each mattress serves side sleepers specifically, not just general comfort.",
      },
    ],
  },

  faqs: [
    {
      question: "What mattress firmness is best for side sleepers?",
      answer:
        "Most side sleepers prefer medium to medium-soft firmness. This allows shoulders and hips to sink in enough for pressure relief while keeping the spine aligned. Heavier sleepers may need medium-firm.",
    },
    {
      question: "Are hybrid mattresses better for side sleepers?",
      answer:
        "Hybrids are a strong choice because they combine pressure-relieving foam with supportive coils. They sleep cooler than all-foam beds and offer better edge support, though memory foam can provide deeper contouring.",
    },
    {
      question: "Is memory foam good for side sleepers?",
      answer:
        "Yes. Memory foam contours closely to your body, which reduces pressure on shoulders and hips. Look for gel-infused or open-cell foam if you tend to sleep hot.",
    },
    {
      question: "Can a mattress reduce shoulder pain?",
      answer:
        "A mattress with adequate cushioning at the shoulder can reduce pressure-point pain for side sleepers. If your mattress is too firm, adding a soft topper or switching to a softer model often helps.",
    },
    {
      question: "Can a mattress reduce hip pain?",
      answer:
        "Side sleepers with hip pain benefit from softer comfort layers that distribute weight away from the hip joint. Zoned support that is firmer at the torso and softer at extremities can also help.",
    },
    {
      question: "What is the best cooling mattress for side sleepers?",
      answer:
        "Hybrids with cooling covers and breathable coil layers tend to sleep coolest. Models like the Helix Midnight Luxe and Brooklyn Bedding Aurora Luxe are designed specifically for hot sleepers.",
    },
    {
      question: "How long should a mattress last?",
      answer:
        "A quality hybrid or latex mattress typically lasts 8–10 years. Memory foam mattresses may last 7–8 years. Rotate your mattress every 3–6 months to extend its life.",
    },
    {
      question: "Is a soft mattress always better for side sleepers?",
      answer:
        "Not always. While side sleepers need cushioning, too soft a surface lets the torso sink excessively and misaligns the spine. The right firmness depends on your body weight and preference.",
    },
    {
      question: "Do heavier side sleepers need a firmer mattress?",
      answer:
        "Generally yes. Heavier sleepers exert more force on comfort layers and need firmer support to prevent bottoming out, while still needing enough cushioning at the shoulders and hips.",
    },
    {
      question: "How do we compare mattresses?",
      answer:
        "We assess pressure relief, cooling, spinal alignment for side sleeping, trial periods, warranty coverage, and price. Our ratings prioritize performance for side sleepers specifically.",
    },
  ],

  articles: [
    {
      title: "Best Mattress for Shoulder Pain",
      slug: "best-mattress-shoulder-pain",
      excerpt: "Top picks that cushion your shoulder without sacrificing support.",
    },
    {
      title: "Best Mattress for Heavy Side Sleepers",
      slug: "best-mattress-heavy-side-sleepers",
      excerpt: "Durable options with firm support and pressure relief.",
    },
    {
      title: "Best Cooling Mattress",
      slug: "best-cooling-mattress",
      excerpt: "Stay comfortable if you sleep hot on your side.",
    },
    {
      title: "Hybrid vs Memory Foam",
      slug: "hybrid-vs-memory-foam",
      excerpt: "Which construction type suits side sleepers best?",
    },
    {
      title: "Mattress Buying Guide",
      slug: "mattress-buying-guide",
      excerpt: "Everything to consider before you buy.",
    },
    {
      title: "Best Mattress Under $1000",
      slug: "best-mattress-under-1000",
      excerpt: "Quality side-sleeper mattresses that won't break the bank.",
    },
  ],

  newsletter: {
    title: "Get the side sleeper mattress guide",
    description:
      "Join our newsletter for a free comparison checklist and tips on choosing the right mattress for your sleep style.",
    buttonText: "Get the guide",
    successMessage: "Thanks! Check your inbox for the guide.",
  },

  affiliateDisclosure:
    "Disclosure: This site may earn a commission when you click certain links and make a purchase, at no additional cost to you. This does not affect our ratings or recommendations.",

  footer: {
    tagline: "Independent mattress comparisons for side sleepers.",
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
