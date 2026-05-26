import type { ImageMetadata } from 'astro';
import { resolveAutoOgImagePath } from '@utils/og';
import { resolveProvidedOgImagePath } from '@utils/og';
import { calmingConverterPages } from './calming-converter-pages';
import { categoryMeta } from './cooling-products';
import { relaxationConverterPages } from './relaxation-converter-pages';
import { ROUTES } from './routes';

export type SitemapPageType = 'converter' | 'collector' | 'attractor' | 'informer';
export type SitemapCollectorSubtype = 'section' | 'article';
export const TOPICS = [
  'cooling',
  'heat-safety',
  'car-cooling',
  'cooling-mats',
  'cooling-wearables',
  'frozen-toys',
  'hydration',
  'calming',
  'anxiety',
  'car-anxiety',
  'crate-training',
  'fireworks',
  'comfort',
  'sleep',
  'beds',
  'orthopedic',
  'crates',
  'travel',
  'road-trips',
  'flying',
  'carriers',
  'tracking',
  'gps-tracking',
  'lost-dog-safety',
] as const;

export type SitemapTopic = typeof TOPICS[number];

export interface SitemapPreview {
  title: string;
  description: string;
  image: string;
}

export interface SitemapPage {
  href: string;
  baseTitle: string;
  pageType: SitemapPageType;
  collectorSubtype?: SitemapCollectorSubtype;
  topics?: SitemapTopic[];
  pinnedRelated?: string[];
  excludeRelated?: string[];
  relatedLabel?: string;
  noindex?: boolean;
  preview: SitemapPreview;
}

export interface SitemapSection {
  title: string;
  description: string;
  pages: SitemapPage[];
}

export interface SitemapPageInput {
  baseTitle: string;
  description: string;
  href: string;
  pageType: SitemapPageType;
  collectorSubtype?: SitemapCollectorSubtype;
  topics?: SitemapTopic[];
  pinnedRelated?: string[];
  excludeRelated?: string[];
  relatedLabel?: string;
  ogTitle?: string;
  ogImage?: string | ImageMetadata;
  noindex?: boolean;
}

function resolveShareTitle(baseTitle: string, ogTitle?: string): string {
  if (baseTitle === 'Home') {
    return 'Chill-Dogs — Cooling & Calming Products for Dogs';
  }

  return ogTitle ?? `${baseTitle} | Chill-Dogs`;
}

function resolveShareImage(href: string, options: { ogImage?: string | ImageMetadata }) {
  return resolveProvidedOgImagePath(options.ogImage)
    ?? resolveAutoOgImagePath({ pathname: href })
    ?? '/og-default.jpg';
}

export function createSitemapPage(input: SitemapPageInput): SitemapPage {
  return {
    href: input.href,
    baseTitle: input.baseTitle,
    pageType: input.pageType,
    collectorSubtype: input.collectorSubtype,
    topics: input.topics,
    pinnedRelated: input.pinnedRelated,
    excludeRelated: input.excludeRelated,
    relatedLabel: input.relatedLabel,
    noindex: input.noindex,
    preview: {
      title: resolveShareTitle(input.baseTitle, input.ogTitle),
      description: input.description,
      image: resolveShareImage(input.href, { ogImage: input.ogImage }),
    },
  };
}

