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
  'best-flea-and-tick-medications-for-dogs': {
    slug: 'best-flea-and-tick-medications-for-dogs',
    title: 'Best Flea and Tick Medications for Dogs',
    description:
      'Compare the most common flea and tick medications for dogs — monthly and quarterly oral prescriptions, combo chews, OTC topicals, and Seresto collar trade-offs.',
    ogTitle: 'Best Flea and Tick Medications for Dogs (2026)',
    pageSlug: 'best-flea-and-tick-medications-for-dogs',
    currentHref: ROUTES.fleaTickMedications,
    hero: {
      title: 'Best Flea and Tick Medications for Dogs',
      subtitle:
        'If you already know you need stronger, conventional protection, this is the fast decision page. Compare oral prescriptions, combo chews, OTC topicals, and collars with the real trade-offs around convenience, cat safety, and neurologic risk warnings.',
      disclaimer: 'As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Oral Prescriptions', href: '#oral-rx' },
      secondaryCta: { label: 'Read the Full Flea & Tick Guide', href: ROUTES.fleaTickPillar },
    },
    toc: [
      { label: 'How To Choose', anchor: 'how-to-choose' },
      { label: 'Oral Prescriptions', anchor: 'oral-rx' },
      { label: 'Combo Chews', anchor: 'combo-rx' },
      { label: 'OTC Topicals', anchor: 'otc-topicals' },
      { label: 'Collar Option', anchor: 'otc-collars' },
      { label: 'Safety Notes', anchor: 'safety-notes' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'prose',
        id: 'how-to-choose',
        heading: 'How to choose the right medication category',
        paragraphs: [
          'Oral prescriptions are the easiest fit for owners who want no-mess dosing and strong tick protection. Quarterly Bravecto works best for people who hate monthly reminders. Combo chews make the most sense when you already need heartworm coverage and want one monthly parasite routine instead of two.',
          'OTC topicals still make sense for owners who want to avoid a prescription, but they are more application-sensitive and can be a poor fit for households with cats if permethrin is involved. Collars are the convenience play. They can work well, but they deserve the same careful label reading and reaction monitoring as any other parasite product.',
        ],
      },
      {
        kind: 'product_section',
        id: 'oral-rx',
        heading: 'Oral monthly and quarterly prescriptions',
        intro:
          'These are the highest-conviction picks for owners who want conventional flea and tick control without greasy topicals. All prescription products here require a veterinarian prescription. Chewy pharmacy orders also require prescription upload at checkout.',
        positionOffset: 0,
        columns: 3,
        productIds: ['nexgard-10-24', 'simparica-22-44', 'bravecto-44-88'],
      },
      {
        kind: 'product_section',
        id: 'combo-rx',
        heading: 'Combo chews for flea, tick, and heartworm coverage',
        intro:
          'These are the best fit when you want fewer parasite products to remember each month. They are still prescription medications and still deserve the same seizure-history and adverse-event conversation as the rest of the isoxazoline class.',
        positionOffset: 3,
        columns: 2,
        productIds: ['nexgard-plus-33-66', 'simparica-trio-22-44'],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'otc-topicals',
        heading: 'OTC topicals when you want no prescription',
        intro:
          'These are the main over-the-counter choices for owners who want flea-and-tick coverage without scheduling a vet visit first. The trade-off is more label-reading, more application mess, and in permethrin products a real cat-safety concern.',
        positionOffset: 5,
        columns: 2,
        productIds: ['frontline-plus-45-88', 'k9-advantix-21-55'],
      },
      {
        kind: 'product_section',
        id: 'otc-collars',
        heading: 'Long-duration collar option',
        intro:
          'Seresto appeals to owners who want one product to last most of the season. That convenience is real. So is the need to read the updated safety context and monitor for reactions after applying it.',
        positionOffset: 7,
        columns: 1,
        productIds: ['seresto-large'],
        alt: true,
      },
      {
        kind: 'callout',
        id: 'safety-notes',
        heading: 'Safety notes that matter before you buy',
        tone: 'warning',
        paragraphs: [
          'Isoxazoline products such as NexGard, Bravecto, Simparica, Simparica Trio, and NexGard Plus carry an FDA neurologic adverse-event warning for tremors, ataxia, and seizures. The FDA still says they are safe and effective for most dogs, but seizure history should absolutely be part of the buying decision.',
          'Permethrin products such as K9 Advantix II are a genuine cat-safety issue. If cats groom the treated dog or sleep pressed against it, choose a different category unless your vet says otherwise.',
          'Seresto remains on the market after EPA review, but it is still reasonable to read the current safety history before choosing it for convenience alone.',
        ],
      },
    ],
    faq: {
      heading: 'Flea and Tick Medication FAQ',
      items: [
        {
          question: 'Do I need a prescription for flea and tick prevention?',
          answer:
            'For the oral prescription products and combo chews on this page, yes. Frontline Plus, K9 Advantix II, and Seresto are over the counter. If your dog has seizure history, liver or kidney concerns, or you live in a high tick-disease region, a vet visit is worth it even when OTC options exist.',
        },
        {
          question: 'What is the difference between NexGard and Bravecto?',
          answer:
            'The big practical difference is dosing schedule. NexGard is monthly. Bravecto is roughly every 12 weeks. Both are oral prescription products in the isoxazoline class, so the FDA neurologic warning conversation applies to both.',
        },
        {
          question: 'Can I use dog flea medication if I have cats?',
          answer:
            'You need to be especially careful with permethrin-containing products such as K9 Advantix II. Those are not a casual multi-pet-household choice. If cats live in the home, default to products that do not create that transfer risk unless your veterinarian gives a clear plan.',
        },
      ],
    },
    internalLinkStripHeading: 'More Flea, Tick, and Outdoor Safety Guides',
    internalLinkStripLimit: 6,
    itemListSchema: {
      name: 'Best Flea and Tick Medications for Dogs',
      url: `https://www.chill-dogs.com${ROUTES.fleaTickMedications}`,
      productIds: [
        'nexgard-10-24',
        'simparica-22-44',
        'bravecto-44-88',
        'nexgard-plus-33-66',
        'simparica-trio-22-44',
        'frontline-plus-45-88',
        'k9-advantix-21-55',
        'seresto-large',
      ],
    },
  },
  'best-natural-flea-and-tick-products-for-dogs': {
    slug: 'best-natural-flea-and-tick-products-for-dogs',
    title: 'Best Natural Flea and Tick Products for Dogs',
    description:
      'Compare natural flea and tick products for dogs — sprays, shampoos, collars and tags, daily chews, and ear and home cleanup — with honest notes on real limits.',
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
      { label: 'Sprays & Oils', anchor: 'sprays' },
      { label: 'Shampoos', anchor: 'shampoo' },
      { label: 'Collars & Tags', anchor: 'collar' },
      { label: 'Daily Chews', anchor: 'chews' },
      { label: 'Home & Grooming', anchor: 'home-support' },
      { label: 'Where Natural Stops', anchor: 'natural-limits' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'prose',
        id: 'natural-fit',
        heading: 'What Natural Does Well',
        paragraphs: [
          'Natural flea and tick products make the most sense when you are trying to reduce pesticide load, your dog has lighter exposure, and you are willing to do the routine work that makes them more useful: coat checks, ear wipe-downs, bedding and pet-area cleanup, bath support, and fast reassessment when you still see pests.',
          'Natural products may not be sufficient for heavy infestations, for dogs that spend a lot of time in tall grass or brush, or for regions with high tick-disease rates.',
        ],
      },
      {
        kind: 'product_section',
        id: 'sprays',
        heading: 'Sprays & Oils',
        intro: 'Sprays and oils for pets and household surfaces',
        positionOffset: 0,
        columns: 3,
        productIds: [
          'wondercide-spray-lemongrass-32oz',
          'natures-dome-cedarwood-spray',
          'isabellas-clearly-natural-spray',
          'pure-natural-pet-spray',
        ],
      },
      {
        kind: 'product_section',
        id: 'shampoo',
        heading: 'Shampoos for bath-day support',
        intro:
          'Shampoo is not a prevention strategy by itself. It is a bath-day cleanup tool after exposure or during light flea pressure, and it makes coat checks and bath support easier to sustain.',
        positionOffset: 4,
        columns: 3,
        productIds: [
          'wondercide-shampoo-amazon',
          'skouts-honor-flea-tick-shampoo',
          'hartz-natures-shield-shampoo',
          'earth-animal-apothecary-shampoo',
          'lillian-ruff-flea-tick-shampoo',
          'top-performance-natural-shampoo',
        ],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'collar',
        heading: 'Collars and wearable tags for owners who prefer leave-on options',
        intro:
          'Wearable natural options are about steady prevention layering, not rescue-level control. A full collar is the simplest leave-on layer; a clip-on tag adds the same idea to a collar your dog already wears. Treat either as a convenience layer, not a substitute for evidence-heavy medication in high-exposure situations.',
        positionOffset: 10,
        columns: 2,
        productIds: [
          'amdeiur-natural-flea-collar',
          'solpetti-botanical-flea-collar',
          'trihood-flea-tick-tag',
          'routade-flea-tick-pendant',
        ],
      },
      {
        kind: 'product_section',
        id: 'chews',
        heading: 'Daily chews as a light internal layer',
        intro:
          'Oral natural chews are the weakest-evidence category on this page, so set expectations accordingly. A daily chew can be a light internal layer for owners who already dose easily, but it is a supplement alongside real prevention, not a stand-in for it.',
        positionOffset: 14,
        columns: 3,
        productIds: [
          'lkdhfjc-flea-tick-chews-200',
          'only-natural-pet-barrier-bites',
          'geynaw-flea-tick-chews',
          'yotango-flea-tick-chews',
          'beloved-pets-flea-tick-chews',
          'dr-woow-flea-tick-chews',
        ],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'home-support',
        heading: 'Home and grooming cleanup that supports the routine',
        intro:
          'Flea season is a dog-plus-home problem, so a natural routine leans on cleanup between treatments. These are the support products for that half of the work: gentle ear wipe-downs after outdoor time and a fragrance-free surface cleaner for crates, floors, and pet zones. Neither treats the dog for fleas — they make the cleanup easier to keep up.',
        positionOffset: 20,
        columns: 2,
        productIds: ['wondercide-rescue-ear-drops', 'wondercide-surface-disinfectant'],
      },
      {
        kind: 'callout',
        id: 'natural-limits',
        heading: 'Where natural products stop making sense',
        tone: 'info',
        paragraphs: [
          'If you still see live fleas after cleaning, your dog is chewing raw spots, or you live in a serious tick-disease region, the practical next step is usually a conventional medication conversation with your vet.',
          `If you want the full conventional-vs-natural picture before deciding, go back to <a href="${ROUTES.fleaTickPillar}">the broad flea and tick guide</a>. If you already know you need conventional protection, skip straight to <a href="${ROUTES.fleaTickMedications}">the medications comparison</a>.`,
        ],
      },
    ],
    faq: {
      heading: 'Natural Flea and Tick Product FAQ',
      items: [
        {
          question: 'Do natural flea and tick products really work?',
          answer:
            'They can help, especially as prevention layers and light-load support, but the evidence base is thinner than for conventional medications. The more exposure your dog has and the higher your regional tick risk is, the more that evidence gap matters.',
        },
        {
          question: 'Is Wondercide safe around cats?',
          answer:
            'Some Wondercide products are labeled for cats, but that does not make every scent or every dog product safe for mixed-pet improvisation. Treat cat safety as a label-reading issue, not as a brand-level assumption.',
        },
        {
          question: 'Should I choose a spray, shampoo, collar, tag, or chew?',
          answer:
            'Spray is the best place to start if you want flexibility and understand reapplication. The shampoos, ear drops, and surface cleaner are cleanup support rather than prevention, while collars and clip-on tags are leave-on convenience layers. Daily chews are the lightest-evidence option here, so treat them as a supplement, not your main protection.',
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
        'natures-dome-cedarwood-spray',
        'isabellas-clearly-natural-spray',
        'pure-natural-pet-spray',
        'wondercide-shampoo-amazon',
        'skouts-honor-flea-tick-shampoo',
        'hartz-natures-shield-shampoo',
        'earth-animal-apothecary-shampoo',
        'lillian-ruff-flea-tick-shampoo',
        'top-performance-natural-shampoo',
        'amdeiur-natural-flea-collar',
        'solpetti-botanical-flea-collar',
        'trihood-flea-tick-tag',
        'routade-flea-tick-pendant',
        'lkdhfjc-flea-tick-chews-200',
        'only-natural-pet-barrier-bites',
        'geynaw-flea-tick-chews',
        'yotango-flea-tick-chews',
        'beloved-pets-flea-tick-chews',
        'dr-woow-flea-tick-chews',
        'wondercide-rescue-ear-drops',
        'wondercide-surface-disinfectant',
      ],
    },
  },
  'dog-bath-tools-for-flea-season': {
    slug: 'dog-bath-tools-for-flea-season',
    title: 'Dog Bath Tools for Flea Season',
    description:
      'The most useful bath tools for flea season focus on cleanup and coat care, not miracle claims — especially slip-on tub sprayers and realistic bath-support routines.',
    ogTitle: 'Dog Bath Tools for Flea Season and Cleanup',
    pageSlug: 'dog-bath-tools-for-flea-season',
    currentHref: ROUTES.fleaSeasonBathTools,
    hero: {
      title: 'Dog Bath Tools for Flea Season',
      subtitle:
        'A bath is not a replacement for prevention, but it can absolutely make exposure cleanup and flea-season maintenance more realistic. This page focuses on the tools that reduce friction so the routine actually happens.',
      disclaimer: 'As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Bath Tools', href: '#bath-tools' },
      secondaryCta: { label: 'See Natural Flea Products', href: ROUTES.naturalFleaTickProducts },
    },
    toc: [
      { label: 'What Bath Tools Solve', anchor: 'bath-strategy' },
      { label: 'Bath Tools', anchor: 'bath-tools' },
      { label: 'Baths Are Support', anchor: 'bath-support' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'prose',
        id: 'bath-strategy',
        heading: 'What bath tools actually solve during flea season',
        paragraphs: [
          'Bath tools solve the routine problem. They make rinse-downs easier after grassy walks, muddy hikes, and early-flea-warning moments when you want to inspect the coat thoroughly. They do not replace medication, environmental cleanup, or veterinary escalation when the dog is genuinely infested.',
          'That is why this page stays narrow. It is about making the cleanup step easier to execute, not about pretending a bath gadget solves a flea problem by itself.',
        ],
      },
      {
        kind: 'product_section',
        id: 'bath-tools',
        heading: 'Slip-on tub sprayers that make rinse-downs realistic',
        intro:
          'Rinseroo is the right kind of bath tool recommendation because it solves a real friction point. It helps owners rinse thoroughly in ordinary tubs and showers without pretending to be a medical treatment.',
        positionOffset: 0,
        columns: 2,
        productIds: ['rinseroo-original', 'rinseroo-shark-tank'],
      },
      {
        kind: 'callout',
        id: 'bath-support',
        heading: 'Baths are support, not standalone flea control',
        tone: 'info',
        paragraphs: [
          `If you are bathing because your dog already feels buggy, itchy, or dirty after exposure, pair the setup tool here with a real shampoo plan such as <a href="${ROUTES.naturalFleaTickProducts}">the natural products page</a> and with bedding cleanup at home.`,
          `If you are still seeing live fleas after baths, move up to <a href="${ROUTES.fleaTickMedications}">the medications comparison</a> or back to <a href="${ROUTES.fleaTickPillar}">the full decision guide</a>.`,
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
      ],
    },
    internalLinkStripHeading: 'More Flea, Tick, and Outdoor Safety Guides',
    internalLinkStripLimit: 6,
    itemListSchema: {
      name: 'Dog Bath Tools for Flea Season',
      url: `https://www.chill-dogs.com${ROUTES.fleaSeasonBathTools}`,
      productIds: ['rinseroo-original', 'rinseroo-shark-tank'],
    },
  },
};
