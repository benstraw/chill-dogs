import type { AffiliateOffer } from './products/types';

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
    label: 'Warmth and Control',
    title: 'Blankets and Leads',
    intro:
      'These items can help keep your dog safe and warm on the way to the vet.',
  },
  prevention: {
    label: 'Phone and Light',
    title: 'Phone and Visibility Add-ons',
    intro:
      'The best emergency kit includes a charged phone, a backup battery and a headlamp so you can call ahead, see the trail and leave quickly.',
  },
};

const carryReviewCandidates: EmergencyProduct[] = [
  {
    id: 'wakytu-emergency-rescue-sling',
    name: 'Wakytu Dog Emergency Rescue Sling',
    category: 'carry',
    badge: 'Rescue Sling',
    asin: 'B0GFMQT8YJ',
    amazonUrl: 'https://www.amazon.com/dp/B0GFMQT8YJ?tag=chill-dogs-20',
    useCase:
      'EMERGENCY DOG CARRYING SLING: Allows you to safely carry your injured or sick dog using the dog lift from the trail to safety, even in rugged terrain.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'LIGHTWEIGHT AND PACKABLE: Just 18 oz. Fits into a small stuff sack.',
      'FULL BODY SUPPORT: Whether the front or rear legs need support, the harness provides full body support. Well-made buckles can withstand large pulling forces without bursting. It also stabilizes your dog and prevents them from struggling.',
      'MANY USES: Provides full body support for injured dogs, elderly dogs with weak legs or dogs suffering from orthopedic injuries.',
      'QUALITY GUARANTEE: Wakytu offers a 3-year warranty service.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71bgbXfa7lL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Wakytu Dog Emergency Rescue Sling on a white background',
    },
  },
  {
    id: 'dual-handle-dog-lifting-harness',
    name: 'Lafoty Dog Lifting Harness',
    category: 'carry',
    badge: 'Lift Harness',
    asin: 'B0GH76XGKZ',
    amazonUrl: 'https://www.amazon.com/dp/B0GH76XGKZ?tag=chill-dogs-20',
    useCase:
      'LIFT & WALK WITH CONFIDENCE: Designed to support dogs with injuries, limited hind leg mobility, arthritis, or post-surgery recovery. Helps your dog stand, walk, and move safely with less strain.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'DUAL HANDLES FOR FLEXIBLE CONTROL: Two integrated lift handles provide maximum control.',
      'LIFT HEAVY DOGS WITH LESS EFFORT: Distributes weight evenly to reduce strain on your back and arms.',
      'BREATHABLE, SECURE & VERSATILE DESIGN: Soft, breathable fabric ensures all-day comfort. Converts to a standard harness, with an integrated handle that can also function as a dog leash.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71JmtA9r9qL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Lafoty Dog Lifting Harness on a white background',
    },
  },
  {
    id: 'onetigris-full-body-dog-carry-sling',
    name: 'OneTigris Full Body Dog Carry Sling',
    category: 'carry',
    badge: 'Full-Body Carry Sling',
    asin: 'B0GRV66Y6X',
    amazonUrl: 'https://www.amazon.com/dp/B0GRV66Y6X?tag=chill-dogs-20',
    useCase:
      'FULL-BODY SUPPORT HARNESS - Evenly distributes weight to keep your dog stable and supported. Ideal lift assistance with spine protection.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'INTERIOR MOBILITY AID - Ideal for helping dogs stand up, turn around, or move safely. With wide, adjustable padded shoulder straps for single-shoulder or crossbody use, offering controlled movement.',
      'REINFORCED DUAL HANDLES - 2 side handles allow for controlled lifting and help reduce the load on the carrier\'s back and maximize comfort for the pup being lifted.',
      'REHAB-FOCUSED DESIGN - Built for post-surgery recovery and physical therapy to help dogs rebuild gait and muscle strength, with padded leg straps to ensure a breathable fit for longer wear.',
      'COMFORT-FIRST MATERIALS - 420D nylon that’s strong and durable, with extra-padded mesh lining for breathability, and quality UTX-Duraflex buckles that are lightweight and waterproof.',
      'COMPACT & SAFE - Comes with a storage pouch for easy packing and reflective strips for visibility in low light.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71JCo5FMVWL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'OneTigris Full Body Dog Carry Sling on a white background',
    },
  },
  {
    id: 'canine-canyon-rover-rescue-carry-harness',
    name: 'Canine Canyon Rover Rescue Dog Carry Harness',
    category: 'carry',
    badge: 'Carry Harness',
    useCase: 'Crafted with padded, breathable air mesh for superior comfort and ventilation.',
    bestFor: 'Owners who want another retailer option for a structured carry harness.',
    bullets: [
      'Versatile design allows you to wear it on your front or back, providing maximum convenience and adaptability.',
      'Durable buckles and sturdy straps make it ready for any adventure, ensuring reliable support on tough terrain.',
      'Perfect for dogs needing extra help due to mobility issues, surgery recovery, or accidents.',
      'Multi-purpose rescue harness offers support for rugged trails, carrying tired pups to safety, or emergency evacuation.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fcanine-canyon-rover-rescue-dog-carry%2Fdp%2F2103910&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/canine-canyon-rover-rescue-dog-carry/dp/2103910',
        merchantProductId: '2103910',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0696a596-5006-7f7d-8000-3095cbc414f4._AC_SS1800_V1_.jpg',
      alt: 'Canine Canyon Rover Rescue Dog Carry Harness on a white background',
    },
  },
  {
    id: 'ruffwear-backtrak-evacuation-kit',
    name: 'Ruffwear BackTrak Evacuation Kit',
    category: 'carry',
    badge: 'Carry Harness',
    useCase: 'Emergency evacuation kit includes a first-aid muzzle and a human vest with an attached dog sling.',
    bestFor: 'Owners who want a carry option from a known outdoor-dog gear brand.',
    bullets: [
      'The lightweight muzzle with adjustable fit is for first-aid use only.',
      'The human vest features adjustable waist, chest, and lightly padded shoulder straps.',
      'Continuous-support webbing straps help distribute weight and can be worn with your dog in the front or back.',
      'Color-coded adjustable straps on the dog sling provide easy and intuitive attachments.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fruffwear-backtrak-evacuation-kit-dog%2Fdp%2F3588422&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/ruffwear-backtrak-evacuation-kit-dog/dp/3588422',
        merchantProductId: '3588422',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0690274e-190f-7145-8000-6efe9d4396f3._AC_SS1800_V1_.jpg',
      alt: 'Ruffwear BackTrak Evacuation Kit on a white background',
    },
  },
  {
    id: 'non-stop-dogwear-dog-rescue-sling',
    name: 'Non-stop Dogwear Dog Rescue Sling',
    category: 'carry',
    badge: 'Rescue Sling',
    useCase: 'Designed for emergency situations to easily transport injured or unable-to-walk dogs.',
    bestFor: 'Owners who want another sling-style carry option from Chewy.',
    bullets: [
      'Lightweight and packable for convenience on every outing.',
      'Trusted by rescue teams worldwide, making it a reliable choice for any emergency.',
      'Universal fit allows for the quick and secure placement of your dog without the need for adjustments.',
      'Weight distribution minimizes strain for the handler.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fnon-stop-dogwear-dog-rescue-sling%2Fdp%2F3598582&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/non-stop-dogwear-dog-rescue-sling/dp/3598582',
        merchantProductId: '3598582',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0699f533-e038-7213-8000-f831fec2093a._AC_SS1800_V1_.jpg',
      alt: 'Non-stop Dogwear Dog Rescue Sling on a white background',
    },
  },
];

