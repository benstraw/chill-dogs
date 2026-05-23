import type { SitemapPage, SitemapSection, SitemapTopic } from './content-sitemap';
import { ROUTES } from './routes';

export interface CollectorCard {
  href: string;
  title: string;
  description: string;
  linkLabel: string;
  dataToPage: string;
  dataCategory?: string;
}

export interface CollectorSection {
  heading: string;
  intro?: string;
  cards: CollectorCard[];
}

export interface CollectorBodyConfig {
  fromPage: string;
  accent: 'primary' | 'sage' | 'terracotta';
  start?: {
    href: string;
    title: string;
    description: string;
    dataToPage: string;
  };
  sections: CollectorSection[];
  showCalmingDisclaimer?: boolean;
  disclosureShowSafety?: boolean;
}

export type SectionCollectorKey = 'cooling' | 'calming' | 'comfort';

export interface SectionCollectorDefinition {
  key: SectionCollectorKey;
  href: string;
  fromPage: string;
  accent: CollectorBodyConfig['accent'];
  navAccent?: string;
  title: string;
  ogTitle: string;
  schemaName: string;
  description: string;
  hero: {
    theme: 'cooling' | 'calming' | 'comfort';
    headline: string;
    subhead: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
  };
  topics: SitemapTopic[];
  startHref?: string;
  startDescription?: string;
  converterPriority?: string[];
  articlePriority?: string[];
  converterSection: {
    heading: string;
    intro?: string;
  };
  articleSection: {
    heading: string;
    intro?: string;
  };
  showCalmingDisclaimer?: boolean;
  disclosureShowSafety?: boolean;
}

export interface SectionCollectorPageData {
  definition: SectionCollectorDefinition;
  body: CollectorBodyConfig;
  schema: Record<string, unknown>;
  inventoryPages: SitemapPage[];
  converters: SitemapPage[];
  articles: SitemapPage[];
}

const SITE_ORIGIN = 'https://www.chill-dogs.com';
const ARTICLE_SECTION_TITLE = 'Articles (from collection)';

