import type { AffiliateOffer } from './products/types';

export type EmergencyProductCategory =
  | 'carry'
  | 'first-aid'
  | 'muzzle'
  | 'warmth-control'
  | 'prevention';

export interface EmergencyProduct {
  id: string;
  name: string;
  category: EmergencyProductCategory;
  badge: string;
  asin?: string;
  amazonUrl?: string;
  offers?: AffiliateOffer[];
  useCase: string;
  bestFor: string;
  bullets: string[];
  pros?: string[];
  cons?: string[];
  howItHelps?: string;
  caution?: string;
  sizingNote?: string;
  ctaLabel?: string;
  image?: { src: string; alt: string };
}

export const emergencyCategoryMeta: Record<EmergencyProductCategory, { label: string; title: string; intro: string }> = {
  carry: {
    label: 'Carry Slings',
    title: 'Emergency Carry Slings and Rescue Harnesses',
    intro:
      'A carry sling is crucial because movement can expedite the spread of venom through the bloodstream. If you can, carry your dog rather than having them walk.',
  },
  'first-aid': {
    label: 'First Aid',
    title: 'Packable Dog First-Aid Kits',
    intro:
      'A first aid kit keeps gloves, gauze, clean dressing, and an emergency blanket all in one place.',
  },
  muzzle: {
    label: 'Muzzle Safety',
    title: 'Use a Muzzle Only If It Is Safe',
    intro:
      'Pain can make even a gentle dog bite, but only muzzle your dog if it is safe to do so. Snake bites can cause breathing problems, vomiting, heat stress, and facial swelling. Remove collars, harnesses and muzzles if symptoms appear.',
  },
  'warmth-control': {
    label: 'Small Add-ons',
    title: 'Small Add-ons for Warmth, Control, and Vet Information',
    intro:
      'Small items can make the trip to the emergency vet calmer: a slip lead for backup control, a Mylar blanket for warmth, and simple supplies for clean handling and clear information.',
  },
  prevention: {
    label: 'Phone and Light',
    title: 'Phone and Visibility Add-ons',
    intro:
      'The best emergency kit is the one that helps you call ahead, see the trail, and leave quickly. A charged phone, backup battery, and headlamp are simple but useful pieces.',
  },
};

