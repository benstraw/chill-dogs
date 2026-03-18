import { relaxationProducts, type RelaxationProduct } from './relaxation-products';
import { ROUTES } from './routes';

export type RelaxationPageType = 'converter';

export interface HeroConfig {
  title: string;
  subtitle: string;
  disclaimer: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface TocHeading {
  label: string;
  anchor: string;
}

export interface QuickPickItem {
  label: string;
  title: string;
  description: string;
  productId: string;
  position: string;
}

export interface ProseBlock {
  kind: 'prose';
  heading: string;
  paragraphs: string[];
  id?: string;
  intro?: string;
  alt?: boolean;
}

export interface ProductSectionBlock {
  kind: 'product_section';
  heading: string;
  productIds: string[];
  positionOffset: number;
  columns: 1 | 2 | 3;
  id?: string;
  intro?: string;
  copyHtml?: string;
  alt?: boolean;
}

export interface DecisionColumnsBlock {
  kind: 'decision_columns';
  left: { heading: string; items: string[] };
  right: { heading: string; items: string[] };
  id?: string;
  alt?: boolean;
}

export interface NoteBlock {
  kind: 'note';
  heading: string;
  text: string;
  alt?: boolean;
}

export interface QuickPicksBlock {
  kind: 'quick_picks';
  heading: string;
  intro: string;
  items: QuickPickItem[];
  id?: string;
  alt?: boolean;
}

export type RelaxationBlock =
  | ProseBlock
  | ProductSectionBlock
  | DecisionColumnsBlock
  | NoteBlock
  | QuickPicksBlock;

export interface RelaxationConverterPageConfig {
  slug: string;
  title: string;
  description: string;
  pageSlug: string;
  hero: HeroConfig;
  toc?: TocHeading[];
  blocks: RelaxationBlock[];
  faq?: { heading: string; items: Array<{ question: string; answer: string }> };
  relatedGuides?: {
    heading: string;
    guides: Array<{ href: string; title: string; description: string }>;
  };
  disclosureShowSafety?: boolean;
  internalLinkStrip?: {
    heading: string;
    links: Array<{ label: string; href: string }>;
  };
  itemListSchema?: {
    name: string;
    url: string;
    productIds: string[];
  };
}

function getRequiredProduct(id: string): RelaxationProduct {
  const product = relaxationProducts.find((p) => p.id === id);
  if (!product) {
    throw new Error(`Missing relaxation product: ${id}`);
  }
  return product;
}

export function getRequiredProducts(ids: string[]): RelaxationProduct[] {
  return ids.map((id) => getRequiredProduct(id));
}

export function buildRelaxationItemListSchema(
  schemaConfig: NonNullable<RelaxationConverterPageConfig['itemListSchema']>
) {
  const products = getRequiredProducts(schemaConfig.productIds);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: schemaConfig.name,
    url: schemaConfig.url,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: p.amazonUrl,
    })),
  };
}