export const sectionCollectorDefinitions: Record<SectionCollectorKey, SectionCollectorDefinition> = {
  cooling: {
    key: 'cooling',
    href: ROUTES.coolingHub,
    fromPage: 'cooling-collector',
    accent: 'primary',
    title: 'Cooling Relief',
    ogTitle: 'Cooling Products for Dogs | Mats, Vests & Bandanas',
    schemaName: 'Cooling Relief for Dogs',
    description:
      'Beat the heat with our curated cooling picks for dogs — from cooling mats and vests to frozen treats and shade solutions.',
    hero: {
      theme: 'cooling',
      headline: 'Beat the Heat in Minutes',
      subhead: 'Cooling and hydration products that work',
      primaryCta: { label: 'See top cooling picks', href: ROUTES.coolingTop },
      secondaryCta: { label: 'How we choose products', href: `${ROUTES.about}#how-we-choose` },
    },
    topics: ['cooling', 'heat-safety', 'car-cooling', 'cooling-mats', 'cooling-wearables', 'frozen-toys', 'hydration'],
    startHref: ROUTES.coolingTop,
    startDescription:
      'Our complete guide covering mats, bandanas, vests, and toys — with quick picks, comparisons, and heat safety tips.',
    converterPriority: [
      ROUTES.coolingTop,
      ROUTES.coolingCar,
      ROUTES.coolingMats,
      ROUTES.coolingBandanas,
      ROUTES.coolingVests,
      ROUTES.coolingToys,
      ROUTES.coolingHydration,
    ],
    articlePriority: [
      ROUTES.coolingCarGuide,
      ROUTES.coolingSafety,
      ROUTES.roadTrip,
    ],
    converterSection: {
      heading: 'Cooling Product Comparisons',
      intro: 'Product paths for hot weather, warm cars, summer walks, frozen enrichment, and travel hydration.',
    },
    articleSection: {
      heading: 'Cooling Articles & Safety Guides',
      intro: 'Practical guides that explain heat risks, car setup, hydration, and warm-weather travel.',
    },
  },
  calming: {
    key: 'calming',
    href: ROUTES.calmingHub,
    fromPage: 'calming-collector',
    accent: 'sage',
    navAccent: 'var(--color-sage)',
    title: 'Calm & Comfort',
    ogTitle: 'Calming Products for Dogs | ThunderShirts, Treats & More',
    schemaName: 'Calming Products for Anxious Dogs',
    description:
      'Explore Chill-Dogs calming guides for anxious dogs, including ThunderShirt, calming chews, lick mats, and snuffle mats.',
    hero: {
      theme: 'calming',
      headline: 'Calm Starts Here',
      subhead: 'Anxiety vests, calming chews, and enrichment distractions for nervous dogs',
      primaryCta: { label: 'See top calming picks', href: ROUTES.calmingTop },
      secondaryCta: { label: 'What to try first', href: ROUTES.calmingAlternatives },
    },
    topics: [
      'calming',
      'anxiety',
      'car-anxiety',
      'crate-training',
      'fireworks',
      'tracking',
      'gps-tracking',
      'lost-dog-safety',
    ],
    startHref: ROUTES.calmingTop,
    startDescription:
      'Our main guide covers ThunderShirt, calming chews, lick mats, and snuffle mats using the exact tools most dog owners consider first.',
    converterPriority: [
      ROUTES.calmingTop,
      ROUTES.calmingAlternatives,
      ROUTES.calmingCar,
      ROUTES.comfortCalmingBeds,
      ROUTES.trackingTop,
      ROUTES.fiCollarReview,
    ],
    articlePriority: [
      ROUTES.calmingCbdGuide,
      ROUTES.calmingFireworksRoom,
      ROUTES.calmingCrateGuide,
      ROUTES.roadTrip,
      ROUTES.rhysRanAway,
      ROUTES.dogRanAwaySafety,
    ],
    converterSection: {
      heading: 'Calming Product Comparisons',
      intro: 'Converter paths for anxious dogs, travel stress, pressure wraps, comfort beds, and escape-risk tracking.',
    },
    articleSection: {
      heading: 'Calming Articles & Related Guides',
      intro: 'Research, setup, training, and safety guides for common anxiety triggers and what can happen when dogs bolt.',
    },
    showCalmingDisclaimer: true,
    disclosureShowSafety: false,
  },
  comfort: {
    key: 'comfort',
    href: ROUTES.comfortHub,
    fromPage: 'comfort-collector',
    accent: 'terracotta',
    title: 'Comfort & Rest',
    ogTitle: 'Dog Beds for Comfort & Rest | Calming & Orthopedic Picks',
    schemaName: 'Comfort & Rest for Dogs',
    description:
      'Calming beds, orthopedic beds, and rest gear for dogs who need more than a mat on the floor. Browse our top picks for rest and recovery at home.',
    hero: {
      theme: 'comfort',
      headline: 'Rest. Recovery. Relaxation.',
      subhead: 'Beds and rest gear for dogs who sleep hard and deserve the right support',
      primaryCta: { label: 'See calming beds', href: ROUTES.comfortCalmingBeds },
      secondaryCta: { label: 'Orthopedic beds', href: ROUTES.comfortOrthopedicBeds },
    },
    topics: ['comfort', 'sleep', 'beds', 'orthopedic', 'crates', 'crate-training', 'flying', 'carriers', 'travel'],
    startHref: ROUTES.comfortCalmingBeds,
    startDescription:
      'Donut beds, cuddler beds, and bolster beds for dogs who curl up, burrow, or press against something when they sleep.',
    converterPriority: [
      ROUTES.comfortCalmingBeds,
      ROUTES.comfortOrthopedicBeds,
      ROUTES.comfortPuppyCrates,
      ROUTES.comfortAnxietyCrates,
      ROUTES.comfortTravelCrates,
      ROUTES.comfortAirlineCrates,
      ROUTES.comfortAirlineCarriers,
      ROUTES.comfortTravelBags,
      ROUTES.comfortFurnitureCrates,
      ROUTES.comfortHeavyDutyCrates,
    ],
    articlePriority: [
      ROUTES.comfortSleepArticle,
      ROUTES.calmingCrateGuide,
      ROUTES.travelFlyWithDog,
      ROUTES.roadTrip,
    ],
    converterSection: {
      heading: 'Comfort Product Comparisons',
      intro: 'Beds, crates, carriers, and travel gear grouped by the rest setup your dog actually needs.',
    },
    articleSection: {
      heading: 'Comfort Articles & Travel Guides',
      intro: 'Sleep, crate training, and travel planning guides that route into the right comfort product path.',
    },
    disclosureShowSafety: false,
  },
};

export async function getSectionCollectorPageData(key: SectionCollectorKey): Promise<SectionCollectorPageData> {
  const { getCompleteSitemapSections } = await import('./sitemap-inventory');
  return buildSectionCollectorPageData(sectionCollectorDefinitions[key], await getCompleteSitemapSections());
}

