import rss from '@astrojs/rss';

const SITE = 'https://www.chill-dogs.com';

const feedItems = [
  // Converters
  { title: '10 Best Cooling Products for Dogs (2026)', url: '/cooling/best-cooling-products-for-dogs/' },
  { title: 'Best Car Cooling Products for Dogs', url: '/cooling/car-cooling-for-dogs/' },
  { title: 'Best Cooling Mats for Dogs', url: '/cooling/cooling-mats/' },
  { title: 'Best Cooling Bandanas for Dogs', url: '/cooling/cooling-bandanas/' },
  { title: 'Best Cooling Vests for Dogs', url: '/cooling/cooling-vests/' },
  { title: 'Best Freezable Dog Toys', url: '/cooling/freezable-dog-toys/' },
  { title: 'Best Calming Products for Anxious Dogs', url: '/calming/best-calming-products-for-anxious-dogs/' },
  { title: 'Best ThunderShirt Alternatives for Dogs', url: '/calming/best-thundershirt-alternatives/' },
  { title: 'Best Calming Products for Car Anxiety in Dogs', url: '/calming/car-anxiety-for-dogs/' },
  { title: 'Best Calming Dog Beds', url: '/comforting/best-calming-dog-beds/' },
  { title: 'Best Orthopedic Dog Beds', url: '/comforting/best-orthopedic-dog-beds/' },
  // Article collectors
  { title: 'How to Keep a Dog Cool in a Car', url: '/cooling/keep-dog-cool-in-car/' },
  { title: 'How Hot Is Too Hot for Dogs?', url: '/cooling/how-hot-is-too-hot-for-dogs/' },
  { title: "Dog Road Trip Gear: Rhys's Cooling & Calming Kit for Long Drives", url: '/travel/dog-road-trip-gear/' },
  { title: 'How Much Do Dogs Sleep? What Rest Really Looks Like', url: '/comforting/how-much-do-dogs-sleep/' },
];

export async function GET() {
  return rss({
    title: 'Chill Dogs',
    description: 'Gear, guides, and picks for keeping your dog cool, calm, and comfortable.',
    site: SITE,
    items: feedItems.map(({ title, url }) => ({
      title,
      link: url,
    })),
  });
}
