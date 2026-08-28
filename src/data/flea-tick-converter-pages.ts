import { fleaTickProducts, type FleaTickProduct } from './flea-tick-products';
import { getRequiredPrimaryOffer } from './products/offers';
import { ROUTES } from './routes';

export interface FleaTickHeroConfig {
  title: string;
  subtitle: string;
  disclaimer: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface FleaTickTocHeading {
  label: string;
  anchor: string;
}

export interface FleaTickProseBlock {
  kind: 'prose';
  heading: string;
  paragraphs: string[];
  id?: string;
  intro?: string;
  alt?: boolean;
}

export interface FleaTickCalloutBlock {
  kind: 'callout';
  heading: string;
  paragraphs: string[];
  id?: string;
  tone?: 'info' | 'warning';
  /** Opt in to rendering the paragraphs as a bulleted list. */
  bullets?: boolean;
  alt?: boolean;
}

export interface FleaTickProductSectionBlock {
  kind: 'product_section';
  heading: string;
  productIds: string[];
  positionOffset: number;
  columns: 1 | 2 | 3;
  id?: string;
  intro?: string;
  alt?: boolean;
  /**
   * Products shown before the "Show N more" bar; the rest sit behind a
   * `DisclosureBar`. Omit to render the whole section open.
   *
   * House rule: set this to 6 (two full grid rows) once a section would hide at
   * least 3 products. Below that the bar costs the reader more than the scroll
   * it saves, so leave the section open.
   */
  visibleCount?: number;
}

export type FleaTickBlock = FleaTickProseBlock | FleaTickCalloutBlock | FleaTickProductSectionBlock;

export interface FleaTickConverterPageConfig {
  slug: string;
  title: string;
  description: string;
  ogTitle?: string;
  pageSlug: string;
  currentHref: string;
  hero: FleaTickHeroConfig;
  toc?: FleaTickTocHeading[];
  blocks: FleaTickBlock[];
  faq?: { heading: string; items: Array<{ question: string; answer: string }> };
  internalLinkStripHeading?: string;
  internalLinkStripLimit?: number;
  /**
   * Mark `natural-*` category products with the sage plant-based treatment. Only the merged
   * flea/tick converter sets this — the mark is meaningless on a page that is all one kind.
   */
  markNaturalProducts?: boolean;
  itemListSchema?: {
    name: string;
    url: string;
    productIds: string[];
  };
}

function getRequiredProduct(id: string): FleaTickProduct {
  const product = fleaTickProducts.find((entry) => entry.id === id);
  if (!product) {
    throw new Error(`Missing flea/tick product: ${id}`);
  }

  return product;
}

export function getRequiredFleaTickProducts(ids: string[]): FleaTickProduct[] {
  return ids.map((id) => getRequiredProduct(id));
}

export function buildFleaTickItemListSchema(
  schemaConfig: NonNullable<FleaTickConverterPageConfig['itemListSchema']>
) {
  const products = getRequiredFleaTickProducts(schemaConfig.productIds);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: schemaConfig.name,
    url: schemaConfig.url,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      url: getRequiredPrimaryOffer(product, `${schemaConfig.name}: ${product.id}`).url,
    })),
  };
}

