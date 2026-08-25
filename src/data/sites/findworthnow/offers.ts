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
      "A melting probiotic tablet with a 3.5 billion CFU blend plus peppermint, inulin, and malic acid.",
    image: {
      src: "/sites/findworthnow/products/prodentim.png",
      alt: "Three ProDentim bottles with chewable oral probiotic tablets",
    },
    affiliateUrl: hop("e7a60dxdsqzk2929vhg2tejc5x"),
    ctaLabel: "Get ProDentim",
    reviewSlug: "prodentim-review",
    reviewTitle: "ProDentim Review",
    metaTitle: "ProDentim Review",
    metaDescription:
      "ProDentim: 3.5 billion CFU chewable probiotic, named strains, multi-bottle packages, and a 60-day money-back window.",
    heroDescription:
      "ProDentim is a melting probiotic tablet for the mouth — about 3.5 billion cells plus a small plant-and-mineral mix. You chew it. You don’t swallow a capsule and hope it lands in the right place.",
    sections: [
      {
        heading: "What is ProDentim?",
        paragraphs: [
          "ProDentim is a chewable oral probiotic. The idea is simple: get the strains onto the gums and tongue instead of sending them straight to the gut.",
          "The formula is listed as non-GMO, gluten-free, and free of stimulants.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "A blend of about 3.5 billion probiotic cells plus a plant-and-mineral mix:",
        ],
        bullets: [
          "Lactobacillus paracasei",
          "Bifidobacterium lactis BL-04",
          "Lactobacillus reuteri",
          "Inulin, malic acid, tricalcium phosphate, and peppermint",
        ],
      },
      {
        heading: "Why it stands out",
        paragraphs: [
          "Everyday toothpaste and mouthwash are built to wipe the mouth clean. A chewable probiotic is the opposite bet: put named strains back on the surfaces you actually care about — gums, breath, everyday comfort.",
          "The same offer also nods at sinus, digestion, and weight. Treat those as extras. The product you are buying is an oral-care tablet.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "A fit if you already brush and still want something chewable for gums and breath — and you like seeing strain names instead of a mystery blend.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "Multi-bottle packages are the usual path, with U.S. shipping around $9.99 on the smaller option and a 60-day money-back guarantee if you contact support.",
          "Use the button below for the current checkout.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "Bleeding gums or tooth pain still belong with a dentist. A chewable tablet is not a cleaning, a filling, or periodontal treatment.",
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
      "A Berry Frost chewable postbiotic tablet built around a dual-strain Lactobacillus plantarum complex.",
    image: {
      src: "/sites/findworthnow/products/dentabiome.png",
      alt: "DentaBiome bottles of Berry Frost chewable oral tablets",
    },
    affiliateUrl: hop("a49904lkpj1iue5-tlv8me-dfi"),
    ctaLabel: "Get DentaBiome",
    reviewSlug: "dentabiome-review",
    reviewTitle: "DentaBiome Review",
    metaTitle: "DentaBiome Review",
    metaDescription:
      "DentaBiome: Berry Frost chewable postbiotic, 2-, 3-, and 6-bottle packages from $49 a bottle, and a 60-day empty-bottle guarantee.",
    heroDescription:
      "DentaBiome is a Berry Frost chewable tablet you work around the mouth — a postbiotic, not a swallowed capsule. Larger packs drop to $49 a bottle and include free U.S. shipping.",
    sections: [
      {
        heading: "What is DentaBiome?",
        paragraphs: [
          "DentaBiome is a chewable postbiotic tablet in Berry Frost. You chew it so it contacts the mouth, rather than swallowing it like a gut capsule.",
          "It is listed as vegan, dairy-free, non-GMO, and made in the United States in a GMP-certified setting.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "The public offer highlights a dual-strain Lactobacillus plantarum complex and a proprietary postbiotic blend. Full milligram amounts are not published on that offer:",
        ],
        bullets: [
          "Dual-strain L. plantarum complex",
          "Proprietary postbiotic blend",
        ],
      },
      {
        heading: "Why it stands out",
        paragraphs: [
          "The formula is built around an enzyme it calls FabM and an “acid-lock” around mouth bacteria — a tighter story than “probiotic for teeth.”",
          "If you want a chewable that stays in the mouth and you like a berry flavor over mint, this is the one in this aisle.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "Worth grabbing if you want a postbiotic chewable, a 60-day empty-bottle guarantee, and free U.S. shipping once you go past two bottles.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "Three one-time packages: a 60-day (2-bottle) option at $79 per bottle, a 90-day (3-bottle) option at $69 per bottle, and a 180-day (6-bottle) option at $49 per bottle. The 3- and 6-bottle options include free U.S. shipping and two digital bonuses.",
          "There is a 60-day money-back guarantee, including empty bottles.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "See a dentist for bleeding gums, cavities, or pain. Chewable supplements are not a cleaning, filling, or periodontal treatment.",
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
      "A short daily listening routine — a 7-second brainwave clip inside a 12-minute session — listed at $39.",
    image: {
      src: "/sites/findworthnow/products/the-brain-song.png",
      alt: "The Brain Song digital audio program promotional artwork",
    },
    affiliateUrl: hop("121f2-o7qryp2404z2ulvg2d9a"),
    ctaLabel: "Get The Brain Song",
    reviewSlug: "the-brain-song-review",
    reviewTitle: "The Brain Song Review",
    metaTitle: "The Brain Song Review",
    metaDescription:
      "The Brain Song: a digital 12-minute listening routine with a 7-second brainwave session, listed at $39. Nothing ships.",
    heroDescription:
      "The Brain Song is a digital listening routine you run at home. A 7-second brainwave clip inside a simple 12-minute session. Current price: $39. Nothing ships.",
    sections: [
      {
        heading: "What is The Brain Song?",
        paragraphs: [
          "A digital audio program. You listen. There is no headset in the box and no disc in the mail — product images are for visualization only.",
          "Files are delivered digitally after checkout.",
        ],
      },
      {
        heading: "What's included",
        paragraphs: [
          "What you get:",
        ],
        bullets: [
          "Digital audio routine",
          "Home listening — no physical product",
        ],
      },
      {
        heading: "Why it stands out",
        paragraphs: [
          "The hook is gamma-wave language: a short daily sound session aimed at focus, learning, and mental wellness. You are buying a listening habit, not another capsule.",
          "If 12 minutes is a slot you already have — commute, desk, evening wind-down — this is an easy one to try at $39.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "A fit if you want a low-priced audio routine and you are curious about brainwave listening without buying hardware.",
        ],
      },
      {
        heading: "Price and guarantee",
        paragraphs: [
          "The current promotional price is $39. Use the button below to start.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "If you have a neurological condition, a hearing issue, or another health concern, talk with a clinician before starting a new audio routine.",
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
      "A 20-plus ingredient hearing-support capsule with maca, grape seed, green tea, and GABA, plus a 90-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/audifort.png",
      alt: "Three Audifort supplement bottles",
    },
    affiliateUrl: hop("f97520q7mg1f366yy8j3wivs4j"),
    ctaLabel: "Get Audifort",
    reviewSlug: "audifort-review",
    reviewTitle: "Audifort Review",
    metaTitle: "Audifort Review",
    metaDescription:
      "Audifort: 20-plus ingredient hearing-support formula, packages from $49 a bottle, and a 90-day money-back window.",
    heroDescription:
      "Audifort is a plant-heavy capsule in the hearing-support aisle. More than 20 ingredients, larger packs at $49 a bottle with free U.S. shipping, and a 90-day money-back window.",
    sections: [
      {
        heading: "What is Audifort?",
        paragraphs: [
          "Audifort is a daily dietary supplement sold for hearing support — a long botanical mix rather than a single-ingredient bottle.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "More than 20 ingredients, including:",
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
        heading: "Why it stands out",
        paragraphs: [
          "You get a wide plant mix in one capsule, plus a 90-day guarantee that is longer than most bottles in this catalog.",
          "If you already take maca, grape seed, or GABA and you want them in a hearing-positioned formula, this is the stacked option.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "A look if you want a multi-ingredient hearing-support capsule and a longer refund window than the usual 60 days.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "A 60-day (2-bottle) option at $79 per bottle plus shipping, a 90-day (3-bottle) option at $69 per bottle, and a 180-day (6-bottle) option at $49 per bottle. The larger packs include free U.S. shipping and two digital bonuses.",
          "There is a 90-day money-back guarantee.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "Sudden hearing change, ear pain, or drainage needs a clinician, not a bottle. The plant mix is long — check it against anything you already take.",
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
      "A Biodynamix joint capsule led by 80 mg of Mobilee, plus pine bark and boswellia, with an 180-day empty-bottle guarantee.",
    image: {
      src: "/sites/findworthnow/products/joint-genesis.png",
      alt: "Joint Genesis supplement bottles from Biodynamix",
    },
    affiliateUrl: hop("b1747etmmmpfvd5gr7tkjayx6y"),
    ctaLabel: "Get Joint Genesis",
    reviewSlug: "joint-genesis-review",
    reviewTitle: "Joint Genesis Review",
    metaTitle: "Joint Genesis Review",
    metaDescription:
      "Joint Genesis: Mobilee 80 mg plus pine bark and boswellia, packages from $49 a bottle, and an 180-day empty-bottle guarantee.",
    heroDescription:
      "Joint Genesis is a Biodynamix joint capsule built around Mobilee — 80 mg of a hyaluronan-related ingredient — plus French maritime pine bark and boswellia. The refund window is 180 days, empty bottles included.",
    sections: [
      {
        heading: "What is Joint Genesis?",
        paragraphs: [
          "A daily joint-support capsule from Biodynamix. The lead ingredient is Mobilee, listed at 80 mg, with other joint-positioned extracts around it.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "Named ingredients include:",
        ],
        bullets: [
          "Mobilee (hyaluronan-related ingredient, 80 mg)",
          "French maritime pine bark",
          "Boswellia serrata",
        ],
      },
      {
        heading: "Why it stands out",
        paragraphs: [
          "The idea is that hyaluronan in joint fluid declines with age, and that Mobilee is there to support that fluid — a tighter story than a generic “joint blend.”",
          "An 180-day empty-bottle guarantee is the other reason to try it: you have half a year, not a couple of weeks.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "A fit if you want a named hyaluronan ingredient plus pine bark and boswellia, and you care about a long refund window.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "A 60-day (2-bottle) option at $79 per bottle plus shipping, a 90-day (3-bottle) option at $69 per bottle, and a 180-day (6-bottle) option at $49 per bottle. A smaller introductory 30-day price also appears.",
          "There is an 180-day empty-bottle money-back guarantee.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "Joint pain that is sudden, severe, or paired with swelling needs a clinician first.",
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
      "A 22-ingredient vision capsule with lutein, zeaxanthin, astaxanthin, and saffron, in 2-, 3-, and 6-bottle packs.",
    image: {
      src: "/sites/findworthnow/products/visiflora.png",
      alt: "VisiFlora vision support supplement bottles",
    },
    affiliateUrl: hop("57a229obhkrh05emnox70a6xfq"),
    ctaLabel: "Get VisiFlora",
    reviewSlug: "visiflora-review",
    reviewTitle: "VisiFlora Review",
    metaTitle: "VisiFlora Review",
    metaDescription:
      "VisiFlora: 22-ingredient vision formula with lutein, zeaxanthin, and saffron, packages from $49 a bottle, 60-day guarantee.",
    heroDescription:
      "VisiFlora is a daily 22-ingredient capsule for vision support — lutein and zeaxanthin from marigold, astaxanthin, saffron, plus a gut-positioned side of the formula. Larger packs land at $49 a bottle.",
    sections: [
      {
        heading: "What is VisiFlora?",
        paragraphs: [
          "A daily vision-support capsule with a 22-ingredient formula. It is listed as vegan, non-GMO, and stimulant-free.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "The formula is grouped into a “vision defense” mix and a gut-positioned mix. Named ingredients include:",
        ],
        bullets: [
          "Astaxanthin",
          "Vitamin C and vitamin E",
          "Lutein and zeaxanthin (from marigold)",
          "Saffron extract",
          "Chromium",
        ],
      },
      {
        heading: "Why it stands out",
        paragraphs: [
          "You get the usual vision names — lutein, zeaxanthin, astaxanthin — plus saffron, and a second mix aimed at the gut, including the idea of a gut–eye connection and a toxin abbreviated as LPS.",
          "If you want one bottle instead of a vision stack plus a separate gut capsule, this is the combined option.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "Worth a look if you already search lutein and zeaxanthin and you want them in a wider 22-ingredient daily capsule.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "A 2-bottle option at $79 per bottle plus shipping, a 3-bottle option at $59 per bottle, and a 6-bottle option at $49 per bottle. Larger packs include free U.S. shipping and digital bonuses.",
          "There is a 60-day money-back guarantee.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "Sudden vision change, eye pain, or flashes of light needs urgent clinical care.",
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
      "A 20-plus ingredient brain capsule with olive leaf, cinnamon, green tea, and bilberry, plus an 180-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/neuro-serge.png",
      alt: "Neuro Serge brain support supplement bottles",
    },
    affiliateUrl: hop("4f7e05xetrzl-5f6jo113i-xdo"),
    ctaLabel: "Get Neuro Serge",
    reviewSlug: "neuro-serge-review",
    reviewTitle: "Neuro Serge Review",
    metaTitle: "Neuro Serge Review",
    metaDescription:
      "Neuro Serge: 20-plus ingredient brain formula, packages from $49 a bottle, and an 180-day money-back window.",
    heroDescription:
      "Neuro Serge is a daily capsule with a proprietary blend of 20-plus plants and nutrients — olive leaf, cinnamon, green tea, bilberry among them — and an 180-day money-back window.",
    sections: [
      {
        heading: "What is Neuro Serge?",
        paragraphs: [
          "A daily brain-support capsule. The blend is proprietary, so you get named plants rather than a full milligram breakdown.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "Named ingredients include:",
        ],
        bullets: [
          "Olive leaf",
          "Cinnamomum cassia (cinnamon)",
          "Green tea extract",
          "Bilberry extract",
        ],
      },
      {
        heading: "Why it stands out",
        paragraphs: [
          "It is positioned as everyday brain support with aging — a plant-heavy capsule you take daily, with half a year to decide if you want to keep it.",
          "If olive leaf, green tea, and bilberry are already on your list, they are in one bottle here.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "A fit if you want a wide botanical brain blend and an 180-day guarantee rather than a two-week trial.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "A 60-day (2-bottle) option at $79 per bottle plus shipping, a 90-day (3-bottle) option at $69 per bottle, and a 180-day (6-bottle) option at $49 per bottle. Larger packs include free shipping and digital bonuses.",
          "There is an 180-day money-back guarantee.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "Ongoing memory change needs a clinician.",
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
      "A blood-sugar support capsule with chromium, cinnamon, and green tea, with 3- and 6-bottle packs from $39 a bottle.",
    image: {
      src: "/sites/findworthnow/products/gluco6.png",
      alt: "Gluco6 supplement bottles",
    },
    affiliateUrl: hop("da930blcnruj3f24ulokjs6p76"),
    ctaLabel: "Get Gluco6",
    reviewSlug: "gluco6-review",
    reviewTitle: "Gluco6 Review",
    metaTitle: "Gluco6 Review",
    metaDescription:
      "Gluco6: chromium, cinnamon, and green tea, packages from $39 a bottle, and a 60-day money-back window.",
    heroDescription:
      "Gluco6 is a daily capsule in the blood-sugar aisle — chromium, cinnamon, and green tea in one bottle. Six-bottle packs land at $39 each with free U.S. shipping.",
    sections: [
      {
        heading: "What is Gluco6?",
        paragraphs: [
          "A dietary supplement sold for everyday blood-sugar support. Simple named ingredients rather than a 20-item proprietary wall.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "The formula includes:",
        ],
        bullets: ["Chromium", "Cinnamon", "Green tea"],
      },
      {
        heading: "Why it stands out",
        paragraphs: [
          "Three names most people in this aisle already recognize, in one daily capsule, with a six-bottle price that is among the lower ones in this catalog.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "Worth a look if you want chromium and cinnamon in one bottle and you like buying a 90- or 180-day supply up front.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "A 90-day (3-bottle) option at $49 per bottle plus shipping and a 180-day (6-bottle) option at $39 per bottle with free U.S. shipping. A smaller 2-bottle option also appears.",
          "There is a 60-day money-back guarantee, less shipping.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "If you use insulin or another glucose-lowering medication, talk with a clinician before adding a supplement.",
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
      "A tasteless powder in pouches you stir into morning coffee, with 2-, 3-, and 6-unit packs and a 60-day empty-pouch guarantee.",
    image: {
      src: "/sites/findworthnow/products/java-burn.png",
      alt: "Java Burn pouches and coffee mug",
    },
    affiliateUrl: hop("3e37aeuhlr3nyac5goka8ppqc3"),
    ctaLabel: "Get Java Burn",
    reviewSlug: "java-burn-review",
    reviewTitle: "Java Burn 2.0 Review",
    metaTitle: "Java Burn 2.0 Review",
    metaDescription:
      "Java Burn 2.0: tasteless coffee powder in pouches, packages from $49 a unit, and a 60-day empty-pouch guarantee.",
    heroDescription:
      "Java Burn 2.0 is a tasteless powder you stir into the coffee you already drink. Pouches, not pills. Larger packs land at $49 each with free shipping.",
    sections: [
      {
        heading: "What is Java Burn 2.0?",
        paragraphs: [
          "A powder you add to morning coffee. It is described as tasteless, sold in pouches, and built around a “nutritional serum complex.”",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "The public offer does not publish a full Supplement Facts list in the main text. You are buying a proprietary mix designed to go in coffee — on top of the caffeine you already get from the mug.",
        ],
      },
      {
        heading: "Why it stands out",
        paragraphs: [
          "No extra capsule. No extra drink. If coffee is already a habit, this is the lowest-friction format in the metabolism aisle.",
          "The 60-day guarantee covers empty pouches, so you can actually use it before you decide.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "A fit if you drink coffee every morning and you want a powder that disappears into the cup rather than another bottle on the counter.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "A 60-day (2-unit) option at $79 each plus shipping, a 90-day (3-unit) option at $69 each, and a 180-day (6-unit) option at $49 each with free shipping.",
          "There is a 60-day money-back guarantee, including empty pouches, less shipping.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "This goes in coffee. If caffeine is a problem for you, or you are pregnant, nursing, or managing a health condition, talk with a clinician first.",
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
      "A liquid dropper with lion’s mane, spirulina, moringa, and tamarind, sold around pineal and melatonin support.",
    image: {
      src: "/sites/findworthnow/products/pineal-guardian-x.png",
      alt: "Pineal Guardian X liquid supplement bottles",
    },
    affiliateUrl: hop("65368cw7tkvgx24jqhliw6wzb4"),
    ctaLabel: "Get Pineal Guardian X",
    reviewSlug: "pineal-guardian-x-review",
    reviewTitle: "Pineal Guardian X Review",
    metaTitle: "Pineal Guardian X Review",
    metaDescription:
      "Pineal Guardian X: liquid dropper with lion’s mane, spirulina, moringa, and tamarind, multi-bottle packs from about $39 a bottle.",
    heroDescription:
      "Pineal Guardian X is a liquid dropper — lion’s mane, spirulina, moringa, and tamarind — aimed at pineal support and natural melatonin. No capsule to swallow.",
    sections: [
      {
        heading: "What is Pineal Guardian X?",
        paragraphs: [
          "A liquid dropper formula in the brain-support aisle, built around the pineal gland and natural melatonin rather than a standard capsule stack.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "Named ingredients include:",
        ],
        bullets: [
          "Yamabushitake (lion’s mane mushroom)",
          "Spirulina",
          "Moringa extract",
          "Tamarind extract",
        ],
      },
      {
        heading: "Why it stands out",
        paragraphs: [
          "The idea is that fluoride can affect the pineal gland and melatonin, and that this liquid is meant to support that pathway. Whether that story is yours or not, the format is different: drops, not pills, with lion’s mane in the mix.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "Worth a look if you prefer a liquid, you already like lion’s mane or spirulina, and you want a pineal-positioned formula rather than a generic nootropic capsule.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "Multi-bottle options sit in the same band as many offers here — around $69, $59, and $39 per bottle depending on pack size.",
          "Use the button below for the current checkout.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "Memory change, sleep problems, or another health concern still belongs with a clinician.",
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
      "A daily drink powder with tongkat ali, ashwagandha, nettle, zinc, and vitamin D, plus an 180-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/prostavive.png",
      alt: "ProstaVive powder tubs for daily prostate-support drink",
    },
    affiliateUrl: hop("cc7150kknprex10azj253afwdq"),
    ctaLabel: "Get ProstaVive",
    reviewSlug: "prostavive-review",
    reviewTitle: "ProstaVive Review",
    metaTitle: "ProstaVive Review",
    metaDescription:
      "ProstaVive: daily prostate-support powder with a named herbal blend, packages from $39 a bottle, and a 180-day guarantee.",
    heroDescription:
      "ProstaVive is a powder you mix with water or another drink — one scoop a day, preferably with a meal. Herbs, minerals, and an 180-day money-back window. Not another capsule.",
    sections: [
      {
        heading: "What is ProstaVive?",
        paragraphs: [
          "A daily drink powder in the prostate-support aisle. One scoop, mixed with water or another drink, preferably with a meal.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "The formula includes:",
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
        heading: "Why it stands out",
        paragraphs: [
          "Most prostate bottles are capsules. This one is a drink, with a list that also covers energy and sexual-wellness names — tongkat ali, maca, ginseng — alongside nettle, zinc, and vitamin D.",
          "If you already mix a morning powder, this slots in. If you hate swallowing pills, this is the format change.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "A fit if you want a scoop instead of a handful of capsules, and you like seeing nettle, zinc, and vitamin D on the same label as tongkat ali.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "A 30-day bottle at $79, a 90-day (3-pack) option at $59 per bottle, and a 180-day (6-pack) option at $39 per bottle. Larger packs include digital bonuses.",
          "There is a 180-day money-back guarantee.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "Urinary symptoms, blood in urine, or prostate concerns need a clinician.",
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
      "A men’s wellness capsule with arginine, tongkat ali, maca, ashwagandha, and horny goat weed, plus a 365-day guarantee.",
    image: {
      src: "/sites/findworthnow/products/spartamax.png",
      alt: "Spartamax men's wellness supplement bottles",
    },
    affiliateUrl: hop("8430e7ycep3nw74q-31debqick"),
    ctaLabel: "Get Spartamax",
    reviewSlug: "spartamax-review",
    reviewTitle: "Spartamax Review",
    metaTitle: "Spartamax Review",
    metaDescription:
      "Spartamax: named men’s-wellness blend including arginine and tongkat ali, packages from $49 a bottle, and a 365-day guarantee.",
    heroDescription:
      "Spartamax is a daily men’s wellness capsule with a named herbal list — arginine, tongkat ali, maca, ashwagandha, horny goat weed — and a full-year money-back window.",
    sections: [
      {
        heading: "What is Spartamax?",
        paragraphs: [
          "A daily capsule in the men’s sexual-wellness aisle, with a published herb-and-amino list instead of a blank proprietary wall.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "The formula includes:",
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
        heading: "Why it stands out",
        paragraphs: [
          "You can actually read the list. Arginine and beet root sit next to the usual men’s-wellness herbs, and the guarantee is 365 days — long enough to run a real stretch, not a weekend sample.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "Worth grabbing if you want named ingredients you already recognize and a one-year window to change your mind.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "A 1-month bottle at $69 plus about $9.99 shipping, a 3-bottle option at $59 per bottle, and a 6-bottle option at $49 per bottle. Larger packs include free U.S. shipping and two digital bonuses.",
          "There is a 365-day money-back guarantee.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "Sexual-health symptoms can have medical causes. Talk with a clinician, especially if you take heart or blood-pressure medication.",
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
      "A 10-ingredient memory tablet with saffron, olive leaf, berberine, and sea-kelp extracts, in 2-, 3-, and 6-bottle packs.",
    image: {
      src: "/sites/findworthnow/products/phytomem-one.png",
      alt: "Phytomem One memory support supplement bottles",
    },
    affiliateUrl: hop("6a03adtgejxez25ovszjq8qw37"),
    ctaLabel: "Get Phytomem One",
    reviewSlug: "phytomem-one-review",
    reviewTitle: "Phytomem One Review",
    metaTitle: "Phytomem One Review",
    metaDescription:
      "Phytomem One: 10-ingredient memory formula with saffron and berberine, packages from $49 a bottle, 60-day guarantee.",
    heroDescription:
      "Phytomem One is a daily 10-ingredient tablet for memory and mental clarity — saffron, olive leaf, sea-kelp extracts, and berberine in one formula. Listed as non-GMO and stimulant-free.",
    sections: [
      {
        heading: "What is Phytomem One?",
        paragraphs: [
          "A daily tablet with a 10-ingredient formula, listed as non-GMO and stimulant-free.",
        ],
      },
      {
        heading: "What's in it",
        paragraphs: [
          "The formula is split into two groups. Named ingredients include:",
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
        heading: "Why it stands out",
        paragraphs: [
          "It is not a standard ginkgo-and-bacopa bottle. Saffron and kelp extracts sit next to berberine, with a story about microplastics and metabolic brain support.",
          "If you want a memory tablet that also carries metabolic names, this is the crossover option.",
        ],
      },
      {
        heading: "Who it's for",
        paragraphs: [
          "A look if you want saffron and berberine in a memory-positioned tablet and you are fine with a stimulant-free daily habit.",
        ],
      },
      {
        heading: "Price, packages, and guarantee",
        paragraphs: [
          "A 2-bottle option at $79 per bottle plus shipping, a 3-bottle option at $59 per bottle, and a 6-bottle option at $49 per bottle. Larger packs include free U.S. shipping and digital bonuses.",
          "There is a 60-day money-back guarantee.",
        ],
      },
      {
        heading: "Good to know",
        paragraphs: [
          "Ongoing memory change needs a clinician. Berberine can interact with medications — talk with a clinician before you start.",
        ],
      },
    ],
  },
];
