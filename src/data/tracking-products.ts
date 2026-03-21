export type TrackerType = 'cellular' | 'off-grid' | 'bluetooth';

export interface TrackerProduct {
  id: string;
  name: string;
  type: TrackerType;
  use_case: string;
  pros: string[];
  cons: string[];
  best_for: string;
  affiliateUrl: string;
  /** Short bullets for cards (3 items) */
  bullets: [string, string, string];
  /** One-line signal / range summary */
  signalNote: string;
  /** Monthly fee if any */
  subscriptionNote?: string;
  /** Optional badge label (e.g. "Best Value") */
  badge?: string;
}

export const trackerProducts: TrackerProduct[] = [
  // ── Cellular ──────────────────────────────────────────────────────────────
  {
    id: 'fi-series-3',
    name: 'Fi Series 3+ GPS Collar',
    type: 'cellular',
    use_case: 'Everyday city and suburban use, travel, dog parks',
    pros: [
      'Real-time location on LTE nationwide network',
      'Escape alerts and safe-zone geofencing',
      'Slim, lightweight, waterproof (IP68)',
      'Step counting, activity data, and health monitoring included',
      '12-month membership included — best value for year-one cost',
    ],
    cons: [
      'Requires cell signal — unreliable in remote or no-service areas',
      'Annual or monthly subscription required after first year',
      'Battery life shorter in heavy real-time tracking mode',
    ],
    best_for: 'Dogs in cities, suburbs, or areas with reliable cell coverage — the best value GPS + LTE collar for most owners',
    affiliateUrl: 'https://www.amazon.com/dp/B0FH8GDBLX/?tag=chill-dogs-20',
    bullets: [
      'LTE cellular tracking with nationwide coverage',
      'Real-time escape alerts and geofence zones',
      '12-month membership included; not reliable off-grid',
    ],
    signalNote: 'Requires LTE cell signal',
    subscriptionNote: 'Annual subscription required (12-month membership included)',
    badge: 'Best Value',
  },
  {
    id: 'fi-mini',
    name: 'Fi Mini GPS Tracker',
    type: 'cellular',
    use_case: 'Lightweight everyday tracking for smaller or active dogs',
    pros: [
      'Compact collar attachment — lighter than full collar',
      'LTE GPS tracking with escape alerts',
      'Virtual fences and step tracking',
      'Waterproof; 6-month membership included',
    ],
    cons: [
      'Requires cell signal — no off-grid capability',
      'Subscription required after included membership',
      'Collar attachment style may not suit all collar types',
    ],
    best_for: 'Owners who want GPS tracking with a lighter, more compact form factor',
    affiliateUrl: 'https://www.amazon.com/dp/B0FMGRT8YK/?tag=chill-dogs-20',
    bullets: [
      'Compact GPS collar attachment — not a full collar',
      'LTE tracking, escape alerts, virtual fences',
      '6-month membership included; requires subscription after',
    ],
    signalNote: 'Requires LTE cell signal',
    subscriptionNote: 'Subscription required (6-month membership included)',
  },
  // ── Off-Grid ──────────────────────────────────────────────────────────────
  {
    id: 'garmin-alpha-tt25',
    name: 'Garmin Alpha TT 25 Tracking Collar',
    type: 'off-grid',
    use_case: 'Hiking, hunting, backcountry, remote wilderness',
    pros: [
      'GPS + VHF radio — works with zero cell signal',
      'Tracks up to 20 dogs simultaneously',
      'Range up to 9 miles line-of-sight',
      'Pairs with Garmin Alpha handheld for full off-grid system',
      'No monthly subscription after purchase',
    ],
    cons: [
      'High upfront cost (collar + handheld purchased separately)',
      'Heavier collar than cellular lifestyle options',
      'Requires compatible Garmin handheld device — not phone-only',
      'Learning curve for setup and pairing',
    ],
    best_for: 'Hunters, hikers, and anyone who takes dogs into true wilderness with no cell signal',
    affiliateUrl: 'https://www.amazon.com/dp/B0BYGGBLKM/?tag=chill-dogs-20',
    bullets: [
      'GPS + VHF radio; works with no cell signal at all',
      'Up to 9-mile range; pairs with Alpha 300i handheld',
      'No subscription; requires dedicated handheld device',
    ],
    signalNote: 'GPS satellite + VHF radio — no cell required',
  },
  {
    id: 'garmin-alpha-300i',
    name: 'Garmin Alpha 300i Handheld',
    type: 'off-grid',
    use_case: 'Off-grid dog tracking controller with inReach satellite messaging',
    pros: [
      'GPS + VHF radio handheld with inReach satellite technology',
      'Two-way satellite messaging from anywhere — no cell required',
      'Controls Alpha TT 25 collar for complete off-grid system',
      'Tracks up to 20 dogs on one display',
      'No monthly tracking subscription (inReach plan separate)',
    ],
    cons: [
      'High upfront cost for the complete system (collar sold separately)',
      'inReach messaging requires a separate Garmin satellite plan',
      'Larger and heavier than a smartphone',
      'Overkill for casual hiking near populated trails',
    ],
    best_for: 'Remote wilderness and backcountry use where both dog tracking and human safety communication matter',
    affiliateUrl: 'https://www.amazon.com/dp/B0BW4X784G/?tag=chill-dogs-20',
    bullets: [
      'VHF + inReach satellite handheld — the off-grid tracking controller',
      'Two-way satellite messaging in true wilderness',
      'Pairs with Alpha TT 25 collar; no cell required',
    ],
    signalNote: 'GPS satellite + VHF radio + inReach satellite — no cell required',
  },
  // ── Bluetooth ─────────────────────────────────────────────────────────────
  {
    id: 'apple-airtag',
    name: 'Apple AirTag (2nd Generation)',
    type: 'bluetooth',
    use_case: 'Backup tag for city use, supplemental tracking',
    pros: [
      'Very affordable per tag',
      'Uses Apple Find My network (crowd-sourced)',
      'Tiny and light — fits in a collar pouch or tag holder',
      'No subscription required',
      'Up to 1.5× Precision Finding range (2nd gen)',
    ],
    cons: [
      'Not real GPS — only updates when near Apple devices',
      'Unreliable if dog runs far from populated areas',
      'Passive — no escape alerts or geofencing',
      'Android users cannot use the Find My network',
      'Requires a separate collar attachment',
    ],
    best_for: 'City dogs as a backup layer, or supplementing an existing GPS collar setup',
    affiliateUrl: 'https://www.amazon.com/dp/B0GJTFXNRX/?tag=chill-dogs-20',
    bullets: [
      'Crowd-sourced Bluetooth via Apple Find My — not true GPS',
      'Reliable only in populated areas with Apple devices nearby',
      'Best as a backup layer; not a standalone tracker',
    ],
    signalNote: 'Bluetooth + crowd-sourced Apple Find My network',
  },
  {
    id: 'tile-mate',
    name: 'Life360 Tile Bluetooth Tracker',
    type: 'bluetooth',
    use_case: 'Backup tag for Android and mixed-platform households',
    pros: [
      'Works on both iOS and Android',
      'Affordable with no required subscription',
      'Uses Tile / Life360 community network',
      'Small and light',
    ],
    cons: [
      'Smaller crowd network than Apple Find My',
      'No real-time GPS tracking',
      'Passive — relies entirely on other Tile users nearby',
      'Not useful in remote or rural areas',
    ],
    best_for: 'Android users wanting a simple backup tag for city use',
    affiliateUrl: 'https://www.amazon.com/dp/B0D63573CF/?tag=chill-dogs-20',
    bullets: [
      'Bluetooth crowd-sourced; works on iOS and Android',
      'Smaller network than AirTag — less reliable in sparse areas',
      'Affordable backup option; not a GPS replacement',
    ],
    signalNote: 'Bluetooth + crowd-sourced Tile network',
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
      'Cellular trackers use the nationwide LTE network to show real-time location on your phone. They work great in cities, suburbs, and most parks — and Fi is the best value option for most owners. They depend entirely on cell signal though: no signal means no tracking.',
  },
  'off-grid': {
    title: 'Off-Grid GPS Systems (Garmin)',
    description:
      'GPS + radio tracking that works in true wilderness with no cell signal required.',
    intro:
      "Garmin's Alpha system combines GPS satellites with VHF radio to track dogs regardless of cell coverage. The Alpha TT 25 collar pairs with the Alpha 300i handheld for a complete off-grid system. They require dedicated hardware but will work anywhere you can see the sky.",
  },
  bluetooth: {
    title: 'Bluetooth Tags (AirTag / Tile)',
    description:
      'Crowd-sourced Bluetooth tags — affordable but not real GPS tracking.',
    intro:
      'Bluetooth tags like AirTag and Tile are not GPS trackers. They update location only when another device in the crowd-sourced network passes nearby. They can be useful as a backup layer in dense cities, but they are not a reliable standalone solution.',
  },
};
