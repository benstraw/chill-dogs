import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { ROUTES } from '@data/routes';

const feedItems = [
  // Converters
  { title: '10 Best Cooling Products for Dogs (2026)', url: ROUTES.coolingTop },
  { title: 'Best Car Cooling Products for Dogs', url: ROUTES.coolingCar },
  { title: 'Best Cooling Mats for Dogs', url: ROUTES.coolingMats },
  { title: 'Best Cooling Bandanas for Dogs', url: ROUTES.coolingBandanas },
  { title: 'Best Cooling Vests for Dogs', url: ROUTES.coolingVests },
  { title: 'Best Freezable Dog Toys', url: ROUTES.coolingToys },
  { title: 'Best Calming Products for Anxious Dogs', url: ROUTES.calmingTop },
  { title: 'Best ThunderShirt Alternatives for Dogs', url: ROUTES.calmingAlternatives },
  { title: 'Best Calming Products for Car Anxiety in Dogs', url: ROUTES.calmingCar },
  { title: 'Best Calming Dog Beds', url: ROUTES.comfortCalmingBeds },
  { title: 'Best Orthopedic Dog Beds', url: ROUTES.comfortOrthopedicBeds },
  // Article collectors
  { title: 'How to Keep a Dog Cool in a Car', url: ROUTES.coolingCarGuide },
  { title: 'How Hot Is Too Hot for Dogs?', url: ROUTES.coolingSafety },
  { title: "Dog Road Trip Gear: Rhys's Cooling & Calming Kit for Long Drives", url: ROUTES.roadTrip },
  { title: 'How Much Do Dogs Sleep? What Rest Really Looks Like', url: ROUTES.comfortSleepArticle },
];

export async function GET(context: APIContext) {
  return rss({
    title: 'Chill Dogs',
    description: 'Gear, guides, and picks for keeping your dog cool, calm, and comfortable.',
    site: context.site ?? 'https://www.chill-dogs.com',
    items: feedItems.map(({ title, url }) => ({
      title,
      link: url,
    })),
  });
}
