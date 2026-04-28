import type { ImageMetadata } from 'astro';
import { resolveAutoOgImagePath } from '@utils/og';
import { resolveProvidedOgImagePath } from '@utils/og';
import { calmingConverterPages } from './calming-converter-pages';
import { categoryMeta } from './cooling-products';
import { relaxationConverterPages } from './relaxation-converter-pages';
import { ROUTES } from './routes';

export type SitemapPageType = 'converter' | 'collector' | 'attractor' | 'informer';
export type SitemapCollectorSubtype = 'section' | 'article';

export interface SitemapPreview {
  title: string;
  description: string;
  image: string;
}

export interface SitemapPage {
  href: string;
  pageType: SitemapPageType;
  collectorSubtype?: SitemapCollectorSubtype;
  preview: SitemapPreview;
}

export interface SitemapSection {
  title: string;
  description: string;
  pages: SitemapPage[];
}

interface SitemapPageInput {
  baseTitle: string;
  description: string;
  href: string;
  pageType: SitemapPageType;
  collectorSubtype?: SitemapCollectorSubtype;
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

function resolveShareImage(href: string, options: { ogImage?: string | ImageMetadata; noindex?: boolean }) {
  return resolveProvidedOgImagePath(options.ogImage)
    ?? resolveAutoOgImagePath({ pathname: href, noindex: options.noindex })
    ?? '/og-default.jpg';
}

export function createSitemapPage(input: SitemapPageInput): SitemapPage {
  return {
    href: input.href,
    pageType: input.pageType,
    collectorSubtype: input.collectorSubtype,
    preview: {
      title: resolveShareTitle(input.baseTitle, input.ogTitle),
      description: input.description,
      image: resolveShareImage(input.href, { ogImage: input.ogImage, noindex: input.noindex }),
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
      }),
      createSitemapPage({
        baseTitle: 'Calm & Comfort',
        ogTitle: 'Calming Products for Dogs | ThunderShirts, Treats & More',
        description:
          'Explore Chill-Dogs calming guides for anxious dogs, including ThunderShirt, calming chews, lick mats, and snuffle mats.',
        href: ROUTES.calmingHub,
        pageType: 'collector',
        collectorSubtype: 'section',
      }),
      createSitemapPage({
        baseTitle: 'Comfort & Rest',
        ogTitle: 'Dog Beds for Comfort & Rest | Calming & Orthopedic Picks',
        description:
          'Calming beds, orthopedic beds, and rest gear for dogs who need more than a mat on the floor. Browse our top picks for rest and recovery at home.',
        href: ROUTES.comfortHub,
        pageType: 'collector',
        collectorSubtype: 'section',
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
      }),
      createSitemapPage({
        baseTitle: categoryMeta['car-cooling'].title,
        description: categoryMeta['car-cooling'].description,
        href: ROUTES.coolingCar,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['cooling-mats'].title,
        description: categoryMeta['cooling-mats'].description,
        href: ROUTES.coolingMats,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['cooling-bandanas'].title,
        description: categoryMeta['cooling-bandanas'].description,
        href: ROUTES.coolingBandanas,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['cooling-vests'].title,
        description: categoryMeta['cooling-vests'].description,
        href: ROUTES.coolingVests,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: categoryMeta['freezable-dog-toys'].title,
        description: categoryMeta['freezable-dog-toys'].description,
        href: ROUTES.coolingToys,
        pageType: 'converter',
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
      }),
      createSitemapPage({
        baseTitle: calmingConverterPages['best-thundershirt-alternatives'].title,
        description: calmingConverterPages['best-thundershirt-alternatives'].description,
        href: ROUTES.calmingAlternatives,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: calmingConverterPages['car-anxiety-for-dogs'].title,
        description: calmingConverterPages['car-anxiety-for-dogs'].description,
        href: ROUTES.calmingCar,
        pageType: 'converter',
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
      }),
      createSitemapPage({
        baseTitle: 'Fi Dog Collar Review: GPS Tracking for Everyday Dogs (2026)',
        ogTitle: 'Fi Series 3+ Dog Collar GPS Review (2026)',
        description:
          'An honest look at Fi Series 3+ — cellular GPS tracking, escape alerts, and geofencing. What it does well, what it costs, and where it fails without cell signal.',
        href: ROUTES.fiCollarReview,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: 'Garmin Dog Tracking Collars: Off-Grid GPS for Wilderness & Hiking (2026)',
        ogTitle: 'Garmin Dog Tracking: Off-Grid GPS Systems (2026)',
        description:
          'Garmin off-grid GPS systems track dogs in wilderness without any cell signal — using GPS satellites and VHF radio. Who needs it, how it works, and key trade-offs.',
        href: ROUTES.garminTracking,
        pageType: 'collector',
        collectorSubtype: 'article',
      }),
      createSitemapPage({
        baseTitle: "AirTag for Dogs: What It Can (and Can't) Actually Do",
        description:
          'AirTag is not a GPS tracker. It uses Bluetooth crowd-sourcing — reliable in cities, unreliable in remote areas. Honest look at when it helps and when it does not.',
        href: ROUTES.airtagForDogs,
        pageType: 'collector',
        collectorSubtype: 'article',
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
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-orthopedic-dog-beds'].title,
        description: relaxationConverterPages['best-orthopedic-dog-beds'].description,
        href: ROUTES.comfortOrthopedicBeds,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-dog-travel-beds'].title,
        description: relaxationConverterPages['best-dog-travel-beds'].description,
        href: ROUTES.comfortTravelBeds,
        pageType: 'converter',
        ogTitle: relaxationConverterPages['best-dog-travel-beds'].ogTitle,
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-puppy-crates'].title,
        description: relaxationConverterPages['best-puppy-crates'].description,
        href: ROUTES.comfortPuppyCrates,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-anxiety-dog-crates'].title,
        description: relaxationConverterPages['best-anxiety-dog-crates'].description,
        href: ROUTES.comfortAnxietyCrates,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-travel-crates-for-road-trips'].title,
        description: relaxationConverterPages['best-travel-crates-for-road-trips'].description,
        href: ROUTES.comfortTravelCrates,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-airline-crates-for-flying-with-your-dog'].title,
        description: relaxationConverterPages['best-airline-crates-for-flying-with-your-dog'].description,
        href: ROUTES.comfortAirlineCrates,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-airline-approved-dog-carriers'].title,
        description: relaxationConverterPages['best-airline-approved-dog-carriers'].description,
        href: ROUTES.comfortAirlineCarriers,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-furniture-dog-crates'].title,
        description: relaxationConverterPages['best-furniture-dog-crates'].description,
        href: ROUTES.comfortFurnitureCrates,
        pageType: 'converter',
      }),
      createSitemapPage({
        baseTitle: relaxationConverterPages['best-heavy-duty-dog-crates'].title,
        description: relaxationConverterPages['best-heavy-duty-dog-crates'].description,
        href: ROUTES.comfortHeavyDutyCrates,
        pageType: 'converter',
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
