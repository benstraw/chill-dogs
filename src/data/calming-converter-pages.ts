import { calmingProducts, type CalmingProduct } from './calming-products';
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
  relatedGuides?: {
    heading: string;
    guides: Array<{ href: string; title: string; description: string }>;
  };
  disclaimerVariant?: 'standard' | 'supplement' | 'cbd';
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
      url: p.amazonUrl,
    })),
  };
}

export const calmingConverterPages: Record<string, CalmingConverterPageConfig> = {
  'best-calming-products-for-anxious-dogs': {
    slug: 'best-calming-products-for-anxious-dogs',
    title: 'Best Calming Products for Anxious Dogs',
    description:
      'Compare the best calming products for anxious dogs, including ThunderShirt, calming chews, lick mats, and snuffle mats for storms, fireworks, grooming, and separation stress.',
    pageSlug: 'best-calming-products-for-anxious-dogs',
    hero: {
      title: 'Best Calming Products for Anxious Dogs',
      subtitle:
        'If your dog gets shaky during storms, paces before fireworks, struggles with separation, or melts down during grooming, the right calming tool can make those moments more manageable. Some products work through gentle pressure, some through nutritional support, some through licking, and some by giving anxious dogs a job for their nose.',
      disclaimer: 'As an Amazon Associate, we earn from qualifying purchases.',
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
    relatedGuides: {
      heading: "Don't Forget the Heat",
      guides: [
        {
          href: ROUTES.roadTrip,
          title: "Rhys's Road Trip Chill Kit",
          description:
            'Taking your dog on a long drive? See how to combine cooling and calming gear — window shades, fans, mats, wraps, and chews — for a cross-country road trip.',
        },
        {
          href: ROUTES.coolingTop,
          title: 'Best Cooling Products for Dogs',
          description:
            'Anxious dogs often overheat faster. If summer heat is part of the problem, our cooling guide covers mats, vests, bandanas, and freezable toys.',
        },
      ],
    },
    disclaimerVariant: 'supplement',
    disclosureShowSafety: false,
    internalLinkStrip: {
      heading: 'More Calming Guides',
      links: [
        { label: 'Back to Calming Hub', href: ROUTES.calmingHub },
        { label: 'ThunderShirt Alternatives', href: ROUTES.calmingAlternatives },
      ],
    },
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
    title: 'Best ThunderShirt Alternatives for Dogs (Anxiety Wraps Compared)',
    description:
      'Compare 6 anxiety wraps for dogs side by side — ThunderShirt and 5 alternatives with silent fastening, ear coverage, hoods, firmer compression, and budget-friendly options.',
    pageSlug: 'best-thundershirt-alternatives',
    hero: {
      title: 'Best ThunderShirt Alternatives: 5 Anxiety Wraps Compared',
      subtitle:
        'ThunderShirt is the most popular anxiety wrap, but it is not the only option. Some dogs flinch at velcro noise, others need ear or head coverage for noise phobias, some need firmer compression, and some owners just want to spend less. We compared 5 wraps against ThunderShirt so you can find the right fit.',
      disclaimer: 'As an Amazon Associate, we earn from qualifying purchases.',
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
    internalLinkStrip: {
      heading: 'More Calming Guides',
      links: [
        { label: 'Calming Hub', href: ROUTES.calmingHub },
        { label: 'Best Calming Products for Anxious Dogs', href: ROUTES.calmingTop },
      ],
    },
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
      disclaimer: 'As an Amazon Associate, we earn from qualifying purchases.',
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
    internalLinkStrip: {
      heading: 'More Calming Guides',
      links: [
        { label: 'Back to Calming Hub', href: ROUTES.calmingHub },
        { label: 'All Calming Products', href: ROUTES.calmingTop },
        { label: 'ThunderShirt Alternatives', href: ROUTES.calmingAlternatives },
        { label: 'Road Trip Chill Kit', href: ROUTES.roadTrip },
      ],
    },
  },
};

export function getCalmingConverterPageConfig(slug: string): CalmingConverterPageConfig {
  const config = calmingConverterPages[slug];
  if (!config) {
    throw new Error(`Missing calming converter page config for slug: ${slug}`);
  }

  return config;
}
