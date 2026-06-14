import type { AffiliateOffer } from './products/types';
import b0b1w5r11y from './amazon-products/B0B1W5R11Y.json';
import b0b1w6vlkw from './amazon-products/B0B1W6VLKW.json';
import b0bwsqwxpc from './amazon-products/B0BWSQWXPC.json';
import b0c3cdqgjq from './amazon-products/B0C3CDQGJQ.json';
import b0clv3yjdx from './amazon-products/B0CLV3YJDX.json';
import b0crwll6c1 from './amazon-products/B0CRWLL6C1.json';
import b0dcqdxss5 from './amazon-products/B0DCQDXSS5.json';
import b0f1zfmvxg from './amazon-products/B0F1ZFMVXG.json';
import b0f2cbr1t1 from './amazon-products/B0F2CBR1T1.json';
import b0f6yl3lt1 from './amazon-products/B0F6YL3LT1.json';
import b0fd8kws9l from './amazon-products/B0FD8KWS9L.json';
import b0fy6tvdhq from './amazon-products/B0FY6TVDHQ.json';
import b0g4w14r1y from './amazon-products/B0G4W14R1Y.json';
import b0g595ggpq from './amazon-products/B0G595GGPQ.json';
import b0gfmqt8yj from './amazon-products/B0GFMQT8YJ.json';
import b0gh76xgkz from './amazon-products/B0GH76XGKZ.json';
import b0ghhdv7y9 from './amazon-products/B0GHHDV7Y9.json';
import b0gjd28nrt from './amazon-products/B0GJD28NRT.json';
import b0gxf114lp from './amazon-products/B0GXF114LP.json';
import b0grgdvz21 from './amazon-products/B0GRGDVZ21.json';
import b0grv66y6x from './amazon-products/B0GRV66Y6X.json';
import b0gtr1575s from './amazon-products/B0GTR1575S.json';
import b07gvsg62x from './amazon-products/B07GVSG62X.json';
import b07wrpclyr from './amazon-products/B07WRPCLYR.json';
import b077z3lnx9 from './amazon-products/B077Z3LNX9.json';
import b08bhjfsj4 from './amazon-products/B08BHJFSJ4.json';
import b08zfvzphm from './amazon-products/B08ZFVZPHM.json';
import b09fkvqqvh from './amazon-products/B09FKVQQVH.json';
import b097pldd92 from './amazon-products/B097PLDD92.json';
import b00ti8gse2 from './amazon-products/B00TI8GSE2.json';

export type EmergencyProductCategory =
  | 'carry'
  | 'stretcher'
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

interface AmazonProductCache {
  product_results?: {
    title?: string;
    thumbnail?: string;
  };
  about_item?: string[];
}

const amazonProductCache = {
  B0GFMQT8YJ: b0gfmqt8yj,
  B0GH76XGKZ: b0gh76xgkz,
  B0GRV66Y6X: b0grv66y6x,
  B0GRGDVZ21: b0grgdvz21,
  B0GJD28NRT: b0gjd28nrt,
  B07GVSG62X: b07gvsg62x,
  B0F6YL3LT1: b0f6yl3lt1,
  B0FD8KWS9L: b0fd8kws9l,
  B07WRPCLYR: b07wrpclyr,
  B097PLDD92: b097pldd92,
  B09FKVQQVH: b09fkvqqvh,
  B08ZFVZPHM: b08zfvzphm,
  B0B1W6VLKW: b0b1w6vlkw,
  B0B1W5R11Y: b0b1w5r11y,
  B0F2CBR1T1: b0f2cbr1t1,
  B0CLV3YJDX: b0clv3yjdx,
  B0C3CDQGJQ: b0c3cdqgjq,
  B0CRWLL6C1: b0crwll6c1,
  B0FY6TVDHQ: b0fy6tvdhq,
  B0GHHDV7Y9: b0ghhdv7y9,
  B0GXF114LP: b0gxf114lp,
  B0G595GGPQ: b0g595ggpq,
  B0GTR1575S: b0gtr1575s,
  B08BHJFSJ4: b08bhjfsj4,
  B0F1ZFMVXG: b0f1zfmvxg,
  B0DCQDXSS5: b0dcqdxss5,
  B077Z3LNX9: b077z3lnx9,
  B00TI8GSE2: b00ti8gse2,
  B0BWSQWXPC: b0bwsqwxpc,
  B0G4W14R1Y: b0g4w14r1y,
} satisfies Record<string, AmazonProductCache>;

