import type { DirectoryProduct } from "@/types/directory-catalog";

function hop(host: string): string {
  return `https://${host}.hop.clickbank.net/?&traffic_source=tiktok`;
}

export const additionalOffers: DirectoryProduct[] = [
  {
    slug: "prodentim",
    name: "ProDentim",
    categorySlug: "dental-health",
    typeLabel: "Oral Probiotic Supplement",
    shortDescription:
      "A chewable probiotic sold for teeth and gums, with a listed blend of 3.5 billion CFU plus plant ingredients.",
    image: {
      src: "/sites/findworthnow/products/prodentim.png",
      alt: "Three ProDentim bottles with chewable oral probiotic tablets",
    },
    affiliateUrl: hop("e7a60dxdsqzk2929vhg2tejc5x"),
    ctaLabel: "Visit ProDentim",
    reviewSlug: "prodentim-review",
    reviewTitle: "ProDentim Review",
    metaTitle: "ProDentim Review",
    metaDescription:
      "A short overview of ProDentim: what the manufacturer says it is, listed ingredients, and what to consider before visiting the official page.",
    heroDescription:
      "ProDentim is a chewable dietary supplement sold for oral care. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is ProDentim?",
        paragraphs: [
          "ProDentim is marketed as a melting probiotic tablet for the mouth microbiome. FindWorthNow has not independently tested the product, and this is not a hands-on review.",
          "The manufacturer describes a blend of about 3.5 billion probiotic cells plus a small plant-and-mineral mix. It also states that the formula is non-GMO, gluten-free, and free of stimulants. We have not verified those manufacturing claims.",
          "Oral supplements are not dental treatment. They are not a substitute for brushing, flossing, or care from a dentist, and they are not intended to diagnose, treat, cure, or prevent gum disease, cavities, or any other medical condition.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "The sales page lists these names. Exact amounts are not clearly published on the public offer we reviewed, and we have not confirmed the formula against a label in hand.",
        ],
        bullets: [
          "Lactobacillus paracasei",
          "Bifidobacterium lactis BL-04",
          "Lactobacillus reuteri",
          "Inulin, malic acid, tricalcium phosphate, and peppermint",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is that everyday toothpaste and mouthwash can disrupt mouth bacteria, and that a chewable probiotic is meant to support gums, breath, and related comfort. That is the manufacturer’s thesis, not a finding from FindWorthNow.",
          "The same page also mentions sinus, digestion, and weight topics. Those are sales-page talking points. This overview treats ProDentim as an oral-care supplement, nothing more.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "Prices and promotions can change. When we checked the official page, it advertised multi-bottle packages, U.S. shipping around $9.99 on the smaller option, and a 60-day money-back guarantee if you contact support.",
          "Checkout is handled through ClickBank, which the site identifies as the retailer. For current pricing, shipping, and refund terms, use the official ProDentim page — that is where a purchase is meant to happen.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "If you have bleeding gums, tooth pain, or another dental problem, see a dentist. Results can vary. The sales page makes strong claims about teeth and gums; those claims belong to the manufacturer.",
        ],
        bullets: [
          "It is a dietary supplement, not a dental procedure or medication.",
          "We have not verified the cited studies, ingredient doses, or customer stories on the sales page.",
          "Supplements are not a replacement for dental care or medical advice.",
        ],
      },
    ],
  },
  {
    slug: "dentabiome",
    name: "DentaBiome",
    categorySlug: "dental-health",
    typeLabel: "Oral Postbiotic Supplement",
    shortDescription:
      "A Berry Frost chewable tablet sold as an oral postbiotic, with a listed Lactobacillus plantarum blend.",
    image: {
      src: "/sites/findworthnow/products/dentabiome.png",
      alt: "DentaBiome bottles of Berry Frost chewable oral tablets",
    },
    affiliateUrl: hop("a49904lkpj1iue5-tlv8me-dfi"),
    ctaLabel: "Visit DentaBiome",
    reviewSlug: "dentabiome-review",
    reviewTitle: "DentaBiome Review",
    metaTitle: "DentaBiome Review",
    metaDescription:
      "A short overview of DentaBiome: what the manufacturer says it is, listed format, packages, and what to consider before visiting the official page.",
    heroDescription:
      "DentaBiome is a chewable dietary supplement sold for oral care. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is DentaBiome?",
        paragraphs: [
          "DentaBiome is marketed as a chewable postbiotic tablet. The sales page describes a Berry Frost flavor and says the tablet is meant to be chewed so it contacts the mouth, rather than swallowed as a capsule. FindWorthNow has not independently tested the product.",
          "The manufacturer states the product is vegan, dairy-free, non-GMO, and made in the United States in a GMP-certified setting. We have not verified those manufacturing claims.",
          "This is not dental treatment and not a substitute for a dentist.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "The public offer highlights a dual-strain Lactobacillus plantarum complex and a proprietary postbiotic blend. Exact milligram amounts and a full Supplement Facts panel were not clearly published on the page we reviewed.",
        ],
        bullets: [
          "Dual-strain L. plantarum complex (manufacturer-stated)",
          "Proprietary postbiotic blend (full label not clearly posted on the public offer)",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is built around an enzyme it calls FabM and an “acid-lock” around mouth bacteria. That is the manufacturer’s thesis, not a finding from FindWorthNow.",
          "The sales page uses strong language about cavities and gums. We are not repeating those claims as established fact.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed three one-time packages: a 60-day (2-bottle) option at $79 per bottle, a 90-day (3-bottle) option at $69 per bottle, and a 180-day (6-bottle) option at $49 per bottle. The 3- and 6-bottle options advertised free U.S. shipping and two digital bonuses.",
          "The page also advertised a 60-day money-back guarantee, including empty bottles. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "See a dentist for bleeding gums, cavities, or pain. Chewable supplements are not a cleaning, filling, or periodontal treatment.",
        ],
        bullets: [
          "It is a dietary supplement, not a medication.",
          "We have not verified the postbiotic strains, doses, or customer stories.",
          "Supplements are not a replacement for dental care.",
        ],
      },
    ],
  },
  {
    slug: "the-brain-song",
    name: "The Brain Song",
    categorySlug: "health-fitness",
    typeLabel: "Digital Audio Program",
    shortDescription:
      "A digital listening routine sold around brainwave audio, with a listed promotional price of $39.",
    image: {
      src: "/sites/findworthnow/products/the-brain-song.png",
      alt: "The Brain Song digital audio program promotional artwork",
    },
    affiliateUrl: hop("121f2-o7qryp2404z2ulvg2d9a"),
    ctaLabel: "Visit The Brain Song",
    reviewSlug: "the-brain-song-review",
    reviewTitle: "The Brain Song Review",
    metaTitle: "The Brain Song Review",
    metaDescription:
      "A short overview of The Brain Song: what the seller says it is, the listed price, and what to consider before visiting the official page.",
    heroDescription:
      "The Brain Song is sold as a digital audio routine. This page summarizes what the seller currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is The Brain Song?",
        paragraphs: [
          "The Brain Song is a digital product. The public page describes a short daily listening session — it mentions a 7-second brainwave experience and a simple 12-minute routine — and says files are delivered digitally. FindWorthNow has not used the audio, and this is not a hands-on review.",
          "The seller associates the offer with brainwave research and gamma-wave language. That is marketing copy, not a clinical evaluation.",
          "An audio file is not a medical device and is not a treatment for memory loss, dementia, or any other medical condition.",
        ],
      },
      {
        heading: "What the seller says you get",
        paragraphs: [
          "When we checked gobrainsong.com, the offer was a digital listening program. The page states that product images are for visualization only and that delivery is digital — no physical disc or headset is promised on that page.",
        ],
        bullets: [
          "Digital audio routine (seller-stated)",
          "Home listening; no physical product listed on the page we reviewed",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s pitch is that a short daily sound session can support focus, learning, and mental wellness by stimulating gamma brainwaves. That is the seller’s thesis, not a result FindWorthNow has measured.",
        ],
      },
      {
        heading: "Price and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a promotional price of $39. Refund terms were not clearly spelled out in the snippet we reviewed, so confirm the current guarantee on the checkout page.",
          "Checkout is handled through ClickBank. Use the official Brain Song page for current pricing — that is where a purchase is meant to happen.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "If you have a neurological condition, hearing issue, or another health concern, talk with a qualified clinician before starting a new audio routine. Results can vary.",
        ],
        bullets: [
          "This is a digital audio program, not a medication or supplement.",
          "We have not verified the audio, the cited research, or typical results.",
          "The content is not medical advice.",
        ],
      },
    ],
  },
  {
    slug: "audifort",
    name: "Audifort",
    categorySlug: "dietary-supplements",
    typeLabel: "Hearing Support Supplement",
    shortDescription:
      "A dietary supplement sold for hearing support, with a listed multi-ingredient formula and 90-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/audifort.png",
      alt: "Three Audifort supplement bottles",
    },
    affiliateUrl: hop("f97520q7mg1f366yy8j3wivs4j"),
    ctaLabel: "Visit Audifort",
    reviewSlug: "audifort-review",
    reviewTitle: "Audifort Review",
    metaTitle: "Audifort Review",
    metaDescription:
      "A short overview of Audifort: what the manufacturer says it is, listed ingredients, packages, and what to consider before visiting the official page.",
    heroDescription:
      "Audifort is a dietary supplement sold for hearing support. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is Audifort?",
        paragraphs: [
          "Audifort is marketed as a dietary supplement for hearing support. The sales page is associated with Andrew Ross. FindWorthNow has not independently tested the product.",
          "Dietary supplements are not medicines. They are not intended to diagnose, treat, cure, or prevent hearing loss, tinnitus, or any other medical condition.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "The offer we reviewed described more than 20 ingredients. These names appeared on the public page. We have not confirmed doses against a label in hand.",
        ],
        bullets: [
          "Maca root",
          "Grape seed",
          "Green tea",
          "Capsicum annuum",
          "Gymnema sylvestre",
          "GABA",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is that selected plant ingredients can support ear health and related comfort. That is the manufacturer’s thesis, not a finding from FindWorthNow.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a 60-day (2-bottle) option at $79 per bottle plus shipping, a 90-day (3-bottle) option at $69 per bottle, and a 180-day (6-bottle) option at $49 per bottle. The larger packs advertised free U.S. shipping and two digital bonuses.",
          "The page advertised a 90-day money-back guarantee. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "Sudden hearing change, ear pain, or drainage needs a clinician, not a supplement. Results can vary. The sales page makes strong claims about hearing; those claims belong to the manufacturer.",
        ],
        bullets: [
          "It is a dietary supplement, not a hearing aid or medical treatment.",
          "We have not verified the formula, doses, or customer stories.",
          "Supplements are not a replacement for medical advice.",
        ],
      },
    ],
  },
  {
    slug: "joint-genesis",
    name: "Joint Genesis",
    categorySlug: "dietary-supplements",
    typeLabel: "Joint Support Supplement",
    shortDescription:
      "A Biodynamix joint supplement sold around Mobilee and other listed plant extracts, with an 180-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/joint-genesis.png",
      alt: "Joint Genesis supplement bottles from Biodynamix",
    },
    affiliateUrl: hop("b1747etmmmpfvd5gr7tkjayx6y"),
    ctaLabel: "Visit Joint Genesis",
    reviewSlug: "joint-genesis-review",
    reviewTitle: "Joint Genesis Review",
    metaTitle: "Joint Genesis Review",
    metaDescription:
      "A short overview of Joint Genesis: what the manufacturer says it is, listed ingredients, packages, and what to consider before visiting the official page.",
    heroDescription:
      "Joint Genesis is a dietary supplement sold for joint support. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is Joint Genesis?",
        paragraphs: [
          "Joint Genesis is marketed by Biodynamix as a joint-support supplement. The sales page is associated with Dr. Mark Weis, M.D. FindWorthNow has not independently tested the product.",
          "Dietary supplements are not medicines. They are not intended to diagnose, treat, cure, or prevent arthritis or any other medical condition.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "The offer we reviewed highlights Mobilee as the lead ingredient, plus other joint-positioned extracts. Exact amounts besides an 80 mg Mobilee figure on the sales page should be confirmed on a current label.",
        ],
        bullets: [
          "Mobilee (manufacturer-stated hyaluronan-related ingredient)",
          "French maritime pine bark",
          "Boswellia serrata",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is that hyaluronan in joint fluid declines with age, and that Mobilee is meant to support that fluid. That is the manufacturer’s thesis, not a finding from FindWorthNow.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a 60-day (2-bottle) option at $79 per bottle plus shipping, a 90-day (3-bottle) option at $69 per bottle, and a 180-day (6-bottle) option at $49 per bottle. A smaller introductory 30-day price also appeared on the page.",
          "The page advertised an 180-day “empty bottle” money-back guarantee. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "Joint pain that is sudden, severe, or paired with swelling needs a clinician. Results can vary. Sales-page studies and village stories belong to the manufacturer.",
        ],
        bullets: [
          "It is a dietary supplement, not a medication.",
          "We have not verified the cited studies, ingredient doses, or customer stories.",
          "Supplements are not a replacement for medical advice.",
        ],
      },
    ],
  },
  {
    slug: "visiflora",
    name: "VisiFlora",
    categorySlug: "dietary-supplements",
    typeLabel: "Vision Support Supplement",
    shortDescription:
      "A capsule supplement sold around a 22-ingredient vision formula, with 2-, 3-, and 6-bottle packages.",
    image: {
      src: "/sites/findworthnow/products/visiflora.png",
      alt: "VisiFlora vision support supplement bottles",
    },
    affiliateUrl: hop("57a229obhkrh05emnox70a6xfq"),
    ctaLabel: "Visit VisiFlora",
    reviewSlug: "visiflora-review",
    reviewTitle: "VisiFlora Review",
    metaTitle: "VisiFlora Review",
    metaDescription:
      "A short overview of VisiFlora: what the manufacturer says it is, listed ingredients, packages, and what to consider before visiting the official page.",
    heroDescription:
      "VisiFlora is a dietary supplement sold for vision support. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is VisiFlora?",
        paragraphs: [
          "VisiFlora is marketed as a daily capsule with a 22-ingredient formula. The manufacturer describes it as vegan, non-GMO, and stimulant-free. FindWorthNow has not independently tested the product.",
          "Dietary supplements are not medicines. They are not intended to diagnose, treat, cure, or prevent eye disease, floaters, or vision loss.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "The sales page groups ingredients into a “vision defense” mix and a gut-positioned mix. These names appeared on the public offer. We have not confirmed a full Supplement Facts panel in hand.",
        ],
        bullets: [
          "Astaxanthin",
          "Vitamin C and vitamin E",
          "Lutein and zeaxanthin (from marigold)",
          "Saffron extract",
          "Chromium (listed on the gut-positioned side of the page)",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is a gut–eye connection and a toxin it abbreviates as LPS. That is the manufacturer’s thesis, not a finding from FindWorthNow. We are not repeating disease or “restore 20/20” language from the sales funnel.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a 2-bottle option at $79 per bottle plus shipping, a 3-bottle option at $59 per bottle, and a 6-bottle option at $49 per bottle. Larger packs advertised free U.S. shipping and digital bonuses.",
          "The page advertised a 60-day money-back guarantee. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "Sudden vision change, eye pain, or flashes of light needs urgent clinical care. Results can vary.",
        ],
        bullets: [
          "It is a dietary supplement, not an eye treatment.",
          "We have not verified the formula, doses, or customer stories.",
          "Supplements are not a replacement for an eye exam or medical advice.",
        ],
      },
    ],
  },
  {
    slug: "neuro-serge",
    name: "Neuro Serge",
    categorySlug: "dietary-supplements",
    typeLabel: "Brain Support Supplement",
    shortDescription:
      "A capsule supplement sold as a 20-plus ingredient brain formula, with an 180-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/neuro-serge.png",
      alt: "Neuro Serge brain support supplement bottles",
    },
    affiliateUrl: hop("4f7e05xetrzl-5f6jo113i-xdo"),
    ctaLabel: "Visit Neuro Serge",
    reviewSlug: "neuro-serge-review",
    reviewTitle: "Neuro Serge Review",
    metaTitle: "Neuro Serge Review",
    metaDescription:
      "A short overview of Neuro Serge: what the manufacturer says it is, listed ingredients, packages, and what to consider before visiting the official page.",
    heroDescription:
      "Neuro Serge is a dietary supplement sold for brain support. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is Neuro Serge?",
        paragraphs: [
          "Neuro Serge is marketed as a daily capsule with a proprietary blend of 20-plus plants and nutrients. The sales page is associated with Dr. Robert Anderson. FindWorthNow has not independently tested the product.",
          "Dietary supplements are not medicines. They are not intended to diagnose, treat, cure, or prevent dementia, Alzheimer’s disease, or any other medical condition.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "The public offer lists a proprietary blend rather than a full milligram breakdown. These names appeared on the page we reviewed.",
        ],
        bullets: [
          "Olive leaf",
          "Cinnamomum cassia (cinnamon)",
          "Green tea extract",
          "Bilberry extract",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is general brain support with aging. Affiliate emails for this offer use much stronger “memory restoration” language. This overview stays with what the product page itself lists and does not treat those emails as evidence.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a 60-day (2-bottle) option at $79 per bottle plus shipping, a 90-day (3-bottle) option at $69 per bottle, and a 180-day (6-bottle) option at $49 per bottle. Larger packs advertised free shipping and digital bonuses.",
          "The page advertised an 180-day money-back guarantee. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "Ongoing memory change needs a clinician. Results can vary. Sales-page claims about brain health belong to the manufacturer.",
        ],
        bullets: [
          "It is a dietary supplement, not a medication.",
          "We have not verified the blend, doses, or customer stories.",
          "Supplements are not a replacement for medical advice.",
        ],
      },
    ],
  },
  {
    slug: "gluco6",
    name: "Gluco6",
    categorySlug: "dietary-supplements",
    typeLabel: "Blood Sugar Support Supplement",
    shortDescription:
      "A dietary supplement sold for blood-sugar support, with listed plant ingredients and a 60-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/gluco6.png",
      alt: "Gluco6 supplement bottles",
    },
    affiliateUrl: hop("da930blcnruj3f24ulokjs6p76"),
    ctaLabel: "Visit Gluco6",
    reviewSlug: "gluco6-review",
    reviewTitle: "Gluco6 Review",
    metaTitle: "Gluco6 Review",
    metaDescription:
      "A short overview of Gluco6: what the manufacturer says it is, listed ingredients, packages, and what to consider before visiting the official page.",
    heroDescription:
      "Gluco6 is a dietary supplement sold for blood-sugar support. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is Gluco6?",
        paragraphs: [
          "Gluco6 is marketed as a dietary supplement for blood-sugar support. FindWorthNow has not independently tested the product.",
          "This is not a diabetes drug and not a replacement for prescribed medication. Dietary supplements are not intended to diagnose, treat, cure, or prevent diabetes or any other medical condition. Do not change diabetes care without a clinician.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "These names appeared on the public offer we reviewed. Exact amounts should be confirmed on a current label.",
        ],
        bullets: ["Chromium", "Cinnamon", "Green tea"],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is everyday blood-sugar and weight support. Affiliate emails for this offer use much stronger disease language. This overview does not repeat those claims.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a 90-day (3-bottle) option at $49 per bottle plus shipping and a 180-day (6-bottle) option at $39 per bottle with free U.S. shipping. A smaller 2-bottle option also appeared.",
          "The page advertised a 60-day money-back guarantee, less shipping. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "If you use insulin or other glucose-lowering medication, talk with a clinician before adding a supplement. Results can vary.",
        ],
        bullets: [
          "It is a dietary supplement, not a medication.",
          "We have not verified the formula, doses, or customer stories.",
          "Supplements are not a replacement for diabetes care or medical advice.",
        ],
      },
    ],
  },
  {
    slug: "java-burn",
    name: "Java Burn 2.0",
    categorySlug: "dietary-supplements",
    typeLabel: "Coffee Additive Supplement",
    shortDescription:
      "A tasteless powder sold in pouches to mix with coffee, marketed around metabolism support.",
    image: {
      src: "/sites/findworthnow/products/java-burn.png",
      alt: "Java Burn pouches and coffee mug",
    },
    affiliateUrl: hop("3e37aeuhlr3nyac5goka8ppqc3"),
    ctaLabel: "Visit Java Burn",
    reviewSlug: "java-burn-review",
    reviewTitle: "Java Burn 2.0 Review",
    metaTitle: "Java Burn 2.0 Review",
    metaDescription:
      "A short overview of Java Burn 2.0: what the manufacturer says it is, how it is sold, and what to consider before visiting the official page.",
    heroDescription:
      "Java Burn 2.0 is a powder sold to mix with coffee. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is Java Burn 2.0?",
        paragraphs: [
          "Java Burn is marketed as a tasteless powder you add to morning coffee. The sales page describes pouches and a “nutritional serum complex.” FindWorthNow has not independently tested the product.",
          "It is a dietary supplement, not a meal replacement and not a medication. It is not intended to diagnose, treat, cure, or prevent obesity or any other medical condition.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "The welcome page we reviewed did not publish a clear, complete Supplement Facts list in the main text. The manufacturer describes a proprietary mix designed to be used with coffee. Confirm ingredients and caffeine content on the official label before buying, especially if you already drink coffee.",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is metabolism and weight support when the powder is used with coffee. That is the manufacturer’s thesis, not a result FindWorthNow has measured. We are not repeating before-and-after weight claims.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a 60-day (2-unit) option at $79 each plus shipping, a 90-day (3-unit) option at $69 each, and a 180-day (6-unit) option at $49 each with free shipping.",
          "The page advertised a 60-day money-back guarantee, including empty pouches, less shipping. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "This product is meant to go into coffee. If caffeine is a problem for you, or you are pregnant, nursing, or managing a health condition, talk with a clinician first. Weight results vary.",
        ],
        bullets: [
          "It is a dietary supplement mixed with coffee, not a medication.",
          "We have not verified the proprietary formula or typical results.",
          "Supplements are not a replacement for diet, activity, or medical advice.",
        ],
      },
    ],
  },
  {
    slug: "pineal-guardian-x",
    name: "Pineal Guardian X",
    categorySlug: "dietary-supplements",
    typeLabel: "Brain Support Liquid Supplement",
    shortDescription:
      "A liquid dropper supplement sold around pineal-gland and melatonin marketing, with listed plant extracts.",
    image: {
      src: "/sites/findworthnow/products/pineal-guardian-x.png",
      alt: "Pineal Guardian X liquid supplement bottles",
    },
    affiliateUrl: hop("65368cw7tkvgx24jqhliw6wzb4"),
    ctaLabel: "Visit Pineal Guardian X",
    reviewSlug: "pineal-guardian-x-review",
    reviewTitle: "Pineal Guardian X Review",
    metaTitle: "Pineal Guardian X Review",
    metaDescription:
      "A short overview of Pineal Guardian X: what the manufacturer says it is, listed ingredients, packages, and what to consider before visiting the official page.",
    heroDescription:
      "Pineal Guardian X is a liquid dietary supplement sold for brain support. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is Pineal Guardian X?",
        paragraphs: [
          "Pineal Guardian X is marketed as a liquid dropper formula. The sales page ties it to the pineal gland and natural melatonin. FindWorthNow has not independently tested the product.",
          "Dietary supplements are not medicines. They are not intended to diagnose, treat, cure, or prevent memory loss, dementia, or any other medical condition.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "These names appeared on the public offer we reviewed. Exact amounts should be confirmed on a current label.",
        ],
        bullets: [
          "Yamabushitake (lion’s mane mushroom)",
          "Spirulina",
          "Moringa extract",
          "Tamarind extract",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is that fluoride can affect the pineal gland and melatonin, and that this liquid is meant to support that pathway. That is the manufacturer’s thesis, not a finding from FindWorthNow.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed multi-bottle options in the same range as many ClickBank supplements, including figures around $69, $59, and $39 per bottle depending on pack size. Confirm the live checkout price — promotions change.",
          "Checkout is handled through ClickBank. Use the official Pineal Guardian page for current pricing and refund terms.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "Memory change, sleep problems, or another health concern belongs with a clinician. Results can vary. Detox and fluoride language on the sales page belongs to the manufacturer.",
        ],
        bullets: [
          "It is a dietary supplement, not a medication.",
          "We have not verified the formula, doses, or customer stories.",
          "Supplements are not a replacement for medical advice.",
        ],
      },
    ],
  },
  {
    slug: "prostavive",
    name: "ProstaVive",
    categorySlug: "mens-health",
    typeLabel: "Prostate Support Powder",
    shortDescription:
      "A daily drink powder sold for prostate support, with a listed herbal blend and 180-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/prostavive.png",
      alt: "ProstaVive powder tubs for daily prostate-support drink",
    },
    affiliateUrl: hop("cc7150kknprex10azj253afwdq"),
    ctaLabel: "Visit ProstaVive",
    reviewSlug: "prostavive-review",
    reviewTitle: "ProstaVive Review",
    metaTitle: "ProstaVive Review",
    metaDescription:
      "A short overview of ProstaVive: what the manufacturer says it is, listed ingredients, packages, and what to consider before visiting the official page.",
    heroDescription:
      "ProstaVive is a powdered dietary supplement sold for prostate support. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is ProstaVive?",
        paragraphs: [
          "ProstaVive is marketed as a powder mixed with water or another drink. The FAQ on the official page says to use one scoop daily, preferably with a meal. FindWorthNow has not independently tested the product.",
          "Dietary supplements are not medicines. They are not intended to diagnose, treat, cure, or prevent prostate disease, urinary problems, or any other medical condition.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "The sales page lists these names. Exact milligram amounts were not clearly posted on the public offer we reviewed.",
        ],
        bullets: [
          "Boron",
          "Tongkat ali",
          "Ashwagandha",
          "Fenugreek",
          "Panax ginseng",
          "Maca root",
          "Artichoke extract",
          "Nettle root",
          "Zinc, magnesium, and vitamin D",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story is prostate comfort, urinary flow, energy, and sexual wellness in one powder. That is the manufacturer’s thesis, not a finding from FindWorthNow. We are not repeating disease or sexual-performance guarantees from the sales page.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a 30-day bottle at $79, a 90-day (3-pack) option at $59 per bottle, and a 180-day (6-pack) option at $39 per bottle. Larger packs advertised digital bonuses.",
          "The page advertised a 180-day money-back guarantee. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "Urinary symptoms, blood in urine, or prostate concerns need a clinician. Results can vary.",
        ],
        bullets: [
          "It is a dietary supplement, not a medication.",
          "We have not verified the formula, doses, or customer stories.",
          "Supplements are not a replacement for medical advice.",
        ],
      },
    ],
  },
  {
    slug: "spartamax",
    name: "Spartamax",
    categorySlug: "mens-health",
    typeLabel: "Men's Wellness Supplement",
    shortDescription:
      "A capsule supplement sold in the men's sexual-wellness category, with a listed herbal blend and 365-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/spartamax.png",
      alt: "Spartamax men's wellness supplement bottles",
    },
    affiliateUrl: hop("8430e7ycep3nw74q-31debqick"),
    ctaLabel: "Visit Spartamax",
    reviewSlug: "spartamax-review",
    reviewTitle: "Spartamax Review",
    metaTitle: "Spartamax Review",
    metaDescription:
      "A short overview of Spartamax: what the manufacturer says it is, listed ingredients, packages, and what to consider before visiting the official page.",
    heroDescription:
      "Spartamax is a dietary supplement sold for men's wellness. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is Spartamax?",
        paragraphs: [
          "Spartamax is marketed as a daily men’s wellness capsule. FindWorthNow has not independently tested the product.",
          "Dietary supplements are not medicines. They are not intended to diagnose, treat, cure, or prevent sexual dysfunction or any other medical condition. This page does not treat the product as a prescription alternative.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "These names appeared on the public offer we reviewed. Exact amounts should be confirmed on a current label.",
        ],
        bullets: [
          "Arginine",
          "Tongkat ali",
          "Maca root",
          "Ashwagandha",
          "Horny goat weed",
          "Beet root",
          "Grape seed extract",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company markets Spartamax in the men's sexual-wellness category. That is the seller’s positioning, not a clinical conclusion from FindWorthNow. We are not repeating performance guarantees from the sales funnel.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a 1-month bottle at $69 plus about $9.99 shipping, a 3-bottle option at $59 per bottle, and a 6-bottle option at $49 per bottle. Larger packs advertised free U.S. shipping and two digital bonuses.",
          "The page advertised a 365-day money-back guarantee. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "Sexual-health symptoms can have medical causes. Talk with a clinician, especially if you take heart or blood-pressure medication. Results can vary.",
        ],
        bullets: [
          "It is a dietary supplement, not a medication.",
          "We have not verified the formula, doses, or customer stories.",
          "Supplements are not a replacement for medical advice.",
        ],
      },
    ],
  },
  {
    slug: "phytomem-one",
    name: "Phytomem One",
    categorySlug: "mental-health",
    typeLabel: "Memory Support Supplement",
    shortDescription:
      "A tablet supplement sold as a 10-ingredient brain formula, with 2-, 3-, and 6-bottle packages.",
    image: {
      src: "/sites/findworthnow/products/phytomem-one.png",
      alt: "Phytomem One memory support supplement bottles",
    },
    affiliateUrl: hop("6a03adtgejxez25ovszjq8qw37"),
    ctaLabel: "Visit Phytomem One",
    reviewSlug: "phytomem-one-review",
    reviewTitle: "Phytomem One Review",
    metaTitle: "Phytomem One Review",
    metaDescription:
      "A short overview of Phytomem One: what the manufacturer says it is, listed ingredients, packages, and what to consider before visiting the official page.",
    heroDescription:
      "Phytomem One is a dietary supplement sold for memory and mental clarity. This page summarizes what the manufacturer currently lists so you can decide whether to read the full offer there.",
    sections: [
      {
        heading: "What is Phytomem One?",
        paragraphs: [
          "Phytomem One is marketed as a daily tablet with a 10-ingredient formula. The manufacturer describes it as non-GMO and stimulant-free. FindWorthNow has not independently tested the product.",
          "Dietary supplements are not medicines. They are not intended to diagnose, treat, cure, or prevent dementia, Alzheimer’s disease, or any other medical condition.",
        ],
      },
      {
        heading: "What the manufacturer says is in it",
        paragraphs: [
          "The sales page splits the formula into two groups. These names appeared on the public offer. We have not confirmed a full Supplement Facts panel in hand.",
        ],
        bullets: [
          "Saffron extract",
          "Fucoxanthin and fucoidan (from sea kelp)",
          "Oleuropein (olive leaf extract)",
          "Berberine HCl",
          "Corosolic acid (banaba leaf)",
          "Kudzu flower extract",
        ],
      },
      {
        heading: "How it is positioned",
        paragraphs: [
          "The company’s marketing story involves microplastics and metabolic brain support. That is the manufacturer’s thesis, not a finding from FindWorthNow. Affiliate emails for this offer use stronger disease language; this overview does not repeat those claims.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "When we checked the official page, it listed a 2-bottle option at $79 per bottle plus shipping, a 3-bottle option at $59 per bottle, and a 6-bottle option at $49 per bottle. Larger packs advertised free U.S. shipping and digital bonuses.",
          "The page advertised a 60-day money-back guarantee. Checkout is handled through ClickBank. Confirm current terms on the official page.",
        ],
      },
      {
        heading: "Things to consider",
        paragraphs: [
          "Ongoing memory change needs a clinician. Berberine can interact with medications; talk with a qualified clinician before using a new supplement.",
        ],
        bullets: [
          "It is a dietary supplement, not a medication.",
          "We have not verified the formula, doses, or customer stories.",
          "Supplements are not a replacement for medical advice.",
        ],
      },
    ],
  },
];
