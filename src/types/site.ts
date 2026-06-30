export type SiteConfig = {
  id: string;
  name: string;
  niche: string;
  url: string;
  metadata: {
    title: string;
    description: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  productGrid: {
    title: string;
    description: string;
  };
  comparisonFeatures: readonly string[];
  faq: readonly { question: string; answer: string }[];
  affiliateDisclosure: string;
  newsletter: {
    title: string;
    description: string;
    buttonText: string;
    successMessage: string;
  };
  ads?: {
    slots: {
      primary: string;
      secondary: string;
    };
  };
};

export type AdSlotId = "primary" | "secondary";