const stretcherReviewCandidates: EmergencyProduct[] = [
  {
    id: 'veehoo-dog-stretcher',
    name: 'Veehoo Dog Stretcher',
    category: 'stretcher',
    badge: 'Dog Stretcher',
    asin: 'B0GJD28NRT',
    amazonUrl: 'https://www.amazon.com/dp/B0GJD28NRT?tag=chill-dogs-20',
    useCase:
      'LOAD CAPACITY & DURABILITY: High-strength aluminum alloy frame reinforced with dual steel bars supports up to 260 lbs. Engineered to withstand real emergencies without bending or warping.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'DESIGNED FOR SAFE TRANSPORT: Three adjustable quick-release safety straps. Wide non-slip rubber grip handles on both ends ensure a secure hold and protect hands, even in wet conditions.',
      'READY IN SECONDS, STOWS ANYWHERE: Collapses from full size (84" × 22") to a compact 42" × 8" in under 10 seconds—no tools or assembly required. Fits easily into any vehicle trunk or emergency kit.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/31tfS6BLmmL._SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Veehoo Dog Stretcher on a white background',
    },
  },
  {
    id: 'patient-aid-portable-stretcher',
    name: 'Patient Aid Portable Stretcher & Gurney',
    category: 'stretcher',
    badge: 'Soft Stretcher',
    asin: 'B07GVSG62X',
    amazonUrl: 'https://www.amazon.com/dp/B07GVSG62X?tag=chill-dogs-20',
    useCase: '600lb weight capacity.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Folds into small package for easy storage.',
      'Made of heavy duty nylon material that can stand up to any conditions.',
      'Durable and machine washable.',
      'Comes with eight padded heavy duty hand grips to evenly distribute weight over the sheet and provide ergonomic lifting.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/41dGfUbQPuL._SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Patient Aid Portable Stretcher and Gurney on a white background',
    },
  },
  {
    id: 'gray-large-dog-stretcher',
    name: 'ChengFu Dog Stretcher',
    category: 'stretcher',
    badge: 'Dog Stretcher',
    asin: 'B0F6YL3LT1',
    amazonUrl: 'https://www.amazon.com/dp/B0F6YL3LT1?tag=chill-dogs-20',
    useCase: 'Crafted from select Oxford fabric, which is tough enough to withstand up to 300 pounds.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Measures 48 x 40 inches, which is large enough to transport a wide range of dog breeds.',
      'The lightweight design and unique foldable structure make it easy to store and takes up very little space.',
      'Unlike traditional stretcher bars with fixed supports, this stretcher bar features a flexible Oxford fabric design. It retains toughness and support while adjusting more easily in narrow environments.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71Awahd2M8L._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'ChengFu Dog Stretcher on a white background',
    },
  },
  {
    id: 'black-pet-emergency-stretcher',
    name: 'Botuwase Pet Stretcher',
    category: 'stretcher',
    badge: 'Dog Stretcher',
    asin: 'B0FD8KWS9L',
    amazonUrl: 'https://www.amazon.com/dp/B0FD8KWS9L?tag=chill-dogs-20',
    useCase: 'SUPPORTS UP TO 300 POUNDS: Made from durable nylon material, it features 8 sturdy handles for balanced support.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'DESIGNED FOR COMFORT & EASY HANDLING: This lightweight stretcher allows for smooth navigation through tight spaces. The neoprene-covered handles ensure a comfortable grip, no matter the weight.',
      'FOLDABLE & EASY TO STORE: Folds up easily for transport and storage, taking up minimal space.',
      'ONE SIZE FITS MOST DOGS: Measures 44 x 28.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/61Piwka25aL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Botuwase Pet Stretcher on a white background',
    },
  },
];

