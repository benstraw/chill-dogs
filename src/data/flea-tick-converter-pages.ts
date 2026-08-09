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
          'Natural flea and tick products make the most sense when you are trying to reduce pesticide load, your dog has lighter exposure, and you are willing to do the routine work that makes them more useful: coat checks, ear wipe-downs, bedding and pet-area cleanup, bath support, and fast reassessment when you still see pests.',
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
          'duty-mitt-flea-tick-mitt',
        ],
      },
      {
        kind: 'product_section',
        id: 'shampoo',
        heading: 'Shampoos for Bath-day Support',
        intro:
          'Shampoos are useful for prevention and after flea and tick exposure. They also help make regular coat checks part of the routine.',
        positionOffset: 5,
        columns: 3,
        productIds: [
          'wondercide-shampoo-amazon',
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
        heading: 'Collars and Wearable Tags',
        intro:
          'These products use natural ingredients to provide protection for months at a time.',
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
        heading: 'Daily Chews',
        intro:
          'Daily chews work best as a supplement to your flea and tick routine. These products use natural ingredients that also help boost your dog’s immune system and support a healthy coat and skin.',
        positionOffset: 14,
        columns: 3,
        productIds: [
          'lkdhfjc-flea-tick-chews-200',
          'geynaw-flea-tick-chews',
          'yotango-flea-tick-chews',
          'beloved-pets-flea-tick-chews',
          'dr-woow-flea-tick-chews',
        ],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'grooming-tools',
        heading: 'Combs, Grooming Sets, and Tick-Removal Tools',
        intro:
          'Coat checks are an integral part of any flea and tick prevention routine. Flea combs allow you to catch a problem early, brushes allow you to get through the undercoat and reach skin on a thick coat, and a tick tool helps you remove a tick entirely without leaving any part of it embedded in your dog.',
        positionOffset: 22,
        columns: 3,
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
        ],
        alt: true,
      },
      {
        kind: 'callout',
        id: 'natural-limits',
        heading: 'Where natural products stop making sense',
        tone: 'info',
        paragraphs: [
          'If you still see live fleas after cleaning, your dog is chewing raw spots, or you live in a serious tick-disease region, the practical next step is usually a conventional medication conversation with your vet.',
          `If you want the routine that makes these products worth buying — coat checks, bedding cleanup, and knowing when to escalate — read <a href="${ROUTES.naturalFleaTickPrevention}">the natural flea and tick prevention guide</a> before you shop.`,
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
            'Spray is the best place to start if you want flexibility and understand reapplication. The shampoos are bath-day support rather than prevention, while collars and clip-on tags are leave-on convenience layers. Daily chews are the lightest-evidence option here, so treat them as a supplement, not your main protection.',
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
        'duty-mitt-flea-tick-mitt',
        'wondercide-shampoo-amazon',
        'hartz-natures-shield-shampoo',
        'earth-animal-apothecary-shampoo',
        'lillian-ruff-flea-tick-shampoo',
        'top-performance-natural-shampoo',
        'amdeiur-natural-flea-collar',
        'solpetti-botanical-flea-collar',
        'trihood-flea-tick-tag',
        'routade-flea-tick-pendant',
        'lkdhfjc-flea-tick-chews-200',
        'geynaw-flea-tick-chews',
        'yotango-flea-tick-chews',
        'beloved-pets-flea-tick-chews',
        'dr-woow-flea-tick-chews',
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
      ],
    },
  },
};