export function buildSectionCollectorPageData(
  definition: SectionCollectorDefinition,
  sections: SitemapSection[]
): SectionCollectorPageData {
  const allPages = sections.flatMap((section) => section.pages);
  const pageOrder = new Map(allPages.map((page, index) => [page.href, index]));
  const articleOrder = getArticleOrder(sections, pageOrder);
  const inventoryPages = allPages.filter((page) => isMatchingCollectorPage(page, definition));
  const startPage = definition.startHref
    ? allPages.find((page) => page.href === definition.startHref)
    : undefined;
  const cardPages = inventoryPages.filter((page) => page.href !== definition.startHref);
  const converters = cardPages
    .filter((page) => page.pageType === 'converter')
    .sort(compareByPriority(definition.converterPriority ?? [], pageOrder));
  const articles = cardPages
    .filter((page) => page.pageType === 'collector' && page.collectorSubtype === 'article')
    .sort(compareByPriority(definition.articlePriority ?? [], articleOrder));

  return {
    definition,
    body: {
      fromPage: definition.fromPage,
      accent: definition.accent,
      start: startPage ? toStartCard(startPage, definition) : undefined,
      sections: [
        {
          ...definition.converterSection,
          cards: converters.map((page) => toCollectorCard(page)),
        },
        {
          ...definition.articleSection,
          cards: articles.map((page) => toCollectorCard(page)),
        },
      ].filter((section) => section.cards.length > 0),
      showCalmingDisclaimer: definition.showCalmingDisclaimer,
      disclosureShowSafety: definition.disclosureShowSafety,
    },
    schema: createCollectionSchema(definition, [startPage, ...inventoryPages].filter(isDefined)),
    inventoryPages,
    converters,
    articles,
  };
}

function isMatchingCollectorPage(page: SitemapPage, definition: SectionCollectorDefinition): boolean {
  if (page.href === definition.href || page.noindex) {
    return false;
  }

  if (page.pageType !== 'converter' && !(page.pageType === 'collector' && page.collectorSubtype === 'article')) {
    return false;
  }

  return hasTopicOverlap(definition.topics, page.topics);
}

function hasTopicOverlap(collectorTopics: SitemapTopic[], pageTopics: SitemapTopic[] | undefined): boolean {
  if (!pageTopics?.length) {
    return false;
  }

  return pageTopics.some((topic) => collectorTopics.includes(topic));
}

function getArticleOrder(sections: SitemapSection[], fallbackOrder: Map<string, number>): Map<string, number> {
  const articleSection = sections.find((section) => section.title === ARTICLE_SECTION_TITLE);
  const articleOrder = new Map<string, number>();

  for (const [index, page] of (articleSection?.pages ?? []).entries()) {
    articleOrder.set(page.href, index);
  }

  for (const [href, index] of fallbackOrder.entries()) {
    if (!articleOrder.has(href)) {
      articleOrder.set(href, articleOrder.size + index);
    }
  }

  return articleOrder;
}

function compareByPriority(priorityHrefs: string[], fallbackOrder: Map<string, number>) {
  const priorityOrder = new Map(priorityHrefs.map((href, index) => [href, index]));

  return (a: SitemapPage, b: SitemapPage): number =>
    compareNumber(priorityOrder.get(a.href) ?? Number.POSITIVE_INFINITY, priorityOrder.get(b.href) ?? Number.POSITIVE_INFINITY)
    || compareNumber(fallbackOrder.get(a.href) ?? Number.POSITIVE_INFINITY, fallbackOrder.get(b.href) ?? Number.POSITIVE_INFINITY)
    || a.href.localeCompare(b.href);
}

function compareNumber(a: number, b: number): number {
  return a - b;
}

function toStartCard(page: SitemapPage, definition: SectionCollectorDefinition): CollectorBodyConfig['start'] {
  return {
    href: page.href,
    title: page.relatedLabel ?? page.baseTitle,
    description: definition.startDescription ?? page.preview.description,
    dataToPage: page.href,
  };
}

function toCollectorCard(page: SitemapPage): CollectorCard {
  return {
    href: page.href,
    title: page.relatedLabel ?? page.baseTitle,
    description: page.preview.description,
    linkLabel: getLinkLabel(page),
    dataToPage: page.href,
    dataCategory: getDataCategory(page.href),
  };
}

function getLinkLabel(page: SitemapPage): string {
  if (page.href === ROUTES.shop) {
    return 'Browse products ->';
  }

  if (page.pageType === 'converter') {
    return 'Compare picks ->';
  }

  return 'Read the guide ->';
}

function getDataCategory(href: string): string {
  return href.split('/').filter(Boolean).at(-1) ?? 'home';
}

function createCollectionSchema(definition: SectionCollectorDefinition, pages: SitemapPage[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: definition.schemaName,
    url: new URL(definition.href, SITE_ORIGIN).href,
    description: definition.description,
    hasPart: uniquePages(pages).map((page) => ({
      '@type': 'WebPage',
      name: page.baseTitle,
      url: new URL(page.href, SITE_ORIGIN).href,
    })),
  };
}

function uniquePages(pages: SitemapPage[]): SitemapPage[] {
  const seen = new Set<string>();
  return pages.filter((page) => {
    if (seen.has(page.href)) {
      return false;
    }

    seen.add(page.href);
    return true;
  });
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}