export const staticSitemapSections: SitemapSection[] = [
  {
    title: 'Entry Points',
    description: 'The attractor and collector sections that absorb traffic and route it into conversion paths.',
    pages: [
      createSitemapPage({
        baseTitle: 'Home',
        description:
          'Curated cooling and calming picks to help your dog feel better fast — from summer heat relief to anxiety-friendly comfort.',
        href: ROUTES.home,
        pageType: 'attractor',
      }),
      createSitemapPage({
        baseTitle: 'Cooling Relief',
        ogTitle: 'Cooling Products for Dogs | Mats, Vests & Bandanas',
        description:
          'Beat the heat with our curated cooling picks for dogs — from cooling mats and vests to frozen treats and shade solutions.',
        href: ROUTES.coolingHub,
        pageType: 'collector',
        collectorSubtype: 'section',
        topics: ['cooling', 'heat-safety', 'car-cooling', 'cooling-mats', 'cooling-wearables', 'frozen-toys', 'hydration'],
        relatedLabel: 'Cooling Relief',
      }),
      createSitemapPage({
        baseTitle: 'Calm & Comfort',
        ogTitle: 'Calming Products for Dogs | ThunderShirts, Treats & More',
        description:
          'Explore Chill-Dogs calming guides for anxious dogs, including ThunderShirt, calming chews, lick mats, and snuffle mats.',
        href: ROUTES.calmingHub,
        pageType: 'collector',
        collectorSubtype: 'section',
        topics: ['calming', 'anxiety', 'car-anxiety', 'crate-training', 'fireworks', 'tracking', 'gps-tracking', 'lost-dog-safety'],
        relatedLabel: 'Calm & Comfort',
      }),
      createSitemapPage({
        baseTitle: 'Comfort & Rest',
        ogTitle: 'Dog Beds for Comfort & Rest | Calming & Orthopedic Picks',
        description:
          'Calming beds, orthopedic beds, and rest gear for dogs who need more than a mat on the floor. Browse our top picks for rest and recovery at home.',
        href: ROUTES.comfortHub,
        pageType: 'collector',
        collectorSubtype: 'section',
        topics: ['comfort', 'sleep', 'beds', 'orthopedic', 'crates', 'crate-training', 'flying', 'carriers', 'travel'],
        relatedLabel: 'Comfort & Rest',
      }),
      createSitemapPage({
        baseTitle: 'Search',
        description: 'Search all Chill-Dogs guides and products, then route to relevant product and guide pages.',
        href: ROUTES.search,
        pageType: 'collector',
        noindex: true,
      }),
    ],
  },
  {
    title: 'Cooling Converters',
    description: 'Commercial product pages. Each page has one job: drive an affiliate outbound click.',
    pages: [
      createSitemapPage({
        baseTitle: '10 Best Cooling Products for Dogs',
        description:
          'Beat the heat with our top picks: cooling mats, bandanas, vests, and freezable toys compared for comfort, durability, and safety all summer.',
        href: ROUTES.coolingTop,
        pageType: 'converter',
        topics: ['cooling', 'heat-safety'],
        relatedLabel: 'Best Cooling Products',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['car-cooling'].title,
        description: categoryMeta['car-cooling'].description,
        href: ROUTES.coolingCar,
        pageType: 'converter',
        topics: ['cooling', 'heat-safety', 'car-cooling', 'travel', 'road-trips', 'hydration'],
        pinnedRelated: [
          ROUTES.roadTrip,
          ROUTES.coolingMats,
          ROUTES.coolingHydration,
          ROUTES.coolingTop,
        ],
        relatedLabel: 'Car Cooling Picks',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['cooling-mats'].title,
        description: categoryMeta['cooling-mats'].description,
        href: ROUTES.coolingMats,
        pageType: 'converter',
        topics: ['cooling', 'heat-safety', 'cooling-mats', 'comfort'],
        pinnedRelated: [
          ROUTES.coolingBandanas,
          ROUTES.coolingVests,
          ROUTES.coolingToys,
          ROUTES.coolingTop,
        ],
        relatedLabel: 'Best Cooling Mats',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['cooling-bandanas'].title,
        description: categoryMeta['cooling-bandanas'].description,
        href: ROUTES.coolingBandanas,
        pageType: 'converter',
        topics: ['cooling', 'heat-safety', 'cooling-wearables'],
        pinnedRelated: [
          ROUTES.coolingMats,
          ROUTES.coolingVests,
          ROUTES.coolingToys,
          ROUTES.coolingTop,
        ],
        relatedLabel: 'Best Cooling Bandanas',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['cooling-vests'].title,
        description: categoryMeta['cooling-vests'].description,
        href: ROUTES.coolingVests,
        pageType: 'converter',
        topics: ['cooling', 'heat-safety', 'cooling-wearables'],
        pinnedRelated: [
          ROUTES.coolingMats,
          ROUTES.coolingBandanas,
          ROUTES.coolingToys,
          ROUTES.coolingTop,
        ],
        relatedLabel: 'Best Cooling Vests',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['freezable-dog-toys'].title,
        description: categoryMeta['freezable-dog-toys'].description,
        href: ROUTES.coolingToys,
        pageType: 'converter',
        topics: ['cooling', 'heat-safety', 'frozen-toys'],
        pinnedRelated: [
          ROUTES.coolingMats,
          ROUTES.coolingBandanas,
          ROUTES.coolingVests,
          ROUTES.coolingTop,
        ],
        relatedLabel: 'Freezable Dog Toys',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['hydration'].title,
        description: categoryMeta['hydration'].description,
        href: ROUTES.coolingHydration,
        pageType: 'converter',
        topics: ['cooling', 'hydration', 'travel', 'road-trips', 'flying'],
        pinnedRelated: [
          ROUTES.travelFlyWithDog,
          ROUTES.roadTrip,
          ROUTES.coolingCar,
          ROUTES.coolingTop,
        ],
        relatedLabel: 'Portable Dog Water Bottles',
      }),
    ],
  },
  {
    title: 'Calming Converters',
    description: 'Commercial product pages for anxiety and calming intent.',
    pages: [
      createSitemapPage({
        baseTitle: calmingConverterPages['best-calming-products-for-anxious-dogs'].title,
        description: calmingConverterPages['best-calming-products-for-anxious-dogs'].description,
        href: ROUTES.calmingTop,
        pageType: 'converter',
        topics: ['calming', 'anxiety'],
        pinnedRelated: [
          ROUTES.roadTrip,
          ROUTES.coolingTop,
          ROUTES.calmingHub,
          ROUTES.calmingAlternatives,
          ROUTES.trackingTop,
          ROUTES.dogRanAwaySafety,
        ],
        relatedLabel: 'Best Calming Products',
      }),
      createSitemapPage({
        baseTitle: calmingConverterPages['best-thundershirt-alternatives'].title,
        description: calmingConverterPages['best-thundershirt-alternatives'].description,
        href: ROUTES.calmingAlternatives,
        pageType: 'converter',
        topics: ['calming', 'anxiety'],
        pinnedRelated: [
          ROUTES.calmingHub,
          ROUTES.calmingTop,
        ],
        relatedLabel: 'ThunderShirt Alternatives',
      }),
      createSitemapPage({
        baseTitle: calmingConverterPages['car-anxiety-for-dogs'].title,
        description: calmingConverterPages['car-anxiety-for-dogs'].description,
        href: ROUTES.calmingCar,
        pageType: 'converter',
        topics: ['calming', 'anxiety', 'car-anxiety', 'travel', 'road-trips'],
        pinnedRelated: [
          ROUTES.calmingHub,
          ROUTES.calmingTop,
          ROUTES.calmingAlternatives,
          ROUTES.roadTrip,
        ],
        relatedLabel: 'Car Anxiety Picks',
      }),
      createSitemapPage({
        baseTitle: calmingConverterPages['best-lick-mats-for-dogs'].title,
        description: calmingConverterPages['best-lick-mats-for-dogs'].description,
        href: ROUTES.calmingLickMats,
        pageType: 'converter',
        topics: ['calming', 'anxiety', 'fireworks', 'comfort'],
        pinnedRelated: [
          ROUTES.calmingTop,
          ROUTES.calmingFireworksRoom,
          ROUTES.calmingFireworksEvent,
          ROUTES.calmingCar,
          ROUTES.coolingToys,
        ],
        relatedLabel: 'Best Lick Mats',
      }),
    ],
  },
  {
    title: 'Tracking & Safety',
    description: 'GPS tracker converters and safety collectors — route lost-dog and tracking intent to affiliate product pages.',
    pages: [
      createSitemapPage({
        baseTitle: 'Best Dog GPS Trackers: Cellular vs Off-Grid vs Bluetooth (2026)',
        ogTitle: 'Best Dog GPS Trackers: Types Compared (2026)',
        description:
          'Compare the top dog GPS trackers — cellular (Fi, Halo, Garmin LTE), off-grid Garmin systems, and Bluetooth tags (AirTag). Honest trade-offs for each.',
        href: ROUTES.trackingTop,
        pageType: 'converter',
        topics: ['tracking', 'gps-tracking', 'lost-dog-safety'],
        pinnedRelated: [
          ROUTES.rhysRanAway,
          ROUTES.fiCollarReview,
          ROUTES.garminTracking,
          ROUTES.airtagForDogs,
          ROUTES.dogRanAwaySafety,
          ROUTES.roadTrip,
        ],
        relatedLabel: 'All GPS Trackers',
      }),
      createSitemapPage({
        baseTitle: 'Fi Dog Collar Review: GPS Tracking for Everyday Dogs (2026)',
        ogTitle: 'Fi Series 3+ Dog Collar GPS Review (2026)',
        description:
          'An honest look at Fi Series 3+ — cellular GPS tracking, escape alerts, and geofencing. What it does well, what it costs, and where it fails without cell signal.',
        href: ROUTES.fiCollarReview,
        pageType: 'converter',
        topics: ['tracking', 'gps-tracking', 'lost-dog-safety'],
        pinnedRelated: [
          ROUTES.trackingTop,
          ROUTES.garminTracking,
          ROUTES.airtagForDogs,
          ROUTES.rhysRanAway,
          ROUTES.dogRanAwaySafety,
        ],
        relatedLabel: 'Fi Collar Review',
      }),
      createSitemapPage({
        baseTitle: 'Garmin Dog Tracking Collars: Off-Grid GPS for Wilderness & Hiking (2026)',
        ogTitle: 'Garmin Dog Tracking: Off-Grid GPS Systems (2026)',
        description:
          'Garmin off-grid GPS systems track dogs in wilderness without any cell signal — using GPS satellites and VHF radio. Who needs it, how it works, and key trade-offs.',
        href: ROUTES.garminTracking,
        pageType: 'collector',
        collectorSubtype: 'article',
        topics: ['tracking', 'gps-tracking', 'lost-dog-safety'],
        pinnedRelated: [
          ROUTES.trackingTop,
          ROUTES.fiCollarReview,
          ROUTES.airtagForDogs,
          ROUTES.rhysRanAway,
          ROUTES.dogRanAwaySafety,
        ],
        relatedLabel: 'Garmin Off-Grid Systems',
      }),
      createSitemapPage({
        baseTitle: "AirTag for Dogs: What It Can (and Can't) Actually Do",
        description:
          'AirTag is not a GPS tracker. It uses Bluetooth crowd-sourcing — reliable in cities, unreliable in remote areas. Honest look at when it helps and when it does not.',
        href: ROUTES.airtagForDogs,
        pageType: 'collector',
        collectorSubtype: 'article',
        topics: ['tracking', 'gps-tracking', 'lost-dog-safety'],
        pinnedRelated: [
          ROUTES.trackingTop,
          ROUTES.fiCollarReview,
          ROUTES.garminTracking,
          ROUTES.rhysRanAway,
          ROUTES.dogRanAwaySafety,
        ],
        relatedLabel: 'AirTag for Dogs',
      }),
    ],
  },
  {
    title: 'Comfort',
    description: 'Rest, Recovery, Relaxation pillar — collector path, dog bed converter pages, crate converter pages, and sleep guides.',
    pages: [
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-calming-dog-beds'].title,
        description: relaxationConverterPages['best-calming-dog-beds'].description,
        href: ROUTES.comfortCalmingBeds,
        pageType: 'converter',
        topics: ['comfort', 'sleep', 'beds', 'calming', 'anxiety'],
        pinnedRelated: [
          ROUTES.comfortOrthopedicBeds,
          ROUTES.calmingTop,
          ROUTES.calmingHub,
        ],
        relatedLabel: 'Best Calming Dog Beds',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-orthopedic-dog-beds'].title,
        description: relaxationConverterPages['best-orthopedic-dog-beds'].description,
        href: ROUTES.comfortOrthopedicBeds,
        pageType: 'converter',
        topics: ['comfort', 'sleep', 'beds', 'orthopedic'],
        pinnedRelated: [
          ROUTES.comfortCalmingBeds,
          ROUTES.calmingTop,
          ROUTES.calmingHub,
        ],
        relatedLabel: 'Best Orthopedic Dog Beds',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-puppy-crates'].title,
        description: relaxationConverterPages['best-puppy-crates'].description,
        href: ROUTES.comfortPuppyCrates,
        pageType: 'converter',
        topics: ['comfort', 'crates', 'crate-training'],
        pinnedRelated: [
          ROUTES.calmingCrateGuide,
          ROUTES.comfortCalmingBeds,
          ROUTES.comfortHub,
        ],
        relatedLabel: 'Best Puppy Crates',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-anxiety-dog-crates'].title,
        description: relaxationConverterPages['best-anxiety-dog-crates'].description,
        href: ROUTES.comfortAnxietyCrates,
        pageType: 'converter',
        topics: ['comfort', 'crates', 'calming', 'anxiety'],
        pinnedRelated: [
          ROUTES.calmingCrateGuide,
          ROUTES.calmingTop,
          ROUTES.comfortHeavyDutyCrates,
          ROUTES.comfortPuppyCrates,
        ],
        relatedLabel: 'Best Anxiety Dog Crates',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-travel-crates-for-road-trips'].title,
        description: relaxationConverterPages['best-travel-crates-for-road-trips'].description,
        href: ROUTES.comfortTravelCrates,
        pageType: 'converter',
        topics: ['comfort', 'crates', 'travel', 'road-trips'],
        pinnedRelated: [
          ROUTES.roadTrip,
          ROUTES.calmingCrateGuide,
          ROUTES.comfortAirlineCrates,
          ROUTES.comfortAnxietyCrates,
        ],
        relatedLabel: 'Travel Crates for Road Trips',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-airline-crates-for-flying-with-your-dog'].title,
        description: relaxationConverterPages['best-airline-crates-for-flying-with-your-dog'].description,
        href: ROUTES.comfortAirlineCrates,
        pageType: 'converter',
        topics: ['comfort', 'crates', 'travel', 'flying'],
        pinnedRelated: [
          ROUTES.calmingCrateGuide,
          ROUTES.comfortTravelCrates,
          ROUTES.comfortAnxietyCrates,
        ],
        relatedLabel: 'Best Airline Crates',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-airline-approved-dog-carriers'].title,
        description: relaxationConverterPages['best-airline-approved-dog-carriers'].description,
        href: ROUTES.comfortAirlineCarriers,
        pageType: 'converter',
        topics: ['comfort', 'travel', 'flying', 'carriers'],
        pinnedRelated: [
          ROUTES.travelFlyWithDog,
          ROUTES.comfortAirlineCrates,
          ROUTES.calmingTop,
          ROUTES.calmingCar,
          ROUTES.roadTrip,
        ],
        relatedLabel: 'Best Airline-Approved Carriers',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-dog-travel-bags-for-flying'].title,
        description: relaxationConverterPages['best-dog-travel-bags-for-flying'].description,
        href: ROUTES.comfortTravelBags,
        pageType: 'converter',
        topics: ['comfort', 'travel', 'flying', 'carriers'],
        pinnedRelated: [
          ROUTES.travelFlyWithDog,
          ROUTES.comfortAirlineCrates,
          ROUTES.calmingTop,
          ROUTES.roadTrip,
        ],
        relatedLabel: 'Best Dog Travel Bags',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-furniture-dog-crates'].title,
        description: relaxationConverterPages['best-furniture-dog-crates'].description,
        href: ROUTES.comfortFurnitureCrates,
        pageType: 'converter',
        topics: ['comfort', 'crates'],
        pinnedRelated: [
          ROUTES.calmingCrateGuide,
          ROUTES.comfortHeavyDutyCrates,
          ROUTES.comfortPuppyCrates,
        ],
        relatedLabel: 'Best Furniture Dog Crates',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-heavy-duty-dog-crates'].title,
        description: relaxationConverterPages['best-heavy-duty-dog-crates'].description,
        href: ROUTES.comfortHeavyDutyCrates,
        pageType: 'converter',
        topics: ['comfort', 'crates', 'anxiety'],
        pinnedRelated: [
          ROUTES.comfortAnxietyCrates,
          ROUTES.calmingCrateGuide,
          ROUTES.comfortFurnitureCrates,
        ],
        relatedLabel: 'Best Heavy-Duty Dog Crates',
      }),
    ],
  },
  {
    title: 'Shop',
    description: 'Cross-pillar product browse page — lets visitors discover the full product catalog with pillar, category, and search filtering.',
    pages: [
      createSitemapPage({
        baseTitle: 'All Dog Products',
        ogTitle: 'Browse All Dog Products — Cooling, Calming, Comfort & Gear',
        description:
          'Browse our full catalog of researched dog products — cooling gear, calming aids, comfortable beds, crates, and GPS trackers. Filter by category.',
        href: ROUTES.shop,
        pageType: 'converter',
        topics: ['cooling', 'calming', 'comfort', 'tracking'],
      }),
    ],
  },
  {
    title: 'Admin & Legal',
    description: 'Informer pages — compliance, trust, contact, and product inventory review. New products must flow into Product Catalog via data files, not hardcoded admin rows.',
    pages: [
      createSitemapPage({
        baseTitle: 'Product Catalog (Admin)',
        description: 'Curated gear, gift guides, and party ideas for dogs who live the good life.',
        href: '/admin/products/',
        pageType: 'informer',
        noindex: true,
      }),
      createSitemapPage({
        baseTitle: 'About',
        ogTitle: 'About Chill-Dogs | Curated Dog Lifestyle Products',
        description:
          'Learn about Chill-Dogs — a simple, focused resource for cooling and relaxation products that help keep dogs comfortable.',
        href: ROUTES.about,
        pageType: 'informer',
      }),
      createSitemapPage({
        baseTitle: 'Contact',
        ogTitle: 'Contact Chill-Dogs | Questions & Feedback Welcome',
        description:
          'Have a question, feedback, or a partnership inquiry? Reach out to the Chill-Dogs team — we read every message and aim to respond within 48 hours.',
        href: ROUTES.contact,
        pageType: 'informer',
      }),
      createSitemapPage({
        baseTitle: 'Affiliate Disclosure',
        ogTitle: 'Affiliate Disclosure | How Chill-Dogs Earns Revenue',
        description:
          "Full affiliate disclosure for Chill-Dogs. We earn commissions from Amazon on qualifying purchases made through links on our site — here's exactly how that works.",
        href: ROUTES.affiliateDisclosure,
        pageType: 'informer',
      }),
      createSitemapPage({
        baseTitle: 'Privacy Policy',
        description: 'Privacy policy for Chill-Dogs. Learn how we handle your data.',
        href: ROUTES.privacyPolicy,
        pageType: 'informer',
        noindex: true,
      }),
      createSitemapPage({
        baseTitle: 'Subscribe to Chill-Dogs',
        ogTitle: 'Subscribe to Chill-Dogs | Dog Tips and Gear Picks',
        description:
          'Get practical tips, seasonal reminders, and researched gear picks for keeping your dog cool, calm, and comfortable. Sent occasionally.',
        href: ROUTES.subscribe,
        pageType: 'informer',
        noindex: true,
      }),
      createSitemapPage({
        baseTitle: 'Check Your Email',
        ogTitle: 'Check Your Email to Confirm Your Chill-Dogs Signup',
        description:
          'Check your inbox for a confirmation email. Click the link to confirm your Chill-Dogs subscription and start getting practical tips.',
        href: ROUTES.subscribeThanks,
        pageType: 'informer',
        noindex: true,
      }),
      createSitemapPage({
        baseTitle: "You're Subscribed",
        ogTitle: "You're Subscribed to Chill-Dogs Tips and Guides",
        description:
          'You are subscribed to Chill-Dogs. Get practical tips on keeping your dog cool, calm, and comfortable delivered to your inbox.',
        href: ROUTES.subscribeConfirmed,
        pageType: 'informer',
        noindex: true,
      }),
      createSitemapPage({
        baseTitle: 'Terms of Use',
        description: 'Terms of use for Chill-Dogs website.',
        href: ROUTES.terms,
        pageType: 'informer',
        noindex: true,
      }),
    ],
  },
];
