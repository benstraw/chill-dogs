import { calmingProducts, type CalmingProduct } from './calming-products';
import { getRequiredPrimaryOffer } from './products/offers';
import { ROUTES } from './routes';

export type CalmingPageType = 'collector' | 'converter';

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
  pageType: CalmingPageType;
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

export interface UseTableBlock {
  kind: 'use_table';
  heading: string;
  intro: string;
  rows: Array<{ situation: string; bestChoice: string; why: string }>;
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

export type CalmingBlock =
  | ProseBlock
  | ProductSectionBlock
  | DecisionColumnsBlock
  | UseTableBlock
  | NoteBlock
  | QuickPicksBlock;

export interface CalmingConverterPageConfig {
  slug: string;
  title: string;
  description: string;
  pageSlug: string;
  hero: HeroConfig;
  toc?: TocHeading[];
  blocks: CalmingBlock[];
  faq?: { heading: string; items: Array<{ question: string; answer: string }> };
  relatedGuidesHeading?: string;
  relatedGuidesLimit?: number;
  disclaimerVariant?: 'standard' | 'supplement' | 'cbd';
  disclosureShowSafety?: boolean;
  internalLinkStripHeading?: string;
  internalLinkStripLimit?: number;
  itemListSchema?: {
    name: string;
    url: string;
    productIds: string[];
  };
}

function getRequiredProduct(id: string): CalmingProduct {
  const product = calmingProducts.find((item) => item.id === id);
  if (!product) {
    throw new Error(`Missing calming product: ${id}`);
  }
  return product;
}

export function getRequiredProducts(ids: string[]): CalmingProduct[] {
  return ids.map((id) => getRequiredProduct(id));
}

export function buildCalmingItemListSchema(schemaConfig: NonNullable<CalmingConverterPageConfig['itemListSchema']>) {
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
      url: getRequiredPrimaryOffer(p, `${schemaConfig.name}: ${p.id}`).url,
    })),
  };
}

