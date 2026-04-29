export type ProductCategory =
  | 'cooling-mats'
  | 'cooling-bandanas'
  | 'cooling-vests'
  | 'freezable-dog-toys'
  | 'car-cooling'
  | 'hydration';

export interface CoolingProduct {
  id: string;
  asin?: string;
  name: string;
  category: ProductCategory;
  amazonUrl: string;
  bullets: [string, string, string];
  bestFor: string;
  coolingMethod?: string;
  sizingNote?: string;
  image?: { src: string; alt: string };
  rhysApproved?: boolean;
}

export interface CategoryMeta {
  title: string;
  description: string;
  heroHeadline: string;
  introCopy: string;
  faqs: { question: string; answer: string }[];
  internalLinks: { label: string; href: string }[];
}

// ─── Products ────────────────────────────────────────────────────────

export const coolingProducts: CoolingProduct[] = [
  // Cooling Mats
  {
    id: 'green-pet-shop-cooling-pad',
    asin: 'B006NONHNE',
    name: 'The Green Pet Shop Cooling Pet Pad',
    category: 'cooling-mats',
    amazonUrl:
      'https://www.amazon.com/Green-Pet-Shop-Cooling-Large/dp/B006NONHNE/?tag=chill-dogs-20',
    bullets: [
      'Pressure-activated gel — no water, electricity, or refrigeration needed',
      'Recharges automatically after 15–20 minutes of non-use',
      'Lightweight and portable for travel, crates, or outdoor use',
    ],
    bestFor: 'Hassle-free cooling anywhere — just set it down and go',
    coolingMethod: 'Pressure-activated gel',
    sizingNote: 'Available in S, M, L, XL — measure your dog lying down',
    image: { src: 'https://m.media-amazon.com/images/I/71n1Mod8sRL._SL500_.jpg', alt: 'The Green Pet Shop Cooling Pet Pad' },
  },
  {
    id: 'kh-cool-bed-iii',
    asin: 'B003KK60R4',
    name: 'K&H Cool Bed III',
    category: 'cooling-mats',
    amazonUrl:
      'https://www.amazon.com/Pet-Products-Cool-Cooling-Large/dp/B003KK60R4/?tag=chill-dogs-20',
    bullets: [
      'Water-based core absorbs and dissipates body heat evenly',
      'Durable nylon exterior resists punctures from nails',
      'No electricity required — fill once and it stays cool for hours',
    ],
    bestFor: 'Large breeds that need sustained, even cooling',
    coolingMethod: 'Water-based absorption',
    sizingNote: 'Comes in S through XL — XL fits dogs up to 100 lbs',
    image: { src: 'https://m.media-amazon.com/images/I/61xAcMN3KJL._SL500_.jpg', alt: 'K&H Cool Bed III' },
  },
  {
    id: 'k9-ballistics-elevated-cooling-bed',
    asin: 'B0FHRNDP6F',
    name: 'K9 Ballistics Chew Proof Elevated Cooling Bed',
    category: 'cooling-mats',
    amazonUrl:
      'https://www.amazon.com/K9-Ballistics-Proof-Elevated-Cooling/dp/B0FHRNDP6F/?tag=chill-dogs-20',
    bullets: [
      'Chew-proof aluminum frame and 1200D ripstop ballistic fabric — built to outlast anxious chewers and diggers',
      'Elevated design lifts dogs off hot floors for passive airflow cooling beneath their body',
      'Pre-assembled and crate-ready — slides through a wire crate door at an angle, no tools needed',
    ],
    bestFor: 'Aggressive chewers who need an indestructible elevated bed with passive cooling',
    coolingMethod: 'Elevated airflow — no padding, heat escapes underneath',
    sizingNote: 'S through XXL — check your crate\'s inner dimensions before ordering',
    image: { src: 'https://m.media-amazon.com/images/I/51U85OKm+1L._SL500_.jpg', alt: 'K9 Ballistics Chew Proof Elevated Cooling Dog Bed' },
    rhysApproved: true,
  },
  {
    id: 'arf-pets-self-cooling-mat',
    asin: 'B0192CJO30',
    name: 'Arf Pets Self Cooling Mat',
    category: 'cooling-mats',
    amazonUrl:
      'https://www.amazon.com/Arf-Pets-Cooling-Kennels-Crates/dp/B0192CJO30/?tag=chill-dogs-20',
    bullets: [
      'Non-toxic gel pad activates on contact — safe if chewed',
      'Foldable design fits kennels, crates, beds, and car seats',
      'Wipes clean easily with a damp cloth',
    ],
    bestFor: 'Crate training and car travel in hot weather',
    coolingMethod: 'Pressure-activated gel',
    sizingNote: 'Multiple sizes — pick one that matches your crate dimensions',
    image: { src: 'https://m.media-amazon.com/images/I/71JPOml6KrL._SL500_.jpg', alt: 'Arf Pets Self Cooling Mat' },
  },

  // Cooling Bandanas
  {
    id: 'afp-chill-out-ice-bandana',
    asin: 'B00IAR9WCM',
    name: 'All For Paws Chill Out Ice Bandana',
    category: 'cooling-bandanas',
    amazonUrl:
      'https://www.amazon.com/All-Paws-Chill-Bandana-Large/dp/B00IAR9WCM/?tag=chill-dogs-20',
    bullets: [
      'Soak in water for 1 minute — stays cool for up to an hour',
      'Inner ice-pack pocket for extra-hot days',
      "Lightweight fabric that dries quickly and won't weigh your dog down",
    ],
    bestFor: 'Quick walks and outdoor play on warm days',
    coolingMethod: 'Evaporative + optional ice pack',
    sizingNote: 'S/M and L/XL — measure around the base of the neck',
    image: { src: 'https://m.media-amazon.com/images/I/611AOa13OFL._SL500_.jpg', alt: 'All For Paws Chill Out Ice Bandana' },
  },
  {
    id: 'kyeese-cooling-bandanas',
    asin: 'B09N35XX2C',
    name: 'KYEESE Dog Instant Cooling Bandanas (2-Pack)',
    category: 'cooling-bandanas',
    amazonUrl:
      'https://www.amazon.com/KYEESE-Bandanas-Breathable-Triangle-Adjustable/dp/B09N35XX2C/?tag=chill-dogs-20',
    bullets: [
      'Instant cooling when wet — just soak, wring, and snap on',
      '2-pack so you always have a fresh one ready to swap',
      'Adjustable snap closure fits necks up to 20 inches',
    ],
    bestFor: 'Small to medium dogs on daily summer walks',
    coolingMethod: 'Evaporative cooling',
    sizingNote: 'Fits necks up to 20 inches — best for small/medium breeds',
    image: { src: 'https://m.media-amazon.com/images/I/71yNibhBnRS._SL500_.jpg', alt: 'KYEESE Dog Instant Cooling Bandanas (2-Pack)' },
  },

  // Cooling Vests
  {
    id: 'ruffwear-swamp-cooler',
    asin: 'B09MSMSP69',
    name: 'Ruffwear Swamp Cooler Dog Cooling Vest',
    category: 'cooling-vests',
    amazonUrl:
      'https://www.amazon.com/RUFFWEAR-Evaporative-Cooling-Compatible-Harnesses/dp/B09MSMSP69/?tag=chill-dogs-20',
    bullets: [
      'Three-layer evaporative design wicks heat away for hours',
      'UPF 50+ sun protection on the back and sides',
      'Compatible with Ruffwear harnesses — clip a leash right on top',
    ],
    bestFor: 'Hiking, trail running, and all-day outdoor adventures',
    coolingMethod: 'Evaporative (soak, wring, wear)',
    sizingNote: 'Sized XXS through XL — use Ruffwear\'s girth measurement chart',
    image: { src: 'https://m.media-amazon.com/images/I/71CjrUbyTWL._SL500_.jpg', alt: 'Ruffwear Swamp Cooler Dog Cooling Vest' },
  },
  {
    id: 'kurgo-core-cooling-vest',
    asin: 'B06VT1VDZX',
    name: 'Kurgo Core Cooling Vest',
    category: 'cooling-vests',
    amazonUrl:
      'https://www.amazon.com/Kurgo-Core-Cooling-Reflective-Small/dp/B06VT1VDZX/?tag=chill-dogs-20',
    bullets: [
      'Evaporative mesh cools your dog as air flows through',
      'Reflective trim for visibility on early-morning or evening walks',
      'Hook-and-loop closure adjusts to most body shapes',
    ],
    bestFor: 'Budget-friendly everyday cooling on walks and errands',
    coolingMethod: 'Evaporative mesh',
    sizingNote: 'S, M, L — measure chest girth for the best fit',
    image: { src: 'https://m.media-amazon.com/images/I/81Dk2mMHkhL._SL500_.jpg', alt: 'Kurgo Core Cooling Vest' },
  },
  {
    id: 'canada-pooch-chill-seeker',
    asin: 'B009JLQCUI',
    name: 'Canada Pooch Chill Seeker Cooling Vest',
    category: 'cooling-vests',
    amazonUrl:
      'https://www.amazon.com/Canada-Pooch-Chill-Seeker-Cooling/dp/B009JLQCUI/?tag=chill-dogs-20',
    bullets: [
      'Stylish design',
      'Moisture-activated cooling lasts through a full walk',
      'Lightweight enough that most dogs forget they\'re wearing it',
    ],
    bestFor: 'Pet owners who want function and fashion',
    coolingMethod: 'Evaporative cooling',
    sizingNote: 'Runs slightly small — size up if your dog is between sizes',
    image: { src: 'https://m.media-amazon.com/images/I/81ZAyuCF-sL._SL500_.jpg', alt: 'Canada Pooch Chill Seeker Cooling Vest' },
  },

  // Freezable Toys
  {
    id: 'kong-classic',
    asin: 'B000AYN7LU',
    name: 'KONG Classic Dog Toy',
    category: 'freezable-dog-toys',
    amazonUrl:
      'https://www.amazon.com/KONG-Classic-Durable-Natural-Rubber/dp/B000AYN7LU/?tag=chill-dogs-20',
    bullets: [
      'Stuff with peanut butter or wet food and freeze for hours of cool fun',
      'Nearly indestructible natural rubber stands up to heavy chewers',
      'Unpredictable bounce keeps dogs mentally engaged',
    ],
    bestFor: 'Heavy chewers who need long-lasting enrichment',
    coolingMethod: 'Freeze stuffing inside',
    image: { src: 'https://m.media-amazon.com/images/I/61eVAqrR7uL._SL500_.jpg', alt: 'KONG Classic Dog Toy' },
  },
  {
    id: 'petsafe-chilly-penguin',
    asin: 'B0G1NDQQYF',
    name: 'PetSafe Chilly Penguin',
    category: 'freezable-dog-toys',
    amazonUrl:
      'https://www.amazon.com/PetSafe-Freezable-Holding-Chilly-Penguin/dp/B0G1NDQQYF/?tag=chill-dogs-20',
    bullets: [
      'Fill with water and freeze — Cool water is released as it thaws',
      'Dishwasher-safe for easy cleanup',
      'Fun shape encourages interactive play and licking',
    ],
    bestFor: 'Dogs who love to lick and need gentle hydration encouragement',
    coolingMethod: 'Frozen water release',
    image: { src: 'https://m.media-amazon.com/images/I/7196xcBelQL._SL500_.jpg', alt: 'PetSafe Chilly Penguin' },
  },

  // Car Cooling
  {
    id: 'enovoe-car-window-shades',
    asin: 'B0BTV5YVFR',
    name: 'Enovoe Magnetic Car Window Shades (4-Pack)',
    category: 'car-cooling',
    amazonUrl:
      'https://www.amazon.com/dp/B0BTV5YVFR/?tag=chill-dogs-20',
    bullets: [
      'Magnetic edges stick directly to the car door frame — no clips, no suction cups',
      'Blocks UV rays and cuts cabin temperature significantly on sunny drives',
      'Folds flat for storage; quick to attach and remove at rest stops',
    ],
    bestFor: 'Blocking direct sun from back-seat windows on hot road trips',
    coolingMethod: 'Passive sun and UV blocking',
    sizingNote: 'Universal fit — covers most standard rear side windows',
    image: { src: 'https://m.media-amazon.com/images/I/61GEGcE92WL._SL500_.jpg', alt: 'Enovoe Magnetic Car Window Shades (4-Pack)' },
  },
  {
    id: 'onlynew-portable-fan',
    asin: 'B0BRPZR3CZ',
    name: 'ONLYNEW Portable Rechargeable Fan',
    category: 'car-cooling',
    amazonUrl:
      'https://www.amazon.com/dp/B0BRPZR3CZ/?tag=chill-dogs-20',
    bullets: [
      '20000mAh rechargeable battery runs 10–30 hours on a single charge — no car USB port needed',
      '4 speed settings with a quiet brushless motor (≤30dB); USB-C charges in 3–5 hours',
      'Foldable hook hangs from a headrest, cargo bar, or tent; 270° rotating air outlet',
    ],
    bestFor: 'Road trips and camping where a reliable power source isn\'t guaranteed',
    coolingMethod: 'Active airflow — portable rechargeable fan',
    sizingNote: 'One size; compact enough to fit in a backpack or door panel',
    image: { src: 'https://m.media-amazon.com/images/I/71aPhAz-VlL._SL500_.jpg', alt: 'ONLYNEW Portable Rechargeable Fan' },
  },
  {
    id: 'ohmo-spill-proof-bowl',
    asin: 'B0C9TX38RZ',
    name: 'OHMO Spill Proof Collapsible Dog Water Bowl',
    category: 'car-cooling',
    amazonUrl:
      'https://www.amazon.com/dp/B0C9TX38RZ/?tag=chill-dogs-20',
    bullets: [
      'Spill-proof design keeps water in the bowl during bumpy car rides',
      'Collapses flat for easy storage in a door panel, console, or travel bag',
      'Dishwasher-safe and holds 24 oz — practical for medium and large dogs',
    ],
    bestFor: 'In-car hydration that stays in the bowl instead of on the seat',
    coolingMethod: 'Hydration support',
    sizingNote: '24 oz capacity; works well for medium to large dogs',
    image: { src: 'https://m.media-amazon.com/images/I/61rhiId91LL._SL500_.jpg', alt: 'OHMO Spill Proof Collapsible Dog Water Bowl' },
  },
  {
    id: 'four-knines-seat-hammock',
    asin: 'B0CLVCMLCK',
    name: '4Knines Dog Seat Cover Hammock',
    category: 'car-cooling',
    amazonUrl:
      'https://www.amazon.com/dp/B0CLVCMLCK/?tag=chill-dogs-20',
    bullets: [
      'Hammock style prevents your dog from tumbling into the footwell on long drives',
      'Waterproof quilted surface stays cooler than bare upholstery or vinyl seats',
      'Anchors to headrests front and back — no tools needed',
    ],
    bestFor: 'Keeping dogs stable, cool, and off hot leather seats',
    coolingMethod: 'Surface insulation from hot upholstery',
    sizingNote: 'Standard and XL fit most sedans, SUVs, and trucks',
    image: { src: 'https://m.media-amazon.com/images/I/81ypdd26KKL._SL500_.jpg', alt: '4Knines Dog Seat Cover Hammock' },
  },

  // ── Hydration ─────────────────────────────────────────────────────────

  {
    id: 'ohmo-spill-proof-dog-bowl',
    asin: 'B0C9TX38RZ',
    name: 'OHMO Spill Proof Collapsible Dog Water Bowl',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B0C9TX38RZ/?tag=chill-dogs-20',
    bullets: [
      'Raised inner lip catches sloshing water and returns it to the bowl — less mess in cars and on bumpy trails',
      'Collapses flat for packing but holds its shape fully open under a dog\'s muzzle',
      '24 oz capacity handles most medium to large dogs between water stops',
    ],
    bestFor: 'Car travel and moving situations where a standard bowl tips or sloshes',
    coolingMethod: 'Spill-resistant collapsible bowl; 24 oz capacity',
    sizingNote: '24 oz; single size',
    rhysApproved: true,
    image: { src: 'https://m.media-amazon.com/images/I/61rhiId91LL._SL500_.jpg', alt: 'OHMO Spill Proof Collapsible Dog Water Bowl' },
  },
  {
    id: 'springer-flip-dog-water-bottle',
    asin: 'B0C15FWR7J',
    name: 'Springer Flip Portable Dog Water Bottle',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B0C15FWR7J/?tag=chill-dogs-20',
    bullets: [
      'Foldable silicone bowl flips out from the bottom of the bottle — no loose parts to lose on a trail',
      'Squeeze-to-dispense design fills the built-in bowl without pouring or wasting water',
      '20 oz capacity covers most dogs for a 30–60 minute walk in warm weather',
    ],
    bestFor: 'Active dogs on walks, hikes, and travel where a one-handed setup is useful',
    coolingMethod: 'Squeeze bottle with integrated foldable silicone bowl',
    sizingNote: '20 oz standard; also available in 25 oz',
    image: { src: 'https://m.media-amazon.com/images/I/71JwQQqdF2L._SL500_.jpg', alt: 'Springer Flip Portable Dog Water Bottle' },
  },
  {
    id: 'malsipree-dog-water-bottle',
    asin: 'B07C79C5BT',
    name: 'MalsiPree Dog Water Bottle Dispenser',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B07C79C5BT/?tag=chill-dogs-20',
    bullets: [
      'One-touch button releases water into the built-in trough; release button returns unused water to the bottle',
      'Leak-proof seal tested to 24 hours on its side — no wet bag on transit days',
      'BPA-free Tritan plastic; dishwasher-safe components for easy cleaning after use',
    ],
    bestFor: 'Travel days where water conservation and leak-proof carry matter most',
    coolingMethod: 'One-touch dispenser with return-water trough',
    sizingNote: '12 oz standard; also available in 20 oz',
    image: { src: 'https://m.media-amazon.com/images/I/71GjkitcmOL._SL500_.jpg', alt: 'MalsiPree Dog Water Bottle Dispenser' },
  },
  {
    id: 'highwave-autodogmug',
    asin: 'B00YNK9VPI',
    name: 'Highwave AutoDogMug',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B00YNK9VPI/?tag=chill-dogs-20',
    bullets: [
      'Squeeze the bottle to fill the top bowl — no buttons or latches; simplest operation available',
      'Top opening is deep enough for most dog muzzles, including longer snouts',
      'BPA-free and leak-resistant; widely used by hikers and dog owners for over a decade',
    ],
    bestFor: 'Dogs who drink from a wide bowl and owners who prefer the simplest possible mechanism',
    coolingMethod: 'Squeeze bottle with fixed top bowl',
    sizingNote: '20 oz; no other sizes',
    image: { src: 'https://m.media-amazon.com/images/I/61G7Jn3SxxL._SL500_.jpg', alt: 'Highwave AutoDogMug Portable Dog Water Bottle' },
  },
  {
    id: 'ollydog-ollybottle',
    asin: 'B0G52NDRZC',
    name: 'OllyDog OllyBottle',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B0G52NDRZC/?tag=chill-dogs-20',
    bullets: [
      'Silicone bowl detaches from the bottle and packs flat for easy storage in any bag pocket',
      'Leak-proof lid with a carabiner clip attaches to a pack or leash handle without a separate clip',
      'Double-wall stainless steel keeps water cooler longer on warm days than plastic alternatives',
    ],
    bestFor: 'Hikers and travelers who want a premium bottle with a detachable, packable bowl',
    coolingMethod: 'Bottle with detachable silicone bowl; stainless steel insulation',
    sizingNote: 'Available in multiple sizes; check current listing',
    image: { src: 'https://m.media-amazon.com/images/I/71gEYgCwZVL._SL500_.jpg', alt: 'OllyDog OllyBottle with Detachable Bowl' },
  },
  {
    id: 'asobu-buddy-bottle',
    asin: 'B085F39N2J',
    name: 'Asobu Buddy Bottle',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B085F39N2J/?tag=chill-dogs-20',
    bullets: [
      'Insulated stainless steel body keeps water cold for hours in warm weather',
      'Removable bowl is attached to the bottle bottom — no loose components to pack separately',
      'Dual-use design means both the dog and owner can drink from the same bottle',
    ],
    bestFor: 'Warm-weather outings where keeping water cold throughout the day matters',
    coolingMethod: 'Insulated stainless steel with attached bowl',
    sizingNote: '27 oz; single size',
    image: { src: 'https://m.media-amazon.com/images/I/61cL-UIATpL._SL500_.jpg', alt: 'Asobu Buddy Bottle Insulated with Bowl' },
  },
  {
    id: 'vapur-collapsible-dog-bottle',
    asin: 'B00BI9AM3C',
    name: 'Vapur Collapsible Water Bottle',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B00BI9AM3C/?tag=chill-dogs-20',
    bullets: [
      'Rolls flat when empty — takes up almost no bag space during transit to the trailhead or airport',
      'Wide-mouth opening makes filling from a water fountain or stream fast without a funnel',
      'Carabiner clip attaches to a pack strap or leash handle for hands-free carry',
    ],
    bestFor: 'Travelers and hikers who want a packable bottle that disappears when empty',
    coolingMethod: 'Collapsible flexible plastic; rolls flat when empty',
    sizingNote: '34 oz; also available in smaller sizes',
    image: { src: 'https://m.media-amazon.com/images/I/51ufvu1A7+L._SL500_.jpg', alt: 'Vapur Collapsible Water Bottle' },
  },
  {
    id: 'kurgo-zippy-collapsible-bowl',
    asin: 'B0GH81LJY9',
    name: 'Collapsible Travel Dog Bowl with Carabiner',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B0GH81LJY9/?tag=chill-dogs-20',
    bullets: [
      'Silicone collapses to under 1 inch thick — fits in any pocket or clipped to a leash handle',
      'Carabiner clip included; no separate hardware needed to attach to a pack or bag',
      'Dishwasher-safe and holds its shape under normal use without flipping or tipping',
    ],
    bestFor: 'Pairing with any water bottle as a lightweight, packable travel bowl',
    coolingMethod: 'Travel bowl; use with any portable water source',
    sizingNote: 'Single bowl; check listing for current capacity',
    image: { src: 'https://m.media-amazon.com/images/I/61+lG34h3IL._SL500_.jpg', alt: 'Collapsible Travel Dog Bowl with Carabiner' },
  },
  {
    id: 'slson-collapsible-dog-bowl',
    asin: 'B0FPX7YVDM',
    name: 'SLSON Collapsible Dog Bowl 2-Pack',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B0FPX7YVDM/?tag=chill-dogs-20',
    bullets: [
      'Two-pack lets you keep one for water and one for food during full travel days',
      'Macaron color silicone collapses flat and stacks for compact storage in any bag',
      'Soft silicone walls flex under a dog\'s nose without tipping the bowl',
    ],
    bestFor: 'Owners who want a water bowl and food bowl in one packable 2-pack',
    coolingMethod: 'Travel bowls; 2-pack includes water and food bowl options',
    sizingNote: 'Check current listing for available sizes',
    image: { src: 'https://m.media-amazon.com/images/I/61Bvzu5fHnL._SL500_.jpg', alt: 'SLSON Collapsible Dog Bowl 2-Pack' },
  },
  {
    id: 'petbonus-silicone-dog-bowls',
    asin: 'B0136OTK3Y',
    name: 'PetBonus 2-Pack Silicone Collapsible Dog Bowls',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B0136OTK3Y/?tag=chill-dogs-20',
    bullets: [
      'Flat-fold design collapses to less than half an inch — takes no meaningful bag space',
      'Carabiner on each bowl clips directly to a leash, bag strap, or belt loop',
      'BPA-free food-grade silicone; safe for both water and food service throughout a trip',
    ],
    bestFor: 'Keeping a dedicate water and food bowl clipped directly to your gear at all times',
    coolingMethod: 'Flat-fold collapsible silicone bowls with carabiner clips',
    sizingNote: '2-pack; multiple color options',
    image: { src: 'https://m.media-amazon.com/images/I/61ZllHjCBFL._SL500_.jpg', alt: 'PetBonus 2-Pack Silicone Collapsible Dog Bowls' },
  },
  {
    id: 'kytely-collapsible-dog-bowls',
    asin: 'B0GK1C7BLF',
    name: 'Kytely Large Collapsible Dog Bowls 2-Pack',
    category: 'hydration',
    amazonUrl: 'https://www.amazon.com/dp/B0GK1C7BLF/?tag=chill-dogs-20',
    bullets: [
      'Larger bowl diameter fits big dogs who need a wide drinking surface on rest stops',
      'Thick silicone walls keep the bowl open under a dog\'s muzzle without collapsing mid-drink',
      'Two-pack provides separate water and food bowls without buying two different products',
    ],
    bestFor: 'Medium to large dogs who need a wider, more stable collapsible bowl',
    coolingMethod: 'Large-diameter collapsible silicone bowls; 2-pack',
    sizingNote: 'Large; check listing for exact diameter',
    image: { src: 'https://m.media-amazon.com/images/I/61zFNvTfdbL._SL500_.jpg', alt: 'Kytely Large Collapsible Dog Bowls 2-Pack' },
  },

];

