import type { EditorialArticle, ProductRoundupArticle } from "@/types/site";

const IMG = "/sites/side-sleeper/articles";
const ROUNDUP = `${IMG}/best-pillow-for-neck-pain-cube-latex-kapok`;
const SCIENCE = `${IMG}/can-the-right-pillow-fix-your-neck-pain`;

const RESEARCH_NOTE = {
  title: "How we do our research",
  content:
    "First we exclude everything coming from influencers and bloggers. Then we sift through hundreds of product reviews on social media and ecommerce pages like Amazon, Ebay, Target and the like — what do the actual customers say? Do their experience match the marketing? Lastly we aggregate the information into honest, unbiased reviews.",
} as const;

export const neckPainCubeLatexKapokArticle: ProductRoundupArticle = {
  kind: "product-roundup",
  title: "Best Pillow for Neck Pain: Pillow Cube vs. Talalay Latex vs. Layla Kapok",
  slug: "best-pillow-for-neck-pain-cube-latex-kapok",
  reviewCategory: "pillow",
  publishedAt: "2026-08-20",
  author: "Side Sleeper Team",
  excerpt:
    "Pillow Cube, Brooklyn Bedding Talalay latex, and Layla Kapok compared for neck pain — specs, owner feedback, and side-sleeper fit.",
  metaDescription:
    "Pillow Cube, Brooklyn Bedding Talalay latex, and Layla Kapok compared for neck pain — specs, owner feedback, and which pick fits dedicated side sleepers.",
  inlineRelatedSlug: "can-the-right-pillow-fix-your-neck-pain",
  relatedSlugs: [
    "best-pillows-for-neck-pain",
    "best-pillows-for-shoulder-pain",
    "best-pillows-for-side-sleepers",
    "best-body-pillow-for-side-sleepers",
  ],
  intro: [
    "A stiff neck usually means one of two things: You slept in a weird position … or your pillow has been quietly failing you for months.",
    "For side sleepers specifically, the gap between your ear and your shoulder needs real, consistent support, not a floppy stack of feathers that flattens out by 2 a.m.",
    "We put three very different approaches to that problem head to head: the cult-favorite (and polarizing) Pillow Cube, Brooklyn Bedding's natural Talalay Latex Pillow, and the adjustable Layla Kapok Pillow. We pulled current pricing from each brand's official site and dug through real owner feedback, including a long, opinionated Reddit thread, to see which one actually holds up for neck pain.",
  ],
  researchNote: RESEARCH_NOTE,
  products: [
    {
      heading:
        "Pillow Cube (Side Cube Original): The Divisive Favorite That Actually Works, If You Stay on Your Side",
      image: {
        src: `${ROUNDUP}/pillow-cube-side-cube.png`,
        alt: "Pillow Cube Side Cube Original memory foam pillow",
      },
      whatItIs:
        "A dense, cube-shaped memory foam pillow purpose-built to fill the 90-degree gap between a side sleeper's head and shoulder, priced at $59.99. Pillow Cube currently offers a 60-night sleep trial.",
      whyItEarnsASpot: [
        "Purpose-built geometry, not a repurposed rectangle. Multiple long-term Reddit owners specifically credit it with resolving chronic neck pain after other pillows failed, including a CPAP user who called it the only pillow that stopped their neck pain after trying buckwheat, Coop, Purple, and a Tempur-Pedic cervical pillow.",
        "Consistent shape retention. One Redditor reported three years of daily use with zero flattening.",
        "Genuinely dialed-in for one job: several reviewers noted it's specifically comfortable because it doesn't try to also work for back sleeping, which keeps side sleepers from unconsciously rolling.",
      ],
      whereItFallsShort: [
        "Actively uncomfortable if you roll onto your back, which multiple reviewers, including happy long-term owners, confirmed. This isn't a flaw so much as a hard tradeoff: it's built for one position only.",
        "Customer service complaints appear repeatedly in owner discussions, including slow response times and shipping/tracking mix-ups on multi-item orders.",
        "Price-per-ounce-of-foam is a common complaint from people who didn't get along with it, since it's a dense block of foam rather than a traditional fluffy pillow.",
      ],
      bestFor:
        "Committed, full-time side sleepers dealing with neck pain who don't shift to their back during the night.",
      skipIf:
        "You're a back sleeper, a combination sleeper who moves around a lot, or you want an easy, hassle-free return experience if it's not a fit.",
      productSlug: "pillow-cube-side-cube",
      productVariant: "Side Cube Original",
    },
    {
      heading:
        "Brooklyn Bedding Talalay Latex Pillow: The Natural, Breathable Middle Ground",
      image: {
        src: `${ROUNDUP}/brooklyn-bedding-talalay-latex-pillow.jpg`,
        alt: "Brooklyn Bedding Talalay Latex Pillow",
      },
      whatItIs:
        "A 100% Talalay latex pillow wrapped in an organic cotton and Tencel cover, available in two loft heights, priced at $172 (currently discounted to $120.40).",
      whyItEarnsASpot: [
        "Naturally breathable latex stays noticeably cooler than dense memory foam, a real advantage for hot sleepers with neck pain who also overheat at night.",
        "Two loft options give some room to customize height, and the brand's own site notes the lower 4\" loft is built for back and stomach sleepers specifically.",
        "Strong verified review base: a 4.4-out-of-5 average across roughly 3,000 reviews, with customers specifically calling out relief for arthritic neck pain.",
        "3-year warranty on defects and USA manufacturing with full quality control.",
      ],
      whereItFallsShort: [
        "Brooklyn Bedding's own review summary notes some customers experienced neck issues after a few weeks, an honest but real inconsistency worth flagging.",
        "Not marketed as side-sleeper-specific the way Pillow Cube is; its stated sweet spot (per the brand) leans toward back and stomach sleepers at the lower loft.",
        "Latex has a firmer, bouncier feel than foam, which some neck pain sufferers find less contouring.",
      ],
      bestFor:
        "Hot sleepers with neck pain who want a natural material and don't sleep exclusively on their side.",
      skipIf:
        "You're specifically a dedicated side sleeper looking for maximum shoulder-gap support.",
      productSlug: "brooklyn-bedding-talalay-latex-pillow",
    },
    {
      heading: "Layla Kapok Pillow: The Adjustable All-Rounder",
      image: {
        src: `${ROUNDUP}/layla-kapok-pillow.png`,
        alt: "Layla Kapok adjustable pillow",
      },
      whatItIs:
        "A shredded memory foam and kapok fiber blend pillow with a removable-fill design for custom loft, priced at $109 for a queen, $129 for a king. Comes with a 30-night trial and 5-year warranty.",
      whyItEarnsASpot: [
        "Fully adjustable fill lets you remove material to dial in the exact loft, a genuine advantage over fixed-height pillows like Pillow Cube.",
        "Independent testers have specifically named it a top pick for side sleepers, noting it needs little to no adjustment to bridge the ear-to-shoulder gap.",
        "Works across sleep positions, unlike Pillow Cube's single-position design, making it a safer bet for combination sleepers.",
        "Hypoallergenic kapok fiber adds a natural, breathable element to the memory foam core.",
      ],
      whereItFallsShort: [
        "Independent testing found it sleeps temperature-neutral rather than actively cooling, so hot sleepers may still want a dedicated cooling pillow.",
        "At $109+ before any sale, it's the priciest option here per pillow when Pillow Cube is bought at full price without a promotion.",
        "30-night trial is shorter than Pillow Cube's 60 nights, leaving less time to be sure it's the right fit.",
      ],
      bestFor:
        "Combination sleepers with neck pain who move between their side and back and want one adjustable pillow that does both reasonably well.",
      skipIf:
        "You're a dedicated side sleeper who wants maximum shoulder-gap support without any adjustment or guesswork.",
      productSlug: "layla-kapok-pillow",
    },
  ],
  closingGuide: {
    title: "The Verdict",
    items: [
      "Committed side sleeper with neck pain: Pillow Cube Side Cube",
      "Hot sleeper who doesn't sleep only on their side: Brooklyn Bedding Talalay Latex Pillow",
      "Combination sleeper who wants adjustable loft: Layla Kapok Pillow",
    ],
    closing:
      "For the specific problem of neck pain for side sleepers, the Pillow Cube comes out on top — not because Reddit is uniformly glowing (it wasn't). Real owners flagged genuine downsides, especially around customer service and its complete incompatibility with back sleeping. But among the three, it's the only one purpose-built and consistently credited by long-term side-sleeper owners with resolving chronic neck pain. The Talalay Latex Pillow is a strong pick if you run hot and don't sleep exclusively on your side, and the Layla Kapok is the safer, more adjustable choice for combination sleepers. If you're a committed side sleeper whose neck pain hasn't budged with a normal pillow, Pillow Cube is the one with the most positive testimonials behind it, as long as you go in accepting the back-sleeping tradeoff upfront.",
  },
  faqs: [
    {
      question: "What's the best pillow loft for side sleepers with neck pain?",
      answer:
        "The right loft depends on your shoulder width and mattress firmness, but generally, side sleepers need enough height to keep the head level with the spine, filling the gap between the ear and the shoulder rather than tilting the neck up or down.",
    },
    {
      question:
        "Can a pillow really fix neck pain, or do I need to see a doctor?",
      answer:
        "A supportive, properly sized pillow can meaningfully reduce neck strain caused by poor alignment during sleep, but persistent or worsening neck pain is worth discussing with a doctor or physical therapist, since a pillow won't resolve pain from an underlying medical cause.",
    },
    {
      question: "Is memory foam or latex better for neck pain?",
      answer:
        "Both can work well. Memory foam tends to contour more deeply around the neck and shoulder, while latex offers a bouncier, more breathable feel. The better choice usually comes down to whether you run hot at night and how much contouring you personally prefer.",
    },
  ],
};