const firstAidReviewCandidates: EmergencyProduct[] = [
  {
    id: 'arca-pet-car-first-aid-kit',
    name: 'ARCA PET Cat & Dog First Aid Kit for Car',
    category: 'first-aid',
    badge: 'First Aid Kit',
    asin: 'B07WRPCLYR',
    amazonUrl: 'https://www.amazon.com/dp/B07WRPCLYR?tag=chill-dogs-20',
    useCase:
      'PET EMERGENCY ESSENTIALS: Includes a dog thermometer, dog muzzle, tick kit, emergency flashlight, and a mini first aid kit pouch.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'PET CARE GUIDE: Contains a comprehensive first aid manual with essential instructions for treating everything from snake bites to minor injuries.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/919bY8axD4L._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'ARCA PET Cat and Dog First Aid Kit for Car on a white background',
    },
  },
  {
    id: 'arca-pet-reflective-first-aid-pouch',
    name: 'ARCA PET Dog First Aid Kit',
    category: 'first-aid',
    badge: 'First Aid Kit',
    asin: 'B097PLDD92',
    amazonUrl: 'https://www.amazon.com/dp/B097PLDD92?tag=chill-dogs-20',
    useCase: '35 PCS EMERGENCY ESSENTIALS: Contains gloves, antiseptic, tweezers, scissors, first aid book and more.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'IDEAL FOR ALL OUTDOOR: Useful for dog hunting and dog camping gear.',
      'PORTABLE & LIGHTWEIGHT: Compact yet complete.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/81YQs25G6VL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'ARCA PET Dog First Aid Kit on a white background',
    },
  },
  {
    id: 'arca-pet-100-piece-first-aid-kit',
    name: 'ARCA PET Cat & Dog First Aid Kit',
    category: 'first-aid',
    badge: 'First Aid Kit',
    asin: 'B09FKVQQVH',
    amazonUrl: 'https://www.amazon.com/dp/B09FKVQQVH?tag=chill-dogs-20',
    useCase: 'COMPREHENSIVE EMERGENCY KIT: Over 100 vital items including a pet thermometer and medicine feeder.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'HIGH-VISIBILITY: Features a reflective zipper and fluorescent lettering.',
      'PET CARE GUIDE: Contains a comprehensive first aid manual with essential instructions for treating everything from snake bites to minor injuries.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/91ZV6pYT5QL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'ARCA PET Cat and Dog First Aid Kit on a white background',
    },
  },
  {
    id: 'adventure-dog-medical-kit-vet-in-a-box',
    name: 'Adventure Dog Medical Kit - Vet in a Box',
    category: 'first-aid',
    badge: 'First Aid Kit',
    asin: 'B08ZFVZPHM',
    amazonUrl: 'https://www.amazon.com/dp/B08ZFVZPHM?tag=chill-dogs-20',
    useCase: 'DISPOSABLE SKIN STAPLER: Close serious wounds in the field when far from medical care.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'QUIKCLOT GAUZE & HEMOSTAT FORCEPS: Stop bleeding fast.',
      'LED HEADLAMP: Illuminate the night so your hands stay free while you administer first aid to your dog.',
    ],
    ctaLabel: 'Check Price on Amazon',
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fadventure-medical-kits-adventure-dog%2Fdp%2F250995&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/adventure-medical-kits-adventure-dog/dp/250995',
        merchantProductId: '250995',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/81t9FSgXDoL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Adventure Dog Medical Kit - Vet in a Box on a white background',
    },
  },
  {
    id: 'compact-dog-first-aid-travel-pack',
    name: 'Rubyloo Dog First Aid Kit',
    category: 'first-aid',
    badge: 'First Aid Kit',
    asin: 'B0B1W6VLKW',
    amazonUrl: 'https://www.amazon.com/dp/B0B1W6VLKW?tag=chill-dogs-20',
    useCase: 'PACKED WITH PET ESSENTIALS: Includes vet-wrap, tick remover, cleansing wipes, saline wash, thermal blanket & more.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'BUILT FOR BACKPACKING & ADVENTURE: Soft case fits in backpacks, glove compartments, or car consoles. Ideal for travel, hunting, road trips, camping, and everyday dog hiking gear.',
      'STEP-BY-STEP PET FIRST AID GUIDE INCLUDED: Easy-to-follow manual covers injuries, bleeding, ticks, and emergencies.',
      'PET-SAFE MATERIALS: Supplies are made with non-toxic, pet-safe materials.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71aAipRmSFL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Rubyloo Dog First Aid Kit on a white background',
    },
  },
  {
    id: 'dog-first-aid-essential-pack',
    name: 'Rubyloo Dog First Aid Kit',
    category: 'first-aid',
    badge: 'First Aid Kit',
    asin: 'B0B1W5R11Y',
    amazonUrl: 'https://www.amazon.com/dp/B0B1W5R11Y?tag=chill-dogs-20',
    useCase:
      'BE PREPARED FOR ANY PET EMERGENCY: Includes vet-wrap, tick remover, first aid pads, saline wash, styptic pencil, slip leash & thermal blanket.',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'BUILT FOR TRAVEL & ADVENTURE: Water resistant, hard-sided case protects supplies in your car or backpack.',
      'STEP-BY-STEP PET FIRST AID GUIDE: Easy-to-follow manual for treating wounds, bites, bleeding, and emergencies.',
      'PET-SAFE & NON-TOXIC MATERIALS: Every item is made with pet-safe, non-toxic materials.',
      'COMPACT, DURABLE & ORGANIZED CASE: Hard-sided waterproof case features a strong zipper, mesh pockets, and reflective printing.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/81EMxVmHhZL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Rubyloo Dog First Aid Kit on a white background',
    },
  },
];

const warmthReviewCandidates: EmergencyProduct[] = [
  {
    id: 'sierra-madre-emergency-sleeping-bag',
    name: 'Sierra Madre Emergency Sleeping Bag',
    category: 'warmth-control',
    badge: 'Sleeping Bag',
    asin: 'B0F2CBR1T1',
    amazonUrl: 'https://www.amazon.com/dp/B0F2CBR1T1?tag=chill-dogs-20',
    useCase: 'STAY WARM IN ANY EMERGENCY: Designed for survival in extreme conditions. Reflects 90% of body heat',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'WATERPROOF & WINDPROOF PROTECTION: Tear-resistant, insulating material',
      'ULTRALIGHT WITH FULL COVERAGE: Weighing just 6 ounces, this survival bivy sack packs down small',
      'DURABLE & REUSABLE: Tough enough for multiple uses. Just fold it up and store it back in the drawstring stuff sack for your next adventure',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/51UjfhM1q0L._AC_SX300_SY300_QL70_FMwebp_.jpg',
      alt: 'Sierra Madre Emergency Sleeping Bag on a white background',
    },
  },
  {
    id: 'frelaxy-emergency-blanket-pack',
    name: 'Frelaxy Emergency Blanket',
    category: 'warmth-control',
    badge: 'Emergency Blanket',
    asin: 'B0CLV3YJDX',
    amazonUrl: 'https://www.amazon.com/dp/B0CLV3YJDX?tag=chill-dogs-20',
    useCase: 'WHISTLE + BLANKET FOR DOUBLE PROTECTION: Each emergency blanket comes with a survival whistle, a waterproof storage pouch, and an EVA case',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      '2X THICKER THAN AVERAGE: Made of Durable 26umPE material',
      '20% LARGER THAN STANDARD: Each blanket is 83" x 60"',
      'LIGHTWEIGHT: Each blanket is only 3 ounces',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71Ynql7JTpL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Frelaxy Emergency Blanket on a white background',
    },
  },
];

