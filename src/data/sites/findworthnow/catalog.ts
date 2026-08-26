import type { DirectoryCatalog } from "@/types/directory-catalog";
import { additionalOffers } from "./offers";
import { batchTwoOffers } from "./offers-batch2";

export const catalog: DirectoryCatalog = {
  categories: [
    {
      slug: "sleep",
      name: "Sleep",
      description:
        "Capsules, bedtime programs, and lucid-dreaming courses for a better night.",
      intro:
        "Sleep supplements, bedtime programs, and lucid-dreaming courses people are comparing right now.",
      metaTitle: "Sleep Products & Resources",
      metaDescription:
        "Sleep capsules, bedtime programs, and lucid-dreaming courses — ingredients, bundles, and current prices.",
    },
    {
      slug: "dental-health",
      name: "Dental Health",
      description:
        "Chewable probiotics and postbiotic tablets for teeth, gums, and breath.",
      intro:
        "Oral-care supplements for teeth, gums, and breath — chewable probiotics and postbiotic tablets.",
      metaTitle: "Dental Health Products",
      metaDescription:
        "Chewable oral probiotics and postbiotic tablets — strains, packages, and current prices.",
    },
    {
      slug: "dietary-supplements",
      name: "Dietary Supplements",
      description:
        "Capsules, powders, and liquids for everyday health — joints, hearing, blood sugar, and more.",
      intro:
        "Capsules, powders, and liquids for everyday health topics, with the current offer laid out in one place.",
      metaTitle: "Dietary Supplements",
      metaDescription:
        "Everyday supplements — formulas, packages, and current prices in one place.",
    },
    {
      slug: "diets-weight-loss",
      name: "Diets & Weight Loss",
      description:
        "Teas, cleanses, coffee add-ins, and digital diet plans.",
      intro:
        "Teas, cleanses, bottles, and digital diet plans for anyone comparing weight-support offers.",
      metaTitle: "Diets & Weight Loss",
      metaDescription:
        "Weight-support teas, cleanses, bottles, and digital diet plans — what’s inside and what it costs.",
    },
    {
      slug: "mens-health",
      name: "Men's Health",
      description:
        "Prostate, testosterone, and men’s wellness supplements.",
      intro:
        "Supplements for prostate support, testosterone, and men’s wellness — packages and pitches in one place.",
      metaTitle: "Men's Health Products",
      metaDescription:
        "Prostate, testosterone, and men’s wellness supplements — formulas, packages, and current prices.",
    },
    {
      slug: "mental-health",
      name: "Mental Health",
      description:
        "Formulas sold around memory, clarity, and everyday mental wellness.",
      intro:
        "Products for memory, clarity, and everyday mental wellness.",
      metaTitle: "Mental Health Products",
      metaDescription:
        "Memory and mental-wellness products — ingredients, packages, and current prices.",
    },
    {
      slug: "health-fitness",
      name: "Health & Fitness",
      description:
        "Digital programs and tools for focus, fitness, and everyday performance.",
      intro:
        "Health-and-fitness offers that aren’t a standard bottle — including short daily audio routines.",
      metaTitle: "Health & Fitness",
      metaDescription:
        "Digital fitness and focus programs — what you get and what they cost.",
    },
  ],
  products: [
    {
      slug: "sleep-revive",
      name: "Sleep Revive",
      categorySlug: "sleep",
      typeLabel: "Sleep Support Supplement",
      shortDescription:
        "A five-ingredient bedtime capsule with lemon balm, valerian, L-theanine, and magnesium glycinate.",
      image: {
        src: "/sites/findworthnow/products/sleep-revive.png",
        alt: "Three Sleep Revive supplement bottles from Critical Nutrition Labs",
      },
      affiliateUrl:
        "https://sleeprevive.org/?hopId=0b6f12e4-2400-4154-ae89-975447d57b68&traffic_source=tiktok",
      ctaLabel: "Get Sleep Revive",
      reviewSlug: "sleep-revive-review",
      reviewTitle: "Sleep Revive Review",
      metaTitle: "Sleep Revive Review",
      metaDescription:
        "Sleep Revive: five named ingredients, 2-capsule bedtime serving, packages from $39 a bottle, and a 60-day money-back window.",
      heroDescription:
        "Sleep Revive is a vegetarian capsule you take 30–45 minutes before bed. Five named ingredients, a clear serving, and packages that drop to $39 a bottle if you stock up.",
      sections: [
        {
          heading: "What is Sleep Revive?",
          paragraphs: [
            "Sleep Revive is a sleep-support capsule from Critical Nutrition Labs. Each bottle holds 60 vegetarian capsules. A serving is two capsules with water, 30–45 minutes before you turn in.",
            "The formula is listed as non-GMO, Prop 65 compliant, and made in a GMP-certified facility in the United States.",
          ],
        },
        {
          heading: "What's in it",
          paragraphs: [
            "Five ingredients. Milligram amounts are not published on the public offer, so you are choosing a named blend rather than a fully dosed label:",
          ],
          bullets: [
            "Rutaecarpine",
            "Lemon balm extract",
            "Valerian root",
            "L-theanine",
            "Magnesium glycinate",
          ],
        },
        {
          heading: "Why it stands out",
          paragraphs: [
            "Most sleep bottles lead with melatonin. This one doesn’t. It leans on lemon balm, valerian, L-theanine, and magnesium glycinate — the kind of mix people already look up when they want to wind down without a hormone.",
            "The idea behind the formula is that everyday plastic-related chemicals (BPA and phthalates are named) can get in the way of rest, and that clearing those “sleep disruptors” helps circadian rhythm settle. If that story matches how you think about sleep, the ingredient list is short enough to actually read.",
          ],
        },
        {
          heading: "Who it's for",
          paragraphs: [
            "A good fit if you want a bedtime capsule with a short, named list — not a 30-ingredient proprietary blend — and a 60-day window to change your mind.",
          ],
          bullets: [
            "You already take or research lemon balm, valerian, L-theanine, or magnesium at night",
            "You want a two-capsule serving you can drop into an existing wind-down",
          ],
        },
        {
          heading: "Price, packages, and guarantee",
          paragraphs: [
            "Prices can move, but the current offer is three one-time packages: a 30-day bottle at $59 plus shipping, a 90-day (3-bottle) option at $49 per bottle, and a 180-day (6-bottle) option at $39 per bottle.",
            "There is a 60-day money-back guarantee if you contact support within 60 days of purchase. Use the button below for the current checkout.",
          ],
        },
        {
          heading: "Good to know",
          paragraphs: [
            "This is a supplement, not a treatment for insomnia or sleep apnea. Keep the habits that already help you sleep, and talk with a clinician if nights have been rough for a while.",
          ],
        },
      ],
    },
    {
      slug: "breathing-for-sleep",
      name: "Breathing for Sleep",
      categorySlug: "sleep",
      typeLabel: "Digital Sleep Program",
      shortDescription:
        "A 10-minute bedtime routine with video, audio, a handbook, and a BreatheMAX pillow in the bundle.",
      image: {
        src: "/sites/findworthnow/products/breathing-for-sleep.png",
        alt: "Breathing for Sleep program bundle with video, handbook, and pillow",
      },
      affiliateUrl:
        "https://c48a58pjfpqo516wtk4gr9ocbi.hop.clickbank.net/?&traffic_source=tiktok",
      ctaLabel: "Get Breathing for Sleep",
      reviewSlug: "breathing-for-sleep-review",
      reviewTitle: "Breathing for Sleep Review",
      metaTitle: "Breathing for Sleep Review",
      metaDescription:
        "Breathing for Sleep: a 10-minute nightly routine plus a BreatheMAX pillow, listed at $79 plus shipping with a 60-day guarantee.",
      heroDescription:
        "Breathing for Sleep is a short evening routine — video, audio, a handbook — plus a physical BreatheMAX pillow in the current bundle. About 10 minutes before bed. No capsules.",
      sections: [
        {
          heading: "What is Breathing for Sleep?",
          paragraphs: [
            "This is a bedtime program, not a bottle. You get digital coaching plus a BreatheMAX pillow in the current offer.",
            "The files show up on a thank-you page shortly after checkout. The pillow typically ships in 5–7 business days.",
          ],
        },
        {
          heading: "What's included",
          paragraphs: [
            "The current bundle includes:",
          ],
          bullets: [
            "Coaching video",
            "Audio routine",
            "Handbook",
            "BreatheMAX pillow",
            "Three bonuses",
          ],
        },
        {
          heading: "Why it stands out",
          paragraphs: [
            "The pitch is tongue posture and breathing — the idea that how you hold your mouth and how you breathe at night sits under restless sleep, and that a brief nightly drill can change that.",
            "The routine is built to take about 10 minutes before bed, or about 5 minutes if you are short on time. The recommendation is to use it nightly for at least 30 days, which is long enough to actually try it rather than sample it once.",
          ],
        },
        {
          heading: "Who it's for",
          paragraphs: [
            "Worth a look if you would rather do something for a few minutes at night than add another capsule — and you want a pillow in the box, not just a PDF.",
          ],
          bullets: [
            "You like a guided routine more than a supplement",
            "You want video, audio, and something physical to sleep with",
          ],
        },
        {
          heading: "Price and guarantee",
          paragraphs: [
            "The current discounted price is $79 plus $7.99 shipping and handling, with a 60-day money-back guarantee if you contact support.",
            "Use the button below to grab the bundle.",
          ],
        },
        {
          heading: "Good to know",
          paragraphs: [
            "This is a practice plus a pillow, not a medical treatment. If sleep has been a problem for a while, check in with a clinician — then use the routine as a nightly habit, not a diagnosis.",
          ],
        },
      ],
    },
    {
      slug: "unique-lucid-dreaming",
      name: "Unique Lucid Dreaming",
      categorySlug: "sleep",
      typeLabel: "Digital Lucid Dreaming Program",
      shortDescription:
        "A 30-day lucid-dreaming bootcamp with daily videos, lifetime access, and PDF bonuses — $27, nothing ships.",
      image: {
        src: "/sites/findworthnow/products/unique-lucid-dreaming.png",
        alt: "30 Day Lucid Dreaming Bootcamp digital course shown on multiple devices",
      },
      affiliateUrl:
        "https://176080n8eitq5164vghegpn7b8.hop.clickbank.net/?&traffic_source=tiktok",
      ctaLabel: "Get Unique Lucid Dreaming",
      reviewSlug: "unique-lucid-dreaming-review",
      reviewTitle: "Unique Lucid Dreaming Review",
      metaTitle: "Unique Lucid Dreaming Review",
      metaDescription:
        "Unique Lucid Dreaming: a 30-day digital bootcamp with daily videos and lifetime access, listed at $27 with a 60-day refund.",
      heroDescription:
        "Unique Lucid Dreaming is a 30-day digital bootcamp for learning to notice and steer your dreams. Daily videos, lifetime member access, PDF bonuses — nothing ships, and the current price is $27.",
      sections: [
        {
          heading: "What is Unique Lucid Dreaming?",
          paragraphs: [
            "This is the Lucid Dreaming Bootcamp Challenge from HowToLucid. Thirty days of daily videos, lifetime access to a members area, and extra PDF bonuses.",
            "Everything is digital. No book, no gadget, no shipping wait.",
          ],
        },
        {
          heading: "What's included",
          paragraphs: [
            "The current bundle includes:",
          ],
          bullets: [
            "30-day bootcamp with daily videos and lifetime member access",
            "Graphics and reminder pack",
            "Morning-routine guide",
            "Meditation playbook PDF",
            "Additional digital blueprints and an ideas list for lucid dreams",
          ],
        },
        {
          heading: "Why it stands out",
          paragraphs: [
            "It is built as a practice, not a sleep aid. Short daily sessions — about 3–8 minutes — aimed at noticing you are dreaming and influencing what happens next.",
            "The course says many students have a first lucid dream within a few weeks, and it also says results are not typical and will vary. Treat that as a range, not a promise.",
          ],
        },
        {
          heading: "Who it's for",
          paragraphs: [
            "A low-commitment way in if you are curious about lucid dreaming and want a structured 30-day plan instead of a stack of free YouTube videos.",
          ],
          bullets: [
            "You want a course, not a capsule",
            "You like short daily practice more than a long weekend binge",
          ],
        },
        {
          heading: "Price and guarantee",
          paragraphs: [
            "The current promotional price is $27, with a 60-day refund policy. You may keep the course if you request a refund under that guarantee.",
            "The charge may show on a bank statement as CLKBNK or similar. Use the button below to start.",
          ],
        },
        {
          heading: "Good to know",
          paragraphs: [
            "This is a practice course, not a sleep-aid supplement. If nightmares or ongoing sleep trouble are the real issue, sort that out first — then the bootcamp is optional curiosity, not a fix.",
          ],
        },
      ],
    },
    ...additionalOffers,
    ...batchTwoOffers,
  ],
};