export const relaxationConverterPages: Record<string, RelaxationConverterPageConfig> = {
  'best-calming-dog-beds': {
    slug: 'best-calming-dog-beds',
    title: 'Best Calming Dog Beds — Rest, Recovery, Relaxation',
    description:
      'Compare the best calming dog beds — donut beds, cuddler beds, and bolster beds — for dogs who need extra comfort, security, and a place to fully unwind.',
    pageSlug: 'best-calming-dog-beds',
    hero: {
      title: 'Best Calming Dog Beds',
      subtitle:
        'Some dogs sleep anywhere. Others circle the same spot twelve times before lying down — and still look anxious once they do. The right bed shapes how your dog settles. Raised rims, soft fill, and enclosed shapes give dogs the containment and comfort they look for on their own.',
      disclaimer: 'As an Amazon Associate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Quick Picks', href: '#quick-picks' },
      secondaryCta: { label: 'Orthopedic Beds', href: ROUTES.comfortOrthopedicBeds },
    },
    toc: [
      { label: 'Quick Picks', anchor: 'quick-picks' },
      { label: 'Donut & Cuddler Beds', anchor: 'donut-beds' },
      { label: 'Bolster & Premium Beds', anchor: 'bolster-beds' },
      { label: 'Which Bed Style Fits Your Dog', anchor: 'which-style' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'quick_picks',
        id: 'quick-picks',
        heading: 'Quick Picks',
        intro:
          'Not sure where to start? These are the clearest first picks depending on what your dog needs most — a fully enclosed donut shape, a cuddler with plush warmth, or a bolster with premium construction.',
        items: [
          {
            label: 'Best Donut Bed',
            title: 'BedStill Donut Calming Dog Bed',
            description:
              'The raised rim and round shape give dogs the enclosed, chin-rest position they naturally seek. A practical starting point for dogs who curl tightly or press against walls and furniture when resting.',
            productId: 'bedstill-donut-calming-bed',
            position: 'quick-picks-1',
          },
          {
            label: 'Best Premium Pick',
            title: 'Pendleton Fleece Kuddler Dog Bed',
            description:
              "Pendleton's heritage fleece brings a warmth and texture that keeps dogs settled through full naps. The lower-profile kuddler shape works well for dogs who sprawl out rather than curl.",
            productId: 'pendleton-fleece-kuddler',
            position: 'quick-picks-2',
          },
          {
            label: 'Best for Medium Dogs',
            title: 'ChiXnuggle Dog Bed',
            description:
              'The recessed center and snuggle-focused fill support the natural positions medium dogs choose for deep rest — without the full raised rim of a donut if your dog prefers less height.',
            productId: 'chixnuggle-dog-bed',
            position: 'quick-picks-3',
          },
        ],
      },
      {
        kind: 'product_section',
        id: 'donut-beds',
        heading: 'Donut & Cuddler Beds',
        positionOffset: 0,
        columns: 2,
        intro:
          'Donut and cuddler beds are designed around the positions dogs choose on their own — curling, burrowing, pressing against edges. The raised rim and soft fill create an enclosed environment that many dogs use without being prompted.',
        productIds: [
          'bedstill-donut-calming-bed',
          'chixnuggle-dog-bed',
        ],
      },
      {
        kind: 'product_section',
        id: 'bolster-beds',
        heading: 'Bolster & Premium Beds',
        positionOffset: 4,
        columns: 2,
        alt: true,
        intro:
          'Bolster beds pair a supportive foam or fiber base with raised edges for head-resting. These tend to suit dogs who lie flat but like something to lean against, and owners who want a bed that holds up visually and physically.',
        productIds: ['pendleton-fleece-kuddler', 'carolina-pet-bolster-sm'],
      },
      {
        kind: 'decision_columns',
        id: 'which-style',
        left: {
          heading: 'Donut or cuddler bed makes sense when',
          items: [
            'Your dog curls tightly or presses into corners when resting.',
            'You want an enclosed shape that helps dogs settle on their own.',
            'Your dog circles before lying down and tends to rest against walls.',
            'You want a single-piece bed without separate bolster components.',
          ],
        },
        right: {
          heading: 'Bolster or premium bed makes sense when',
          items: [
            'Your dog lies flat or sprawls and wants something to lean a head against.',
            'You want a bed that holds its shape longer as the dog uses it daily.',
            'The bed will be in a visible area and you want it to look good.',
            'Your dog leans against furniture edges more than it curls into tight spaces.',
          ],
        },
      },
    ],
    faq: {
      heading: 'Calming Dog Bed FAQ',
      items: [
        {
          question: 'What makes a dog bed calming?',
          answer:
            'Shape and fill matter more than marketing language. Raised rims give dogs a surface to rest their chin and feel supported from all sides. Soft, consistent fill helps dogs settle without shifting. Enclosed shapes — donuts, cuddlers, bolsters — match the positions dogs already choose on their own when they feel comfortable.',
        },
        {
          question: 'What size calming bed should I get?',
          answer:
            'Measure your dog from nose to base of tail when fully stretched out. For donut beds, add a few inches so the dog can curl comfortably inside the rim. For bolster beds, the main sleeping area should be long enough for your dog to lie flat. When in doubt, size up — most dogs can use a slightly larger bed without issue.',
        },
        {
          question: 'How do I get my dog to actually use the new bed?',
          answer:
            'Place the bed where your dog already rests. Dogs tend to favor spots they have already claimed. If your dog ignores it, add something familiar — a worn shirt, their usual blanket. Avoid moving the bed frequently once a dog starts using it consistently.',
        },
        {
          question: 'How often should I wash a dog bed?',
          answer:
            'A good baseline is every two to four weeks for a regularly used bed, or sooner if your dog gets muddy or wet. All beds listed here have machine washable covers. Check the care label before washing inserts or foam components — some are surface-washable only.',
        },
        {
          question: 'Do calming beds actually work?',
          answer:
            'The shape and fill can genuinely affect where and how dogs settle — many dogs naturally choose enclosed, supported spots when left to pick their own resting place. That said, a bed is one piece. Dogs with persistent restlessness or anxiety may benefit from other approaches alongside a better sleeping setup.',
        },
      ],
    },
    relatedGuides: {
      heading: 'More Rest & Recovery',
      guides: [
        {
          href: ROUTES.comfortOrthopedicBeds,
          title: 'Best Orthopedic Dog Beds',
          description:
            'For older dogs, large breeds, or heavy resters, orthopedic foam and full-surround bolsters make a real difference in sustained daily comfort.',
        },
        {
          href: ROUTES.calmingTop,
          title: 'Best Calming Products for Anxious Dogs',
          description:
            'If sleep trouble is anxiety-driven, compare anxiety wraps, calming chews, and lick mats that work before and during stressful events.',
        },
      ],
    },
    disclosureShowSafety: false,
    internalLinkStrip: {
      heading: 'More Relaxation Guides',
      links: [
        { label: 'Orthopedic Dog Beds', href: ROUTES.comfortOrthopedicBeds },
        { label: 'Best Calming Products', href: ROUTES.calmingTop },
        { label: 'Calming Hub', href: ROUTES.calmingHub },
      ],
    },
    itemListSchema: {
      name: 'Best Calming Dog Beds',
      url: 'https://www.chill-dogs.com/comforting/best-calming-dog-beds/',
      productIds: [
        'bedstill-donut-calming-bed',
        'chixnuggle-dog-bed',
        'pendleton-fleece-kuddler',
        'carolina-pet-bolster-sm',
      ],
    },
  },

  'best-orthopedic-dog-beds': {
    slug: 'best-orthopedic-dog-beds',
    title: 'Best Orthopedic Dog Beds — Joint Support for Rest and Recovery',
    description:
      'Compare the best orthopedic dog beds for large dogs, older dogs, and heavy resters — foam beds, full-surround bolsters, and anti-slip options built for sustained daily use.',
    pageSlug: 'best-orthopedic-dog-beds',
    hero: {
      title: 'Best Orthopedic Dog Beds',
      subtitle:
        'Older dogs, larger breeds, and heavy daily resters need more than a padded surface. Orthopedic beds use denser foam to distribute body weight more evenly — reducing pressure on joints over the hours dogs spend resting each day. The right bed does that without sliding across the floor or collapsing after a few weeks.',
      disclaimer: 'As an Amazon Associate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Quick Picks', href: '#quick-picks' },
      secondaryCta: { label: 'Calming Beds', href: ROUTES.comfortCalmingBeds },
    },
    toc: [
      { label: 'Quick Picks', anchor: 'quick-picks' },
      { label: 'Orthopedic Support Beds', anchor: 'support-beds' },
      { label: 'Orthopedic Bolster Beds', anchor: 'bolster-beds' },
      { label: 'Which Bed Fits Your Dog', anchor: 'which-bed' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'quick_picks',
        id: 'quick-picks',
        heading: 'Quick Picks',
        intro:
          'Three clear starting points depending on what your dog needs most — full-body bolster support, straightforward flat orthopedic foam, or extra surface area for larger breeds.',
        items: [
          {
            label: 'Best Full-Surround',
            title: 'CWAWZ Orthopedic Dog Bed with Full-Surround Bolsters',
            description:
              'Raised edges on all four sides mean your dog always has something to lean against regardless of how it positions itself. The dual-sided design adds practical longevity.',
            productId: 'cwawz-orthopedic-bolster',
            position: 'quick-picks-1',
          },
          {
            label: 'Best Value Flat Bed',
            title: 'INVENHO Washable Orthopedic Dog Bed',
            description:
              'Orthopedic foam base, fully washable, anti-slip bottom. Straightforward construction that covers the basics at a practical price point for dogs who need daily support.',
            productId: 'invenho-orthopedic-bed',
            position: 'quick-picks-2',
          },
          {
            label: 'Best for Large Dogs',
            title: 'ZOMISIA Orthopedic Dog Bed for Large Dogs',
            description:
              'Large-format foam that gives bigger dogs room to stretch fully without losing support at the edges — sized for breeds where most standard beds just are not long enough.',
            productId: 'zomisia-orthopedic-bed',
            position: 'quick-picks-3',
          },
        ],
      },
      {
        kind: 'product_section',
        id: 'support-beds',
        heading: 'Orthopedic Support Beds',
        positionOffset: 0,
        columns: 3,
        intro:
          'These beds prioritize the foam base. The focus is consistent support across the full sleeping surface — particularly useful for heavier dogs or dogs who spend long stretches resting in the same spot.',
        productIds: ['invenho-orthopedic-bed', 'invenho-orthopedic-couch-bed', 'zomisia-orthopedic-bed', 'anti-anxiety-orthopedic-bed', 'bedsure-comfyfleece-orthopedic'],
      },
      {
        kind: 'product_section',
        id: 'bolster-beds',
        heading: 'Orthopedic Bolster Beds',
        positionOffset: 3,
        columns: 2,
        alt: true,
        intro:
          'Bolster beds add raised edges to an orthopedic base — useful for dogs who need joint support and like having something to lean against. These suit dogs who shift between flat resting and head-on-edge positions.',
        productIds: ['cwawz-orthopedic-bolster', 'carolina-pet-bolster-lg'],
      },
      {
        kind: 'decision_columns',
        id: 'which-bed',
        left: {
          heading: 'Flat orthopedic bed makes sense when',
          items: [
            'Your dog stretches out fully to sleep rather than curling.',
            'You want maximum surface area for less money.',
            'The bed will go inside a crate or against a wall where bolsters would be in the way.',
            'Your dog tends to step onto the bed from one specific side.',
          ],
        },
        right: {
          heading: 'Bolster orthopedic bed makes sense when',
          items: [
            'Your dog regularly repositions to lean its head against a surface.',
            'You want one bed that supports both flat resting and chin-on-edge positions.',
            'Your dog tends to feel more settled with a defined perimeter around it.',
            'You want the joint support of foam plus the enclosed feel of a bolster.',
          ],
        },
      },
    ],
    faq: {
      heading: 'Orthopedic Dog Bed FAQ',
      items: [
        {
          question: 'Do orthopedic dog beds actually help dogs?',
          answer:
            'Dense foam can reduce pressure buildup on joints during the hours dogs spend sleeping — which, for most adult dogs, is 12 to 14 hours per day. That can matter most for older dogs, heavier breeds, and dogs recovering from activity. The difference is less noticeable in younger, lighter dogs who do not rest as heavily.',
        },
        {
          question: 'What is the difference between orthopedic and regular dog beds?',
          answer:
            'Standard dog beds typically use polyester fiber fill, which compresses over time and provides less consistent support. Orthopedic beds use denser foam — similar to memory foam — that distributes weight more evenly across the sleeping surface and holds its shape longer with regular use.',
        },
        {
          question: 'How do I pick the right size orthopedic bed?',
          answer:
            'Measure your dog from nose to base of tail when fully stretched. The sleeping surface of the bed should match or slightly exceed that length. For bolster beds, measure the inner sleeping area, not the full bed dimension including the bolster edge.',
        },
        {
          question: 'How long do orthopedic dog beds last?',
          answer:
            'A well-constructed orthopedic bed typically holds its support for one to three years with regular use, depending on your dog\'s weight and how much time it spends resting there. Dual-sided beds extend useful life by giving you a fresh surface when one side compresses.',
        },
        {
          question: 'Can I wash an orthopedic dog bed?',
          answer:
            'All beds listed here have machine washable covers. Foam inserts are typically spot-cleaned or surface-washed — avoid machine washing foam as it can damage the structure. Check the product care label before washing any component you are unsure about.',
        },
      ],
    },
    relatedGuides: {
      heading: 'More Rest & Recovery',
      guides: [
        {
          href: ROUTES.comfortCalmingBeds,
          title: 'Best Calming Dog Beds',
          description:
            'Donut beds, cuddler beds, and bolster beds for dogs who need extra comfort and security — not just a supportive surface.',
        },
        {
          href: ROUTES.calmingTop,
          title: 'Best Calming Products for Anxious Dogs',
          description:
            'Compare anxiety wraps, calming chews, lick mats, and snuffle mats for dogs who need support beyond a better sleeping setup.',
        },
      ],
    },
    disclosureShowSafety: false,
    internalLinkStrip: {
      heading: 'More Relaxation Guides',
      links: [
        { label: 'Calming Dog Beds', href: ROUTES.comfortCalmingBeds },
        { label: 'Best Calming Products', href: ROUTES.calmingTop },
        { label: 'Calming Hub', href: ROUTES.calmingHub },
      ],
    },
    itemListSchema: {
      name: 'Best Orthopedic Dog Beds',
      url: 'https://www.chill-dogs.com/comforting/best-orthopedic-dog-beds/',
      productIds: [
        'invenho-orthopedic-bed',
        'invenho-orthopedic-couch-bed',
        'zomisia-orthopedic-bed',
        'anti-anxiety-orthopedic-bed',
        'bedsure-comfyfleece-orthopedic',
        'cwawz-orthopedic-bolster',
        'carolina-pet-bolster-lg',
      ],
    },
  },
};

export function getRelaxationConverterPageConfig(slug: string): RelaxationConverterPageConfig {
  const config = relaxationConverterPages[slug];
  if (!config) {
    throw new Error(`Missing relaxation converter page config for slug: ${slug}`);
  }
  return config;
}