export const calmingConverterPages: Record<string, CalmingConverterPageConfig> = {
  'best-calming-products-for-anxious-dogs': {
    slug: 'best-calming-products-for-anxious-dogs',
    title: 'Best Calming Products for Anxious Dogs',
    description:
      'Compare the best calming products for anxious dogs — ThunderShirt, calming chews, lick mats, and snuffle mats for storms, fireworks, and separation stress.',
    pageSlug: 'best-calming-products-for-anxious-dogs',
    hero: {
      title: 'Best Calming Products for Anxious Dogs',
      subtitle:
        'If your dog gets shaky during thunderstorms, paces due to fireworks, struggles with separation, or melts down during grooming, the right calming tools can help. Some products work by providing gentle pressure, others through nutritional support.  Some dogs benefit from postive distractions, like licking or sniffing.  ',
      disclaimer: 'As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Quick Picks', href: '#quick-picks' },
      secondaryCta: { label: 'ThunderShirt Alternatives', href: ROUTES.calmingAlternatives },
    },
    toc: [
      { label: 'Quick Picks', anchor: 'quick-picks' },
      { label: 'Anxiety Wraps', anchor: 'anxiety-wraps' },
      { label: 'Calming Treats', anchor: 'calming-treats' },
      { label: 'Lick Mats', anchor: 'lick-mats' },
      { label: 'Snuffle Mats', anchor: 'snuffle-mats' },
      { label: 'When To Use Each', anchor: 'when-to-use-each' },
      { label: 'When Anxiety Makes Dogs Bolt', anchor: 'anxiety-bolting' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'quick_picks',
        id: 'quick-picks',
        heading: 'Quick Picks Summary',
        intro:
          'If you want the short version, start here. These are the strongest first-click options depending on whether you want the most proven wearable, the easiest low-cost distraction tool, or help for loud-event anxiety.',
        items: [
          {
            label: 'Best Overall',
            title: 'ThunderShirt Classic Dog Anxiety Jacket',
            description:
              'ThunderShirt is the clearest starting point for dogs who spiral during storms, fireworks, or travel. It is easy to understand, easy to use before a trigger starts, and often the first calming product dog owners try for event-based anxiety.',
            productId: 'thundershirt-classic',
            position: 'quick-picks-1',
          },
          {
            label: 'Best Budget',
            title: 'LUKITO Premium Silicone Licking Mat',
            description:
              'For a lower-cost calming tool, the LUKITO mat gives you immediate use during baths, brushing, and quick stress spikes. The suction cups also make it more practical than a flat mat if you need it to stay put.',
            productId: 'lukito-licking-mat',
            position: 'quick-picks-2',
          },
          {
            label: 'Best for Storms & Fireworks',
            title: 'ThunderShirt Classic Dog Anxiety Jacket',
            description:
              'Loud, predictable events are where a wrap makes the most sense because you can put it on before the stress peaks. It is also easier to use in a dark room or safe space than puzzle-style enrichment tools.',
            productId: 'thundershirt-classic',
            position: 'quick-picks-3',
          },
        ],
      },
      {
        kind: 'product_section',
        id: 'anxiety-wraps',
        heading: 'Anxiety Wraps',
        pageType: 'collector',
        positionOffset: 0,
        columns: 1,
        intro:
          'Pressure wraps are designed to apply light, steady compression around the torso. The idea is similar to swaddling or weighted pressure: some dogs seem to settle when their body feels held and contained. This approach tends to make the most sense for storms, fireworks, travel days, or other situations you can anticipate.',
        copyHtml:
          'A wrap may not be the right fit for every dog. If your dog hates wearing gear, overheats easily, or freezes when anything snug touches their body, a lick mat or calming chew may be more realistic. If you want a deeper breakdown of when a wrap is worth buying, read <a href="/calming/best-thundershirt-alternatives/">our ThunderShirt alternatives guide</a>.',
        productIds: ['thundershirt-classic'],
      },
      {
        kind: 'decision_columns',
        left: {
          heading: 'Why ThunderShirt makes sense',
          items: [
            'Best for predictable triggers like fireworks, storms, or travel.',
            'No food transition or ingredient guesswork.',
            'Often easier to test than building a longer supplement routine.',
          ],
        },
        right: {
          heading: 'When it may not be the best fit',
          items: [
            'Dogs that strongly dislike clothing or fitted gear.',
            'Situations where you need an all-day background calming routine.',
            'Homes where grooming stress or boredom is the bigger issue than noise anxiety.',
          ],
        },
      },
      {
        kind: 'product_section',
        id: 'calming-treats',
        heading: 'Calming Treats',
        pageType: 'collector',
        positionOffset: 1,
        columns: 3,
        intro:
          'Calming chews are usually the easiest mild-to-moderate support option for dog owners who do not want a wearable product. Ingredients commonly used in this category include melatonin, L-theanine, hemp, and valerian root. In plain terms, these are meant to take the edge off before a stressful event rather than instantly stop panic once it starts.',
        copyHtml:
          'The key distinction is positioning. Native Pet is the natural-focus pick, Greenies is the familiar-brand choice, and Pet Honesty is the hemp-forward option for people specifically shopping that angle.',
        productIds: ['native-pet-calm-chews', 'greenies-calming-chews', 'pet-honesty-hemp-calming-chews'],
      },
      {
        kind: 'product_section',
        id: 'lick-mats',
        heading: 'Lick Mats',
        pageType: 'collector',
        positionOffset: 4,
        columns: 2,
        intro:
          'Licking is soothing for a lot of dogs because the repetitive action helps them focus and can encourage a calmer state. That is why lick mats are so often used during bath time, grooming, brushing, and other short stressful tasks where you need a distraction right now.',
        copyHtml:
          'LickiMat is the classic textured option. LUKITO is the more budget-friendly pick with suction cups, which makes it especially practical when you need the mat to stay in one spot on a tub wall, tile floor, or grooming setup.',
        productIds: ['lickimat-classic-soother', 'lukito-licking-mat'],
      },
      {
        kind: 'product_section',
        id: 'snuffle-mats',
        heading: 'Snuffle Mats',
        pageType: 'collector',
        positionOffset: 6,
        columns: 2,
        intro:
          "Snuffle mats tap into a dog's foraging instinct. Instead of asking an anxious dog to simply calm down, they give that dog something useful to do with its nose. That makes them a strong fit for indoor boredom, pre-departure restlessness, and some mild separation-anxiety routines.",
        copyHtml:
          'Rundic has the more colorful, playful interactive design. AWOOF leans more puzzle-like, which makes it the better fit for dogs that need a little more challenge to stay engaged.',
        productIds: ['rundic-snuffle-mat', 'awoof-snuffle-mat'],
      },
      {
        kind: 'use_table',
        id: 'when-to-use-each',
        heading: 'When To Use Each',
        intro:
          'The most useful calming product depends less on hype and more on the moment you are trying to solve. This table is the fast way to match the situation to the tool type.',
        rows: [
          {
            situation: 'Thunderstorms',
            bestChoice: 'Anxiety Wrap',
            why: 'A wrap is easiest to put on before a storm hits and can offer steady pressure through the loudest part.',
          },
          {
            situation: 'Fireworks',
            bestChoice: 'Anxiety Wrap + Calming Treats',
            why: 'Pressure support plus a chew given ahead of time is often the most practical combo for predictable noise events.',
          },
          {
            situation: 'Separation Anxiety',
            bestChoice: 'Snuffle Mats',
            why: 'Nose work gives dogs a job to do and can redirect some restless energy when you leave the house.',
          },
          {
            situation: 'Grooming Stress',
            bestChoice: 'Lick Mats',
            why: 'Licking keeps the dog occupied in the moment, which is why mats are so useful for baths, brushing, and nail trims.',
          },
          {
            situation: 'General Nervous Energy',
            bestChoice: 'Calming Treats',
            why: 'Chews are the easiest mild-support option when your dog is edgy but not in a full panic state.',
          },
        ],
      },
      {
        kind: 'note',
        heading: 'Calming Note',
        text:
          "These products are best thought of as support tools, not cures. If your dog's anxiety is intense, escalating, or causing self-injury, it is worth getting individualized guidance from a qualified veterinarian.",
      },
      {
        kind: 'prose',
        id: 'anxiety-bolting',
        heading: 'When Anxiety Makes Dogs Bolt',
        alt: true,
        paragraphs: [
          'Calming products work on the nervous system — they reduce the spike, shorten the recovery, and make high-stress moments more manageable. But some anxiety triggers move faster than any wrap or chew can. A loud crack of thunder, a sudden firework, an unexpected animal on the trail: some dogs bolt before the cortisol even peaks.',
          'If your dog has a history of running during high-stress events, pairing calming gear with a GPS tracker is the more complete safety setup. A tracker does not prevent the bolt — but it dramatically improves your odds of getting your dog back. <a href="/gear/best-dog-gps-trackers/">Compare GPS trackers for dogs →</a>',
        ],
      },
    ],
    faq: {
      heading: 'Calming Products FAQ',
      items: [
        {
          question: 'Do calming treats work?',
          answer:
            'They can help some dogs, especially for mild to moderate stress, but results vary by dog and by ingredient. They usually work best when matched to a specific situation and combined with a calm routine.',
        },
        {
          question: 'Are calming wraps safe?',
          answer:
            'Usually, yes, if the fit is snug but not restrictive and your dog is supervised at first. A wrap should not rub, overheat your dog, or be left on for long stretches without checking comfort and fit.',
        },
        {
          question: 'Can I combine calming methods?',
          answer:
            'Yes. Many dog owners pair a wrap with a lick mat, or use a calming chew before a predictable trigger like fireworks. The sensible approach is to start simple, watch your dog closely, and avoid piling on too many changes at once.',
        },
        {
          question: 'How long does it take to see results?',
          answer:
            'Lick mats and snuffle mats work immediately because they redirect attention in the moment. Wraps often help as soon as they are on. Calming chews typically need more lead time, so they are better for predictable stress than last-second panic.',
        },
      ],
    },
    relatedGuidesHeading: "Don't Forget the Heat",
    relatedGuidesLimit: 2,
    disclaimerVariant: 'supplement',
    disclosureShowSafety: false,
    internalLinkStripHeading: 'More Calming & Safety Guides',
    internalLinkStripLimit: 6,
    itemListSchema: {
      name: 'Best Calming Products for Anxious Dogs',
      url: 'https://www.chill-dogs.com/calming/best-calming-products-for-anxious-dogs/',
      productIds: [
        'thundershirt-classic',
        'native-pet-calm-chews',
        'greenies-calming-chews',
        'pet-honesty-hemp-calming-chews',
        'lickimat-classic-soother',
        'lukito-licking-mat',
        'rundic-snuffle-mat',
        'awoof-snuffle-mat',
      ],
    },
  },

  'best-thundershirt-alternatives': {
    slug: 'best-thundershirt-alternatives',
    title: 'Best ThunderShirt Alternatives for Dogs',
    description:
      'Compare 6 anxiety wraps side by side — ThunderShirt and 5 alternatives with silent fastening, ear coverage, firmer compression, and budget-friendly options.',
    pageSlug: 'best-thundershirt-alternatives',
    hero: {
      title: 'Best ThunderShirt Alternatives: 5 Anxiety Wraps Compared',
      subtitle:
        'ThunderShirt is the most popular anxiety wrap, but it is not the only option. Some dogs flinch at velcro noise, others need ear or head coverage for noise phobias, some need firmer compression, and some owners just want to spend less. We compared 5 wraps against ThunderShirt so you can find the right fit.',
      disclaimer: 'As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.',
      primaryCta: { label: 'Compare All 6 Wraps', href: '#compare' },
      secondaryCta: { label: 'See All Calming Picks', href: ROUTES.calmingTop },
    },
    blocks: [
      {
        kind: 'prose',
        heading: 'Why look beyond ThunderShirt?',
        paragraphs: [
          'ThunderShirt works well for a lot of dogs, but it has real limitations. The velcro closure is loud enough to startle noise-sensitive dogs mid-storm. The standard fit does not work for every body type, especially barrel-chested or very small breeds. There is no ear or head coverage, which matters for dogs whose noise phobia centers on sound reaching their ears. And the compression level is fixed — some dogs need firmer pressure to feel the effect.',
          'Price is another factor. ThunderShirt is the most recognized brand, and you pay for that. Several wraps on this list deliver comparable or different compression approaches at a lower price point, which makes it easier to try a wrap without a big commitment.',
        ],
      },
      {
        kind: 'product_section',
        id: 'compare',
        heading: '6 Anxiety Wraps Compared',
        pageType: 'converter',
        positionOffset: 0,
        columns: 3,
        alt: true,
        intro:
          'ThunderShirt is listed first as the baseline. The five alternatives each solve a specific gap — noise-free fastening, budget price, ear coverage, a hood for head-hiding dogs, or firmer double compression.',
        productIds: [
          'thundershirt-classic',
          'dajidali-anxiety-vest',
          'harbyel-anxiety-jacket',
          'beautyzoo-reversible-turtleneck',
          'morvigive-hooded-vest',
          'caslfuca-anxiety-vest',
        ],
      },
      {
        kind: 'decision_columns',
        left: {
          heading: 'When to stick with ThunderShirt',
          items: [
            'Your dog tolerates velcro noise without flinching.',
            'The standard fit works well for your dog.',
            'You want the most established, widely reviewed wrap on the market.',
            'You do not need ear, head, or hood coverage.',
            'The simplest one-piece design is what you prefer.',
          ],
        },
        right: {
          heading: 'When to try an alternative wrap',
          items: [
            'Noise-free fastening — DAJIDALI or Harbyel use silent or quiet closures.',
            'Ear and neck coverage for sound-sensitive dogs — BEAUTYZOO turtleneck covers ears.',
            'Hood for dogs who hide during loud events — MORVIGIVE has an adjustable hood.',
            'Firmer compression than ThunderShirt provides — Caslfuca uses double compression with an adjustable belt.',
            'Lower price to test whether your dog responds to wraps at all — Harbyel and BEAUTYZOO are the most budget-friendly.',
          ],
        },
      },
      {
        kind: 'prose',
        heading: 'What to expect from any anxiety wrap',
        alt: true,
        paragraphs: [
          'Anxiety wraps are support tools, not guaranteed fixes. The gentle-pressure concept is popular and many dog owners report positive results, but every dog responds differently. Some settle quickly, some take a few sessions to adjust, and some will never tolerate wearing a garment at all.',
          'Fit is the single biggest factor in whether a wrap helps. A wrap that is too loose provides no compression. One that is too tight causes discomfort and can make anxiety worse. Measure your dog carefully and follow the sizing chart for whichever wrap you choose.',
          'If your dog resists wearable gear entirely, a different calming approach — like calming chews, lick mats, or snuffle mats — may be more realistic. You can explore those options in our <a href="/calming/best-calming-products-for-anxious-dogs/">full calming products comparison</a>.',
        ],
      },
    ],
    faq: {
      heading: 'Anxiety Wrap FAQ',
      items: [
        {
          question: 'Are ThunderShirt alternatives as effective?',
          answer:
            'Effectiveness depends on the individual dog, not the brand. ThunderShirt has the most reviews and recognition, but the core concept — gentle torso compression — is the same across wraps. What matters most is proper fit, how well your dog tolerates wearing gear, and matching the wrap features to specific triggers.',
        },
        {
          question: 'What size anxiety wrap should I get?',
          answer:
            'Measure chest girth at the widest point behind the front legs. Every wrap brand has its own sizing chart, so check the specific product listing rather than guessing from a different brand. When in between sizes, most manufacturers recommend sizing up.',
        },
        {
          question: 'Can dogs wear anxiety wraps all day?',
          answer:
            'Most wraps are designed for situational use during stressful events, not all-day wear. Extended compression can cause skin irritation or overheating. Put the wrap on before a known trigger and remove it once the stressful event passes. Check skin and comfort regularly during use.',
        },
        {
          question: 'Do anxiety wraps help with separation anxiety?',
          answer:
            'Some dog owners report that wraps help with mild separation anxiety, but wraps work best for event-based triggers like storms and fireworks where you can put the wrap on before the stress starts. For separation anxiety, you typically cannot be there to put the wrap on when the anxiety peaks.',
        },
        {
          question: 'Which anxiety wrap is quietest?',
          answer:
            'The DAJIDALI vest uses a self-gripping fabric that is nearly silent. The Harbyel jacket uses a quieter hook-and-loop design. Both are meaningfully quieter than standard velcro closures, which matters for dogs who startle at the ripping sound during storms or other noise events.',
        },
      ],
    },
    disclaimerVariant: 'standard',
    disclosureShowSafety: false,
    internalLinkStripHeading: 'More Calming Guides',
    internalLinkStripLimit: 2,
    itemListSchema: {
      name: 'Best ThunderShirt Alternatives: Anxiety Wraps Compared',
      url: 'https://www.chill-dogs.com/calming/best-thundershirt-alternatives/',
      productIds: [
        'thundershirt-classic',
        'dajidali-anxiety-vest',
        'harbyel-anxiety-jacket',
        'beautyzoo-reversible-turtleneck',
        'morvigive-hooded-vest',
        'caslfuca-anxiety-vest',
      ],
    },
  },

  'best-lick-mats-for-dogs': {
    slug: 'best-lick-mats-for-dogs',
    title: 'Best Lick Mats for Dogs: Calming Enrichment Picks',
    description:
      'Compare the best lick mats for dogs for fireworks night, grooming, crate time, frozen treats, travel, chewers, and slow-feeding alternatives.',
    pageSlug: 'best-lick-mats-for-dogs',
    hero: {
      title: 'Best Lick Mats for Dogs',
      subtitle:
        'Lick mats are great enrichment tools. Spread a dog-safe snack, freeze it if you choose to do so, and give your dog something delicious to focus on during grooming, crate time, quiet indoor breaks, or fireworks-night prep.',
      disclaimer: 'As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.',
      primaryCta: { label: 'See Quick Picks', href: '#quick-picks' },
      secondaryCta: { label: 'Fireworks Calm Room Guide', href: ROUTES.calmingFireworksRoom },
    },
    toc: [
      { label: 'Quick Picks', anchor: 'quick-picks' },
      { label: 'How to Choose', anchor: 'how-to-choose' },
      { label: 'Silicone Mats', anchor: 'starter-silicone-mats' },
      { label: 'Chew-Resistant Mats', anchor: 'chew-resistant-picks' },
      { label: 'Frozen Treat Bowls', anchor: 'frozen-treat-bowls' },
      { label: 'Travel and Holder Options', anchor: 'travel-holder-options' },
      { label: 'Adjacent Alternatives', anchor: 'adjacent-alternatives' },
      { label: 'Best Use Cases', anchor: 'best-use-cases' },
      { label: 'FAQ', anchor: 'faq' },
    ],
    blocks: [
      {
        kind: 'quick_picks',
        id: 'quick-picks',
        heading: 'Quick Picks',
        intro:
          "A flat silicone mat works well with all types of spreads. Stainless steel is a good choice for heavy chewers. Bowl-style designs are better for frozen treats. Snuffle or slow-feeder options are great for indulging a dog's instinct to forage for food.",
        items: [
          {
            label: 'Best Overall',
            title: 'Awoo Paradise Silicone Dog Lick Mat',
            description:
              'The Awoo Paradise is the best all-purpose pick for spreads and frozen treats. It is great if you want one mat for fireworks night, crate time, quiet indoor enrichment and calm everyday breaks.',
            productId: 'awoo-paradise-lick-mat',
            position: 'quick-picks-1',
          },
          {
            label: 'Best for Fireworks Night',
            title: 'Pawnana Slow Feeder Lick Mat',
            description:
              'Pawnana gives you more depth than a flat mat, which makes it perfect for frozen yogurt, pumpkin, wet-food, or a soaked-kibble setup before the noise starts.',
            productId: 'pawnana-slow-feeder-lick-mat',
            position: 'quick-picks-2',
          },
          {
            label: 'Best for Chewers',
            title: 'FEELNEEDY Stainless Steel Lick Mat',
            description:
              'If your dog treats a silicone mat like a chew toy, try the FEELNEEDY. The stainless steel surface is a sturdier choice for dogs that bite or fold flexible mats.',
            productId: 'feelneedy-stainless-lick-mat',
            position: 'quick-picks-3',
          },
          {
            label: 'Best for Frozen Treats',
            title: 'Pawnana Slow Feeder Lick Mat',
            description:
              'The shape is more contained than a flat tray and helps to keep frozen spreads in the bowl. It is great for crate time, calm-room setup, or a longer indoor enrichment session.',
            productId: 'pawnana-slow-feeder-lick-mat',
            position: 'quick-picks-4',
          },
          {
            label: 'Best for Grooming Sessions',
            title: 'LUKITO Premium Silicone Licking Mat',
            description:
              "LUKITO is the practical grooming pick because suction cups help keep the mat in place on smooth tile walls, tubs, or other clean surfaces while you bathe, brush, or trim your dog's nails.",
            productId: 'lukito-licking-mat',
            position: 'quick-picks-5',
          },
          {
            label: 'Best for Travel',
            title: 'BYAZLETQAN Collapsible Portable Lick Mat',
            description:
              'The clamshell design is easier to pack than a full-size open tray. It is a great choice for hikes, road trips, airline travel, and prepared enrichment away from home.',
            productId: 'byazletqan-portable-lick-mat',
            position: 'quick-picks-6',
          },
          {
            label: 'Best Snuffle Mat',
            title: 'Rundic Snuffle Mat for Dogs',
            description:
              'Some dogs would rather search than lick. Rundic is a good choice when you are using dry treats or kibble and want foraging enrichment instead of a sticky spread.',
            productId: 'rundic-snuffle-mat',
            position: 'quick-picks-7',
          },
          {
            label: 'Best Slow-Feeder Bowl',
            title: 'Evenco Slow Feeder Bowl',
            description:
              'If your dog eats too quickly, choose a slow-feeder bowl instead of a lick mat. Evenco is a great choice for pace control and extended distraction.',
            productId: 'evenco-slow-feeder-bowl',
            position: 'quick-picks-8',
          },
        ],
      },
      {
        kind: 'prose',
        id: 'how-to-choose',
        heading: 'How to Choose a Lick Mat',
        paragraphs: [
          'Start with material. Silicone is flexible, so it is easy to spread peanut butter, yogurt, pumpkin, wet food, or soaked kibble on it. Stainless steel is rigid, but it is the better choice for dogs that chew, fold, or damage soft mats.',
          'Then choose the shape. Flat mats are versatile and easy to stack in the freezer. Bowl-style lick mats are better when you want more depth and mess control. Suction mats are great for grooming and baths because they can attach to a smooth wall or tub surface.',
          'Check the care instructions before freezing or dishwashing any mat, and supervise dogs that try to bite the mat instead of licking it. If your dog prefers dry treats and sniffing, a snuffle mat may be more useful.',
        ],
      },
      {
        kind: 'product_section',
        id: 'starter-silicone-mats',
        heading: 'Silicone Lick Mats',
        pageType: 'converter',
        positionOffset: 0,
        columns: 2,
        alt: true,
        intro:
          'Flat silicone mats are a great choice for most dogs. They work with common spreadable foods and can be easily stored in a freezer.',
        copyHtml:
          'Awoo Paradise and Lickimat work well as a lick mat and a slow feeder. LUKITO is a great choice for grooming because the suction cups allow you to attach the mat to a wall.',
        productIds: [
          'awoo-paradise-lick-mat',
          'lickimat-classic-soother',
          'lukito-licking-mat',
        ],
      },
      {
        kind: 'product_section',
        id: 'chew-resistant-picks',
        heading: 'Chew-Resistant and Stainless Steel Mats',
        pageType: 'converter',
        positionOffset: 4,
        columns: 3,
        intro:
          'Stainless steel is a better choice if your dog chews or shreds silicone. They provide a sturdier surface than a flexible mat.',
        copyHtml:
          'FEELNEEDY is the best flat chew-resistant pick. Feedoo is the heavier bowl-style stainless option for wet food and frozen treats. The stainless suction mat is the fixed-position option for crate-side or dogs that push mats around.',
        productIds: [
          'feelneedy-stainless-lick-mat',
          'feedoo-stainless-lick-mat',
          'stainless-suction-lick-mat',
        ],
      },
      {
        kind: 'product_section',
        id: 'frozen-treat-bowls',
        heading: 'Frozen Treat Mats and Bowls',
        pageType: 'converter',
        positionOffset: 7,
        columns: 3,
        alt: true,
        intro:
          'Bowl-style lick mats are useful when you want depth and food containment. They are less portable than a flat mat, but better for frozen yogurt, pumpkin, wet food, or soaked kibble.',
        copyHtml:
          'Pawnana is a strong frozen-treat choice for fireworks night or crate time. QUWOU is a compact lick bowl for smaller servings. West Paw is reversable for slow feeding and licking enrichment.',
        productIds: [
          'pawnana-slow-feeder-lick-mat',
          'quwou-dog-lick-bowl',
          'west-paw-seaflex-feast-mat',
        ],
      },
      {
        kind: 'product_section',
        id: 'travel-holder-options',
        heading: 'Travel and Holder Options',
        pageType: 'converter',
        positionOffset: 10,
        columns: 2,
        intro:
          'Some dogs push mats around, and some owners need a cleaner way to carry prepared enrichment.',
        copyHtml:
          'LickiMat Outdoor Keeper is a holder system for outdoor or more stable use with compatible inserts. BYAZLETQAN is a portable clamshell option for road trips, airline travel, and enrichment away from home.',
        productIds: [
          'lickimat-outdoor-keeper',
          'byazletqan-portable-lick-mat',
        ],
      },
      {
        kind: 'product_section',
        id: 'adjacent-alternatives',
        heading: 'Snuffle Mats and Slow-Feeder Bowls',
        pageType: 'converter',
        positionOffset: 12,
        columns: 2,
        alt: true,
        intro:
          'Lick mats are not your only enrichment option. If your dog prefers sniffing and searching, use a snuffle mat. If your dog eats too quickly, use a slow feeder.',
        copyHtml:
          'Rundic is the snuffle alternative for dry treats and kibble. Evenco is the slow-feeder alternative when meal pace matters more than calming licking.',
        productIds: [
          'rundic-snuffle-mat',
          'evenco-slow-feeder-bowl',
        ],
      },
      {
        kind: 'use_table',
        id: 'best-use-cases',
        heading: 'Best Use Cases',
        intro: '',
        rows: [
          {
            situation: 'Fireworks night',
            bestChoice: 'Pawnana or Awoo Paradise',
            why: 'Prepare the mat before the noise starts. A frozen bowl lasts longer, while a flat silicone mat is easier to keep ready in the freezer.',
          },
          {
            situation: 'Grooming or baths',
            bestChoice: 'LUKITO',
            why: 'Suction cups keep the mat stuck to a smooth tub, tile, or floor.',
          },
          {
            situation: 'Dogs who chew silicone',
            bestChoice: 'FEELNEEDY or Feedoo',
            why: 'Stainless steel is the sturdier alternative for dogs that bite or fold flexible mats.',
          },
          {
            situation: 'Frozen treat enrichment',
            bestChoice: 'Pawnana',
            why: 'The bowl shape has more depth and helps to contain yogurt, pumpkin, wet food, or soaked kibble.',
          },
          {
            situation: 'Travel',
            bestChoice: 'BYAZLETQAN',
            why: 'A portable clamshell is easier to pack and keep clean between stops.',
          },
          {
            situation: 'Dogs who prefer sniffing',
            bestChoice: 'Rundic Snuffle Mat',
            why: 'A snuffle mat uses dry treats or kibble and gives foraging-focused dogs a job that is not based on licking.',
          },
          {
            situation: 'Dogs who eat too quickly',
            bestChoice: 'Evenco Slow Feeder Bowl',
            why: 'A slow feeder bowl is a better option when your main goal is meal pacing rather than licking enrichment.',
          },
        ],
      },
      {
        kind: 'note',
        heading: 'Calming Note',
        text:
          'Lick mats are enrichment tools, not anxiety treatments. They can help occupy some dogs during stressful moments. Severe fear, escape attempts, or self-injury should be discussed with your veterinarian.',
      },
    ],
    faq: {
      heading: 'Lick Mat FAQ',
      items: [
        {
          question: 'Do lick mats actually calm dogs?',
          answer:
            'They can help some dogs settle because licking gives them a repetitive task to focus on. That does not make a lick mat an anxiety treatment, and many dogs will ignore food if they are already panicking.',
        },
        {
          question: 'Are silicone lick mats safe for dogs?',
          answer:
            'Silicone mats can be practical for supervised enrichment, but they are not a good fit for every dog. If your dog bites, folds, or chews the mat, remove it and consider a sturdier stainless steel option.',
        },
        {
          question: 'Are stainless steel lick mats better than silicone?',
          answer:
            'They are better for some chewers and for owners who want a harder, dishwasher-friendly surface. Silicone is usually easier to spread, store, and freeze, so the better choice depends on your dog and how you plan to use it.',
        },
        {
          question: 'Can you freeze a lick mat?',
          answer:
            'Many lick mats are used with frozen spreads, but check the listing and care instructions for the specific product. Flat silicone mats are easiest to stack in the freezer, while bowl-style mats hold deeper frozen portions.',
        },
        {
          question: 'What should I put on a dog lick mat?',
          answer:
            'Common options include plain yogurt, pumpkin, wet dog food, soaked kibble, or dog-safe peanut butter without xylitol. Start with a thin layer so your dog learns to lick instead of trying to bite the mat.',
        },
        {
          question: 'What is the difference between a lick mat and a snuffle mat?',
          answer:
            'A lick mat uses spreadable food and encourages licking. A snuffle mat uses dry treats or kibble hidden in fabric folds and encourages sniffing and foraging.',
        },
      ],
    },
    relatedGuidesHeading: 'Related Calming Guides',
    relatedGuidesLimit: 3,
    disclaimerVariant: 'standard',
    disclosureShowSafety: false,
    internalLinkStripHeading: 'More Calming & Enrichment Guides',
    internalLinkStripLimit: 5,
    itemListSchema: {
      name: 'Best Lick Mats for Dogs',
      url: 'https://www.chill-dogs.com/calming/best-lick-mats-for-dogs/',
      productIds: [
        'awoo-paradise-lick-mat',
        'lickimat-classic-soother',
        'lukito-licking-mat',
        'feelneedy-stainless-lick-mat',
        'feedoo-stainless-lick-mat',
        'stainless-suction-lick-mat',
        'pawnana-slow-feeder-lick-mat',
        'quwou-dog-lick-bowl',
        'west-paw-seaflex-feast-mat',
        'lickimat-outdoor-keeper',
        'byazletqan-portable-lick-mat',
        'rundic-snuffle-mat',
        'evenco-slow-feeder-bowl',
      ],
    },
  },

  'car-anxiety-for-dogs': {
    slug: 'car-anxiety-for-dogs',
    title: 'Best Calming Products for Car Anxiety in Dogs',
    description:
      'Practical calming tools for dogs who struggle with car travel — anxiety wraps, calming chews, and lick mats for road trips and everyday drives.',
    pageSlug: 'car-anxiety-for-dogs',
    hero: {
      title: 'Calming Tools for Car-Anxious Dogs',
      subtitle:
        'Whether your dog whines from the driveway or shakes through the whole trip, these are the practical tools — anxiety wraps, calming chews, and lick mats — that make a real difference for travel stress.',
      disclaimer: 'As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.',
      primaryCta: { label: 'See All Calming Picks', href: ROUTES.calmingTop },
      secondaryCta: { label: 'Full Road Trip Guide', href: ROUTES.roadTrip },
    },
    blocks: [
      {
        kind: 'product_section',
        id: 'anxiety-wraps',
        heading: 'Anxiety Wraps for Travel',
        pageType: 'converter',
        positionOffset: 0,
        columns: 1,
        intro:
          'A wrap is the first tool worth trying for car anxiety because you can put it on before you even start the engine. The gentle pressure helps some dogs settle quickly — no timing guesswork, no waiting for supplements to kick in.',
        productIds: ['thundershirt-classic'],
      },
      {
        kind: 'product_section',
        id: 'calming-chews',
        heading: 'Calming Chews for Travel Stress',
        pageType: 'converter',
        positionOffset: 1,
        columns: 3,
        alt: true,
        intro:
          "Calming chews are best used proactively — give them 30–45 minutes before departure so they have time to work. They're a good complement to a wrap or a lick mat during longer drives.",
        productIds: ['native-pet-calm-chews', 'greenies-calming-chews', 'pet-honesty-hemp-calming-chews'],
      },
      {
        kind: 'product_section',
        id: 'lick-mats',
        heading: 'Lick Mats for In-Car Distraction',
        pageType: 'converter',
        positionOffset: 4,
        columns: 1,
        intro:
          'A lick mat gives a restless dog something to focus on during the drive itself. Spread it with peanut butter or yogurt before you leave — the repetitive licking helps many dogs settle into the ride.',
        productIds: ['lickimat-classic-soother', 'lukito-licking-mat'],
      },
    ],
    faq: {
      heading: 'Car Anxiety FAQ',
      items: [
        {
          question: 'How do I help a dog with car anxiety?',
          answer:
            'Start with predictability: use the same routine before every drive. An anxiety wrap can help before you pull out of the driveway. Calming chews work best when given 30–45 minutes before travel. A lick mat during the drive keeps restless dogs occupied. Combine approaches to find what helps your dog most.',
        },
        {
          question: 'Is it safe to give calming chews on a road trip?',
          answer:
            'Calming chews labeled for dogs are generally considered safe for occasional travel use, but effectiveness varies. Consult your vet before introducing supplements, especially if your dog takes other medications.',
        },
        {
          question: 'What if my dog gets carsick?',
          answer:
            'Motion sickness is different from anxiety, though the two can overlap. Keep the car cool and well-ventilated, limit food before travel, and face your dog forward if possible. If symptoms are severe, talk to your vet about prescription options.',
        },
        {
          question: 'Can I use a lick mat in the car?',
          answer:
            'Yes — spread peanut butter, plain yogurt, or wet food on the mat and let your dog lick during the drive. The repetitive licking action can reduce stress in the moment. The LUKITO mat with suction cups is particularly easy to attach to a car window or smooth surface.',
        },
        {
          question: 'How long before a trip should I give a calming chew?',
          answer:
            'Most manufacturers recommend 30–45 minutes before the stressful event. Check the label for dosing and timing guidance specific to the product you use.',
        },
      ],
    },
    itemListSchema: {
      name: 'Best Calming Products for Car Anxiety in Dogs',
      url: 'https://www.chill-dogs.com/calming/car-anxiety-for-dogs/',
      productIds: [
        'thundershirt-classic',
        'native-pet-calm-chews',
        'greenies-calming-chews',
        'pet-honesty-hemp-calming-chews',
        'lickimat-classic-soother',
        'lukito-licking-mat',
      ],
    },
    disclaimerVariant: 'supplement',
    disclosureShowSafety: false,
    internalLinkStripHeading: 'More Calming Guides',
    internalLinkStripLimit: 4,
  },
};

export function getCalmingConverterPageConfig(slug: string): CalmingConverterPageConfig {
  const config = calmingConverterPages[slug];
  if (!config) {
    throw new Error(`Missing calming converter page config for slug: ${slug}`);
  }

  return config;
}
