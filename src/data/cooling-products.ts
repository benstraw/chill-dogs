export type ProductCategory =
  | 'cooling-mats'
  | 'cooling-bandanas'
  | 'cooling-vests'
  | 'freezable-dog-toys'
  | 'car-cooling'
  | 'bonus';

export interface CoolingProduct {
  id: string;
  name: string;
  category: ProductCategory;
  amazonUrl: string;
  bullets: [string, string, string];
  bestFor: string;
  coolingMethod?: string;
  sizingNote?: string;
  image?: { src: string; alt: string };
  isBonus?: boolean;
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
  },
  {
    id: 'kh-cool-bed-iii',
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
  },
  {
    id: 'arf-pets-self-cooling-mat',
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
  },

  // Cooling Bandanas
  {
    id: 'afp-chill-out-ice-bandana',
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
  },
  {
    id: 'kyeese-cooling-bandanas',
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
  },

  // Cooling Vests
  {
    id: 'ruffwear-swamp-cooler',
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
  },
  {
    id: 'kurgo-core-cooling-vest',
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
  },
  {
    id: 'canada-pooch-chill-seeker',
    name: 'Canada Pooch Chill Seeker Cooling Vest',
    category: 'cooling-vests',
    amazonUrl:
      'https://www.amazon.com/Canada-Pooch-Chill-Seeker-Cooling/dp/B009JLQCUI/?tag=chill-dogs-20',
    bullets: [
      'Stylish design that looks like a regular vest — not "medical"',
      'Moisture-activated cooling lasts through a full walk',
      'Lightweight enough that most dogs forget they\'re wearing it',
    ],
    bestFor: 'Style-conscious pet parents who want function and fashion',
    coolingMethod: 'Evaporative cooling',
    sizingNote: 'Runs slightly small — size up if your dog is between sizes',
  },

  // Freezable Toys
  {
    id: 'kong-classic',
    name: 'KONG Classic Dog Toy',
    category: 'freezable-dog-toys',
    amazonUrl:
      'https://www.amazon.com/KONG-Classic-Durable-Natural-Rubber/dp/B000AYN7LU/?tag=chill-dogs-20',
    bullets: [
      'Stuff with peanut butter or wet food and freeze for hours of cool fun',
      'Nearly indestructible natural rubber stands up to heavy chewers',
      'Unpredictable bounce keeps dogs mentally engaged',
    ],
    bestFor: 'Heavy chewers who need long-lasting frozen enrichment',
    coolingMethod: 'Freeze stuffing inside',
  },
  {
    id: 'petsafe-chilly-penguin',
    name: 'PetSafe Chilly Penguin',
    category: 'freezable-dog-toys',
    amazonUrl:
      'https://www.amazon.com/PetSafe-Freezable-Holding-Chilly-Penguin/dp/B0G1NDQQYF/?tag=chill-dogs-20',
    bullets: [
      'Fill with water and freeze — the penguin slowly releases cool water as it thaws',
      'Dishwasher-safe for easy cleanup',
      'Fun shape encourages interactive play and licking',
    ],
    bestFor: 'Dogs who love to lick and need gentle hydration encouragement',
    coolingMethod: 'Frozen water release',
  },

  // Car Cooling
  {
    id: 'enovoe-car-window-shades',
    name: 'Enovoe Magnetic Car Window Shades (4-Pack)',
    category: 'car-cooling',
    amazonUrl: 'https://a.co/d/0ibvjezH?tag=chill-dogs-20',
    bullets: [
      'Magnetic edges stick directly to the car door frame — no clips, no suction cups',
      'Blocks UV rays and cuts cabin temperature significantly on sunny drives',
      'Folds flat for storage; quick to attach and remove at rest stops',
    ],
    bestFor: 'Blocking direct sun from back-seat windows on hot road trips',
    coolingMethod: 'Passive sun and UV blocking',
    sizingNote: 'Universal fit — covers most standard rear side windows',
  },
  {
    id: 'kh-travel-fan',
    name: 'K&H Pet Products Clip-On Travel Fan',
    category: 'car-cooling',
    amazonUrl: 'https://a.co/d/0gdIEc6H?tag=chill-dogs-20',
    bullets: [
      'Clips to headrest or cargo bar to direct airflow toward your dog',
      'Two-speed setting; runs off any USB port or 12V adapter',
      'Flexible neck adjusts to point exactly where you need it',
    ],
    bestFor: 'Active airflow for crated or back-seat dogs when AC vents fall short',
    coolingMethod: 'Active airflow — clip-on fan',
    sizingNote: 'One size; flexible clip fits most headrests and cargo bars',
  },
  {
    id: 'outward-hound-port-a-bowl',
    name: 'Outward Hound Port-A-Bowl Collapsible Bowl',
    category: 'car-cooling',
    amazonUrl:
      'https://www.amazon.com/Outward-Hound-Kyjen-Collapsible-Waterproof/dp/B07N9MMCG7/?tag=chill-dogs-20',
    bullets: [
      'Folds completely flat — slips into a pocket, bag, or door panel',
      'Carabiner clip attaches to a leash or backpack for hands-free carry',
      'Dishwasher-safe BPA-free nylon holds up to 32 oz for larger dogs',
    ],
    bestFor: 'Pit-stop hydration without hauling a bulky bowl',
    coolingMethod: 'Hydration support',
    sizingNote: 'Available in S (1 cup) and L (32 oz) — size up for large dogs',
  },
  {
    id: 'four-knines-seat-hammock',
    name: '4Knines Dog Seat Cover Hammock',
    category: 'car-cooling',
    amazonUrl: 'https://a.co/d/0iAjKmBj?tag=chill-dogs-20',
    bullets: [
      'Hammock style prevents your dog from tumbling into the footwell on long drives',
      'Waterproof quilted surface stays cooler than bare upholstery or vinyl seats',
      'Anchors to headrests front and back — no tools needed',
    ],
    bestFor: 'Keeping dogs stable, cool, and off hot leather seats in the back',
    coolingMethod: 'Surface insulation from hot upholstery',
    sizingNote: 'Standard and XL fit most sedans, SUVs, and trucks',
  },

  // Bonus
  {
    id: 'nasa-bed',
    name: 'Wag This World NASA-Inspired Orthopedic Dog Bed',
    category: 'bonus',
    amazonUrl:
      'https://www.amazon.com/Wag-This-World-Supportive-Orthopedic-Resistant/dp/B0BQPJLB68/?tag=chill-dogs-20',
    bullets: [
      'Open-cell memory foam allows airflow to prevent heat buildup',
      'Supportive orthopedic base eases joint pain in senior dogs',
      'Water-resistant liner protects the foam from accidents',
    ],
    bestFor: 'Senior dogs or large breeds that overheat on traditional beds',
    coolingMethod: 'Breathable open-cell memory foam',
    isBonus: true,
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────

export function getProductsByCategory(category: ProductCategory): CoolingProduct[] {
  return coolingProducts.filter((p) => p.category === category);
}

export function getCoreProducts(): CoolingProduct[] {
  return coolingProducts.filter((p) => !p.isBonus);
}

export function getBonusProduct(): CoolingProduct | undefined {
  return coolingProducts.find((p) => p.isBonus);
}

// ─── Category Meta ───────────────────────────────────────────────────

export const categoryMeta: Record<Exclude<ProductCategory, 'bonus'>, CategoryMeta> = {
  'car-cooling': {
    title: 'Best Car Cooling Products for Dogs (2026)',
    description:
      'Keep your dog cool and comfortable on road trips with magnetic window shades, clip-on fans, collapsible bowls, and seat hammocks. Our top picks for every budget.',
    heroHeadline: 'The Best Car Cooling Setup for Dogs on Road Trips',
    introCopy:
      'Hot back seats are one of the biggest road-trip risks for dogs. These four products address the core problem: passive sun blocking, active airflow, quick hydration, and a cooler surface to lie on.',
    faqs: [
      {
        question: 'How do I keep my dog cool in the car without AC?',
        answer:
          'Combine passive and active methods: magnetic shades block the sun before heat builds up, a clip-on fan keeps air moving, and a collapsible bowl at every stop replaces fluids. On very hot days, schedule drives in the morning or evening.',
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
        question: 'How often should I stop and offer water on a road trip?',
        answer:
          'Every 1–2 hours is a reasonable baseline, but dogs that are stressed, panting heavily, or in hot weather may need more frequent breaks. Always offer cool (not ice cold) water.',
      },
    ],
    internalLinks: [
      { label: 'Road Trip Chill Kit', href: '/travel/rhys-road-trip-chill-kit/' },
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
      'A good cooling mat gives your dog an instant cool-down spot — no electricity, no prep. We compared pressure-activated gel pads and water-based mats to find the strongest options. Here are our top picks.',
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
      'Evaporative cooling vests for hikes, walks, and backyard play. Here are the 3 best options.',
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
      'Freezable toys combine enrichment with cooling — stuff them, freeze them, and let your dog work for a cold treat. Here are two classics that deliver.',
    faqs: [
      {
        question: 'What can I freeze inside a KONG?',
        answer:
          'Peanut butter (xylitol-free), plain yogurt, mashed banana, wet dog food, or a mix. Freeze for at least 4 hours for the longest-lasting challenge.',
      },
      {
        question: 'Are freezable toys safe for puppies?',
        answer:
          'Yes — the KONG Classic and Chilly Penguin are both safe for puppies. Use the KONG Puppy (softer rubber) for teething pups under 9 months.',
      },
      {
        question: 'How long do frozen toys keep dogs busy?',
        answer:
          'A fully frozen KONG can last 20–45 minutes depending on the filling and your dog\'s determination. The Chilly Penguin is quicker — usually 10–20 minutes.',
      },
    ],
    internalLinks: [
      { label: 'Cooling Mats', href: '/cooling/cooling-mats/' },
      { label: 'Cooling Bandanas', href: '/cooling/cooling-bandanas/' },
      { label: 'Cooling Vests', href: '/cooling/cooling-vests/' },
      { label: 'All Cooling Products', href: '/cooling/best-cooling-products-for-dogs/' },
    ],
  },
};