type AmazonCandidateInput = {
  asin: keyof typeof amazonProductCache;
  id: string;
  category: EmergencyProductCategory;
  badge: string;
  useCase: string;
  bestFor: string;
  fallbackBullets: string[];
};

const unsafeAmazonBulletPatterns = [
  /\bvet[-\s]?(approved|endorsed|reviewed|recommended)\b/i,
  /\bsnake\s*bites?\b/i,
  /\bclose serious wounds?\b/i,
  /\bstop bleeding fast\b/i,
];

function cleanAmazonBullet(bullet: string): string {
  return bullet.replace(/^【([^】]+)】\s*/, '$1: ').replace(/^\d+\.\s*/, '').trim();
}

function productTitle(cache: AmazonProductCache, fallback: string): string {
  return (cache.product_results?.title?.trim() || fallback)
    .replace(/\bVet Approved\s*/gi, '')
    .replace(/,\s*Best Head Lamp for Adults and Kids/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function amazonBullets(cache: AmazonProductCache, fallbackBullets: string[]): string[] {
  const safeBullets = (cache.about_item ?? [])
    .filter((bullet) => !unsafeAmazonBulletPatterns.some((pattern) => pattern.test(bullet)))
    .map(cleanAmazonBullet)
    .filter(Boolean)
    .slice(0, 3);

  return [...safeBullets, ...fallbackBullets].slice(0, 3);
}

function createAmazonReviewCandidate(input: AmazonCandidateInput): EmergencyProduct {
  const cache = amazonProductCache[input.asin];
  const name = productTitle(cache, input.id);
  const thumbnail = cache.product_results?.thumbnail;

  return {
    id: input.id,
    name,
    category: input.category,
    badge: input.badge,
    asin: input.asin,
    amazonUrl: `https://www.amazon.com/dp/${input.asin}?tag=chill-dogs-20`,
    useCase: input.useCase,
    bestFor: input.bestFor,
    bullets: amazonBullets(cache, input.fallbackBullets),
    ctaLabel: 'Check Price on Amazon',
    ...(thumbnail
      ? {
          image: {
            src: thumbnail,
            alt: `${name} on a white background`,
          },
        }
      : {}),
  };
}

export const emergencyCategoryMeta: Record<EmergencyProductCategory, { label: string; title: string; intro: string }> = {
  carry: {
    label: 'Carry Slings',
    title: 'Emergency Carry Slings and Rescue Harnesses',
    intro:
      'A carry sling is crucial because movement can expedite the spread of venom through the bloodstream. If you can, carry your dog rather than having them walk.',
  },
  stretcher: {
    label: 'Dog Stretchers',
    title: 'Dog Stretchers for Vehicle and Trail Transport',
    intro:
      'A dog stretcher is a larger transport option for car kits, group hikes, and situations where a dog needs more body support than a sling.',
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

const carryReviewCandidates: EmergencyProduct[] = [
  createAmazonReviewCandidate({
    asin: 'B0GFMQT8YJ',
    id: 'wakytu-emergency-rescue-sling',
    category: 'carry',
    badge: 'Rescue Sling Candidate',
    useCase: 'Review candidate for packable emergency dog carry support',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a lightweight, packable rescue sling.',
      'Intended for short emergency carries and outdoor use.',
      'Confirm the current size and weight guidance before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0GH76XGKZ',
    id: 'dual-handle-dog-lifting-harness',
    category: 'carry',
    badge: 'Lift Harness Candidate',
    useCase: 'Review candidate for short lifts, stairs, and assisted movement',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a dual-handle lifting harness.',
      'Designed for assisted walking and short support lifts.',
      'Confirm fit, lift points, and size range before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0GRV66Y6X',
    id: 'onetigris-full-body-dog-carry-sling',
    category: 'carry',
    badge: 'Full-Body Carry Candidate',
    useCase: 'Review candidate for larger dogs that need fuller body support',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes full-body support and reinforced handles.',
      'Designed for larger dogs and assisted carrying.',
      'Confirm measurements and carry load before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0GRGDVZ21',
    id: 'vivifying-dog-lift-harness',
    category: 'carry',
    badge: 'Rear Support Candidate',
    useCase: 'Review candidate for rear-leg support and short mobility assistance',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes rear-leg support for large dogs.',
      'Designed for standing, stairs, and car assistance.',
      'Confirm sizing and whether rear-only support fits your kit needs.',
    ],
  }),
];

const stretcherReviewCandidates: EmergencyProduct[] = [
  createAmazonReviewCandidate({
    asin: 'B0GJD28NRT',
    id: 'veehoo-dog-stretcher',
    category: 'stretcher',
    badge: 'Dog Stretcher Candidate',
    useCase: 'Review candidate for a vehicle or group emergency transport kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes an aluminum-frame dog stretcher.',
      'Includes safety straps and non-slip handles.',
      'Confirm folded size and storage needs before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B07GVSG62X',
    id: 'patient-aid-portable-stretcher',
    category: 'stretcher',
    badge: 'Soft Stretcher Candidate',
    useCase: 'Review candidate for a soft stretcher that can store flat',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a soft transfer stretcher with multiple handles.',
      'Designed to fold down for storage.',
      'Confirm dimensions and animal handling fit before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0F6YL3LT1',
    id: 'gray-large-dog-stretcher',
    category: 'stretcher',
    badge: 'Large Dog Stretcher Candidate',
    useCase: 'Review candidate for larger-dog transport with multiple handles',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a foldable stretcher for large dogs.',
      'Designed with multiple handles for balanced carrying.',
      'Confirm listed capacity and dimensions before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0FD8KWS9L',
    id: 'black-pet-emergency-stretcher',
    category: 'stretcher',
    badge: 'Emergency Stretcher Candidate',
    useCase: 'Review candidate for pet transport from vehicle, trailhead, or home',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a pet stretcher with multiple handles.',
      'Designed for emergency, illness, injury, or recovery transport.',
      'Confirm listed size, handle layout, and storage before buying.',
    ],
  }),
];

const firstAidReviewCandidates: EmergencyProduct[] = [
  createAmazonReviewCandidate({
    asin: 'B07WRPCLYR',
    id: 'arca-pet-car-first-aid-kit',
    category: 'first-aid',
    badge: 'First Aid Kit Candidate',
    useCase: 'Review candidate for a car, home, or travel pet first aid kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a pet emergency kit with travel supplies.',
      'Includes a thermometer, muzzle, tick kit, and mini first aid pouch.',
      'Use as transport support, not snakebite treatment.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B097PLDD92',
    id: 'arca-pet-reflective-first-aid-pouch',
    category: 'first-aid',
    badge: 'First Aid Pouch Candidate',
    useCase: 'Review candidate for a compact outdoor pet first aid pouch',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a water-resistant reflective pouch.',
      'Includes basic supplies such as gloves, antiseptic, tweezers, and scissors.',
      'Use as transport support, not snakebite treatment.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B09FKVQQVH',
    id: 'arca-pet-100-piece-first-aid-kit',
    category: 'first-aid',
    badge: '100-Piece Kit Candidate',
    useCase: 'Review candidate for a larger pet first aid supply kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a 100-piece pet first aid kit.',
      'Includes visibility details and a pet care guide.',
      'Use as transport support, not snakebite treatment.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B08ZFVZPHM',
    id: 'adventure-dog-medical-kit-vet-in-a-box',
    category: 'first-aid',
    badge: 'Medical Kit Candidate',
    useCase: 'Review candidate for a more loaded dog medical kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a dog-focused medical kit.',
      'Includes wound-care and lighting supplies for field readiness.',
      'Use as transport support, not snakebite treatment.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0B1W6VLKW',
    id: 'compact-dog-first-aid-travel-pack',
    category: 'first-aid',
    badge: 'Travel Pack Candidate',
    useCase: 'Review candidate for a compact hiking, camping, or travel first aid kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a lightweight pet first aid travel pack.',
      'Includes supplies such as tick remover, cleansing wipes, saline wash, and thermal blanket.',
      'Use as transport support, not snakebite treatment.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0B1W5R11Y',
    id: 'dog-first-aid-essential-pack',
    category: 'first-aid',
    badge: 'Essential Pack Candidate',
    useCase: 'Review candidate for a home, car, RV, or camping first aid kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a hard-sided pet first aid case.',
      'Includes supplies such as tick remover, slip leash, saline wash, and thermal blanket.',
      'Use as transport support, not snakebite treatment.',
    ],
  }),
];

const warmthReviewCandidates: EmergencyProduct[] = [
  createAmazonReviewCandidate({
    asin: 'B0F2CBR1T1',
    id: 'sierra-madre-emergency-sleeping-bag',
    category: 'warmth-control',
    badge: 'Emergency Blanket Candidate',
    useCase: 'Review candidate for a compact thermal layer in a car or trail kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a waterproof Mylar thermal bivy.',
      'Designed to pack small for emergency storage.',
      'Confirm size and packability before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0CLV3YJDX',
    id: 'frelaxy-emergency-blanket-pack',
    category: 'warmth-control',
    badge: 'Emergency Blanket Candidate',
    useCase: 'Review candidate for a multipack emergency blanket add-on',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes extra-thick, extra-large emergency blankets.',
      'Includes whistles and storage pouches.',
      'Confirm pack size and storage case before buying.',
    ],
  }),
];