export const emergencyProducts: EmergencyProduct[] = [
  {
    id: 'fido-pro-airlift-rescue-sling',
    name: 'Fido Pro Airlift Emergency Dog Rescue Sling',
    category: 'carry',
    badge: 'Best Overall Carry Sling',
    asin: 'B0BCJT919V',
    amazonUrl: 'https://www.amazon.com/dp/B0BCJT919V?tag=chill-dogs-20',
    useCase: 'Packable trail evacuation for small and medium dogs',
    bestFor: 'Hikers and trail walkers who need a compact way to carry a dog out',
    bullets: [
      'Lightweight sling that packs into a daypack',
      'Designed to support the dog while one person carries',
      'Most useful when walking out would add movement and stress',
    ],
    pros: ['Very packable', 'Purpose-built for trail carry', 'Useful for one-person evacuation'],
    cons: ['Premium price', 'Weight-limited by size', 'Requires practice before an emergency'],
    howItHelps:
      'Lets you carry a bitten or injured dog toward the car or trailhead instead of having them walk.',
    sizingNote: 'Check the current size chart before buying.',
    ctaLabel: 'Check Fido Pro Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/61cEfEWdGTL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Fido Pro Airlift emergency dog rescue sling on a white background',
    },
  },
  {
    id: 'rock-n-rescue-sar-dog-harness',
    name: 'Rock-N-Rescue SAR Dog Harness',
    category: 'carry',
    badge: 'Best for Large Dogs',
    asin: 'B00MIZ7UVC',
    amazonUrl: 'https://www.amazon.com/dp/B00MIZ7UVC?tag=chill-dogs-20',
    useCase: 'Durable evacuation harness for larger dogs',
    bestFor: 'Large-dog owners who want a sturdier carry option in the car',
    bullets: [
      'Heavy-duty harness design for bigger dogs',
      'Better suited to car kits than ultralight daypacks',
      'Useful for heavier dogs',
    ],
    pros: ['Durable build', 'Suitable for large dogs', 'Good fit for car emergency kits'],
    cons: ['Bulkier than ultralight slings', 'Less convenient for small packs', 'Premium price'],
    howItHelps:
      'Provides a substantial way to lift, steady, or carry a dog to care.',
    sizingNote: 'Measure your dog before ordering.',
    image: {
      src: 'https://m.media-amazon.com/images/I/71+E+Rzq7VL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Rock-N-Rescue orange SAR dog harness on a white background',
    },
  },
  {
    id: 'adventure-medical-me-and-my-dog-kit',
    name: 'Adventure Medical Kits Me & My Dog First Aid Kit',
    category: 'first-aid',
    badge: 'Best Base First Aid Kit',
    asin: 'B00T72ST0A',
    amazonUrl: 'https://www.amazon.com/dp/B00T72ST0A?tag=chill-dogs-20',
    useCase: 'A general first aid base for owner and dog supplies',
    bestFor: 'Most owners building one practical car or trail kit',
    bullets: [
      'Human-and-dog first aid supplies in one kit',
      'Good base to supplement with dog-specific extras',
      'Pairs well with a sling, slip lead, and vet info card',
    ],
    pros: ['Organized base kit', 'Covers common minor injuries', 'Easy to keep in a car or pack'],
    cons: ['Not snakebite treatment', 'Still needs added dog-specific supplies', 'Supply mix can change'],
    howItHelps:
      'Keeps gloves, dressings, and basic emergency supplies ready while you focus on getting to a veterinarian.',
    image: {
      src: 'https://m.media-amazon.com/images/I/91eY4r3AyEL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Adventure Medical Kits Me and My Dog first aid kit on a white background',
    },
  },
  {
    id: 'adventure-medical-trail-dog-kit',
    name: 'Adventure Medical Kits Trail Dog First Aid Kit',
    category: 'first-aid',
    badge: 'Best Lightweight Kit',
    asin: 'B00T72ST1Y',
    amazonUrl: 'https://www.amazon.com/dp/B00T72ST1Y?tag=chill-dogs-20',
    useCase: 'Small trail first aid kit for day hikes',
    bestFor: 'Minimalist hikers who need a light kit that actually comes along',
    bullets: [
      'Compact dog-focused kit for trail packs',
      'Better for day hikes than a bulky car kit',
      'Leaves room for a sling and power bank',
    ],
    pros: ['Light and packable', 'Dog-focused supplies', 'Good second kit for a hiking bag'],
    cons: ['Less complete than larger kits', 'No carry solution', 'Needs add-ons for snakebite readiness'],
    howItHelps:
      'Adds basic clean-handling and dressing supplies without making the emergency kit too bulky to carry.',
    image: {
      src: 'https://m.media-amazon.com/images/I/91n+0ewODtL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Adventure Medical Kits Trail Dog first aid kit on a white background',
    },
  },
  {
    id: 'adventure-medical-workin-dog-kit',
    name: "Adventure Medical Kits Workin' Dog First Aid Kit",
    category: 'first-aid',
    badge: 'Best Loaded Kit',
    asin: 'B018ONRL2E',
    amazonUrl: 'https://www.amazon.com/dp/B018ONRL2E?tag=chill-dogs-20',
    useCase: 'Comprehensive first aid kit for car storage, field use, and bigger emergency loadouts',
    bestFor: 'Owners who want QuikClot, lighting, and a broader emergency supply set in one case',
    bullets: [
      'Contains QuikClot, self-adhering bandages, a cold pack, leash, headlamp, and emergency blanket.',
      'Compact design is easy to stash under a car seat.',
      'Includes a guide for dog emergency basics.',
      'Built around field-ready supplies rather than a minimalist trail kit.',
      'Works best as a stocked car-kit option.',
    ],
    howItHelps: 'Keeps a wider set of supplies ready for general field emergencies while transport remains the priority.',
    caution: 'Hemostatic gauze and trauma supplies are for bleeding wounds, not venom treatment.',
    image: {
      src: 'https://m.media-amazon.com/images/I/91IP+BIHSvL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: "Adventure Medical Kits Workin' Dog first aid kit on a white background",
    },
  },
  {
    id: 'kurgo-50-piece-dog-first-aid-kit',
    name: 'Kurgo 50-Piece Dog First Aid Kit',
    category: 'first-aid',
    badge: 'Best Value First Aid Kit',
    asin: 'B00IKRVU90',
    amazonUrl: 'https://www.amazon.com/dp/B00IKRVU90?tag=chill-dogs-20',
    useCase: 'Travel-ready 50-piece dog first aid kit for the car or trail bag',
    bestFor: 'Owners who want an organized soft case for cuts, choking, and general emergencies',
    bullets: [
      '50 essential pieces are organized across mesh compartments and a zippered pocket.',
      'Durable oxford fabric case includes an integrated hook and bottle opener.',
      'Parachute cord utility helps keep pet bandages, gloves, and small tools organized.',
      'Built for travel, walks, and outdoor use with dogs.',
      'Backed by a lifetime warranty.',
    ],
    howItHelps: 'Gives you a ready supply pouch for clean handling, dressing materials, and general dog first aid.',
    image: {
      src: 'https://m.media-amazon.com/images/I/81QdYcNIVeL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Kurgo dog first aid kit on a white background',
    },
  },
  {
    id: 'swiss-safe-mylar-emergency-blankets',
    name: 'Swiss Safe Mylar Emergency Blankets',
    category: 'warmth-control',
    badge: 'Best Budget Warmth Add-On',
    asin: 'B01LZN0KGB',
    amazonUrl: 'https://www.amazon.com/dp/B01LZN0KGB?tag=chill-dogs-20',
    useCase: 'Tiny warmth layer for car, backyard, and hiking kits',
    bestFor: 'Every kit, because they are cheap and easy to stash',
    bullets: [
      'Small enough for every emergency bag',
      'Helps keep a quiet dog warm during transport',
      'Useful beyond snakebite scenarios',
    ],
    pros: ['Very compact', 'Low-cost multipack', 'Easy to keep in several places'],
    cons: ['Crinkly and noisy', 'Not durable for repeated use', 'Not dog-specific'],
    howItHelps:
      'Adds a lightweight warmth layer for the ride to veterinary care, especially after shock or long trail carries.',
    image: {
      src: 'https://m.media-amazon.com/images/I/71t6WSsGGwL._AC_SX300_SY300_QL70_FMwebp_.jpg',
      alt: 'Swiss Safe Mylar emergency blanket multipack on a white background',
    },
  },
  {
    id: 'mendota-pet-slip-lead',
    name: 'Mendota Pet Slip Lead',
    category: 'warmth-control',
    badge: 'Best Backup Control Tool',
    asin: 'B00074W3RW',
    amazonUrl: 'https://www.amazon.com/dp/B00074W3RW?tag=chill-dogs-20',
    useCase: 'Backup control if a dog slips a collar or harness',
    bestFor: 'Car kits, trail kits, and backyard emergency hooks',
    bullets: [
      'Leash and collar function in one simple tool',
      'Useful when a panicked dog slips other gear',
      'Packs flat in a first aid pouch or car bin',
    ],
    pros: ['Simple and durable', 'Fast backup control', 'Works without a separate collar'],
    cons: ['Not for unattended use', 'Requires calm handling', 'Choose width by dog size'],
    howItHelps:
      'Gives you quick backup control while moving a scared or painful dog toward the car.',
    sizingNote: 'Choose the lead width and length that fit your dog size and handling needs.',
    image: {
      src: 'https://m.media-amazon.com/images/I/518869tpQWL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Mendota green rope slip lead on a white background',
    },
  },
  {
    id: 'anker-313-power-bank',
    name: 'Anker 313 Power Bank',
    category: 'prevention',
    badge: 'Best Call-the-Vet Add-On',
    asin: 'B08TW84CR1',
    amazonUrl: 'https://www.amazon.com/dp/B08TW84CR1?tag=chill-dogs-20',
    useCase: 'Backup phone power for calling the emergency vet from the trail or car',
    bestFor: 'Hikers, road trippers, and anyone walking outside cell-phone comfort zones',
    bullets: [
      'Small backup battery for phone calls and maps',
      'Helps you call ahead before arriving at the vet',
      'Useful for everyday travel emergencies too',
    ],
    pros: ['Compact size', 'Useful beyond dog gear', 'Good capacity for phones'],
    cons: ['Must be kept charged', 'Not waterproof', 'Cable may be separate'],
    howItHelps:
      'Keeps your phone alive so you can call the emergency vet, navigate, and coordinate help.',
    image: {
      src: 'https://m.media-amazon.com/images/I/61524M+c4pL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Anker 313 compact power bank on a white background',
    },
  },
  {
    id: 'lhknl-rechargeable-headlamp',
    name: 'LHKNL Rechargeable LED Headlamp',
    category: 'prevention',
    badge: 'Best Dusk and Dawn Add-On',
    asin: 'B08D66HCXW',
    amazonUrl: 'https://www.amazon.com/dp/B08D66HCXW?tag=chill-dogs-20',
    useCase: 'Hands-free visibility for summer dusk and dawn walks',
    bestFor: 'Trail walkers and backyard owners who walk during lower-light snake hours',
    bullets: [
      'Hands-free light for spotting trail hazards',
      'Useful during dusk, dawn, and emergency carries',
      'Cheap prevention gear with broad utility',
    ],
    pros: ['Hands-free visibility', 'Rechargeable', 'Useful for carrying or searching'],
    cons: ['Battery must be maintained', 'Brightness varies by mode', 'Not a snake deterrent'],
    howItHelps:
      'Helps you see the path, spot hazards earlier, and keep both hands free if you need to carry your dog.',
    image: {
      src: 'https://m.media-amazon.com/images/I/71DxWxvCwlL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'LHKNL rechargeable LED headlamp two-pack on a white background',
    },
  },
];

export function getEmergencyProductsByCategory(category: EmergencyProductCategory): EmergencyProduct[] {
  return emergencyProducts.filter((product) => product.category === category);
}
