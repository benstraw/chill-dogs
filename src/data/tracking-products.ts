export type TrackerType = 'cellular' | 'off-grid' | 'bluetooth';

export interface TrackerProduct {
  id: string;
  name: string;
  type: TrackerType;
  asin: string;
  /** Full Amazon affiliate URL */
  amazonUrl: string;
  /** For system bundles: secondary product Amazon URL (e.g. Garmin handheld) */
  secondaryUrl?: string;
  secondaryLabel?: string;
  use_case: string;
  pros: string[];
  cons: string[];
  best_for: string;
  /** Short bullets for cards (3 items) */
  bullets: [string, string, string];
  /** One-line signal / range summary */
  signalNote: string;
  /** Monthly fee if any */
  subscriptionNote?: string;
  /** Product image from Amazon CDN */
  image?: { src: string; alt: string };
}

export interface AccessoryProduct {
  id: string;
  name: string;
  asin: string;
  amazonUrl: string;
  note: string;
  image?: { src: string; alt: string };
}

export const trackerProducts: TrackerProduct[] = [
  // ── Cellular ──────────────────────────────────────────────────────────────
  {
    id: 'fi-series-3-plus',
    name: 'Fi Series 3+ GPS Collar (12-mo membership)',
    type: 'cellular',
    asin: 'B0FH8GDBLX',
    amazonUrl: 'https://www.amazon.com/dp/B0FH8GDBLX?tag=chill-dogs-20',
    use_case: 'Everyday city and suburban use, travel, dog parks',
    pros: [
      'Real-time location on LTE nationwide network',
      'Escape alerts and safe-zone geofencing',
      'Slim, lightweight, IP68 waterproof',
      'Step counting and activity data included',
      '12-month membership included — best per-month value',
    ],
    cons: [
      'Requires cell signal — unreliable in remote or no-service areas',
      'Ongoing subscription after first year',
      'Battery life shorter in heavy-tracking mode',
    ],
    best_for: 'Dogs in cities, suburbs, or areas with reliable cell coverage',
    bullets: [
      'LTE cellular tracking with nationwide coverage',
      'Real-time escape alerts and geofence zones',
      '12-mo membership included; not reliable off-grid',
    ],
    signalNote: 'Requires LTE cell signal',
    subscriptionNote: 'Subscription required after included 12 months',
    image: {
      src: 'https://m.media-amazon.com/images/I/718qv1ME25L._AC_SL1500_.jpg',
      alt: 'Fi Series 3+ GPS dog collar on white background',
    },
  },
  {
    id: 'fi-mini',
    name: 'Fi Mini GPS Collar (6-mo membership)',
    type: 'cellular',
    asin: 'B0FMGRT8YK',
    amazonUrl: 'https://www.amazon.com/dp/B0FMGRT8YK?tag=chill-dogs-20',
    use_case: 'Smaller dogs, lightweight everyday tracking',
    pros: [
      'Lighter and more compact than standard Fi',
      'Same LTE network and app as Fi Series 3+',
      'Real-time escape alerts and geofencing',
      '6-month membership included',
    ],
    cons: [
      'Requires cell signal — same LTE limitations as all cellular trackers',
      'Shorter included membership period than Series 3+',
      'Not suitable for backcountry or no-signal terrain',
    ],
    best_for: 'Small to medium dogs where collar bulk is a concern',
    bullets: [
      'Compact LTE tracker — lighter than standard Fi',
      'Same real-time escape alerts and geofence app',
      '6-mo membership included; subscription continues after',
    ],
    signalNote: 'Requires LTE cell signal',
    subscriptionNote: 'Subscription required after included 6 months',
    image: {
      src: 'https://m.media-amazon.com/images/I/61mN2O0yhaL._AC_SL1500_.jpg',
      alt: 'Fi Mini GPS dog collar on white background',
    },
  },
  {
    id: 'garmin-alpha-lte',
    name: 'Garmin Alpha LTE',
    type: 'cellular',
    asin: 'B0D79WDP16',
    amazonUrl: 'https://www.amazon.com/dp/B0D79WDP16?tag=chill-dogs-20',
    use_case: 'Hybrid tracking: cellular coverage with VHF radio fallback',
    pros: [
      'Cellular LTE + VHF radio in one collar',
      'Switches to VHF when cell signal drops',
      'Works with Garmin Alpha handheld via radio',
      'No monthly subscription for off-grid radio mode',
    ],
    cons: [
      'Requires Garmin handheld to use radio mode',
      'Premium price for the hybrid system',
      'Bulkier than lifestyle collars like Fi',
    ],
    best_for: 'Dogs that go between urban areas and remote terrain regularly',
    bullets: [
      'Hybrid: LTE cellular in coverage + VHF radio when it drops',
      'Works with Garmin Alpha handheld in radio mode',
      'Subscription for LTE; no subscription for radio mode',
    ],
    signalNote: 'LTE cellular + VHF radio fallback',
    subscriptionNote: 'Subscription required for LTE tracking',
    image: {
      src: 'https://m.media-amazon.com/images/I/710yMxkF3ML._AC_SL1500_.jpg',
      alt: 'Garmin Alpha LTE GPS dog tracking collar on white background',
    },
  },
  // ── Off-Grid ──────────────────────────────────────────────────────────────
  {
    id: 'garmin-alpha-tt25-system',
    name: 'Garmin Alpha TT 25 + 300i System',
    type: 'off-grid',
    asin: 'B0BYGGBLKM',
    amazonUrl: 'https://www.amazon.com/dp/B0BYGGBLKM?tag=chill-dogs-20',
    secondaryUrl: 'https://www.amazon.com/dp/B0BW4X784G?tag=chill-dogs-20',
    secondaryLabel: 'Shop Alpha 300i Handheld on Amazon',
    use_case: 'Hiking, hunting, backcountry, remote wilderness',
    pros: [
      'GPS + VHF radio — works with zero cell signal',
      'Tracks up to 20 dogs simultaneously',
      'Range up to 9 miles line-of-sight',
      'Dedicated Alpha 300i handheld display',
      'No monthly subscription after purchase',
      'Rugged and waterproof for field conditions',
    ],
    cons: [
      'High upfront cost (collar sold separately from handheld)',
      'Heavier collar than cellular options',
      'Requires dedicated handheld device — not just a phone app',
      'Learning curve for setup and pairing',
    ],
    best_for: 'Hunters, hikers, and anyone who takes dogs into true wilderness',
    bullets: [
      'GPS + VHF radio; works with no cell signal at all',
      'Up to 9-mile range; tracks up to 20 dogs',
      'No subscription; collar and 300i handheld sold separately',
    ],
    signalNote: 'GPS satellite + VHF radio — no cell required',
    image: {
      src: 'https://m.media-amazon.com/images/I/61DPIt365qL._AC_SL1500_.jpg',
      alt: 'Garmin Alpha TT 25 dog tracking collar and Alpha 300i handheld on white background',
    },
  },
  // ── Bluetooth ─────────────────────────────────────────────────────────────
  {
    id: 'apple-airtag-2nd-gen',
    name: 'Apple AirTag 2nd Generation (1-pack)',
    type: 'bluetooth',
    asin: 'B0GJTXVN9Z',
    amazonUrl: 'https://www.amazon.com/dp/B0GJTXVN9Z?tag=chill-dogs-20',
    use_case: 'Backup tag for city use, supplemental tracking',
    pros: [
      'Very affordable — no subscription required',
      'Uses Apple Find My network (crowd-sourced)',
      'Tiny and light — fits in a collar pouch or tag holder',
      'Updated 2nd generation hardware',
    ],
    cons: [
      'Not real GPS — only updates when near Apple devices',
      'Unreliable if dog runs far from populated areas',
      'Passive — no escape alerts or geofencing',
      'Android users cannot use the Find My network',
      'Requires a separate collar attachment',
    ],
    best_for: 'City dogs as a backup, or supplementing an existing collar setup',
    bullets: [
      'Crowd-sourced Bluetooth via Apple Find My — not true GPS',
      'Reliable only in populated areas with Apple devices nearby',
      'Best as a backup layer; not a standalone tracker',
    ],
    signalNote: 'Bluetooth + crowd-sourced Apple Find My network',
    image: {
      src: 'https://m.media-amazon.com/images/I/611DjYhflAL._AC_SL1500_.jpg',
      alt: 'Apple AirTag 2nd generation on white background',
    },
  },
  {
    id: 'tile-2pack',
    name: 'Tile 2-Pack (Life360)',
    type: 'bluetooth',
    asin: 'B0D63573CF',
    amazonUrl: 'https://www.amazon.com/dp/B0D63573CF?tag=chill-dogs-20',
    use_case: 'Backup tag for Android and mixed-platform households',
    pros: [
      'Works on both iOS and Android',
      'Two tags for the price of one',
      'No required subscription for basic tracking',
      'Uses Tile community network (part of Life360)',
      'Small and light',
    ],
    cons: [
      'Smaller crowd network than Apple Find My',
      'No real-time GPS tracking',
      'Passive — relies entirely on other Tile users nearby',
      'Not useful in remote or rural areas',
    ],
    best_for: 'Android users wanting a simple backup tag for city use',
    bullets: [
      'Bluetooth crowd-sourced; works on iOS and Android',
      'Two tags included; Life360 network integration',
      'Affordable backup option; not a GPS replacement',
    ],
    signalNote: 'Bluetooth + crowd-sourced Tile/Life360 network',
    image: {
      src: 'https://m.media-amazon.com/images/I/71ZlAqo0ElL._AC_SL1500_.jpg',
      alt: 'Tile 2-pack Bluetooth trackers on white background',
    },
  },
];