export const fleaTickConverterPages: Record<string, FleaTickConverterPageConfig> = {
  'best-natural-flea-and-tick-products-for-dogs': {
    slug: 'best-natural-flea-and-tick-products-for-dogs',
    title: 'Best Natural Flea and Tick Products for Dogs',
    description:
      'Compare natural flea and tick products for dogs — sprays, shampoos, collars and tags, daily chews, and flea combs — with honest notes on what they really do.',
    ogTitle: 'Best Natural Flea and Tick Products for Dogs (2026)',
    pageSlug: 'best-natural-flea-and-tick-products-for-dogs',
    currentHref: ROUTES.naturalFleaTickProducts,
    hero: {
      title: 'Best Natural Flea and Tick Products for Dogs',
      subtitle:
        'These products have less toxicity than conventional flea and tick products, with an emphasis on natural ingredients and plant-based formulas.',
      disclaimer: 'As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Natural Sprays', href: '#sprays' },
      secondaryCta: { label: 'Read the Natural Guide', href: ROUTES.naturalFleaTickPrevention },
    },
    toc: [
      { label: 'What Natural Does Well', anchor: 'natural-fit' },
      { label: 'Sprays, Oils & Wipe-Ons', anchor: 'sprays' },
      { label: 'Shampoos', anchor: 'shampoo' },
      { label: 'Collars & Tags', anchor: 'collar' },
      { label: 'Daily Chews', anchor: 'chews' },
      { label: 'Combs & Tick Tools', anchor: 'grooming-tools' },
      { label: 'Where Natural Stops', anchor: 'natural-limits' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'prose',
        id: 'natural-fit',
        heading: 'What Natural Does Well',
        paragraphs: [
          "Natural flea and tick products make the most sense when you are trying to reduce your dog's exposure to toxic ingredients, your dog has lighter exposure to pests, and you are willing to do the routine work that makes them more useful: coat checks, ear wipe-downs, bedding and pet-area cleanup, and bath support.",
          'Natural products may not be sufficient for heavy infestations, for dogs that spend a lot of time in tall grass or brush, or for regions with high tick-disease rates.',
        ],
      },
      {
        kind: 'product_section',
        id: 'sprays',
        heading: 'Sprays, Oils & Wipe-Ons',
        intro:
          'Sprays and oils for pets and household surfaces, plus a pre-saturated mitt for dogs that will not stand still for a spray bottle.',
        positionOffset: 0,
        columns: 3,
        productIds: [
          'wondercide-spray-lemongrass-32oz',
          'natures-dome-peppermint-spray',
          'isabellas-clearly-natural-spray',
          'pure-natural-pet-spray',
          'ortho-pawz-natural-flea-tick-spray',
          'duty-mitt-flea-tick-mitt',
        ],
      },
      {
        kind: 'product_section',
        id: 'shampoo',
        heading: 'Shampoos for Bath-day Support',
        intro:
          'Shampoos are useful for prevention and after flea and tick exposure. They also help make regular coat checks part of the routine.',
        positionOffset: 6,
        columns: 3,
        productIds: [
          'wondercide-shampoo-amazon',
          'hartz-natures-shield-shampoo',
          'earth-animal-apothecary-shampoo',
          'lillian-ruff-flea-tick-shampoo',
          'top-performance-natural-shampoo',
          'tevrapet-naturals-flea-tick-shampoo',
          'we-love-doodles-flea-tick-shampoo',
        ],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'collar',
        heading: 'Collars and Wearable Tags',
        intro:
          'These products use natural ingredients to provide protection for months at a time.',
        positionOffset: 13,
        columns: 2,
        productIds: [
          'amdeiur-natural-flea-collar',
          'solpetti-botanical-flea-collar',
          'tenerolike-essential-oil-collar-5pack',
          'crobirware-natural-flea-collar-6pack',
          'njkpuyt-flea-collar-small-4pack',
          'trihood-flea-tick-tag',
          'routade-flea-tick-pendant',
        ],
      },
      {
        kind: 'product_section',
        id: 'chews',
        heading: 'Daily Chews',
        intro:
          'Daily chews work best as a supplement to your flea and tick routine. These products use natural ingredients that also help boost your dog’s immune system and support a healthy coat and skin.',
        positionOffset: 20,
        columns: 3,
        productIds: [
          'lkdhfjc-flea-tick-chews-200',
          'geynaw-flea-tick-chews',
          'yotango-flea-tick-chews',
          'beloved-pets-flea-tick-chews',
          'dr-woow-flea-tick-chews',
          'lkdhfjc-natural-defense-chews-200',
          'petrivium-flea-tick-chews-150',
        ],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'grooming-tools',
        heading: 'Combs, Grooming Sets, and Tick-Removal Tools',
        intro:
          'Coat checks are an integral part of any flea and tick prevention routine. Flea combs allow you to catch a problem early, brushes allow you to get through the undercoat and reach skin on a thick coat, and a tick tool helps you remove a tick entirely without leaving any part of it embedded in your dog.',
        positionOffset: 27,
        columns: 3,
        visibleCount: 6,
        productIds: [
          'green-pet-double-sided-flea-comb',
          'ikkab-flea-comb-set',
          'vomroju-flea-lice-comb-set',
          'tweezerman-precision-flea-comb',
          'wahl-flea-finishing-comb',
          'anrundar-grooming-kit',
          'homesake-tick-remover-kit',
          'ahhomatata-tick-twister-set',
          'tweezerman-tick-removal-kit',
          'tweezerman-tick-tweezer',
          'tickcheck-premium-tick-kit',
          'tickcheck-remover-spoon',
          'tick-key-original-7pack',
        ],
        alt: true,
      },
      {
        kind: 'callout',
        id: 'natural-limits',
        heading: 'When Natural Is Not Enough',
        tone: 'info',
        paragraphs: [
          'If you continue to see live fleas on your dog, if your dog is chewing raw spots, or if you live in a region with heavy flea and tick infestation, consult your veterinarian, as pharmaceutical treatments may be necessary.',
        ],
      },
    ],
    faq: {
      heading: 'Natural Flea and Tick Product FAQ',
      items: [
        {
          question: 'Do natural flea and tick products really work?',
          answer:
            'For many dogs, yes, especially if your dog tends to spend a lot of time indoors. For dogs that live outside much of the time, play often in dog runs, or live in a region with high flea and tick infestation, pharmaceutical treatments may be necessary.',
        },
        {
          question: 'Are natural dog flea and tick treatments safe around cats?',
          answer:
            'Some products are labeled for use on dogs and cats, and some are safe to use around cats, but that does not make every scent or every dog product safe for cats. Peppermint essential oil in particular can be toxic to cats. Read product labels carefully if you have cats in your house.',
        },
        {
          question: 'Should I choose a spray, shampoo, collar, tag, or chew?',
          answer:
            'Sprays allow flexibility but require frequent reapplication. Shampoos work to repel fleas and ticks on contact, rather than prevention. Collars and tags provide protection for months at a time. Daily chews are best used as a supplement rather than your main protection.',
        },
      ],
    },
    internalLinkStripHeading: 'More Flea, Tick, and Outdoor Safety Guides',
    internalLinkStripLimit: 6,
    itemListSchema: {
      name: 'Best Natural Flea and Tick Products for Dogs',
      url: `https://www.chill-dogs.com${ROUTES.naturalFleaTickProducts}`,
      productIds: [
        'wondercide-spray-lemongrass-32oz',
        'natures-dome-peppermint-spray',
        'isabellas-clearly-natural-spray',
        'pure-natural-pet-spray',
        'ortho-pawz-natural-flea-tick-spray',
        'duty-mitt-flea-tick-mitt',
        'wondercide-shampoo-amazon',
        'hartz-natures-shield-shampoo',
        'earth-animal-apothecary-shampoo',
        'lillian-ruff-flea-tick-shampoo',
        'top-performance-natural-shampoo',
        'tevrapet-naturals-flea-tick-shampoo',
        'we-love-doodles-flea-tick-shampoo',
        'amdeiur-natural-flea-collar',
        'solpetti-botanical-flea-collar',
        'tenerolike-essential-oil-collar-5pack',
        'crobirware-natural-flea-collar-6pack',
        'njkpuyt-flea-collar-small-4pack',
        'trihood-flea-tick-tag',
        'routade-flea-tick-pendant',
        'lkdhfjc-flea-tick-chews-200',
        'geynaw-flea-tick-chews',
        'yotango-flea-tick-chews',
        'beloved-pets-flea-tick-chews',
        'dr-woow-flea-tick-chews',
        'lkdhfjc-natural-defense-chews-200',
        'petrivium-flea-tick-chews-150',
        'green-pet-double-sided-flea-comb',
        'ikkab-flea-comb-set',
        'vomroju-flea-lice-comb-set',
        'tweezerman-precision-flea-comb',
        'wahl-flea-finishing-comb',
        'anrundar-grooming-kit',
        'homesake-tick-remover-kit',
        'ahhomatata-tick-twister-set',
        'tweezerman-tick-removal-kit',
        'tweezerman-tick-tweezer',
        'tickcheck-premium-tick-kit',
        'tickcheck-remover-spoon',
        'tick-key-original-7pack',
      ],
    },
  },
  'best-flea-and-tick-products-for-dogs': {
    slug: 'best-flea-and-tick-products-for-dogs',
    title: 'Best Flea and Tick Products for Dogs',
    description:
      'Compare no-prescription flea and tick products for dogs — spot-on topicals and long-wear collars — plus the combs and tick tools for whatever gets through.',
    ogTitle: 'Best Flea and Tick Products for Dogs (2026)',
    pageSlug: 'best-flea-and-tick-products-for-dogs',
    currentHref: ROUTES.fleaTickProducts,
    hero: {
      title: 'Best Flea and Tick Products for Dogs',
      subtitle:
        'Topical treatments, long-wear collars and tick-removal tools. Everything here is available without a prescription.'
        + ` For products that use only natural ingredients, see <a href="${ROUTES.naturalFleaTickProducts}">the natural products page</a>.`
        + ' For prescription options, consult your veterinarian.',
      disclaimer: 'As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Topical Treatments', href: '#otc-topicals' },
      secondaryCta: { label: 'Read the Full Flea & Tick Guide', href: ROUTES.fleaTickPillar },
    },
    toc: [
      { label: 'How To Choose', anchor: 'how-to-choose' },
      { label: 'Topical Treatments', anchor: 'otc-topicals' },
      { label: 'Collars', anchor: 'otc-collars' },
      { label: 'Plant-Based Options', anchor: 'natural-options' },
      { label: 'Combs & Tick Tools', anchor: 'grooming-tools' },
      { label: 'Safety Notes', anchor: 'safety-notes' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'prose',
        id: 'how-to-choose',
        heading: 'How to Choose',
        paragraphs: [
          'Topical treatments are applied monthly. They must go on skin rather than fur, and the dog has to stay dry while it sets. Collars provide protection for several months, but they must be worn at all times.',
        ],
      },
      {
        kind: 'product_section',
        id: 'otc-topicals',
        heading: 'Topical Treatments',
        intro: 'Monthly liquid doses applied directly to the skin between the shoulder blades.',
        positionOffset: 0,
        columns: 3,
        productIds: ['vectra-3d-xl-95-plus', 'trioak-topical-medium-23-44'],
      },
      {
        kind: 'product_section',
        id: 'otc-collars',
        heading: 'Flea and Tick Collars',
        intro:
          'Collars provide flea and tick protection for months at a time. They must be worn continuously for full effect.',
        positionOffset: 2,
        columns: 3,
        productIds: ['udyoude-flea-collar-large-2pack', 'cabins-flea-collar-4pack'],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'natural-options',
        heading: 'Plant-Based Sprays and Shampoos',
        intro:
          'These use plant oils rather than the pesticides in the sections above, so they ask more of your routine and suit lighter exposure. This is a short sample — the full range lives on the natural products page.',
        positionOffset: 4,
        columns: 3,
        productIds: [
          'ortho-pawz-natural-flea-tick-spray',
          'tevrapet-naturals-flea-tick-shampoo',
          'we-love-doodles-flea-tick-shampoo',
        ],
      },
      {
        kind: 'product_section',
        id: 'grooming-tools',
        heading: 'Combs, Grooming Sets, and Tick-Removal Tools',
        intro:
          'Coat checks are an integral part of any flea and tick prevention routine. Flea combs allow you to catch a problem early, brushes allow you to get through the undercoat and reach skin on a thick coat, and a tick tool helps you remove a tick entirely without leaving any part of it embedded in your dog.',
        positionOffset: 7,
        columns: 3,
        alt: true,
        visibleCount: 6,
        productIds: [
          'green-pet-double-sided-flea-comb',
          'ikkab-flea-comb-set',
          'vomroju-flea-lice-comb-set',
          'tweezerman-precision-flea-comb',
          'wahl-flea-finishing-comb',
          'anrundar-grooming-kit',
          'homesake-tick-remover-kit',
          'ahhomatata-tick-twister-set',
          'tweezerman-tick-removal-kit',
          'tweezerman-tick-tweezer',
          'tickcheck-premium-tick-kit',
          'tickcheck-remover-spoon',
          'tick-key-original-7pack',
        ],
      },
      {
        kind: 'callout',
        id: 'safety-notes',
        heading: 'Safety Notes',
        tone: 'warning',
        bullets: true,
        paragraphs: [
          'Permethrin is toxic to cats. Do not use products that contain permethrin if you have cats in your home.',
          'Apply topicals to skin, not fur, and keep the dog dry for the window the label specifies. Many complaints that a spot-on "did nothing" trace back to application error rather than the product.',
          'Collars need the same attention as any other pesticide product. Check the skin under the collar for the first week, and take it off if you see redness or hair loss.',
          'If you are still finding live fleas or ticks after a full cycle of any of these products, consult your veterinarian, as your dog may require prescription medication.',
        ],
      },
    ],
    faq: {
      heading: 'Flea and Tick Product FAQ',
      items: [
        {
          question: 'Are over-the-counter flea and tick products as good as prescription ones?',
          answer:
            'For many dogs, yes, particularly with lighter exposure. Prescription orals generally have stronger and faster tick coverage and may be necessary if you live in an area with heavy pest infestation.',
        },
        {
          question: 'Should I use a topical treatment or a collar?',
          answer:
            'Both are effective, so choose based on which routine you will actually maintain. A topical is a monthly task and requires proper application; a collar must be replaced every 6-8 months but stays on the dog continuously. Do not use both at once without asking your vet — that is stacking pesticides, not doubling protection.',
        },
        {
          question: 'Do I still need a flea comb if my dog is using prevention products?',
          answer:
            'Yes. Prevention lowers the odds of infestation, but ticks especially need to be found and removed. Use a comb weekly and after walks in tall grass or brush.',
        },
        {
          question: 'Can I use these products if I have cats?',
          answer:
            'Permethrin is toxic to cats. Products that contain permethrin should not be used in households with cats. Check all labels to ensure that they are safe for use around cats. When in doubt, consult your veterinarian.',
        },
      ],
    },
    internalLinkStripHeading: 'More Flea, Tick, and Outdoor Safety Guides',
    internalLinkStripLimit: 6,
    itemListSchema: {
      name: 'Best Flea and Tick Products for Dogs',
      url: `https://www.chill-dogs.com${ROUTES.fleaTickProducts}`,
      productIds: [
        'vectra-3d-xl-95-plus',
        'trioak-topical-medium-23-44',
        'udyoude-flea-collar-large-2pack',
        'cabins-flea-collar-4pack',
        'ortho-pawz-natural-flea-tick-spray',
        'tevrapet-naturals-flea-tick-shampoo',
        'we-love-doodles-flea-tick-shampoo',
        'green-pet-double-sided-flea-comb',
        'ikkab-flea-comb-set',
        'vomroju-flea-lice-comb-set',
        'tweezerman-precision-flea-comb',
        'wahl-flea-finishing-comb',
        'anrundar-grooming-kit',
        'homesake-tick-remover-kit',
        'ahhomatata-tick-twister-set',
        'tweezerman-tick-removal-kit',
        'tweezerman-tick-tweezer',
        'tickcheck-premium-tick-kit',
        'tickcheck-remover-spoon',
        'tick-key-original-7pack',
      ],
    },
  },
  'dog-bath-tools-for-flea-season': {
    slug: 'dog-bath-tools-for-flea-season',
    title: 'Dog Bath Tools',
    description:
      'Compare dog bath tools that make washing realistic — sprayers, shampoo brushes and scrubbers, multi-tool grooming kits, and drying robes and towels.',
    ogTitle: 'Dog Bath Tools: Sprayers, Brushes, and Drying Gear',
    pageSlug: 'dog-bath-tools-for-flea-season',
    currentHref: ROUTES.fleaSeasonBathTools,
    hero: {
      title: 'Dog Bath Tools',
      subtitle:
        'A bath is not a replacement for flea and tick prevention, but it makes exposure cleanup and coat maintenance far more realistic. These are the tools that reduce friction at each stage — getting water on the dog, working shampoo through the coat, checking the skin, and drying off afterward.',
      disclaimer: 'As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Sprayers and Rinse Setups', href: '#rinse-setups' },
      secondaryCta: { label: 'See Natural Flea Products', href: ROUTES.naturalFleaTickProducts },
    },
    toc: [
      { label: 'What Bath Tools Solve', anchor: 'bath-strategy' },
      { label: 'Sprayers & Rinse Setups', anchor: 'rinse-setups' },
      { label: 'Brushes & Scrubbers', anchor: 'bath-brushes' },
      { label: 'Multi-Tool Kits', anchor: 'bath-kits' },
      { label: 'Drying & Cleanup', anchor: 'drying' },
      { label: 'Baths Are Support', anchor: 'bath-support' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'prose',
        id: 'bath-strategy',
        heading: 'What bath tools actually solve',
        paragraphs: [
          'Bath tools solve the routine problem. They make rinse-downs easier after grassy walks, muddy hikes, and early-flea-warning moments when you want to inspect the coat thoroughly. They do not replace medication, environmental cleanup, or veterinary escalation when the dog is genuinely infested.',
          'Every bath has the same four friction points: getting water where you need it, working shampoo down to the skin, seeing what is actually in the coat, and drying the dog before it shakes off across the house. The sections below are organized around those four steps, so you can buy for whichever one keeps derailing your routine rather than buying a whole shelf of gear.',
        ],
      },
      {
        kind: 'product_section',
        id: 'rinse-setups',
        heading: 'Sprayers and rinse setups',
        intro:
          'The hardest part of most baths is water delivery, not soap. These cover the places dogs actually get washed: an indoor tub or shower, an outdoor tap, a folding station you set up anywhere, and nowhere near plumbing at all.',
        positionOffset: 0,
        columns: 3,
        productIds: [
          'rinseroo-original',
          'g-promise-dog-wash-shower-attachment',
          'fly2sky-portable-pet-shower',
          'wondurdog-outdoor-hose-nozzle',
          'wondurdog-deluxe-indoor-kit',
          'furesh-elevated-folding-tub',
        ],
      },
      {
        kind: 'product_section',
        id: 'bath-brushes',
        heading: 'Bath brushes and shampoo scrubbers',
        intro:
          'A bath brush does two jobs at once: it works shampoo down through the coat to the skin where dirt and dander sit, and it gives you a reason to run your hands over the whole dog. Pick on coat type and on how the brush stays attached to a wet hand.',
        positionOffset: 6,
        columns: 3,
        visibleCount: 6,
        productIds: [
          'we-love-doodles-long-pin-bath-brush',
          'oleamuo-self-cleaning-bath-brush',
          'doggy-style-bamboo-bath-scrubber',
          'troisamis-double-sided-bath-brush',
          'jelly-pet-deshedding-bath-brush',
          'ropo-double-sided-bath-brush',
          'hop-wooden-handle-bath-brush',
          'unmeee-silicone-shampoo-brush',
          'techcare-foaming-bath-brush',
        ],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'bath-kits',
        heading: 'Multi-tool bath and grooming kits',
        intro:
          'Kits make sense when you are starting from nothing, or when the coat work around the bath — dematting, deshedding, a flea comb pass — matters as much as the wash itself. Compare them on which specific tools are included, not on the piece count.',
        positionOffset: 15,
        columns: 3,
        productIds: [
          'sztopfocus-11-piece-grooming-kit',
          'anrundar-grooming-kit',
          'masterpeak-3-in-1-grooming-kit',
          'lyongsment-7-in-1-grooming-set',
          'brooklyn-pet-gear-3-piece-kit',
          'cxtiefanzyl-3-piece-grooming-kit',
        ],
      },
      {
        kind: 'product_section',
        id: 'drying',
        heading: 'Drying and post-bath cleanup',
        intro:
          'Drying is where a controlled bath turns into a wet house. A robe or a proper microfiber towel keeps the water on the dog long enough for you to finish up, and a dryer is what finally gets a dense double coat dry to the skin. The dry-shampoo applicator at the end is for the days a real bath is not going to happen.',
        positionOffset: 21,
        columns: 3,
        productIds: [
          'tuff-pupper-drying-bathrobe',
          'paw-mountain-3-piece-bath-set',
          'chemical-guys-furrocious-towel',
          'dog-gone-smart-shammy-grey',
          'fido-fave-1500w-dryer',
          'flying-pig-one-hv-dryer',
          'pet-life-dry-shampoo-applicator',
        ],
        alt: true,
      },
      {
        kind: 'callout',
        id: 'bath-support',
        heading: 'Baths are support, not standalone flea control',
        tone: 'info',
        paragraphs: [
          `If you are bathing because your dog already feels buggy, itchy, or dirty after exposure, pair the setup tool here with a real shampoo plan such as <a href="${ROUTES.naturalFleaTickProducts}">the natural products page</a> and with bedding cleanup at home.`,
          `If you are still seeing live fleas after baths, move up to <a href="${ROUTES.fleaTickProducts}">the flea and tick products page</a> or back to <a href="${ROUTES.fleaTickPillar}">the full decision guide</a>.`,
        ],
      },
    ],
    faq: {
      heading: 'Dog Bath Tools FAQ',
      items: [
        {
          question: 'Can bathing alone get rid of fleas on a dog?',
          answer:
            'Not reliably when there is a real infestation. Baths can help with cleanup and inspection, but fleas are usually a dog-plus-home problem. That means bedding, rugs, furniture, and sometimes the yard matter too.',
        },
        {
          question: 'When is a bath tool actually worth buying?',
          answer:
            'When the hard part is the setup, not the soap. If your dog is messy after hikes, you struggle to rinse thoroughly in a regular tub, or flea-season baths keep getting skipped because the process is annoying, a rinse tool can make the routine realistic.',
        },
        {
          question: 'Should I buy a bath tool kit or individual tools?',
          answer:
            'A kit is the better first purchase if you are starting from nothing, because it gets a slicker, a rake, and a bath brush into the house for less than buying them separately. If you already own the coat tools and the bath itself is the problem, buy the one thing that fixes it — usually a sprayer or a brush that stays on your hand.',
        },
        {
          question: 'What kind of bath brush works best for a double coat?',
          answer:
            'Look for longer, firmer bristles and a larger head so you can work shampoo down to the skin rather than across the top of the coat. Short rubber-finger brushes are built for smooth coats and tend to skate over a dense undercoat. Whatever you pick, get the mats out with a rake before the dog gets wet — water tightens them.',
        },
      ],
    },
    internalLinkStripHeading: 'More Flea, Tick, and Outdoor Safety Guides',
    internalLinkStripLimit: 6,
    itemListSchema: {
      name: 'Dog Bath Tools',
      url: `https://www.chill-dogs.com${ROUTES.fleaSeasonBathTools}`,
      productIds: [
        'rinseroo-original',
        'g-promise-dog-wash-shower-attachment',
        'fly2sky-portable-pet-shower',
        'wondurdog-outdoor-hose-nozzle',
        'wondurdog-deluxe-indoor-kit',
        'furesh-elevated-folding-tub',
        'we-love-doodles-long-pin-bath-brush',
        'oleamuo-self-cleaning-bath-brush',
        'doggy-style-bamboo-bath-scrubber',
        'troisamis-double-sided-bath-brush',
        'jelly-pet-deshedding-bath-brush',
        'ropo-double-sided-bath-brush',
        'hop-wooden-handle-bath-brush',
        'unmeee-silicone-shampoo-brush',
        'techcare-foaming-bath-brush',
        'sztopfocus-11-piece-grooming-kit',
        'anrundar-grooming-kit',
        'masterpeak-3-in-1-grooming-kit',
        'lyongsment-7-in-1-grooming-set',
        'brooklyn-pet-gear-3-piece-kit',
        'cxtiefanzyl-3-piece-grooming-kit',
        'tuff-pupper-drying-bathrobe',
        'paw-mountain-3-piece-bath-set',
        'chemical-guys-furrocious-towel',
        'dog-gone-smart-shammy-grey',
        'fido-fave-1500w-dryer',
        'flying-pig-one-hv-dryer',
        'pet-life-dry-shampoo-applicator',
      ],
    },
  },
};
