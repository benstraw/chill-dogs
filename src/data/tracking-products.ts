export type TrackerType = 'cellular' | 'off-grid' | 'bluetooth';

export interface TrackerProduct {
  id: string;
  name: string;
  type: TrackerType;
  use_case: string;
  pros: string[];
  cons: string[];
  best_for: string;
  placeholder_url: string;
  /** Short bullets for cards (3 items) */
  bullets: [string, string, string];
  /** One-line signal / range summary */
  signalNote: string;
  /** Monthly fee if any */
  subscriptionNote?: string;
}

export const trackerProducts: TrackerProduct[] = [
  // ── Cellular ──────────────────────────────────────────────────────────────
  {
    id: 'fi-series-3',
    name: 'Fi Series 3 GPS Collar',
    type: 'cellular',
    use_case: 'Everyday city and suburban use, travel, dog parks',
    pros: [
      'Real-time location on LTE nationwide network',
      'Escape alerts and safe-zone geofencing',
      'Slim, lightweight, waterproof',
      'Step counting and activity data included',
    ],
    cons: [
      'Requires cell signal — unreliable in remote or no-service areas',
      'Monthly subscription required',
      'Battery life shorter in heavy-tracking mode',
    ],
    best_for: 'Dogs in cities, suburbs, or areas with reliable cell coverage',
    placeholder_url: '#fi-series-3',
    bullets: [
      'LTE cellular tracking with nationwide coverage',
      'Real-time escape alerts and geofence zones',
      'Subscription required; not reliable off-grid',
    ],
    signalNote: 'Requires LTE cell signal',
    subscriptionNote: 'Monthly subscription required',
  },
  {
    id: 'whistle-go-explore',
    name: 'Whistle Go Explore',
    type: 'cellular',
    use_case: 'Everyday tracking with health monitoring',
    pros: [
      'GPS + LTE tracking with nationwide coverage',
      'Health and activity monitoring built in',
      'Escape alerts',
      'Works well for suburban and urban dogs',
    ],
    cons: [
      'Requires cell signal — fails in remote terrain',
      'Monthly subscription required',
      'Bulkier than Fi on smaller dogs',
    ],
    best_for: 'Owners who want both tracking and health data in one device',
    placeholder_url: '#whistle-go-explore',
    bullets: [
      'GPS + LTE tracking plus health monitoring',
      'Nationwide coverage; subscription required',
      'Not suited for no-signal backcountry trips',
    ],
    signalNote: 'Requires LTE cell signal',
    subscriptionNote: 'Monthly subscription required',
  },
  // ── Off-Grid ──────────────────────────────────────────────────────────────
  {
    id: 'garmin-alpha-300',
    name: 'Garmin Alpha 300 System',
    type: 'off-grid',
    use_case: 'Hiking, hunting, backcountry, remote wilderness',
    pros: [
      'GPS + VHF radio — works with zero cell signal',
      'Tracks up to 20 dogs simultaneously',
      'Range up to 9 miles line-of-sight',
      'Dedicated handheld display device',
      'No monthly subscription after purchase',
    ],
    cons: [
      'High upfront cost (collar + handheld bundle)',
      'Heavier collar than cellular options',
      'Requires a handheld device — not just a phone app',
      'Learning curve for setup and pairing',
    ],
    best_for: 'Hunters, hikers, and anyone who takes dogs into true wilderness',
    placeholder_url: '#garmin-alpha-300',
    bullets: [
      'GPS + VHF radio; works with no cell signal at all',
      'Up to 9-mile range; tracks up to 20 dogs',
      'No subscription; requires dedicated handheld device',
    ],
    signalNote: 'GPS satellite + VHF radio — no cell required',
  },
  {
    id: 'garmin-trex-plus',
    name: 'Garmin T&REx Plus Collar',
    type: 'off-grid',
    use_case: 'Hunting dogs, field trials, remote hiking',
    pros: [
      'Long battery life (up to 80 hours)',
      'Rugged and waterproof for field conditions',
      'Works with Garmin Alpha handheld units',
      'No subscription required',
    ],
    cons: [
      'Requires compatible Garmin handheld to display location',
      'Larger and heavier than lifestyle collars',
      'Premium price for the full system',
    ],
    best_for: 'Hunting dogs and working dogs in remote terrain',
    placeholder_url: '#garmin-trex-plus',
    bullets: [
      'Up to 80-hour battery life in the field',
      'Works with Garmin Alpha handheld for off-grid tracking',
      'No subscription; designed for serious outdoor use',
    ],
    signalNote: 'GPS satellite + VHF radio — no cell required',
  },
  // ── Bluetooth ─────────────────────────────────────────────────────────────
  {
    id: 'apple-airtag',
    name: 'Apple AirTag',
    type: 'bluetooth',
    use_case: 'Backup tag for city use, supplemental tracking',
    pros: [
      'Very affordable (~$25–$35 per tag)',
      'Uses Apple Find My network (crowd-sourced)',
      'Tiny and light — fits in a collar pouch or tag holder',
      'No subscription required',
    ],
    cons: [
      'Not real GPS — only updates when near Apple devices',
      'Unreliable if dog runs far from populated areas',
      'Passive — no escape alerts or geofencing',
      'Android users cannot use the Find My network',
      'Requires a separate collar attachment',
    ],
    best_for: 'City dogs as a backup, or supplementing an existing collar setup',
    placeholder_url: '#apple-airtag',
    bullets: [
      'Crowd-sourced Bluetooth via Apple Find My — not true GPS',
      'Reliable only in populated areas with Apple devices nearby',
      'Best as a backup layer; not a standalone tracker',
    ],
    signalNote: 'Bluetooth + crowd-sourced Apple Find My network',
  },
  {
    id: 'tile-mate',
    name: 'Tile Mate',
    type: 'bluetooth',
    use_case: 'Backup tag for Android and mixed-platform households',
    pros: [
      'Works on both iOS and Android',
      'Affordable with no required subscription',
      'Uses Tile community network',
      'Small and light',
    ],
    cons: [
      'Smaller crowd network than Apple Find My',
      'No real-time GPS tracking',
      'Passive — relies entirely on other Tile users nearby',
      'Not useful in remote or rural areas',
    ],
    best_for: 'Android users wanting a simple backup tag for city use',
    placeholder_url: '#tile-mate',
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
      'Cellular trackers use the nationwide LTE network to show real-time location on your phone. They work great in cities, suburbs, and most parks — but they depend entirely on cell signal. No signal means no tracking.',
  },
  'off-grid': {
    title: 'Off-Grid GPS Systems (Garmin)',
    description:
      'GPS + radio tracking that works in true wilderness with no cell signal required.',
    intro:
      "Off-grid systems like Garmin's Alpha and TRex lines combine GPS satellites with VHF radio to track dogs regardless of cell coverage. They require a dedicated handheld device but will work anywhere you can see the sky.",
  },
  bluetooth: {
    title: 'Bluetooth Tags (AirTag / Tile)',
    description:
      'Crowd-sourced Bluetooth tags — affordable but not real GPS tracking.',
    intro:
      'Bluetooth tags like AirTag and Tile are not GPS trackers. They update location only when another device in the crowd-sourced network passes nearby. They can be useful as a backup layer in dense cities, but they are not a reliable standalone solution.',
  },
};