export const accessoryProducts: AccessoryProduct[] = [
  {
    id: 'stunt-puppy-fi-collar',
    name: 'Stunt Puppy Fi-Ready Collar',
    asin: 'B0CJZVYP97',
    amazonUrl: 'https://www.amazon.com/dp/B0CJZVYP97?tag=chill-dogs-20',
    note: 'A collar designed to work with Fi Series 3 and 3+ devices',
    image: {
      src: 'https://m.media-amazon.com/images/I/61xbJD5bMoL._AC_SL1500_.jpg',
      alt: 'Stunt Puppy Fi-Ready dog collar on white background',
    },
  },
];

export function getTrackersByType(type: TrackerType): TrackerProduct[] {
  return trackerProducts.filter((p) => p.type === type);
}

export const trackerCategoryMeta: Record<
  TrackerType,
  { title: string; description: string; intro: string }
> = {
  cellular: {
    title: 'Cellular GPS Trackers',
    description: 'Real-time LTE tracking for dogs in areas with cell coverage.',
    intro:
      'Cellular trackers use the nationwide LTE network to show real-time location on your phone. They work great in cities, suburbs, and most parks — but they depend entirely on cell signal. No signal means no tracking. Fi makes the most popular cellular collars; Garmin Alpha LTE adds a VHF radio fallback for mixed-terrain use.',
  },
  'off-grid': {
    title: 'Off-Grid GPS Systems (Garmin)',
    description:
      'GPS + radio tracking that works in true wilderness with no cell signal required.',
    intro:
      "Off-grid systems like Garmin's Alpha line combine GPS satellites with VHF radio to track dogs regardless of cell coverage. The Alpha TT 25 collar pairs with the Alpha 300i handheld — sold separately — to create a complete off-grid system. They require a dedicated handheld device but will work anywhere you can see the sky.",
  },
  bluetooth: {
    title: 'Bluetooth Tags (AirTag / Tile)',
    description:
      'Crowd-sourced Bluetooth tags — affordable but not real GPS tracking.',
    intro:
      'Bluetooth tags like AirTag and Tile are not GPS trackers. They update location only when another device in the crowd-sourced network passes nearby. They can be useful as a backup layer in dense cities, but they are not a reliable standalone solution.',
  },
};