const slipLeadReviewCandidates: EmergencyProduct[] = [
  {
    id: 'petarea-reflective-slip-lead',
    name: 'Petarea 5 FT Slip Lead Dog Leash',
    category: 'warmth-control',
    badge: 'Slip Lead',
    asin: 'B0C3CDQGJQ',
    amazonUrl: 'https://www.amazon.com/dp/B0C3CDQGJQ?tag=chill-dogs-20',
    useCase:
      'COLLAR AND LEASH IN ONE: It can be used without a collar or harness. It can be adjusted to fit any dog’s neck size by adjusting the leather stopper',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'HIGHLY REFLECTIVE: Reflective thread braided throughout the leash ensures that you and your dog are safe and visible at night',
      'DURABLE: Made of heavy-duty mountain climbing rope. The woven polyester material and use of high quality metal O-ring and leather provide maximum durability',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71eHzXMqXhL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Petarea 5 FT Slip Lead Dog Leash on a white background',
    },
  },
  {
    id: 'mad-dog-products-orange-slip-lead',
    name: 'Mad Dog Products Slip Lead Dog Leash',
    category: 'warmth-control',
    badge: 'Slip Lead',
    asin: 'B0CRWLL6C1',
    amazonUrl: 'https://www.amazon.com/dp/B0CRWLL6C1?tag=chill-dogs-20',
    useCase: 'NO COLLAR NEEDED: Just slip the loop over the dog’s neck and secure it with the custom locking stopper',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'PREMIUM FEEL: Leashes are soft, machine washable and UV fade-proof. Handmade using quality polypropylene rope and brass rust-proof hardware',
      'MADE IN THE USA: Mad Dog Products are all handcrafted in the United States of America',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/61wxuiDLPWL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Mad Dog Products Slip Lead Dog Leash on a white background',
    },
  },
  {
    id: 'mendota-products-large-slip-lead',
    name: 'Mendota Products Slip Lead',
    category: 'warmth-control',
    badge: 'Slip Lead',
    useCase: 'British-style slip lead is a leash and collar in one',
    bestFor: 'Owners who want a simple backup leash option from Chewy.',
    bullets: [
      'Made from a waterproof, vibrant, long lasting and machine washable polypropylene rope',
      'Soft on the hands',
      'Adjustable to fit any neck size with the oil-tanned leather snap that controls the collar diameter',
      'Handmade in the USA',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fmendota-products-large-slip-confetti%2Fdp%2F144722&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/mendota-products-large-slip-confetti/dp/144722',
        merchantProductId: '144722',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/mendota-products-large-slip-confetti-rope-dog-leash-hi-viz-yellow-4ft-long-12in-wide/img-416316._AC_SS1800_V1_.jpg',
      alt: 'Mendota Products Large Slip Confetti Rope Dog Leash in hi-viz yellow on a white background',
    },
  },
  {
    id: 'water-woods-braided-rope-slip-dog-lead',
    name: 'Water & Woods Braided Rope Slip Dog Lead',
    category: 'warmth-control',
    badge: 'Slip Lead',
    useCase: 'Made from soft, durable braided rope material',
    bestFor: 'Owners who want another rope-lead option from Chewy.',
    bullets: [
      'Features a two-in-one collar and leash combination',
      'Features leather slides that allow for sizing adjustments',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fwater-woods-braided-rope-slip-dog%2Fdp%2F650214&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/water-woods-braided-rope-slip-dog/dp/650214',
        merchantProductId: '650214',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/water-woods-braided-rope-slip-dog-leash-green/img-450905._AC_SS1800_V1_.jpg',
      alt: 'Water & Woods Braided Rope Slip Dog Leash in green on a white background',
    },
  },
];

