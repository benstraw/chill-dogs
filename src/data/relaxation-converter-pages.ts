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

  'best-puppy-crates': {
    slug: 'best-puppy-crates',
    title: 'Best Puppy Crates for Crate Training',
    description:
      'Compare puppy crates for crate training, including KindTail PAWD, Midwest iCrate, Midwest Life Stages, and Petmate Training Retreat Kennel options.',
    pageSlug: 'best-puppy-crates',
    hero: {
      title: 'Best Puppy Crates',
      subtitle:
        'A first puppy crate needs to do one job well: make housebreaking and quiet-time practice easier without forcing you to buy another crate in a month. For most puppies, that means a wire crate with a divider panel, enough size options, and a door layout that fits the room where training actually happens.',
      disclaimer: 'As an Amazon Associate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Quick Picks', href: '#quick-picks' },
      secondaryCta: { label: 'Crate Training Guide', href: ROUTES.calmingCrateGuide },
    },
    toc: [
      { label: 'Quick Picks', anchor: 'quick-picks' },
      { label: 'Puppy Crate Picks', anchor: 'puppy-crates' },
      { label: 'iCrate vs Life Stages', anchor: 'icrate-vs-life-stages' },
      { label: 'Which Crate Fits Your Puppy', anchor: 'which-crate' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'quick_picks',
        id: 'quick-picks',
        heading: 'Quick Picks',
        intro:
          'Start with the crate that matches your actual constraint: finished home setup, budget, build quality, or room layout. These picks are practical for puppy crate training, but they solve slightly different problems.',
        items: [
          {
            label: 'Top Pick for Puppy Crate Training',
            title: 'KindTail PAWD Collapsible Dog Crate',
            description:
              'The featured pick if you want a cleaner-looking puppy crate that collapses for storage and includes a washable bed.',
            productId: 'kindtail-pawd-collapsible-crate',
            position: 'quick-picks-1',
          },
          {
            label: 'Best Budget First Crate',
            title: 'MidWest iCrate Dog Crate (18-Inch)',
            description:
              'The simple pick for tiny-breed puppies: lighter, usually cheaper, and built around the divider-panel setup that makes puppy housebreaking easier.',
            productId: 'midwest-icrate-puppy',
            position: 'quick-picks-2',
          },
          {
            label: 'Best Sturdier Wire Crate',
            title: 'MidWest Life Stages Dog Crate (22-Inch)',
            description:
              'The one to lean toward if the price gap is small. Life Stages uses heavier-gauge steel than iCrate and feels more solid for active puppies.',
            productId: 'midwest-life-stages-puppy-crate',
            position: 'quick-picks-3',
          },
          {
            label: 'Best Flexible Door Layout',
            title: 'Petmate Training Retreat Kennel',
            description:
              'A useful alternative when side-door access matters. The two-door layout can make daily crate routines easier in tight bedrooms or living rooms.',
            productId: 'petmate-training-retreat-kennel',
            position: 'quick-picks-4',
          },
        ],
      },
      {
        kind: 'product_section',
        id: 'puppy-crates',
        heading: 'Puppy Crate Picks',
        positionOffset: 0,
        columns: 3,
        intro:
          'For crate training, prioritize fit and daily usability over extras. A divider matters because puppies should not start with a crate that is so large they can sleep on one side and potty on the other.',
        productIds: [
          'kindtail-pawd-collapsible-crate',
          'midwest-icrate-puppy',
          'midwest-life-stages-puppy-crate',
          'petmate-training-retreat-kennel',
        ],
      },
      {
        kind: 'prose',
        id: 'icrate-vs-life-stages',
        heading: 'MidWest iCrate vs Life Stages',
        paragraphs: [
          'The iCrate and Life Stages lines look similar because they solve the same core problem: a wire crate with multiple size options and a divider panel. The practical difference is build and handling.',
          'iCrate is the lighter, simpler, usually more budget-friendly option. It is easier to move around and makes sense for standard puppy crate training when your dog is not especially strong or hard on gear.',
          'Life Stages uses heavier-gauge steel and is built to feel sturdier. Some iCrate sizes are also slightly narrower and lower than comparable Life Stages models. If the price gap is small, Life Stages is the one I would lean toward for a stronger or more active puppy.',
        ],
        alt: true,
      },
      {
        kind: 'decision_columns',
        id: 'which-crate',
        left: {
          heading: 'Get iCrate when',
          items: [
            'You want the simpler budget-friendly option.',
            'You plan to move the crate around the house often.',
            'Your puppy is average-strength and you mainly need a divider-based training setup.',
            'Lower crate weight matters more than a sturdier wire frame.',
          ],
        },
        right: {
          heading: 'Get Life Stages when',
          items: [
            'You want the sturdier Midwest option.',
            'Your puppy is strong, active, or likely to push against the crate.',
            'You do not mind extra crate weight.',
            'The price difference is small enough that durability is worth prioritizing.',
          ],
        },
      },
      {
        kind: 'note',
        heading: 'Where Petmate Fits',
        text:
          'The Petmate Training Retreat Kennel is less about beating the Midwest crates on build and more about room fit. If a side door would make the crate easier to use every day, it can be the more practical choice.',
        alt: true,
      },
    ],
    faq: {
      heading: 'Puppy Crate FAQ',
      items: [
        {
          question: 'What type of crate is best for a puppy?',
          answer:
            'For most puppies, a wire crate with a divider panel is the easiest starting point. The divider lets you create a smaller sleeping area during housebreaking, then expand the space as your puppy grows.',
        },
        {
          question: 'Should I get iCrate or Life Stages?',
          answer:
            'Get iCrate if you want the lighter, usually cheaper option for standard puppy crate training. Get Life Stages if you want the sturdier Midwest crate and do not mind extra weight. If the price gap is small, Life Stages is the stronger pick.',
        },
        {
          question: 'Why does a puppy crate need a divider?',
          answer:
            'A divider prevents the crate from being too large at the beginning. Puppies are more likely to keep a correctly sized sleeping area clean, while an oversized crate can let them sleep in one corner and potty in another.',
        },
        {
          question: 'Is a two-door crate worth it?',
          answer:
            'A two-door crate is useful when the crate sits beside furniture, in a bedroom corner, or anywhere a single front door would be inconvenient. If the crate will sit in an open area, one door is usually enough.',
        },
      ],
    },
    relatedGuides: {
      heading: 'More Crate Training Help',
      guides: [
        {
          href: ROUTES.calmingCrateGuide,
          title: 'How to Crate Train Your Dog',
          description:
            'Step-by-step crate training guidance for puppies, anxious dogs, travel, and common mistakes to avoid.',
        },
        {
          href: ROUTES.comfortCalmingBeds,
          title: 'Best Calming Dog Beds',
          description:
            'If your puppy settles better with soft edges and a defined rest area, compare calming beds and bolster beds next.',
        },
      ],
    },
    disclosureShowSafety: false,
    internalLinkStrip: {
      heading: 'More Puppy Comfort Guides',
      links: [
        { label: 'Crate Training Guide', href: ROUTES.calmingCrateGuide },
        { label: 'Calming Dog Beds', href: ROUTES.comfortCalmingBeds },
        { label: 'Comfort & Rest', href: ROUTES.comfortHub },
      ],
    },
    itemListSchema: {
      name: 'Best Puppy Crates',
      url: 'https://www.chill-dogs.com/comforting/best-puppy-crates/',
      productIds: [
        'kindtail-pawd-collapsible-crate',
        'midwest-icrate-puppy',
        'midwest-life-stages-puppy-crate',
        'petmate-training-retreat-kennel',
      ],
    },
  },

  'best-anxiety-dog-crates': {
    slug: 'best-anxiety-dog-crates',
    title: 'Best Dog Crates for Anxiety Management',
    description:
      'Compare dog crates for anxiety management, including wire, enclosed plastic, and heavy-duty options for different dog patterns.',
    pageSlug: 'best-anxiety-dog-crates',
    hero: {
      title: 'Best Dog Crates for Anxiety',
      subtitle:
        'An anxiety crate should match the dog, not the label. Some dogs settle in a familiar wire crate. Some do better with an enclosed kennel that blocks visual stimulation. And some escape artists need a heavy-duty crate only as part of a broader safety plan.',
      disclaimer: 'As an Amazon Associate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Quick Picks', href: '#quick-picks' },
      secondaryCta: { label: 'Crate Training Guide', href: ROUTES.calmingCrateGuide },
    },
    toc: [
      { label: 'Quick Picks', anchor: 'quick-picks' },
      { label: 'Safety First', anchor: 'safety-first' },
      { label: 'Anxiety Crate Picks', anchor: 'anxiety-crates' },
      { label: 'Which Crate Fits the Pattern', anchor: 'which-crate' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'quick_picks',
        id: 'quick-picks',
        heading: 'Quick Picks',
        intro:
          'Use these as management categories, not anxiety cures. The right choice depends on whether your dog is mildly unsettled, overstimulated by visibility, or actively trying to escape.',
        items: [
          {
            label: 'Best Wire Crate for Mild Anxiety',
            title: 'MidWest Life Stages Dog Crate',
            description:
              'A sturdy wire option for dogs who are already crate-trained and need a familiar, ventilated place to settle during mild stress.',
            productId: 'midwest-life-stages-crate',
            position: 'quick-picks-1',
          },
          {
            label: 'Best Enclosed Crate',
            title: 'Petmate Sky Kennel',
            description:
              'The enclosed plastic shell can reduce visual stimulation for dogs who settle better when the world is partly blocked out.',
            productId: 'petmate-sky-kennel',
            position: 'quick-picks-2',
          },
          {
            label: 'Best Heavy-Duty Crate',
            title: 'Impact High Anxiety Dog Crate',
            description:
              'The heavy-duty option for dogs with a real escape history, bent wire crates, or injury risk from standard crate attempts.',
            productId: 'impact-high-anxiety-crate',
            position: 'quick-picks-3',
          },
        ],
      },
      {
        kind: 'prose',
        id: 'safety-first',
        heading: 'Safety First: A Crate Is Not a Separation Anxiety Cure',
        paragraphs: [
          'A crate can be a useful management tool for some anxious dogs, but it is not a treatment for separation anxiety by itself. <a href="https://www.humaneworld.org/resources/separation-anxiety-dogs">Humane World</a> specifically advises creating a safe space instead of defaulting to a crate for separation anxiety because dogs can continue panicking inside confinement and may injure themselves trying to escape.',
          '<a href="https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/separation-anxiety">ASPCA separation-anxiety guidance</a> and <a href="https://www.oregonhumane.org/portland-training/crate-training-your-dog/">Oregon Humane crate-training guidance</a> make the same practical point: watch the dog’s actual pattern. If confinement makes panic worse, use a room, pen, veterinary behavior support, and gradual training rather than trying to solve the problem with a stronger crate.',
          'So this page frames crates as management choices: wire for mild anxiety in dogs who already tolerate crates, enclosed plastic for dogs who need less visual stimulation, and heavy-duty containment only when escape risk makes standard crates unsafe.',
        ],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'anxiety-crates',
        heading: 'Anxiety Crate Picks',
        positionOffset: 0,
        columns: 3,
        intro:
          'These three picks cover different anxiety patterns. Do not size down for containment. Your dog still needs room to stand, turn around, and lie down naturally.',
        productIds: ['midwest-life-stages-crate', 'petmate-sky-kennel', 'impact-high-anxiety-crate'],
      },
      {
        kind: 'decision_columns',
        id: 'which-crate',
        left: {
          heading: 'Use Life Stages or Sky Kennel when',
          items: [
            'Your dog is already crate-trained and does not panic in confinement.',
            'The anxiety is mild, situational, or linked to overstimulation.',
            'Your goal is a predictable rest space, not brute-force containment.',
            'You can monitor the dog’s response and change course if distress escalates.',
          ],
        },
        right: {
          heading: 'Consider Impact only when',
          items: [
            'Your dog has escaped from or damaged standard crates.',
            'Wire bars create tooth, paw, or latch-injury risk for this specific dog.',
            'You are also working on the underlying anxiety with training or professional support.',
            'You need containment as harm reduction, not as the whole behavior plan.',
          ],
        },
      },
      {
        kind: 'note',
        heading: 'When No Crate Is the Better Choice',
        text:
          'If your dog drools, thrashes, screams, urinates, or injures itself when confined, a stronger crate may only make the panic more dangerous. In that case, use a safer room or pen setup and talk with a veterinarian or qualified separation-anxiety trainer.',
        alt: true,
      },
    ],
    faq: {
      heading: 'Anxiety Crate FAQ',
      items: [
        {
          question: 'Can a crate help with dog anxiety?',
          answer:
            'Sometimes, but only for dogs who already feel safe in a crate. For mild anxiety, a familiar crate can reduce pacing and provide predictability. For true separation anxiety or confinement panic, a crate can make distress worse.',
        },
        {
          question: 'What is the best crate for mild anxiety?',
          answer:
            'For mild anxiety in a dog who tolerates wire crates, MidWest Life Stages is the practical pick because it is sturdier than lighter wire crates while still offering airflow, visibility, and a divider panel.',
        },
        {
          question: 'Is an enclosed crate better for anxious dogs?',
          answer:
            'An enclosed plastic crate like the Petmate Sky Kennel can help dogs who settle better with less visual stimulation. It is not automatically better for every anxious dog, especially dogs who panic when confined.',
        },
        {
          question: 'When does a heavy-duty anxiety crate make sense?',
          answer:
            'A heavy-duty crate makes sense when a dog has a real escape history and standard crates create injury risk. It should still be part of a broader plan that addresses the underlying anxiety.',
        },
      ],
    },
    relatedGuides: {
      heading: 'More Anxiety & Crate Training Help',
      guides: [
        {
          href: ROUTES.calmingCrateGuide,
          title: 'How to Crate Train Your Dog',
          description:
            'Crate training basics, puppy setup, anxiety cautions, travel use, and common mistakes to avoid.',
        },
        {
          href: ROUTES.calmingTop,
          title: 'Best Calming Products for Anxious Dogs',
          description:
            'Compare wraps, chews, lick mats, and snuffle mats for dogs who need support beyond crate management.',
        },
      ],
    },
    disclosureShowSafety: true,
    internalLinkStrip: {
      heading: 'More Anxiety Guides',
      links: [
        { label: 'Crate Training Guide', href: ROUTES.calmingCrateGuide },
        { label: 'Puppy Crates', href: ROUTES.comfortPuppyCrates },
        { label: 'Best Calming Products', href: ROUTES.calmingTop },
      ],
    },
    itemListSchema: {
      name: 'Best Dog Crates for Anxiety',
      url: 'https://www.chill-dogs.com/comforting/best-anxiety-dog-crates/',
      productIds: ['midwest-life-stages-crate', 'petmate-sky-kennel', 'impact-high-anxiety-crate'],
    },
  },

  'best-travel-crates-for-road-trips': {
    slug: 'best-travel-crates-for-road-trips',
    title: 'Best Travel Crates for Road Trips',
    description:
      'Compare the best travel crates for road trips, including collapsible dog crates, hard-sided kennels, and soft folding crates for car travel.',
    pageSlug: 'best-travel-crates-for-road-trips',
    hero: {
      title: 'Best Travel Crates for Road Trips',
      subtitle:
        'For road trips, the best dog travel crate depends less on price and more on how your dog actually travels. Some dogs do well in a lightweight folding crate that is easy to pack and set up. Others need a sturdier hard-sided kennel with more structure and fewer opportunities to claw their way out.',
      disclaimer: 'As an Amazon Associate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Quick Picks', href: '#quick-picks' },
      secondaryCta: { label: 'Road Trip Gear', href: ROUTES.roadTrip },
    },
    toc: [
      { label: 'Quick Picks', anchor: 'quick-picks' },
      { label: 'Hard-Sided vs Soft Folding', anchor: 'hard-sided-vs-soft' },
      { label: 'Travel Crate Comparison', anchor: 'travel-crates' },
      { label: 'Which One Should You Buy', anchor: 'which-one' },
      { label: 'Bottom Line', anchor: 'bottom-line' },
    ],
    blocks: [
      {
        kind: 'quick_picks',
        id: 'quick-picks',
        heading: 'Quick Answer: Top Picks',
        intro:
          'If you already know how your dog behaves in a crate, the choice gets simple. Prioritize structure for dogs who push boundaries. Prioritize portability only for calm, crate-trained dogs.',
        items: [
          {
            label: 'Best Overall for Road Trips',
            title: 'PetSafe Happy Ride Collapsible Travel Crate',
            description:
              'The best all-around road trip pick because it is specifically built around travel use, car setup, and collapsible storage.',
            productId: 'petsafe-happy-ride-travel-crate',
            position: 'quick-picks-1',
          },
          {
            label: 'Best Hard-Sided Travel Crate',
            title: 'Petmate Sky Kennel',
            description:
              'The better hard-sided choice when your dog needs more structure, more enclosure, or a sturdier alternative to soft folding travel crates.',
            productId: 'petmate-sky-kennel',
            position: 'quick-picks-2',
          },
          {
            label: 'Best Soft Folding Crate',
            title: 'EliteField 3-Door Folding Soft Dog Crate',
            description:
              'A strong soft-sided option for trained dogs, hotel stays, and temporary setup when the three-door layout is useful.',
            productId: 'elitefield-three-door-soft-crate',
            position: 'quick-picks-3',
          },
          {
            label: 'Best Lightweight Soft Crate',
            title: 'Lesure Soft Collapsible Dog Crate',
            description:
              'The lightweight convenience pick for calm, trained dogs when easy carry, quick setup, and compact storage matter most.',
            productId: 'lesure-soft-collapsible-crate',
            position: 'quick-picks-4',
          },
        ],
      },
      {
        kind: 'prose',
        id: 'hard-sided-vs-soft',
        heading: 'Hard-Sided vs Soft Folding Travel Crates',
        paragraphs: [
          'A dog travel crate for car use is not the same decision as a puppy house-training crate or an airline crate. For road trips, the tradeoff is usually structure versus portability.',
          'Hard-sided dog crates for road trips are usually the better choice for dogs that need more containment, more enclosure, or fewer soft surfaces to scratch and chew. They take up more room and are less convenient to store, but they give you a more structured setup.',
          'A collapsible dog crate for road trips is easier to pack, carry, and set up in hotels or temporary spaces. Soft dog crates for car travel are best for dogs that are already crate trained, calm in confinement, and not likely to chew, claw, or push hard against the walls.',
          '<strong>Important:</strong> Soft folding crates are convenient for road trips, hotel stays, and calm crate-trained dogs, but they are not indestructible. A determined dog can claw, chew, or push out of one much more easily than from a hard-sided crate. Do not use a soft crate for dogs with serious anxiety, destructive behavior, or strong escape tendencies.',
        ],
        alt: true,
      },
      {
        kind: 'product_section',
        id: 'travel-crates',
        heading: 'Product Comparison',
        positionOffset: 0,
        columns: 2,
        intro:
          'These are road-trip crate picks, not general indoor crates or airline-crate rankings. The goal is quick fit: car convenience, realistic containment, and easy setup when you reach the next stop.',
        productIds: [
          'petsafe-happy-ride-travel-crate',
          'petmate-sky-kennel',
          'elitefield-three-door-soft-crate',
          'lesure-soft-collapsible-crate',
        ],
      },
      {
        kind: 'prose',
        heading: 'PetSafe Happy Ride Collapsible Travel Crate',
        paragraphs: [
          'Choose PetSafe Happy Ride if you want the best all-around road trip travel crate. It is framed around car travel rather than indoor crate training, with a collapsible format, mesh visibility, dual side access, storage pockets, and back-seat setup details.',
          'This is the pick for owners who want a travel-specific crate that packs down between trips and feels more purpose-built for long drives than a standard indoor wire crate.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Petmate Sky Kennel',
        paragraphs: [
          'Choose Petmate if your dog needs a harder-sided, more secure setup. The plastic shell is more enclosed than a soft folding crate and gives dogs fewer fabric or mesh surfaces to chew, claw, or push through.',
          'It is the better fit for dogs who need more structure on road trips, but it is less compact than a soft folding travel crate. That is the tradeoff: more structure, less packability.',
        ],
        alt: true,
      },
      {
        kind: 'prose',
        heading: 'EliteField 3-Door Folding Soft Dog Crate',
        paragraphs: [
          'Choose EliteField if you want a soft folding crate for a trained dog and like the three-door setup. Top, front, and side access can make a real difference when the crate moves between a car, hotel room, campsite, or temporary sleeping area.',
          'This is a convenience pick for dogs who already settle calmly in a crate. It is not the right choice for dogs who panic, chew, claw, or test crate walls.',
        ],
      },
      {
        kind: 'prose',
        heading: 'Lesure Soft Collapsible Dog Crate',
        paragraphs: [
          'Choose Lesure if you want the lightest, most portable soft-sided option. Its appeal is fast setup, compact storage, breathable mesh, and easy carry for road trip stops or temporary rooms.',
          'Like any soft-sided folding dog crate for travel, it is best for calm, trained dogs. If containment strength matters more than portability, choose Petmate instead.',
        ],
        alt: true,
      },
      {
        kind: 'decision_columns',
        id: 'which-one',
        left: {
          heading: 'Choose hard-sided when',
          items: [
            'Your dog needs more structure or enclosure during car travel.',
            'Your dog paws at doors, pushes against crate walls, or gets overstimulated by visibility.',
            'You want a more realistic containment setup than fabric and mesh.',
            'Packability matters less than a sturdier travel crate.',
          ],
        },
        right: {
          heading: 'Choose soft folding when',
          items: [
            'Your dog is already crate-trained and calm in confinement.',
            'You need a folding dog crate for travel, hotel stays, or temporary setup.',
            'Lightweight carry and compact storage matter most.',
            'Your dog will not chew, claw, or try hard to escape.',
          ],
        },
      },
      {
        kind: 'note',
        heading: 'Bottom Line',
        text:
          'PetSafe Happy Ride is the best overall road trip pick because it is built around travel use. Petmate is the better hard-sided choice for dogs that need more structure. EliteField and Lesure are strong soft-sided options for calm, crate-trained dogs, with EliteField winning on access and Lesure winning on lightweight portability.',
        alt: true,
      },
    ],
    faq: {
      heading: 'Travel Crate FAQ',
      items: [
        {
          question: 'What is the best travel crate for road trips?',
          answer:
            'PetSafe Happy Ride is the best overall road trip pick because it is designed around travel use and collapses for storage. If your dog needs more structure, choose a hard-sided kennel like Petmate.',
        },
        {
          question: 'Are soft dog crates good for car travel?',
          answer:
            'Soft dog crates can work well for car travel with calm, crate-trained dogs. They are convenient and portable, but they are not escape-proof and should not be used for dogs that panic, chew, or try hard to escape.',
        },
        {
          question: 'Is a travel crate the same as crash-tested vehicle safety gear?',
          answer:
            'No. This page focuses on road trip containment, portability, and temporary travel setup. Road trip convenience is different from crash-tested vehicle safety. If crash protection is the priority, look specifically for products tested for that purpose.',
        },
        {
          question: 'Should I use a hard-sided or soft folding travel crate?',
          answer:
            'Use a hard-sided crate if your dog needs more structure or containment. Use a soft folding crate if your dog is already calm in a crate and you care most about portability, hotel setup, and easy storage.',
        },
      ],
    },
    relatedGuides: {
      heading: 'More Road Trip & Crate Help',
      guides: [
        {
          href: ROUTES.roadTrip,
          title: "Rhys's Road Trip Chill Kit",
          description:
            'A road trip setup that combines cooling, calming, hydration, and rest gear for long drives with dogs.',
        },
        {
          href: ROUTES.calmingCrateGuide,
          title: 'How to Crate Train Your Dog',
          description:
            'Crate training guidance for puppies, anxious dogs, travel, and common crate mistakes.',
        },
      ],
    },
    disclosureShowSafety: false,
    internalLinkStrip: {
      heading: 'More Travel & Crate Guides',
      links: [
        { label: 'Road Trip Gear', href: ROUTES.roadTrip },
        { label: 'Crate Training Guide', href: ROUTES.calmingCrateGuide },
        { label: 'Anxiety Crates', href: ROUTES.comfortAnxietyCrates },
      ],
    },
    itemListSchema: {
      name: 'Best Travel Crates for Road Trips',
      url: 'https://www.chill-dogs.com/comforting/best-travel-crates-for-road-trips/',
      productIds: [
        'petsafe-happy-ride-travel-crate',
        'petmate-sky-kennel',
        'elitefield-three-door-soft-crate',
        'lesure-soft-collapsible-crate',
      ],
    },
  },

  'best-orthopedic-dog-beds': {
    slug: 'best-orthopedic-dog-beds',
    title: 'Best Orthopedic Dog Beds for Large & Older Dogs',
    description:
      'Compare the best orthopedic dog beds for large and older dogs — foam beds, full-surround bolsters, and anti-slip options built for sustained daily use.',
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