const slipLeadReviewCandidates: EmergencyProduct[] = [
  createAmazonReviewCandidate({
    asin: 'B0C3CDQGJQ',
    id: 'petarea-reflective-slip-lead',
    category: 'warmth-control',
    badge: 'Slip Lead Candidate',
    useCase: 'Review candidate for backup control in a car, trail, or home kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a slip lead that combines leash and collar function.',
      'Reflective thread is braided into the rope.',
      'Confirm width, length, and safe handling fit before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0CRWLL6C1',
    id: 'mad-dog-products-orange-slip-lead',
    category: 'warmth-control',
    badge: 'Slip Lead Candidate',
    useCase: 'Review candidate for a simple backup leash in an emergency kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes an orange English slip lead.',
      'Designed to work without a separate collar.',
      'Confirm width, length, and safe handling fit before buying.',
    ],
  }),
];

const preventionReviewCandidates: EmergencyProduct[] = [
  createAmazonReviewCandidate({
    asin: 'B0FY6TVDHQ',
    id: 'ultra-thin-20000mah-power-bank',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    useCase: 'Review candidate for keeping a phone charged during emergency transport',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a 20,000mAh portable charger.',
      'Includes a built-in USB-C cable.',
      'Keep charged before storing it in a kit.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0GHHDV7Y9',
    id: 'cuktech-25000mah-power-bank',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    useCase: 'Review candidate for higher-capacity phone and device charging',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a 25,000mAh portable charger.',
      'Includes a built-in USB-C cable and multiple charging ports.',
      'Keep charged before storing it in a kit.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0GXF114LP',
    id: '50000mah-built-in-cable-power-bank',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    useCase: 'Review candidate for a larger-capacity car or camping kit battery',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a 50,000mAh power bank.',
      'Includes built-in cables and an LED display.',
      'Confirm size, weight, and charging needs before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0G595GGPQ',
    id: 'iniu-magnetic-10000mah-power-bank',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    useCase: 'Review candidate for a compact phone battery in a light trail kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a 10,000mAh magnetic power bank.',
      'Designed for wireless and wired phone charging.',
      'Confirm phone compatibility before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0GTR1575S',
    id: '10000mah-built-in-cable-power-bank',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    useCase: 'Review candidate for a compact all-in-one phone charger',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a 10,000mAh portable charger.',
      'Includes built-in cables and an LCD display.',
      'Keep charged before storing it in a kit.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B08BHJFSJ4',
    id: 'black-diamond-cosmo-300-headlamp',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    useCase: 'Review candidate for hands-free light in a trail or car kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing identifies this as the Black Diamond Cosmo 300 headlamp.',
      'Headlamps keep both hands free during low-light transport.',
      'Confirm current battery type, brightness, and water rating before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0F1ZFMVXG',
    id: 'nebo-mycro-450-headlamp',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    useCase: 'Review candidate for rechargeable hands-free light',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a rechargeable headlamp.',
      'Includes multiple light modes.',
      'Confirm brightness, runtime, and charging setup before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0DCQDXSS5',
    id: 'nitecore-nu20-classic-headlamp',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    useCase: 'Review candidate for a lightweight rechargeable headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a lightweight USB-C rechargeable headlamp.',
      'Includes white and red light modes.',
      'Confirm runtime and brightness before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B077Z3LNX9',
    id: 'nitecore-nu25-headlamp',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    useCase: 'Review candidate for a compact rechargeable headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a 360-lumen rechargeable headlamp.',
      'Includes white, high-CRI, and red light outputs.',
      'Confirm current model details before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B00TI8GSE2',
    id: 'energizer-led-headlamp',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    useCase: 'Review candidate for a battery-powered emergency headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing identifies this as an Energizer LED headlamp.',
      'Headlamps keep both hands free during low-light transport.',
      'Confirm batteries, brightness, and runtime before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0BWSQWXPC',
    id: 'coast-wph34r-rechargeable-headlamp',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    useCase: 'Review candidate for a waterproof rechargeable headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a rechargeable waterproof headlamp.',
      'Includes multiple beam colors and modes.',
      'Confirm runtime, brightness, and charging setup before buying.',
    ],
  }),
  createAmazonReviewCandidate({
    asin: 'B0G4W14R1Y',
    id: 'sunrei-rechargeable-headlamp',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    useCase: 'Review candidate for a rechargeable outdoor headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    fallbackBullets: [
      'Amazon listing describes a USB-C rechargeable headlamp.',
      'Includes red light, motion sensor, and multiple light modes.',
      'Confirm runtime, brightness, and fit before buying.',
    ],
  }),
];

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
  ...carryReviewCandidates,
  ...stretcherReviewCandidates,
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
  ...firstAidReviewCandidates,
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
  ...warmthReviewCandidates,
  ...slipLeadReviewCandidates,
  ...preventionReviewCandidates,
  {
    id: 'hipypaw-basket-silicone-muzzle',
    name: 'HipyPaw Basket Silicone Dog Muzzle',
    category: 'muzzle',
    badge: 'Best Silicone Basket',
    asin: 'B0G6ZKGM85',
    amazonUrl: 'https://www.amazon.com/dp/B0G6ZKGM85?tag=chill-dogs-20',
    useCase: 'Silicone basket muzzle for medium and large dogs during transport',
    bestFor: 'Owners who want a soft, flexible basket that allows drinking',
    bullets: [
      'Silicone basket design allows panting and drinking',
      'Soft material is gentler on the face than rigid plastic',
      'Lightweight enough to keep in a trail pack or car kit',
    ],
    howItHelps:
      'Reduces pain-biting risk during handling only when breathing is normal and the dog is calm enough to apply it safely.',
    caution:
      'Do not muzzle a dog that is struggling to breathe, vomiting, overheating, brachycephalic, or swelling around the face.',
    sizingNote: 'Size carefully before the trail — a muzzle that needs adjusting during an emergency adds stress.',
    image: {
      src: 'https://m.media-amazon.com/images/I/71WlU8K7jwL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'HipyPaw black silicone basket dog muzzle on a white background',
    },
  },
  {
    id: 'vinchini-3d-mesh-muzzle',
    name: 'VINCHINI 3D Air Mesh Dog Muzzle',
    category: 'muzzle',
    badge: 'Best Budget Mesh',
    asin: 'B0GKYDN917',
    amazonUrl: 'https://www.amazon.com/dp/B0GKYDN917?tag=chill-dogs-20',
    useCase: 'Affordable 3D mesh muzzle for medium dogs',
    bestFor: 'Beagle-sized and medium-breed owners looking for a lightweight budget option',
    bullets: [
      '3D air mesh keeps airflow around the snout',
      'Escape-proof strap design for a secure fit',
      'Compact and lightweight for trail kits',
    ],
    howItHelps:
      'A practical budget backup for medium dogs during careful handling, when breathing is fully clear.',
    caution:
      'Do not muzzle a dog that is struggling to breathe, vomiting, overheating, brachycephalic, or swelling around the face.',
    sizingNote:
      'Sized for Beagle, Cocker Spaniel, Border Collie, and similar medium breeds — verify fit before heading out.',
    image: {
      src: 'https://m.media-amazon.com/images/I/71hcXCUrsaL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'VINCHINI black 3D mesh dog muzzle on a white background',
    },
  },
  {
    id: 'pawfun-reflective-mesh-muzzle',
    name: 'Pawfun Reflective Mesh Dog Muzzle',
    category: 'muzzle',
    badge: 'Best Reflective Straps',
    asin: 'B0GXW3M9KQ',
    amazonUrl: 'https://www.amazon.com/dp/B0GXW3M9KQ?tag=chill-dogs-20',
    useCase: 'Breathable mesh muzzle with reflective straps for low-light trail use',
    bestFor: 'Hikers and dusk walkers who want added visibility during an emergency carry',
    bullets: [
      'Reflective straps improve visibility on low-light carries',
      'Soft mesh construction allows airflow around the snout',
      'Available in small, medium, and large',
    ],
    howItHelps:
      'Adds a visibility layer for nighttime or dusk trail emergencies, while providing restraint when the dog can safely wear a muzzle.',
    caution:
      'Do not muzzle a dog that is struggling to breathe, vomiting, overheating, brachycephalic, or swelling around the face.',
    sizingNote: 'Measure snout circumference and follow the size chart before heading out.',
    image: {
      src: 'https://m.media-amazon.com/images/I/710Yy6xaijL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Pawfun black mesh dog muzzle with reflective straps on a white background',
    },
  },
  {
    id: 'shinylin-basket-mesh-muzzle',
    name: 'Shinylin Basket Air Mesh Dog Muzzle',
    category: 'muzzle',
    badge: 'Best Multi-Size Set',
    asin: 'B0FK4D9L15',
    amazonUrl: 'https://www.amazon.com/dp/B0FK4D9L15?tag=chill-dogs-20',
    useCase: 'Basket air mesh muzzle available across six sizes',
    bestFor: 'Multi-dog households or owners who want the widest range of fit options',
    bullets: [
      'Six size options (S through XXXL) cover small to giant breeds',
      'Basket-style mesh design keeps the snout covered while allowing air',
      'Snap fastener applies and removes faster than buckle straps',
    ],
    howItHelps:
      'The wide size range means you can fit a muzzle properly before an emergency rather than guessing at the trailhead.',
    caution:
      'Do not muzzle a dog that is struggling to breathe, vomiting, overheating, brachycephalic, or swelling around the face.',
    sizingNote: 'Six sizes available — measure and test the fit at home so you know the right size for your dog.',
    image: {
      src: 'https://m.media-amazon.com/images/I/81AOe4JyoSL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Shinylin basket air mesh dog muzzle on a white background',
    },
  },
  {
    id: 'tviaoh-small-dog-muzzle',
    name: 'TVIAOH Small Dog Muzzle',
    category: 'muzzle',
    badge: 'Best for Small Dogs',
    asin: 'B0F898P647',
    amazonUrl: 'https://www.amazon.com/dp/B0F898P647?tag=chill-dogs-20',
    useCase: 'Soft nylon muzzle sized for small breeds',
    bestFor: 'Small-dog owners who want an appropriately sized muzzle in the kit',
    bullets: [
      'Sized specifically for small breeds',
      'Reflective strap for low-light visibility',
      'Soft nylon allows panting and drinking when correctly fitted',
    ],
    howItHelps:
      'Fills a gap for small-dog owners — most budget muzzle sets are sized for medium and large breeds.',
    caution:
      'Do not muzzle a dog that is struggling to breathe, vomiting, overheating, brachycephalic, or swelling around the face.',
    sizingNote:
      'Measure snout circumference to confirm fit — small muzzles vary significantly between brands.',
    image: {
      src: 'https://m.media-amazon.com/images/I/41DRMjQAlBL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'TVIAOH small dog muzzle on a white background',
    },
  },
  {
    id: 'letsqk-2pack-mesh-muzzle',
    name: 'LETSQK 2-Pack Mesh Dog Muzzle',
    category: 'muzzle',
    badge: 'Best Value 2-Pack',
    asin: 'B0GK8XCCZC',
    amazonUrl: 'https://www.amazon.com/dp/B0GK8XCCZC?tag=chill-dogs-20',
    useCase: 'Two-pack soft mesh muzzle for households with more than one dog',
    bestFor: 'Multi-dog owners who want a spare or need two different sizes',
    bullets: [
      'Two muzzles per pack — practical for multi-dog households',
      'Soft mesh allows panting and drinking when properly fitted',
      'Available across small, medium, and large sizes',
    ],
    howItHelps: 'A second muzzle in the kit costs little extra and means one is always available.',
    caution:
      'Do not muzzle a dog that is struggling to breathe, vomiting, overheating, brachycephalic, or swelling around the face.',
    sizingNote: 'Both muzzles in the pack are the same size — confirm the size before ordering.',
    image: {
      src: 'https://m.media-amazon.com/images/I/81I08AKRvAL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'LETSQK two-pack mesh dog muzzle on a white background',
    },
  },
  {
    id: 'lh-ntgr-reflective-muzzle',
    name: 'LH NTGR Adjustable Reflective Dog Muzzle',
    category: 'muzzle',
    badge: 'Best Adjustable Fit',
    asin: 'B0GW7K9DGZ',
    amazonUrl: 'https://www.amazon.com/dp/B0GW7K9DGZ?tag=chill-dogs-20',
    useCase: 'Adjustable reflective muzzle for large, medium, and small dogs',
    bestFor: 'Owners who want reflective safety details and a fully adjustable fit',
    bullets: [
      'Reflective panel improves visibility during low-light carries',
      'Adjustable straps fit a range of head shapes',
      'Breathable design allows panting when safely applied',
    ],
    howItHelps:
      'The reflective panel and adjustable fit make it practical for trail and dusk emergency scenarios.',
    caution:
      'Do not muzzle a dog that is struggling to breathe, vomiting, overheating, brachycephalic, or swelling around the face.',
    sizingNote: 'Adjust and test the fit at home before relying on it in an emergency.',
    image: {
      src: 'https://m.media-amazon.com/images/I/81dcJbJISXL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'LH NTGR adjustable reflective dog muzzle on a white background',
    },
  },
];

export function getEmergencyProductsByCategory(category: EmergencyProductCategory): EmergencyProduct[] {
  return emergencyProducts.filter((product) => product.category === category);
}