const preventionReviewCandidates: EmergencyProduct[] = [
  {
    id: 'ultra-thin-20000mah-power-bank',
    name: 'Neoseek Ultra-Thin 20,000 mAh Power Bank',
    category: 'prevention',
    badge: 'Power Bank',
    asin: 'B0FY6TVDHQ',
    amazonUrl: 'https://www.amazon.com/dp/B0FY6TVDHQ?tag=chill-dogs-20',
    useCase: "SLIM POWERHOUSE: 0.7'' power bank. Built from tough, lightweight aerospace aluminum",
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      '45W HIGH-SPEED CHARGING: Output 45W to your devices while inputting 40W to the power bank itself. Get a 50% charge for your iPhone 16 Pro in 27 minutes',
      'MASSIVE 20,000mAh CAPACITY: Can fully charge an iPhone 16 four times over',
      'TRAVEL-READY DESIGN: Comes with a built-in braided cable and a USB-C port. Power up two devices at the same time',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/51ikc21h3qL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Neoseek Ultra-Thin 20,000 mAh Power Bank on a white background',
    },
  },
  {
    id: 'cuktech-25000mah-power-bank',
    name: 'CUKTECH 25,000mAh Power Bank',
    category: 'prevention',
    badge: 'Power Bank',
    asin: 'B0GHHDV7Y9',
    amazonUrl: 'https://www.amazon.com/dp/B0GHHDV7Y9?tag=chill-dogs-20',
    useCase: '100W ULTRA-FAST OUTPUT: With a 100W peak output, this power bank can charge a MacBook Air 13" (M3) to 56% in just 30 mins',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      '25,000mAh HIGH CAPACITY: Airline approved. Provides up to 3.2 full charges for iPhone 17 Pro Max or 1.2 charges for MacBook Air',
      'CHARGE 3 DEVICES AT ONCE: Equipped with an integrated USB-C cable, one USB-C port, and one USB-A port',
      '100W RAPID RECHARGE: 15 mins for 25% power. A quick 15-min charge refuels enough to add 33 hours of extra runtime for iPhone 17',
      'ADVANCED SAFETY PROTECTION: Multi-point safety system features real-time temperature monitoring to guard against overheating',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/51zFD9uYSYL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'CUKTECH 25,000mAh Power Bank on a white background',
    },
  },
  {
    id: '50000mah-built-in-cable-power-bank',
    name: 'JKELAR Portable Charger Power Bank 50000mAh',
    category: 'prevention',
    badge: 'Power Bank',
    asin: 'B0GXF114LP',
    amazonUrl: 'https://www.amazon.com/dp/B0GXF114LP?tag=chill-dogs-20',
    useCase:
      'MASSIVE 50000mAh CAPACITY: Delivers a week’s worth of reliable energy. With universal compatibility, it safely charges iPhones, Android phones, and tablets',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'BUILT-IN CABLES FOR ALL iPHONES & TYPE-C PHONES: Features a built-in Type-C cable and a Lightning cable, combined with an extra USB-C port to charge multiple devices simultaneously',
      'SUPER FAST 22.5W CHARGING: Engineered with advanced 22.5W fast-charging tech, this power bank fuels the iPhone 17 Pro Max up to 85% in 30 minutes',
      '2 WAYS TO FAST RECHARGE & MULTI-SAFE PROTECTION: Featuring both USB-C and Micro USB inputs, it offers flexible dual recharge options. With PD 18W rapid input, it achieves a 75% charge in 2 hours. Backed by a certified system for overcharge and short-circuit protection, it features an LED display and emergency flashlight',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71UH61Eu7xL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'JKELAR Portable Charger Power Bank 50000mAh on a white background',
    },
  },
  {
    id: '10000mah-built-in-cable-power-bank',
    name: 'Emmyuluo Portable Charger 10000mAh Power Bank',
    category: 'prevention',
    badge: 'Power Bank',
    asin: 'B0GTR1575S',
    amazonUrl: 'https://www.amazon.com/dp/B0GTR1575S?tag=chill-dogs-20',
    useCase: '10,000mAh POWER BANK: Charges iPhone 16 up to 2.2 times, Samsung S24 up to 1.8 times, or AirPods Pro up to 12 times',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'WITH 4 BUILT-IN CABLES: iOS, USB-C, and Micro USB. Charge up to 5 devices at the same time',
      'SMART LED DIGITAL DISPLAY: Shows the exact remaining battery percentage (0–100%), so you never have to guess when to recharge',
      'COMPACT AND LIGHTWEIGHT: It easily slips into pockets, purses, or backpacks',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/81ZQvpeFRaL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Emmyuluo Portable Charger 10000mAh Power Bank on a white background',
    },
  },
  {
    id: 'nebo-mycro-450-headlamp',
    name: 'NEBO MYCRO 450 Headlamp',
    category: 'prevention',
    badge: 'Headlamp',
    asin: 'B0F1ZFMVXG',
    amazonUrl: 'https://www.amazon.com/dp/B0F1ZFMVXG?tag=chill-dogs-20',
    useCase: '450 LUMEN RECHARGEABLE HEADLAMP: Powerful LED headlamp with a focused spot beam',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      '6 LIGHT MODES: Includes Turbo, High, Medium, Low, plus red and green light modes to preserve night vision. Smart Power Control optimizes brightness and runtime for efficient performance',
      '2-IN-1 HEADLAMP + CAP LIGHT DESIGN: Quickly converts from a headlamp to a clip-on cap light for versatile, hands-free lighting',
      'USB-C RECHARGEABLE + SMART FEATURES: Built-in rechargeable battery with up to 5-hour runtime. Features PowerSave lockout, mode memory recall, and battery indicator',
      'DURABLE, WEATHER-RESISTANT BUILD: IPX4 water-resistant and impact-resistant construction with aluminum and ABS housing',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/81qMbGgYilL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'NEBO MYCRO 450 Headlamp on a white background',
    },
  },
  {
    id: 'nitecore-nu20-classic-headlamp',
    name: 'Nitecore NU20 Classic Ultralight Headlamp',
    category: 'prevention',
    badge: 'Headlamp',
    asin: 'B0DCQDXSS5',
    amazonUrl: 'https://www.amazon.com/dp/B0DCQDXSS5?tag=chill-dogs-20',
    useCase: 'ULTRA-LIGHT & POWERFUL: Weighs just 1.34 oz yet delivers up to 360 lumens with a beam distance of 119 yards',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      '3 LIGHT MODES + SAFETY FEATURES: Main white LED with 3 brightness levels, plus SOS & Beacon, a soft reading light, and an auxiliary red light for night vision',
      'LONG RUNTIME & FAST CHARGING: Up to 97 hours of use on low mode; recharges in just over an hour via USB-C',
      'DURABLE OUTDOOR-READY DESIGN: Built from rugged PC material, rated IP66 waterproof and 1m impact resistant',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71Dx1Xloz2L._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Nitecore NU20 Classic Ultralight Headlamp on a white background',
    },
  },
  {
    id: 'nitecore-nu25-headlamp',
    name: 'Nitecore NU25 360 Lumen Triple Output',
    category: 'prevention',
    badge: 'Headlamp',
    asin: 'B077Z3LNX9',
    amazonUrl: 'https://www.amazon.com/dp/B077Z3LNX9?tag=chill-dogs-20',
    useCase: '360 LUMEN WIDE BEAM: Featuring a CREE XP-G2 S3 LED for a primary output, the NU25 is capable of 360 lumen max output and 88 yards of throw',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'AUXILIARY HIGH CRI AND RED LED LIGHTS: The high CRI auxiliary light produces richer more natural looking colors over standard LEDs. The auxiliary red LED is great for preserving night vision',
      'COMPACT AND LIGHTWEIGHT: Weighs less than an ounce (0.99oz w/o headband, 1.9oz w/ headband)',
      'NO CHARGER NEEDED: Built-in micro-USB battery can be charged using a micro-USB charging cable connected to any USB power source',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71Y2uzYi8WL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Nitecore NU25 360 Lumen Triple Output on a white background',
    },
  },
  {
    id: 'energizer-led-headlamp',
    name: 'Energizer LED Headlamp',
    category: 'prevention',
    badge: 'Headlamp',
    asin: 'B00TI8GSE2',
    amazonUrl: 'https://www.amazon.com/dp/B00TI8GSE2?tag=chill-dogs-20',
    useCase: '4 MODES: White Spot light, White Flood light, Spot and Flood together, Red Night Vision',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'LED LIGHT',
      'THREE BRIGHTNESS LEVELS',
      'ADJUSTIBLE ANGLE',
      'BATTERY POWERED',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71x2yk0T1yL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Energizer LED Headlamp on a white background',
    },
  },
  {
    id: 'coast-wph34r-rechargeable-headlamp',
    name: 'Coast WPH34R 2000 Lumen Waterproof Headlamp',
    category: 'prevention',
    badge: 'Headlamp',
    asin: 'B0BWSQWXPC',
    amazonUrl: 'https://www.amazon.com/dp/B0BWSQWXPC?tag=chill-dogs-20',
    useCase: 'SIX OUTPUT MODES SPANNING THREE BEAM COLORS: Green, white and red',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'HINGED BEAM ADJUSTMENT',
      'LIFETIME WARRANTY',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71eXvU0NusL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Coast WPH34R 2000 Lumen Waterproof Headlamp on a white background',
    },
  },
  {
    id: 'sunrei-rechargeable-headlamp',
    name: 'SUNREI Rechargeable Headlamp',
    category: 'prevention',
    badge: 'Headlamp',
    asin: 'B0G4W14R1Y',
    amazonUrl: 'https://www.amazon.com/dp/B0G4W14R1Y?tag=chill-dogs-20',
    useCase: 'ULTRA-BRIGHT 500 LUMENS: Includes spotlight, floodlight, mixed beam, red light, and red flashing modes',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'USB-C RECHARGEABLE WITH 2200mAh BATTERY: Long runtime up to 200 hours. Supports fast charging with power banks, wall chargers, or car adapters',
      'HANDS-FREE MOTION SENSOR: Activate the motion sensor mode to turn the headlamp on or off with just a wave',
      'WATERPROOF: Designed with IPX6 waterproof protection to withstand heavy rain and harsh outdoor conditions',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/61FEUjQgqQL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'SUNREI Rechargeable Headlamp on a white background',
    },
  },
];