// ─── Helpers ─────────────────────────────────────────────────────────

export function getProductsByCategory(category: ProductCategory): CoolingProduct[] {
  return coolingProducts.filter((p) => p.category === category);
}

// ─── Category Meta ───────────────────────────────────────────────────

export const categoryMeta: Record<ProductCategory, CategoryMeta> = {
  'car-cooling': {
    title: 'Best Car Cooling Products for Dogs (2026)',
    description:
      'Keep your dog cool and comfortable on road trips with magnetic window shades, clip-on fans, collapsible bowls, and seat hammocks. Our top picks for every budget.',
    heroHeadline: 'The Best Car Cooling Setup for Dogs on the Road',
    introCopy:
      'Hot back seats are one of the biggest dangers for dogs on road trips. To help keep dogs safe, look to products that provide passive sun blocking, active airflow, quick hydration, and a cooler surface to lie on.',
    faqs: [
      {
        question: 'How do I keep my dog cool in the car without AC?',
        answer:
          'Combine passive and active methods: magnetic shades block the sun before heat builds up, a clip-on fan keeps air moving, and water from a collapsible bowl at every stop replaces fluids. On very hot days, schedule drives in the morning or evening.',
      },
      {
        question: 'Are magnetic window shades safe for dogs?',
        answer:
          'Yes — they attach to the door frame with magnets, not adhesive, so there is nothing to chew or swallow. They do block some visibility, so confirm your driver\'s sightlines are clear before driving.',
      },
      {
        question: 'Can I use a regular USB fan in the car?',
        answer:
          'You can, but a fan designed for cars (like the K&H clip-on) attaches more securely to headrests and includes power options for a 12V adapter. A regular desk fan can tip or fall at highway speed.',
      },
      {
        question: 'How often should I stop and offer water to my dog on a road trip?',
        answer:
          'Every 1–2 hours is a reasonable baseline, but dogs that are stressed, panting heavily, or in hot weather may need more frequent breaks. Always offer cool (not ice cold) water.',
      },
    ],
    internalLinks: [
      { label: 'Road Trip Chill Kit', href: '/travel/dog-road-trip-gear/' },
      { label: 'Cooling Mats', href: '/cooling/cooling-mats/' },
      { label: 'Cooling Vests', href: '/cooling/cooling-vests/' },
      { label: 'All Cooling Products', href: '/cooling/best-cooling-products-for-dogs/' },
    ],
  },
  'cooling-mats': {
    title: 'Best Cooling Mats for Dogs (2026)',
    description:
      'We compared the top dog cooling mats by material, durability, and overall value. Here are the 3 worth buying.',
    heroHeadline: 'The Best Cooling Mats to Keep Your Dog Comfortable',
    introCopy:
      'A good cooling mat gives your dog an instant cool-down spot — no electricity needed. We compared pressure-activated gel pads and water-based mats to find the best options.',
    faqs: [
      {
        question: 'Are cooling mats safe for dogs?',
        answer:
          'Yes. The gel and water-based mats on this list use non-toxic materials. Always supervise heavy chewers and inspect the mat regularly for punctures.',
      },
      {
        question: 'How long do cooling mats stay cold?',
        answer:
          'Gel mats typically stay cool for 1–3 hours of continuous use, then recharge on their own. Water-based mats like the K&H Cool Bed III can stay cool longer since the water absorbs more heat.',
      },
      {
        question: 'Can I put a cooling mat in a crate?',
        answer:
          'Absolutely — most mats are designed to fold or trim to fit standard crate sizes. The Arf Pets mat is especially good for crates.',
      },
    ],
    internalLinks: [
      { label: 'Cooling Bandanas', href: '/cooling/cooling-bandanas/' },
      { label: 'Cooling Vests', href: '/cooling/cooling-vests/' },
      { label: 'Freezable Toys', href: '/cooling/freezable-dog-toys/' },
      { label: 'All Cooling Products', href: '/cooling/best-cooling-products-for-dogs/' },
    ],
  },
  'cooling-bandanas': {
    title: 'Best Cooling Bandanas for Dogs (2026)',
    description:
      'Lightweight, affordable, and effective — these are the best cooling bandanas to keep your dog comfortable on hot walks.',
    heroHeadline: 'The Best Cooling Bandanas for Hot-Weather Walks',
    introCopy:
      'Cooling bandanas are the simplest way to take the edge off the heat. Soak, wring, tie, and go. We picked two standouts that stay cool and stay on.',
    faqs: [
      {
        question: 'How do cooling bandanas work?',
        answer:
          'Most use evaporative cooling — you soak them in water, wring them out, and the evaporation pulls heat away from your dog\'s neck. Some have pockets for ice packs.',
      },
      {
        question: 'How long do cooling bandanas last?',
        answer:
          'Typically 30 minutes to an hour in hot weather. Re-soak when they feel warm. The AFP Ice Bandana lasts longer thanks to its ice-pack pocket.',
      },
      {
        question: 'Are cooling bandanas safe for puppies?',
        answer:
          'Yes, as long as the bandana fits snugly without being too tight. Always supervise puppies to prevent chewing.',
      },
    ],
    internalLinks: [
      { label: 'Cooling Mats', href: '/cooling/cooling-mats/' },
      { label: 'Cooling Vests', href: '/cooling/cooling-vests/' },
      { label: 'Freezable Toys', href: '/cooling/freezable-dog-toys/' },
      { label: 'All Cooling Products', href: '/cooling/best-cooling-products-for-dogs/' },
    ],
  },
  'cooling-vests': {
    title: 'Best Cooling Vests for Dogs (2026)',
    description:
      'Evaporative cooling vests for hikes, walks, and outdoor play. We compared the best options by fit, cooling power, and durability to find the top picks.',
    heroHeadline: 'The Best Cooling Vests for Active Dogs',
    introCopy:
      'Cooling vests use evaporative technology to pull heat away from your dog\'s body. They\'re ideal for hikes, runs, and any extended time outside. We picked three that balance cooling power, fit, and durability.',
    faqs: [
      {
        question: 'Do cooling vests really work?',
        answer:
          'Yes — evaporative vests can lower surface temperature by several degrees. They work best in dry heat with some airflow. In humid climates, they\'re less effective.',
      },
      {
        question: 'How do I activate a cooling vest?',
        answer:
          'Soak the vest in cool water for 1–2 minutes, wring out the excess, and put it on your dog. Re-soak when it dries out.',
      },
      {
        question: 'Can my dog wear a harness with a cooling vest?',
        answer:
          'The Ruffwear Swamp Cooler is specifically designed to work with harnesses. Other vests may need the harness on top — test the fit before heading out.',
      },
      {
        question: 'How do I wash a cooling vest?',
        answer:
          'Most can be hand-washed with mild soap and air-dried. Check the label — machine washing can damage evaporative layers.',
      },
    ],
    internalLinks: [
      { label: 'Cooling Mats', href: '/cooling/cooling-mats/' },
      { label: 'Cooling Bandanas', href: '/cooling/cooling-bandanas/' },
      { label: 'Freezable Toys', href: '/cooling/freezable-dog-toys/' },
      { label: 'All Cooling Products', href: '/cooling/best-cooling-products-for-dogs/' },
    ],
  },
  'freezable-dog-toys': {
    title: 'Best Freezable Dog Toys (2026)',
    description:
      'Cool your dog down from the inside out. These freezable toys provide enrichment and relief on hot days.',
    heroHeadline: 'The Best Freezable Toys to Cool Down Your Dog',
    introCopy:
      'Freezable toys combine enrichment with cooling — stuff them, freeze them, and let your dog work for a cold treat.',
    faqs: [
      {
        question: 'What can I freeze inside a KONG?',
        answer:
          'Peanut butter (xylitol-free), plain yogurt, or wet dog food all work well. Freeze for at least 4 hours for a long-lasting challenge.',
      },
      {
        question: 'Are freezable toys safe for puppies?',
        answer:
          'Yes — the KONG Classic and Chilly Penguin are both safe for puppies. Use the KONG Puppy (softer rubber) for teething pups younger than 9 months old.',
      },
      {
        question: 'How long do frozen toys keep dogs busy?',
        answer:
          'A fully frozen KONG can last 20–45 minutes depending on the filling and your dog\'s determination. The Chilly Penguin will usually last 10–20 minutes.',
      },
    ],
    internalLinks: [
      { label: 'Cooling Mats', href: '/cooling/cooling-mats/' },
      { label: 'Cooling Bandanas', href: '/cooling/cooling-bandanas/' },
      { label: 'Cooling Vests', href: '/cooling/cooling-vests/' },
      { label: 'All Cooling Products', href: '/cooling/best-cooling-products-for-dogs/' },
    ],
  },
  hydration: {
    title: 'Best Dog Water Bottles and Travel Bowls (2026)',
    description:
      'Compare the best portable dog water bottles, squeeze dispensers, and collapsible travel bowls for walks, hikes, and travel days. Top picks for every carry style.',
    heroHeadline: 'Portable Dog Water Bottles and Travel Bowls',
    introCopy:
      'Keeping your dog hydrated on walks, hikes, and travel days comes down to having water accessible — not buried in a bag. Portable bottles with built-in dispensers and collapsible bowls solve that problem without adding meaningful weight or bulk.',
    faqs: [
      {
        question: 'What is the easiest type of dog water bottle to use on a walk?',
        answer:
          'Squeeze bottles with an integrated bowl — like the Springer Flip or MalsiPree — are the simplest one-handed option. You squeeze, the bowl fills, your dog drinks, you release to return unused water. No separate bowl to carry or manage. The Highwave AutoDogMug works the same way with a fixed top bowl. If you already have a water bottle you like, a carabiner-clip collapsible bowl paired with it achieves the same result at lower cost.',
      },
      {
        question: 'How much water does a dog need on a walk or hike?',
        answer:
          'A general baseline is about 1 oz of water per pound of body weight per day, but active dogs in warm weather need significantly more. On a summer hike, a 40 lb dog may drink 16–24 oz or more. Offer water at every rest stop rather than waiting for your dog to show signs of thirst — panting and seeking shade are signs they\'re already behind on fluids.',
      },
      {
        question: 'Can I use a human water bottle for my dog?',
        answer:
          'You can share water from a human bottle, but you\'ll need a separate bowl for most dogs to drink from effectively. Wide-mouth bottles like Vapur or Nalgene work when paired with a collapsible bowl. Bottles with integrated dispensers remove the need for a separate bowl entirely.',
      },
      {
        question: 'Do I need a collapsible bowl if my water bottle already has a dispenser?',
        answer:
          'Not necessarily. Built-in dispenser bottles (Springer Flip, MalsiPree, Highwave) handle both the water carry and the drinking surface in one unit. A separate collapsible bowl is most useful if you carry a standard bottle or want to offer water from a stream, tap, or water fountain without bringing a dispenser bottle.',
      },
    ],
    internalLinks: [
      { label: 'How to Fly With a Dog', href: '/travel/how-to-fly-with-a-dog/' },
      { label: 'Dog Road Trip Gear', href: '/travel/dog-road-trip-gear/' },
      { label: 'Car Cooling for Dogs', href: '/cooling/car-cooling-for-dogs/' },
      { label: 'All Cooling Products', href: '/cooling/best-cooling-products-for-dogs/' },
    ],
  },
};
