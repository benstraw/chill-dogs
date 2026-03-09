import type { APIContext } from 'astro';
import { buildLlmsMarkdown, type LlmsLink } from '@utils/llms';
import { ROUTES } from '@data/routes';

export const prerender = true;

const SITE_NAME = 'Chill-Dogs';
const SITE_DESCRIPTION = 'Curated cooling and calming product guides for dogs, focused on practical picks and clear routes to high-intent recommendations.';
const INTRO = 'This index prioritizes evergreen guides and key conversion pages for fast retrieval by LLM tools and agents.';

const STATIC_LINKS: LlmsLink[] = [
  {
    title: 'Home',
    path: ROUTES.home,
    description: 'Main entry point to cooling and calming recommendation paths.',
    explicitPriority: 1000,
  },
  {
    title: 'Cooling Collector',
    path: ROUTES.coolingHub,
    description: 'Overview of cooling categories and supporting heat-safety guides.',
    explicitPriority: 960,
  },
  {
    title: 'Calming Collector',
    path: ROUTES.calmingHub,
    description: 'Overview of calming categories and high-intent anxiety guides.',
    explicitPriority: 955,
  },
  {
    title: 'Best Cooling Products for Dogs',
    path: ROUTES.coolingTop,
    description: 'Top cooling picks across mats, vests, bandanas, and frozen enrichment.',
    explicitPriority: 940,
  },
  {
    title: 'Best Calming Products for Anxious Dogs',
    path: ROUTES.calmingTop,
    description: 'Top calming picks across wraps, chews, lick mats, and snuffle mats.',
    explicitPriority: 935,
  },
  {
    title: "Rhys's Road Trip Chill Kit",
    path: ROUTES.roadTrip,
    description: 'Road-trip setup that combines cooling and calming recommendations.',
    explicitPriority: 930,
  },
  {
    title: 'Car Cooling for Dogs',
    path: ROUTES.coolingCar,
    description: 'Converter page focused on in-car cooling gear and heat-risk reduction.',
    explicitPriority: 920,
  },
  {
    title: 'Car Anxiety for Dogs',
    path: ROUTES.calmingCar,
    description: 'Converter page focused on travel calming aids and routines.',
    explicitPriority: 915,
  },
  {
    title: 'Cooling Mats',
    path: ROUTES.coolingMats,
    description: 'Category converter for cooling mat recommendations.',
    explicitPriority: 910,
  },
  {
    title: 'Cooling Vests',
    path: ROUTES.coolingVests,
    description: 'Category converter for evaporative cooling vest recommendations.',
    explicitPriority: 905,
  },
  {
    title: 'Cooling Bandanas',
    path: ROUTES.coolingBandanas,
    description: 'Category converter for lightweight neck-cooling options.',
    explicitPriority: 900,
  },
  {
    title: 'Freezable Dog Toys',
    path: ROUTES.coolingToys,
    description: 'Category converter for frozen enrichment and cooling play.',
    explicitPriority: 895,
  },
  {
    title: 'How Hot Is Too Hot for Dogs?',
    path: ROUTES.coolingSafety,
    description: 'Heat threshold explainer with routing to cooling products.',
    explicitPriority: 885,
  },
  {
    title: 'Best ThunderShirt Alternatives for Dogs',
    path: ROUTES.calmingAlternatives,
    description: 'Comparison guide for calming options beyond pressure wraps.',
    explicitPriority: 880,
  },
  {
    title: 'About Chill-Dogs',
    path: ROUTES.about,
    description: 'Editorial approach, positioning, and trust context.',
    explicitPriority: 600,
  },
  {
    title: 'Contact',
    path: ROUTES.contact,
    description: 'Direct contact page for editorial or site questions.',
    explicitPriority: 590,
  },
];

function resolveBaseUrl(context: APIContext): string {
  const envUrl = import.meta.env.PUBLIC_SITE_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
  }

  if (context.site) {
    return context.site.href;
  }

  throw new Error('Missing site URL. Set PUBLIC_SITE_URL or Astro site config.');
}

export async function GET(context: APIContext): Promise<Response> {
  const baseUrl = resolveBaseUrl(context);

  const body = buildLlmsMarkdown({
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
    shortParagraph: INTRO,
    baseUrl,
    links: STATIC_LINKS,
    maxLinks: 40,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