export const neckPainScienceArticle: EditorialArticle = {
  kind: "editorial",
  title:
    "Can the Right Pillow Fix Your Neck Pain? Here's What the Science Says",
  slug: "can-the-right-pillow-fix-your-neck-pain",
  reviewCategory: "science",
  publishedAt: "2026-08-20",
  author: "Side Sleeper Team",
  excerpt:
    "Three studies on pillows and neck pain: latex and adaptable shapes help, one-size-fits-all often fails, and pain relief isn't the same as better sleep.",
  metaDescription:
    "Three studies on pillows and neck pain: latex and adaptable shapes help, one-size-fits-all often fails, and pain relief isn't the same as better sleep.",
  inlineRelatedSlug: "best-pillow-for-neck-pain-cube-latex-kapok",
  relatedSlugs: [
    "best-pillows-for-neck-pain",
    "sleep-quality-7-facts",
    "best-pillows-for-shoulder-pain",
    "best-pillows-for-side-sleepers",
  ],
  intro: [
    "Neck pain affects a huge chunk of the population at some point in their lives, and a surprising amount of research has gone into figuring out whether the thing under your head at night is actually part of the problem.",
    "We dug into three studies spanning nearly three decades, from a classic 1997 clinical trial to a 2021 meta-analysis pooling data from hundreds of participants, to see what actually holds up.",
    'The short answer: Pillows do seem to matter, but not always in the way marketing copy suggests, and the details are more interesting than "buy the most expensive and your pain will vanish."',
  ],
  introImage: {
    src: `${SCIENCE}/intro-emiliano-vittoriosi.jpg`,
    alt: "Person receiving a neck and shoulder massage",
    caption: "Photo by Emiliano Vittoriosi on Unsplash",
    photographerHref: "https://unsplash.com/@emilianovittoriosi",
  },
  ogImage: {
    src: `${SCIENCE}/intro-emiliano-vittoriosi.jpg`,
    alt: "Person receiving a neck and shoulder massage",
  },
  sections: [
    {
      heading: "The Big Picture: What Happens When You Pool the Evidence",
      paragraphs: [
        "The most convincing place to start is a 2021 systematic review and meta-analysis that did the unglamorous but valuable work of gathering up every decent clinical trial on pillows and neck pain it could find. The researchers combed through six major research databases and initially turned up 35 studies. After filtering for quality, they zeroed in on nine well-designed trials covering 555 people with chronic neck pain.",
        "Here's what they found: pillows made from rubber (latex) or featuring spring/coil support systems were genuinely better than other options at reducing neck pain, easing the pain people woke up with in the morning, and lowering overall neck-related disability. The improvements weren't massive, but they were statistically real, and importantly, people also reported being more satisfied with these pillows compared to what they'd been using before. That satisfaction boost was actually the strongest effect in the whole analysis.",
        "Now for the part that might surprise you: despite all that improvement in pain and satisfaction, the type of pillow didn't meaningfully change how well people actually slept, at least not according to standard sleep quality questionnaires. And it didn't produce any dramatic, measurable shift in spinal alignment either.",
        'In other words, a good pillow can make your neck hurt less and make you happier with your sleep setup, without necessarily changing the numbers on a formal sleep quality scale. That\'s a useful distinction: pain relief and "better sleep" aren\'t automatically the same outcome, even though we tend to lump them together.',
      ],
      image: {
        src: `${SCIENCE}/neck-treatment-julius-toltesi.jpg`,
        alt: "Hands applying pressure to a patient's upper back during treatment",
        caption: "Photo by Julius Toltesi on Unsplash",
        photographerHref: "https://unsplash.com/s/photos/julius-toltesi",
      },
      citations: [
        {
          label:
            "The effects of pillow designs on neck pain, waking symptoms, neck disability, sleep quality and spinal alignment in adults: A systematic review and meta-analysis",
          href: "https://www.sciencedirect.com/science/article/abs/pii/S0268003321000838",
        },
      ],
    },
    {
      heading:
        "Why One-Size-Fits-All Pillows Were Probably Never Going to Work",
      paragraphs: [
        "The second study takes a step back from clinical trials and asks a more basic engineering question: what should a pillow's shape actually look like, given how people really sleep? Researchers first watched 40 people sleep and tracked their positions throughout the night. The finding here alone explains a lot about why so many of us wake up uncomfortable: people switch between lying on their back and lying on their side roughly 24 times over the course of a single night. That's not an occasional shift, that's constant movement.",
        "The problem is that a single fixed pillow height can't serve both positions well. When you're lying on your back, you need relatively little height under your head to keep your neck in a neutral line. When you roll onto your side, you suddenly need a lot more height to fill the gap between your ear and your shoulder, otherwise your neck bends downward toward the mattress all night.",
        "The researchers measured people's actual head, neck, and shoulder dimensions and confirmed that the ideal pillow height for back sleeping and the ideal height for side sleeping are simply different numbers for most people.",
        "Their solution was to design a pillow shaped like a shallow \"U\": lower and flatter through the center for when you're on your back, with built-up, higher sides for when you roll onto your shoulder. When they tested this shape-optimized pillow against a standard one with a small group of sleepers, the custom design produced significantly better sleep quality ratings.",
        "It's a small study, so treat the exact numbers with some caution, but the underlying logic is hard to argue with: since your body doesn't stay in one position all night, your pillow probably shouldn't be built for only one position either.",
      ],
      image: {
        src: `${SCIENCE}/masks-aleksandrina-andreeva.jpg`,
        alt: "Two shaggy folk masks with carved wooden faces",
        caption:
          "Some pillows are best avoided. Photo by Aleksandrina Andreeva on Unsplash",
        photographerHref: "https://unsplash.com/@aleksandrina",
      },
      citations: [
        {
          label: "Ergonomic approach for pillow concept design",
          href: "https://www.sciencedirect.com/science/article/abs/pii/S0003687015300338",
        },
      ],
    },
    {
      heading: "The Classic Experiment: Water, Rolls, and What Actually Helped",
      paragraphs: [
        "The oldest of the three papers is also, in some ways, the most rigorous, since it's a genuine randomized controlled trial rather than an observational study.",
        "Back in 1997, researchers at Johns Hopkins recruited 41 people dealing with ongoing neck pain and put them through a five-week crossover experiment. Everyone started on their own regular pillow for a week as a baseline, then spent two weeks on a neck-roll pillow and two weeks on a water-based pillow, in random order, while researchers tracked their pain levels, sleep quality, and disability scores the whole way through.",
        "The water pillow won, and it wasn't close. People reported statistically significant improvements in pain intensity, pain relief, sleep quality, and disability scores compared to both their usual pillow and the roll pillow. Most participants said they actually preferred it over what they'd been sleeping on before the study even started.",
        "The roll pillow, on the other hand, had a rough time. A notable number of participants found it genuinely difficult to sleep on, and the researchers noted it tended to push the neck into an extended, tilted-back position rather than keeping it neutral, which is likely why people struggled with it.",
        "The theory behind why the water pillow performed better is fairly intuitive once you hear it: water shifts and redistributes as you move, so it continuously reshapes itself to match the contour of your head and neck rather than forcing your neck to conform to a fixed shape. It's the same underlying idea as the U-shaped pillow from the second study, just solved with fluid dynamics instead of foam geometry.",
        "One important asterisk: this study was funded by the company that made the water pillow being tested. That doesn't mean the results are wrong — the effect sizes were real and statistically significant — but it's the kind of funding relationship that's worth knowing about before treating the finding as the final word.",
      ],
      image: {
        src: `${SCIENCE}/water-margo-evardson.jpg`,
        alt: "Person in water resting on a floating pillow",
        caption:
          "The water pillows probably didn't look like this. In our defence, water pillows are hard to find. Photo by Margo Evardson on Unsplash",
        photographerHref: "https://unsplash.com/@margoevardson",
      },
      citations: [
        {
          label: "Cervical pain: A comparison of three pillows",
          href: "https://www.sciencedirect.com/science/article/pii/S000399939790263X",
        },
      ],
    },
    {
      heading: "So What Does This Actually Mean for Your Pillow Shopping?",
      paragraphs: [
        "Put these three pieces of research together and a pattern starts to emerge that's less about brand names and more about basic mechanics. The clearest, most consistently supported idea across all three papers is that adaptability matters.",
        "Whether that adaptability comes from a naturally responsive material like latex or water, or from a shape deliberately engineered to handle both back and side sleeping, pillows that can adjust to your changing position throughout the night tend to outperform pillows that force your neck into one static shape.",
        "The rubber and spring pillows in the meta-analysis, the custom-contoured U-shaped design, and the water pillow in the 1997 trial are three very different products, but they share that same underlying trait. Meanwhile, rigid, fixed-shape designs like the neck roll performed worse, sometimes uncomfortably so.",
        "None of this means you need to run out and buy a water pillow specifically — the research here is limited, sample sizes are modest, and pillow science overall is a smaller, less-funded field than you might expect given how universal the problem is. But if you're shopping for something to help with neck pain, the research suggests it's worth prioritizing a pillow that can genuinely respond to your body and your sleep position, rather than one that locks your neck into a single, fixed angle for eight hours a night.",
      ],
    },
  ],
};