export const emergencyProducts: EmergencyProduct[] = [
  {
    id: 'fido-pro-airlift-rescue-sling',
    name: 'Fido Pro Airlift Emergency Dog Rescue Sling',
    category: 'carry',
    badge: 'Rescue Sling',
    asin: 'B0BCJT919V',
    amazonUrl: 'https://www.amazon.com/dp/B0BCJT919V?tag=chill-dogs-20',
    useCase: 'EMERGENCY DOG CARRYING SLING: Allows you to safely carry your injured or sick dog, even in rugged terrain.',
    bestFor: 'Hikers and trail walkers who need a compact way to carry a dog out',
    bullets: [
      'LIGHTWEIGHT AND PACKABLE: Weighs just 13 oz. Fits into a small stuff sack.',
      '8-POINT SUPPORT FOR SAFE TRANSPORT: Cradles your dog, evenly distributing weight from head to tail for a comfortable and secure carry.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/61cEfEWdGTL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Fido Pro Airlift emergency dog rescue sling on a white background',
    },
  },
  {
    id: 'rock-n-rescue-sar-dog-harness',
    name: 'Rock-N-Rescue SAR Dog Harness',
    category: 'carry',
    badge: 'Rescue Harness',
    asin: 'B00MIZ7UVC',
    amazonUrl: 'https://www.amazon.com/dp/B00MIZ7UVC?tag=chill-dogs-20',
    useCase:
      'THE ULTIMATE CANINE SAR HARNESS: A full body harness designed specifically for Search and Rescue dogs. Helps you safely and securely lower or raise your dog in technical rescue situations.',
    bestFor: 'Large-dog owners who want a sturdier carry option in the car',
    bullets: [
      'ULTRA STRONG AND WEAR-RESISTANT NYLON: Delivers superior resistance to abrasion, tearing, and heavy loads.',
      'INCLUDES A STORAGE BAG: So you can keep the harness clean and in good condition until the next time you need it.',
      'AMERICAN MADE: Proudly made by Rock-N-Rescue in the U.S.A.',
    ],
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
    badge: 'First Aid Kit',
    asin: 'B00T72ST0A',
    amazonUrl: 'https://www.amazon.com/dp/B00T72ST0A?tag=chill-dogs-20',
    useCase: 'DUAL PURPOSE DESIGN: Provides both human and canine first aid essentials.',
    bestFor: 'Most owners building one practical car or trail kit',
    bullets: [
      'COMPREHENSIVE GUIDES: Equipped with a Pet First Aid manual and Wilderness & Travel Medicine Guide.',
      'WATERPROOF STORAGE: Includes DryFlex waterproof bags, keeping your medical supplies dry and intact in various weather conditions.',
      'EMERGENCY EQUIPMENT: Features an emergency cold pack and a SOL emergency blanket.',
      'PRACTICAL TOOLS: Contains a 10 CC irrigation syringe and a splinter picker.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fadventure-medical-kits-dog-series-me%2Fdp%2F250997&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/adventure-medical-kits-dog-series-me/dp/250997',
        merchantProductId: '250997',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/91eY4r3AyEL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Adventure Medical Kits Me and My Dog first aid kit on a white background',
    },
  },
  {
    id: 'adventure-medical-trail-dog-kit',
    name: 'Adventure Medical Kits Trail Dog First Aid Kit',
    category: 'first-aid',
    badge: 'First Aid Kit',
    asin: 'B00T72ST1Y',
    amazonUrl: 'https://www.amazon.com/dp/B00T72ST1Y?tag=chill-dogs-20',
    useCase: 'SPLINTER PICKER/TICK REMOVER: Safely remove splinters and ticks from your dog’s paws and body.',
    bestFor: 'Minimalist hikers who need a light kit that actually comes along',
    bullets: [
      'TRIANGULAR BANDAGE: Safely administer first aid to your dog by first muzzling them with this triangular bandage.',
      'COHESIVE ELASTIC BANDAGE: Easily wrap injuries with this self-adhering bandage which doesn’t stick to fur.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fadventure-medical-kits-dog-series%2Fdp%2F250999&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/adventure-medical-kits-dog-series/dp/250999',
        merchantProductId: '250999',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/91n+0ewODtL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Adventure Medical Kits Trail Dog first aid kit on a white background',
    },
  },
  {
    id: 'adventure-medical-workin-dog-kit',
    name: "Adventure Medical Kits Workin' Dog First Aid Kit",
    category: 'first-aid',
    badge: 'First Aid Kit',
    asin: 'B018ONRL2E',
    amazonUrl: 'https://www.amazon.com/dp/B018ONRL2E?tag=chill-dogs-20',
    useCase: 'COMPREHENSIVE CARE WITH QUIKCLOT: Stops bleeding quickly with kaolin.',
    bestFor: 'Owners who want QuikClot, lighting, and a broader emergency supply set in one case',
    bullets: [
      'RUGGED DESIGN: Compact dog emergency kit fits easily under a car seat.',
      'HANDS-FREE UTILITY: An LED headlamp ensures you can tend to your pet in any setting.',
      'EMERGENCY GUIDE: Comes with a manual offering clear instructions for dog emergency essentials.',
      'FIELD-TESTED: Features QuikClot, self-adhering bandages, cold pack, leash, headlamp, emergency blanket, and more.',
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/91IP+BIHSvL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: "Adventure Medical Kits Workin' Dog first aid kit on a white background",
    },
  },
  {
    id: 'kurgo-50-piece-dog-first-aid-kit',
    name: 'Kurgo 50-Piece Dog First Aid Kit',
    category: 'first-aid',
    badge: 'First Aid Kit',
    asin: 'B00IKRVU90',
    amazonUrl: 'https://www.amazon.com/dp/B00IKRVU90?tag=chill-dogs-20',
    useCase:
      'BE PREPARED ANYWHERE: Dog first aid travel kit featuring a mesh compartment system and 50 essential pieces.',
    bestFor: 'Owners who want an organized soft case for cuts, choking, and general emergencies',
    bullets: [
      'COMPACT & DURABLE DESIGN: Built with durable oxford fabric. Includes an integrated hook and bottle opener for easy hanging and quick access.',
      'ORGANIZED & VERSATILE: Features three interior mesh compartments, a zippered pocket, and parachute cord utility to keep pet bandages, gloves, and tools organized.',
      'DURABLE GEAR, LIFETIME PROMISE: Engineered for longevity and reliability. Crafted with rugged materials and backed by a lifetime warranty.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fkurgo-first-aid-kit-dogs-cats%2Fdp%2F56782&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/kurgo-first-aid-kit-dogs-cats/dp/56782',
        merchantProductId: '56782',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/81QdYcNIVeL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Kurgo dog first aid kit on a white background',
    },
  },
  {
    id: 'kurgo-rsg-first-aid-kit',
    name: 'Kurgo RSG First Aid Kit for Dogs',
    category: 'first-aid',
    badge: 'First Aid Kit',
    useCase: '49-piece kit. Includes a variety of first aid tools and essentials.',
    bestFor: 'Owners who want another compact dog-first-aid option from Chewy.',
    bullets: [
      'Wearable first aid kit.',
      'Complements the RSG Activity Belt and County or Townie Harness.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fkurgo-rsg-first-aid-kit-dogs%2Fdp%2F207876&subId1=dog-snake-bite-emergency-kit&subId2=product-card',
        canonicalUrl: 'https://www.chewy.com/kurgo-rsg-first-aid-kit-dogs/dp/207876',
        merchantProductId: '207876',
        status: 'active' as const,
      },
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/kurgo-rsg-first-aid-kit-for-dogs/img-568019._AC_SS1800_V1_.jpg',
      alt: 'Kurgo RSG First Aid Kit for Dogs on a white background',
    },
  },
  ...firstAidReviewCandidates,
  {
    id: 'swiss-safe-mylar-emergency-blankets',
    name: 'Swiss Safe Mylar Emergency Blankets',
    category: 'warmth-control',
    badge: 'MYLAR BLANKET',
    asin: 'B01LZN0KGB',
    amazonUrl: 'https://www.amazon.com/dp/B01LZN0KGB?tag=chill-dogs-20',
    useCase: 'Mylar blanket add-on for emergency warmth during transport',
    bestFor: 'Every kit, because they are cheap and easy to stash',
    bullets: [
      'EFFECTIVELY REFLECTS & RETAINS HEAT: Engineered with advanced dual-sided aluminized Mylar technology, to retain 90% of body heat.',
      'PORTABLE DESIGN FOR ANY ADVENTURE: Built with military-grade 12-micron aluminized polyethylene mylar. Ultra-compact.',
      'HEAVY DUTY YET LIGHTWEIGHT: Designed to be hard to rip, offering reliable protection against wind and rain.',
      'WATERPROOF AND VERSATILE: Use them as a blanket, ground cover, shelter, or to protect your gear from the elements.',
      'BONUS SPACE BLANKET INCLUDED: With every purchase, receive a bonus space blanket - a smaller, more compact version. Perfect for keeping in your glove compartment, hiking backpack, or emergency go-bag.',
    ],
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
    badge: 'Dog Muzzle',
    asin: 'B0G6ZKGM85',
    amazonUrl: 'https://www.amazon.com/dp/B0G6ZKGM85?tag=chill-dogs-20',
    useCase:
      'HUMANIZED DESIGN: Features a lightweight design that conforms to the contours of the face. The soft lining prevents chafing, and the basket design allows dogs to drink and pant freely.',
    bestFor: 'Owners who want a soft, flexible basket that allows drinking',
    bullets: [
      'SAFE MATERIAL: Made of food-grade liquid silicone, it’s soft and gentle on the skin.',
      'EASY TO CLEAN: Made of soft silicone, it’s easy to rinse, quick-drying, and hygienic. The multiple breathable holes help prevent stuffiness.',
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/71WlU8K7jwL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'HipyPaw black silicone basket dog muzzle on a white background',
    },
  },
  {
    id: 'vinchini-3d-mesh-muzzle',
    name: 'VINCHINI 3D Air Mesh Dog Muzzle',
    category: 'muzzle',
    badge: 'Best Mesh',
    asin: 'B0GKYDN917',
    amazonUrl: 'https://www.amazon.com/dp/B0GKYDN917?tag=chill-dogs-20',
    useCase:
      'ALLOWS PANTING & DRINKING: Allows your pet to breathe naturally, pant, and drink water without restriction, reducing anxiety.',
    bestFor: 'Beagle-sized and medium-breed owners looking for a lightweight budget option',
    bullets: [
      'PREVENTS SCAVENGING & BITING: Acts as an effective mouth guard to stop your dog from chewing unwanted items.',
      'BREATHABLE 3D AIR MESH: Made with durable nylon and soft 3D air mesh fabric. This lightweight construction provides optimal airflow.',
      'SECURE & ESCAPE-PROOF: Features an adjustable neck and snout strap to keep the dog muzzle securely in place.',
    ],
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
    useCase: 'HUMANE SOLUTION FOR SAFER OUTINGS: Gently helps reduce biting, chewing, scavenging, and barking, without making your dog feel restrained.',
    bestFor: 'Hikers and dusk walkers who want added visibility during an emergency carry',
    bullets: [
      'ALL-DAY COMFORT WITH SOFT MESH: Crafted with lightweight, breathable mesh. Smooth edges help prevent rubbing or pressure.',
      'FREEDOM TO DRINK, BREATHE & BE REWARDED: This mesh dog muzzle lets your dog drink water, pant, and enjoy treats during training.',
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/710Yy6xaijL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Pawfun black mesh dog muzzle with reflective straps on a white background',
    },
  },
  {
    id: 'shinylin-basket-mesh-muzzle',
    name: 'Shinylin 6 Sizes Basket Air Mesh Dog Muzzles',
    category: 'muzzle',
    badge: 'Best Multi-Size Set',
    asin: 'B0FK4D9L15',
    amazonUrl: 'https://www.amazon.com/dp/B0FK4D9L15?tag=chill-dogs-20',
    useCase: 'VARIOUS SIZES & COLORS: S, M, L, XL, XXL, XXXL. Suitable for dogs of different breeds.',
    bestFor: 'Multi-dog households or owners who want the widest range of fit options',
    bullets: [
      'BREATHABLE FABRIC: Made of nylon fabric with good breathability and wear resistance.',
      'COMFORTABLE TO WEAR: Compared with traditional metal cage muzzles, this basket air mesh muzzle uses a flexible structure to reduce pressure on the dog’s face; the lining is soft and cushioned to help avoid friction and discomfort.',
      'WIDELY ADAPTABLE: Six sizes can meet the needs of dogs of different sizes, from Chihuahuas to golden retrievers. The adjustable buckle design further optimizes the fit.',
      'FIRM AND WEAR RESISTANT: Uses high density nylon fabric to improve tear resistance while remaining lightweight.',
    ],
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
    useCase: 'HUMANE DOG MUZZLE: Allows for the dog to pant, drink, and eat treats.',
    bestFor: 'Small-dog owners who want an appropriately sized muzzle in the kit',
    bullets: [
      'SECURE AND ADJUSTIBLE FIT: Functional, durable, and effective. Combines security, breathability, and ease of use.',
    ],
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
    useCase: 'ADJUSTABLE DOG MUZZLE: Dual-adjustable straps (snout & neck) with a secure neck connection keep the muzzle snug and anti-slip.',
    bestFor: 'Multi-dog owners who want a spare or need two different sizes',
    bullets: [
      'COMFORTABLE & BREATHABLE: Crafted with high-quality nylon, soft breathable mesh, and skin-friendly fabric. Extra soft padding lines the interior.',
      'HUMANE DESIGN: Leaves ample space for your dog to breathe, pant, and drink water freely.',
      'EASY TO WEAR & CLEAN: Ergonomic design ensures a secure fit. Machine-washable and designed to dry flat.',
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/81I08AKRvAL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'LETSQK two-pack mesh dog muzzle on a white background',
    },
  },
  {
    id: 'lh-ntgr-reflective-muzzle',
    name: 'LH NTGR Adjustable Reflective Dog Muzzle',
    category: 'muzzle',
    badge: 'Best Rubber Basket',
    asin: 'B0GW7K9DGZ',
    amazonUrl: 'https://www.amazon.com/dp/B0GW7K9DGZ?tag=chill-dogs-20',
    useCase:
      'SOFT, LIGHTWEIGHT RUBBER BASKET DESIGN: Allows dogs to eat, drink, and pant freely. Maximizes ventilation to help prevent overheating.',
    bestFor: 'Owners who want reflective safety details and a fully adjustable fit',
    bullets: [
      'COMFORTABLE FIT DESIGN: Features an adjustable head and neck strap.',
      'DOG-FRIENDLY MATERIALS: Made from a soft thermoplastic elastomer material that is lightweight, durable, odorless, and quick to clean.',
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/81dcJbJISXL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'LH NTGR adjustable reflective dog muzzle on a white background',
    },
  },
];

export function getEmergencyProductsByCategory(category: EmergencyProductCategory): EmergencyProduct[] {
  return emergencyProducts.filter((product) => product.category === category);
}
