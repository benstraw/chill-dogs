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
    label: 'Control and Warmth',
    title: 'Control and Warmth',
    intro:
      'These items can help keep your dog safe and warm on the way to the vet.',
  },
  prevention: {
    label: 'Phone and Light',
    title: 'Phone and Visibility Add-ons',
    intro:
      'The best emergency kit is the one that helps you call ahead, see the trail, and leave quickly. A charged phone, backup battery, and headlamp are simple but useful pieces.',
  },
};

const carryReviewCandidates: EmergencyProduct[] = [
  {
    id: 'wakytu-emergency-rescue-sling',
    name: 'Wakytu Dog Emergency Rescue Sling - Lightweight Packable Lift Harness with Handle - Safe Transport for Small Medium Dogs - Ideal for Hiking Skiing（18.5-29.5lbs）',
    category: 'carry',
    badge: 'Rescue Sling Candidate',
    asin: 'B0GFMQT8YJ',
    amazonUrl: 'https://www.amazon.com/dp/B0GFMQT8YJ?tag=chill-dogs-20',
    useCase: 'Review candidate for packable emergency dog carry support',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Emergency Dog Carrying Sling: Designed for hiking, skiing, and other outdoor activities, allowing you to safely carry your injured or sick dog using the dog lift from the trail to safety, even in rugged terrain.',
      'Lightweight and Packable: Just 18 oz, this incredibly lightweight rescue sling for dogs fits into a small stuff sack, making it an essential addition to store in your backpack to ensure you\'re always prepared for emergencies.',
      'Full Body Support : Whether the front or rear legs need support, our dog backpack carrier and dog lift harness provide full body support. well-made buckles can withstand large pulling forces without bursting. it also stabilizes your dog and prevents them from struggling, allowing you to trim their nails with ease.​',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71bgbXfa7lL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Wakytu Dog Emergency Rescue Sling - Lightweight Packable Lift Harness with Handle - Safe Transport for Small Medium Dogs - Ideal for Hiking Skiing（18.5-29.5lbs） on a white background',
    },
  },
  {
    id: 'dual-handle-dog-lifting-harness',
    name: 'Dog Lifting Harness for Medium Dogs, Dual Handle Dog Support Harness for Daily Walking Assistance, Male Dog-Friendly, Breathable & Easy On Mobility Aid, Red, M',
    category: 'carry',
    badge: 'Lift Harness Candidate',
    asin: 'B0GH76XGKZ',
    amazonUrl: 'https://www.amazon.com/dp/B0GH76XGKZ?tag=chill-dogs-20',
    useCase: 'Review candidate for short lifts, stairs, and assisted movement',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Lift & Walk with Confidence: Designed to support dogs with limited hind leg mobility, arthritis, or post-surgery recovery. Helps your dog stand, walk, and move safely with less strain.',
      'Dual Handles for Flexible Control: Two integrated lift handles provide maximum control for different situations—perfect for stairs, walking assistance, or short lifts when your dog needs extra help.',
      'Male Dog-Friendly, No Potty Interference: The thoughtful wrap design avoids belly pressure and does not interfere with potty needs, ensuring comfort and dignity for male dogs during daily use.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71JmtA9r9qL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Dog Lifting Harness for Medium Dogs, Dual Handle Dog Support Harness for Daily Walking Assistance, Male Dog-Friendly, Breathable & Easy On Mobility Aid, Red, M on a white background',
    },
  },
  {
    id: 'onetigris-full-body-dog-carry-sling',
    name: 'OneTigris Full Body Dog Carry Sling for Large Dogs, Dog Lift Harness Backpack Carrier with Handles, for Senior Dogs, Joint Injuries, Up and Down Stairs (Black, XL)',
    category: 'carry',
    badge: 'Full-Body Carry Candidate',
    asin: 'B0GRV66Y6X',
    amazonUrl: 'https://www.amazon.com/dp/B0GRV66Y6X?tag=chill-dogs-20',
    useCase: 'Review candidate for larger dogs that need fuller body support',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'FULL-BODY SUPPORT HARNESS - Evenly distributes weight to keep your dog stable and supported, ideal lift assistance with spine protection for senior dogs, dogs with joint injury or arthritis',
      'INTERIOR MOBILITY AID - Ideal for helping dogs stand up, turn around, or move safely between rooms to prevent slips, with wide, adjustable padded shoulder straps for single-shoulder or crossbody use, offering controlled movement, physio aid, and confidence building',
      'REINFORCED DUAL HANDLES - 2 side handles allow for controlled lifting and help reduce the load on the carrier\'s back and maximize comfort for the pup being lifted for daily life support',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71JCo5FMVWL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'OneTigris Full Body Dog Carry Sling for Large Dogs, Dog Lift Harness Backpack Carrier with Handles, for Senior Dogs, Joint Injuries, Up and Down Stairs (Black, XL) on a white background',
    },
  },
  {
    id: 'vivifying-dog-lift-harness',
    name: 'Vivifying Dog Lift Harness for Large Dogs, Soft Flannel Rear Leg Support Sling, Adjustable Dog Lifting Harness for Weak Back Legs, Senior Injured Disabled Dogs, ACL Surgery Mobility Assist, L, Gray',
    category: 'carry',
    badge: 'Rear Support Candidate',
    asin: 'B0GRGDVZ21',
    amazonUrl: 'https://www.amazon.com/dp/B0GRGDVZ21?tag=chill-dogs-20',
    useCase: 'Review candidate for rear-leg support and short mobility assistance',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Rear Leg Support for Large Dogs – Our dog lift harness helps large dogs with weak back legs, senior mobility needs, injury, disability, or post-surgery movement challenges. Use it for walking, standing, stairs, and car assistance',
      'Soft Flannel for Gentle Support – This gray flannel rear leg support sling provides soft underbelly contact and helps reduce rubbing while lifting. It is a comfortable daily support option for dogs needing hip and joint mobility assistance',
      'Upgraded Non-Slip Style Handle – The upgraded padded handle is designed to stay in place better and provide a more comfortable grip. This dog lifting harness helps owners support large dogs with improved control and less hand strain',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71g9k5dSi8L._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Vivifying Dog Lift Harness for Large Dogs, Soft Flannel Rear Leg Support Sling, Adjustable Dog Lifting Harness for Weak Back Legs, Senior Injured Disabled Dogs, ACL Surgery Mobility Assist, L, Gray on a white background',
    },
  },
  {
    id: 'canine-canyon-rover-rescue-carry-harness',
    name: 'Canine Canyon Rover Rescue Dog Carry Harness',
    category: 'carry',
    badge: 'Chewy Carry Harness',
    useCase: 'Chewy-only rescue carry harness alternative for emergency transport',
    bestFor: 'Owners who want another retailer option for a structured carry harness.',
    bullets: [
      'Structured carry-harness option for moving a dog without asking them to walk farther.',
      'Fits the same evacuation role as the larger carry picks on this page, with a pet-retail checkout option.',
      'Check the current sizing and weight guidance before relying on it in an emergency.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/canine-canyon-rover-rescue-dog-carry/dp/2103910',
        canonicalUrl: 'https://www.chewy.com/canine-canyon-rover-rescue-dog-carry/dp/2103910',
        merchantProductId: '2103910',
        status: 'active' as const,
      },
    ],
  },
  {
    id: 'ruffwear-backtrak-evacuation-kit',
    name: 'Ruffwear BackTrak Evacuation Kit',
    category: 'carry',
    badge: 'Chewy Carry Harness',
    useCase: 'Chewy-only evacuation harness option for trail or car kits',
    bestFor: 'Owners who want a carry option from a known outdoor-dog gear brand.',
    bullets: [
      'Evacuation-focused carry option for getting a dog off the trail or into the car with less extra walking.',
      'Useful if you want a more outdoor-gear-oriented alternative in this category.',
      'Check the current fit guidance and practice the carry at home before an emergency.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/ruffwear-backtrak-evacuation-kit-dog/dp/3588422',
        canonicalUrl: 'https://www.chewy.com/ruffwear-backtrak-evacuation-kit-dog/dp/3588422',
        merchantProductId: '3588422',
        status: 'active' as const,
      },
    ],
  },
  {
    id: 'non-stop-dogwear-dog-rescue-sling',
    name: 'Non-stop Dogwear Dog Rescue Sling',
    category: 'carry',
    badge: 'Chewy Rescue Sling',
    useCase: 'Chewy-only rescue sling option for packable dog carries',
    bestFor: 'Owners who want another sling-style carry option from Chewy.',
    bullets: [
      'Sling-style alternative for carrying a dog instead of having them keep moving after a bite.',
      'Fits better in a trail-focused kit than bulkier car-only transport gear.',
      'Confirm the current size range and carry instructions before counting on it in the field.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/non-stop-dogwear-dog-rescue-sling/dp/3598582',
        canonicalUrl: 'https://www.chewy.com/non-stop-dogwear-dog-rescue-sling/dp/3598582',
        merchantProductId: '3598582',
        status: 'active' as const,
      },
    ],
  },
];

const stretcherReviewCandidates: EmergencyProduct[] = [
  {
    id: 'veehoo-dog-stretcher',
    name: 'Veehoo Dog Stretcher for Large Dogs, Aluminum Alloy Portable Dog Transport Stretcher with Safety Straps, Non-Slip Handles, Waterproof Fabric, for Outdoor Rescue, Senior Dogs, or Hip & Joint Care',
    category: 'stretcher',
    badge: 'Dog Stretcher Candidate',
    asin: 'B0GJD28NRT',
    amazonUrl: 'https://www.amazon.com/dp/B0GJD28NRT?tag=chill-dogs-20',
    useCase: 'Review candidate for a vehicle or group emergency transport kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Load Capacity & Durability: High-strength aluminum alloy frame reinforced with dual steel bars supports up to 260 lbs, delivering high load capacity that outperforms standard stretchers—engineered to withstand real emergencies without bending or warping',
      'Designed for Safe Transport: Three adjustable quick-release safety straps (one on chest, two on legs) securely immobilize patients. Wide non-slip rubber grip handles on both ends ensure a secure hold and protect hands, even in wet conditions',
      'Wipes Clean in Seconds: Premium 600D Oxford fabric with waterproof, fireproof, and anti-stain coating ensures hygiene across any environment. Wipes clean in seconds—ideal for hospitals, clinics, and ambulances where rapid sanitization between uses is essential',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/31tfS6BLmmL._SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Veehoo Dog Stretcher for Large Dogs, Aluminum Alloy Portable Dog Transport Stretcher with Safety Straps, Non-Slip Handles, Waterproof Fabric, for Outdoor Rescue, Senior Dogs, or Hip & Joint Care on a white background',
    },
  },
  {
    id: 'patient-aid-portable-stretcher',
    name: 'Patient Aid Portable Stretcher & Gurney with 8 Handles - 44" x 50" - EMS, Sports Medicine, Emergency Rescue, Emergency Evacuation - Moving, Lifting or Transfer - Human, Animal, Pet - 600 lb Capacity',
    category: 'stretcher',
    badge: 'Soft Stretcher Candidate',
    asin: 'B07GVSG62X',
    amazonUrl: 'https://www.amazon.com/dp/B07GVSG62X?tag=chill-dogs-20',
    useCase: 'Review candidate for a soft stretcher that can store flat',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Can be used as a soft stretcher, mobility sheet or for EMS transfers to hospital beds and operating tables. Can be used with a wide variety of patients with a 600lb weight Capacity.',
      'Friction-reducing bottoms that ease positioning and reduces back strains during transfers. Can be used to transport, transfer or rescue patients from areas inaccessible to stretchers.',
      'Designed to be used hundreds of times and folds into small package for easy storage. Can be used to get patients off the floor.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/41dGfUbQPuL._SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Patient Aid Portable Stretcher & Gurney with 8 Handles - 44" x 50" - EMS, Sports Medicine, Emergency Rescue, Emergency Evacuation - Moving, Lifting or Transfer - Human, Animal, Pet - 600 lb Capacity on a white background',
    },
  },
  {
    id: 'gray-large-dog-stretcher',
    name: 'Dog Stretcher for Large Dogs, Dog Stretcher, Portable Stretcher, Emergency Animal Carrier Capable of Holding up to 300 pounds with 8 Handles(Gray)',
    category: 'stretcher',
    badge: 'Large Dog Stretcher Candidate',
    asin: 'B0F6YL3LT1',
    amazonUrl: 'https://www.amazon.com/dp/B0F6YL3LT1?tag=chill-dogs-20',
    useCase: 'Review candidate for larger-dog transport with multiple handles',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Dog Stretcher is crafted from select Oxford fabric, which is tough enough to easily withstand up to 300 pounds, while being smooth and delicate to the touch, providing a thoughtful experience for the user.',
      'The Dog Stretcher for Large Dogs measures 48 x 40 inches, and its spacious design makes it easy to transport large dogs, whether it\'s a larger Labrador or a German Shepherd, it\'s a perfect fit and meets the needs of a wide range of dog breeds.',
      'The Portable Stretcher\'s lightweight design and unique foldable structure make it extremely easy to store and take up very little space. With a light weight of only 450g, the stretcher can be easily carried outside on a daily basis or used indoors, providing comfortable support for your pet anytime, anywhere.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71Awahd2M8L._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Dog Stretcher for Large Dogs, Dog Stretcher, Portable Stretcher, Emergency Animal Carrier Capable of Holding up to 300 pounds with 8 Handles(Gray) on a white background',
    },
  },
  {
    id: 'black-pet-emergency-stretcher',
    name: 'Pet Stretcher for Dogs – Emergency Animal Carrier, 300lb Weight Limit, 44”x28” Size, with 8 Safety Straps for Easy Transport（Black）',
    category: 'stretcher',
    badge: 'Emergency Stretcher Candidate',
    asin: 'B0FD8KWS9L',
    amazonUrl: 'https://www.amazon.com/dp/B0FD8KWS9L?tag=chill-dogs-20',
    useCase: 'Review candidate for pet transport from vehicle, trailhead, or home',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'For Every Pet Parent – Emergency, Illness, Injury or Disability: As a caring pet parent, ensuring your dog\'s safety during emergencies, illness, injury, or recovery is a top priority. Our Pet Stretcher is the ideal solution, providing a secure and easy way to transport your pet to safety—whether from your vehicle to home or to a medical facility.',
      'Supports Up to 300 Pounds: Our Pet Stretcher is designed to comfortably carry pets weighing up to 300 pounds (136 kg). Made from durable nylon material, it features 8 sturdy handles for balanced support, making it easy for one or more people to transport your pet.',
      'Designed for Comfort & Easy Handling: Transporting your pet is now simpler than ever! This lightweight stretcher is designed with ease of use in mind, allowing for smooth navigation through tight spaces like stairs, vehicles, or narrow hallways. The neoprene-covered handles ensure a comfortable grip, no matter the weight.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/61Piwka25aL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Pet Stretcher for Dogs – Emergency Animal Carrier, 300lb Weight Limit, 44”x28” Size, with 8 Safety Straps for Easy Transport（Black） on a white background',
    },
  },
];

const firstAidReviewCandidates: EmergencyProduct[] = [
  {
    id: 'arca-pet-car-first-aid-kit',
    name: 'ARCA PET Cat & Dog First Aid Kit for Car - Pet Emergency Kit for Home Office Travel – Dog Camping Essentials with Digital Thermometer, Muzzle & Mini First Aid Pouch',
    category: 'first-aid',
    badge: 'First Aid Kit Candidate',
    asin: 'B07WRPCLYR',
    amazonUrl: 'https://www.amazon.com/dp/B07WRPCLYR?tag=chill-dogs-20',
    useCase: 'Review candidate for a car, home, or travel pet first aid kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'ENSURE PET SAFETY ON THE GO with our dog travel accessories, dog must haves in pet travel. Our comprehensive pet first aid kit for dogs is your companion for worry-free journeys.',
      'PET EMERGENCY ESSENTIALS: In addition to comprehensive pet first aid supplies, we include a dog thermometer, dog muzzle, tick kit, emergency flashlight, and a handy mini first aid kit pouch.',
      'GEAR UP FOR OUTDOOR FUN! This first aid kit is your first line of defense during activities like hiking, jogging, or camping, designed for dog camping gear and hunting dog adventures.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/919bY8axD4L._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'ARCA PET Cat & Dog First Aid Kit for Car - Pet Emergency Kit for Home Office Travel – Dog Camping Essentials with Digital Thermometer, Muzzle & Mini First Aid Pouch on a white background',
    },
  },
  {
    id: 'arca-pet-reflective-first-aid-pouch',
    name: 'ARCA PET Dog First Aid Kit - Pet Emergency Kit - Water Resistant High Visibility Reflective First Aid Pouch Dog Camping Essentials for Hiking, Backpacking, Sports, Hunting',
    category: 'first-aid',
    badge: 'First Aid Pouch Candidate',
    asin: 'B097PLDD92',
    amazonUrl: 'https://www.amazon.com/dp/B097PLDD92?tag=chill-dogs-20',
    useCase: 'Review candidate for a compact outdoor pet first aid pouch',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'READY FOR ADVENTURE: ARCA PET First Aid Kit for dogs, with dog travel accessories, ensures preparedness for minor and major situations, providing your pet the care it needs on your outdoor excursions.',
      '35 PCS EMERGENCY ESSENTIALS: Travel dog must haves! Care for your pet with gloves, antiseptic, tweezers, scissors, first aid book and more. No fumbling when every second counts!',
      'IDEAL FOR ALL OUTDOOR: Our dog emergency kit, essential for daily use, camping, hiking, and more, is a necessity for outdoor enthusiasts! Ideal for dog hunting gear and dog camping gear.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/81YQs25G6VL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'ARCA PET Dog First Aid Kit - Pet Emergency Kit - Water Resistant High Visibility Reflective First Aid Pouch Dog Camping Essentials for Hiking, Backpacking, Sports, Hunting on a white background',
    },
  },
  {
    id: 'arca-pet-100-piece-first-aid-kit',
    name: 'ARCA PET Cat & Dog First Aid Kit - High Visibility Reflective Zipper with Fluorescent Letter Print - 100 pcs with Dog Thermometer, Tick Remover Kit & Pet First Aid Kit Manual Book',
    category: 'first-aid',
    badge: '100-Piece Kit Candidate',
    asin: 'B09FKVQQVH',
    amazonUrl: 'https://www.amazon.com/dp/B09FKVQQVH?tag=chill-dogs-20',
    useCase: 'Review candidate for a larger pet first aid supply kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Comprehensive Emergency Kit: Over 100 vital items including a pet thermometer and medicine feeder, perfect for dog travel essentials and dog camping essentials. Ready for any outdoor emergency.',
      'High-Visibility: Features a reflective zipper and fluorescent lettering, easily visible in any lighting. Ideal as pet first aid kit for car and essential for nighttime emergency & outdoor adventures',
      'Adventure Ready: Perfect for pet owners on the go, this kit pairs seamlessly with dog hiking gear and dog travel accessories for road trips and outdoor excursions, ensuring for any unexpected events',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/91ZV6pYT5QL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'ARCA PET Cat & Dog First Aid Kit - High Visibility Reflective Zipper with Fluorescent Letter Print - 100 pcs with Dog Thermometer, Tick Remover Kit & Pet First Aid Kit Manual Book on a white background',
    },
  },
  {
    id: 'adventure-dog-medical-kit-vet-in-a-box',
    name: 'Adventure Dog Medical Kit - Vet in a Box',
    category: 'first-aid',
    badge: 'Medical Kit Candidate',
    asin: 'B08ZFVZPHM',
    amazonUrl: 'https://www.amazon.com/dp/B08ZFVZPHM?tag=chill-dogs-20',
    useCase: 'Review candidate for a more loaded dog medical kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Amazon listing describes a dog-focused medical kit.',
      'Includes wound-care and lighting supplies for field readiness.',
      'Use as transport support, not snakebite treatment.',
    ],
    ctaLabel: 'Check Price on Amazon',
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/adventure-medical-kits-adventure-dog/dp/250995',
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
    name: 'Dog First Aid Kit - Emergency Supplies - Pet First Aid Kit Guide, Tick Remover, Thermal Blanket & More - Compact Dog Gear for Hiking, Camping & Backpacking (Travel Pack)',
    category: 'first-aid',
    badge: 'Travel Pack Candidate',
    asin: 'B0B1W6VLKW',
    amazonUrl: 'https://www.amazon.com/dp/B0B1W6VLKW?tag=chill-dogs-20',
    useCase: 'Review candidate for a compact hiking, camping, or travel first aid kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'BE READY ANYWHERE, ANYTIME – Lightweight, compact cat & dog first aid kit for hiking, camping, or travel. Designed for fast, effective emergency care when space and weight matter most.',
      'PACKED WITH REAL PET ESSENTIALS – Includes vet-wrap, tick remover, cleansing wipes, saline wash, thermal blanket & more—no fluff, just field-tested dog emergency tools.',
      'BUILT FOR BACKPACKING & ADVENTURE – Soft case fits in backpacks, glove compartments, or car consoles. Ideal for travel, hunting, road trips, camping, and everyday dog hiking gear.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71aAipRmSFL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Dog First Aid Kit - Emergency Supplies - Pet First Aid Kit Guide, Tick Remover, Thermal Blanket & More - Compact Dog Gear for Hiking, Camping & Backpacking (Travel Pack) on a white background',
    },
  },
  {
    id: 'dog-first-aid-essential-pack',
    name: 'Dog First Aid Kit - Emergency Supplies - Pet First Aid Kit Guide, Tick Remover, Slip Leash & Medical Essentials for Home, Camping, Car, RV, Travel (Essential Pack)',
    category: 'first-aid',
    badge: 'Essential Pack Candidate',
    asin: 'B0B1W5R11Y',
    amazonUrl: 'https://www.amazon.com/dp/B0B1W5R11Y?tag=chill-dogs-20',
    useCase: 'Review candidate for a home, car, RV, or camping first aid kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'MORE THAN JUST BANDAGES – Includes vet-wrap, tick remover, first aid pads, saline wash, styptic pencil, slip leash & thermal blanket—real pet essentials, not just human first aid items.',
      'BUILT FOR TRAVEL & ADVENTURE – Water resistant, hard-sided case protects supplies in your car, backpack, or RV. Ideal for hiking, road trips, camping, and disaster preparedness.',
      'COMPACT, DURABLE & ORGANIZED CASE: Our hard-sided waterproof case features a strong zipper, mesh pockets, and reflective printing. Compact and customizable, with space for additional items.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/81EMxVmHhZL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Dog First Aid Kit - Emergency Supplies - Pet First Aid Kit Guide, Tick Remover, Slip Leash & Medical Essentials for Home, Camping, Car, RV, Travel (Essential Pack) on a white background',
    },
  },
];

const warmthReviewCandidates: EmergencyProduct[] = [
  {
    id: 'sierra-madre-emergency-sleeping-bag',
    name: 'Sierra Madre Emergency Sleeping Bag – Ultralight, Waterproof Mylar Thermal Bivy Sack Tent for Hiking, Bug-Out Bags, Survival Kits',
    category: 'warmth-control',
    badge: 'Emergency Blanket Candidate',
    asin: 'B0F2CBR1T1',
    amazonUrl: 'https://www.amazon.com/dp/B0F2CBR1T1?tag=chill-dogs-20',
    useCase: 'Review candidate for a compact thermal layer in a car or trail kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'STAY WARM IN ANY EMERGENCY: Designed for survival in extreme conditions, Sierra Madre’s thermal bivy sack reflects 90% of body heat, keeping you warmer for longer in cold weather. Ideal for survival kits, bug-out bags, camping, and hiking.',
      'WATERPROOF & WINDPROOF PROTECTION: Mylar was originally designed as a tear-resistant, insulating material by NASA for space exploration. Our durable PET emergency sleeping bag shields you from rain, wind, and snow, ensuring you stay dry and warm no matter the conditions.',
      'ULTRALIGHT WITH FULL COVERAGE: Weighing just 6 ounces, this survival bivy sack packs down small, fitting effortlessly into any backpack, glove compartment, or emergency kit for easy portability. Despite its light weight, our bag is larger for full coverage, fitting more body types comfortably.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/51UjfhM1q0L._AC_SX300_SY300_QL70_FMwebp_.jpg',
      alt: 'Sierra Madre Emergency Sleeping Bag – Ultralight, Waterproof Mylar Thermal Bivy Sack Tent for Hiking, Bug-Out Bags, Survival Kits on a white background',
    },
  },
  {
    id: 'frelaxy-emergency-blanket-pack',
    name: 'Frelaxy Emergency Blanket 2-Pack/4-Pack, Extra-Thick Extra-Large Space Blankets with Whistles, Storage Pouchs, and EVA case',
    category: 'warmth-control',
    badge: 'Emergency Blanket Candidate',
    asin: 'B0CLV3YJDX',
    amazonUrl: 'https://www.amazon.com/dp/B0CLV3YJDX?tag=chill-dogs-20',
    useCase: 'Review candidate for a multipack emergency blanket add-on',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Whistles+Blankets for Double Protection: Each emergency blanket comes with a survival whistle to keep you warm and safe when needed.',
      '2X THICKER THAN AVERAGE: Made of Durable 26umPE material, it is twice thicker than Average emergency blankets.',
      '20% LARGE THAN STANDARD: The size of each blanket is 83" x 60", which is larger than regular blankets and provides full body protection.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71Ynql7JTpL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Frelaxy Emergency Blanket 2-Pack/4-Pack, Extra-Thick Extra-Large Space Blankets with Whistles, Storage Pouchs, and EVA case on a white background',
    },
  },
];

const slipLeadReviewCandidates: EmergencyProduct[] = [
  {
    id: 'petarea-reflective-slip-lead',
    name: '5 FT Slip Lead Dog Leash, Heavy Duty Rope Leash for Small Medium Large Dogs, No Pull Training Lead with Reflective Thread, Strong Comfortable Loop Leash (Blue Stripe, Medium(3/8"))',
    category: 'warmth-control',
    badge: 'Slip Lead Candidate',
    asin: 'B0C3CDQGJQ',
    amazonUrl: 'https://www.amazon.com/dp/B0C3CDQGJQ?tag=chill-dogs-20',
    useCase: 'Review candidate for backup control in a car, trail, or home kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'GREAT FOR TRAINING - The leash tightens when your dog pulls and loosens when the behavior is corrected. Slip lead easily stops your dog from pulling with no harm. Also great for walking, jogging, training, crate transfer and potty breaks for your pet.',
      'COLLAR AND LEASH IN ONE – This slip leash is convenient as it can be used without a collar or harness. It can be adjusted to fit any dog’s neck size by adjusting the leather stopper. Simply place the loop over your dog’s head and you’ll be ready to go.',
      'HIGHLY REFLECTIVE – Reflective thread braided throughout the leash ensures that you and your dog are safe and visible during late-night walks',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71eHzXMqXhL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: '5 FT Slip Lead Dog Leash, Heavy Duty Rope Leash for Small Medium Large Dogs, No Pull Training Lead with Reflective Thread, Strong Comfortable Loop Leash (Blue Stripe, Medium(3/8")) on a white background',
    },
  },
  {
    id: 'mad-dog-products-orange-slip-lead',
    name: 'Mad Dog Products 1/4 Inch x 4 feet Orange Signature English Slip Lead Dog Leash - Made in USA',
    category: 'warmth-control',
    badge: 'Slip Lead Candidate',
    asin: 'B0CRWLL6C1',
    amazonUrl: 'https://www.amazon.com/dp/B0CRWLL6C1?tag=chill-dogs-20',
    useCase: 'Review candidate for a simple backup leash in an emergency kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'NO COLLAR NEEDED: Designed for ease of use for you and your pup. Just slip the loop over the dog\'s neck and secure it with the custom locking stopper made by Mad Dog\'s product specialists.',
      'TRAINER APPROVED: The slip leash is great for training and is favored by dog trainers and breeders around the world. 23 different color options to match your dog\'s unique personality and style.',
      'BETTER MATERIALS AND PREMIUM FEEL: Mad Dog Products leashes are soft on the hands, machine washable and UV fade-proof. Always handmade using quality polypropylene rope and brass rust-proof hardware.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/61wxuiDLPWL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Mad Dog Products 1/4 Inch x 4 feet Orange Signature English Slip Lead Dog Leash - Made in USA on a white background',
    },
  },
  {
    id: 'mendota-products-large-slip-lead',
    name: 'Mendota Products Large Slip Lead',
    category: 'warmth-control',
    badge: 'Chewy Slip Lead',
    useCase: 'Chewy-only slip lead option for backup control in car or trail kits',
    bestFor: 'Owners who want a simple backup leash option from Chewy.',
    bullets: [
      'Slip-lead option for fast backup control when you need to move a scared dog around cars, doors, or trailheads.',
      'Useful as a simple add-on when you do not want to depend on a separate collar and leash.',
      'Choose the right length and width ahead of time so it is ready when you need it.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/mendota-products-large-slip-confetti/dp/144722',
        canonicalUrl: 'https://www.chewy.com/mendota-products-large-slip-confetti/dp/144722',
        merchantProductId: '144722',
        status: 'active' as const,
      },
    ],
  },
  {
    id: 'water-woods-braided-rope-slip-dog-lead',
    name: 'Water & Woods Braided Rope Slip Dog Lead',
    category: 'warmth-control',
    badge: 'Chewy Slip Lead',
    useCase: 'Chewy-only rope slip lead option for emergency backup handling',
    bestFor: 'Owners who want another rope-lead option from Chewy.',
    bullets: [
      'Braided rope slip lead for quick control when a dog needs to be guided carefully during transport.',
      'Useful as a backup lead in kits that already focus on carry gear and warmth.',
      'Check the rope thickness and size before buying so it matches your dog and handling needs.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/water-woods-braided-rope-slip-dog/dp/650214',
        canonicalUrl: 'https://www.chewy.com/water-woods-braided-rope-slip-dog/dp/650214',
        merchantProductId: '650214',
        status: 'active' as const,
      },
    ],
  },
];

const preventionReviewCandidates: EmergencyProduct[] = [
  {
    id: 'ultra-thin-20000mah-power-bank',
    name: 'Ultra-Thin 20,000mAh Power Bank, 45W Max Fast Charging Battery Pack, Built-in USB-C Cable for iPhone 17/16 Series, Galaxy, MacBook, and More',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    asin: 'B0FY6TVDHQ',
    amazonUrl: 'https://www.amazon.com/dp/B0FY6TVDHQ?tag=chill-dogs-20',
    useCase: 'Review candidate for keeping a phone charged during emergency transport',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'The Slim Powerhouse: This 0.7\'\' power bank is your unstoppable, on-the-go energy source. Built from tough, lightweight aerospace aluminum, it provides formidable power in a sleek, burden-free form factor that travels effortlessly with you.',
      '45W High-Speed Charging: Output 45W to your devices while inputting 40W to the power bank itself. Get a 50% charge for your iPhone 16 Pro in 27 minutes.',
      'Massive 20,000mah Capacity: This power beast can fully charge an iPhone 16 four times over. Experience the freedom of immense power that\'s designed to be carried without the weight.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/51ikc21h3qL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Ultra-Thin 20,000mAh Power Bank, 45W Max Fast Charging Battery Pack, Built-in USB-C Cable for iPhone 17/16 Series, Galaxy, MacBook, and More on a white background',
    },
  },
  {
    id: 'cuktech-25000mah-power-bank',
    name: 'CUKTECH 25,000mAh Power Bank, 100W Max Portable Charger with Built-in USB-C Cable, Fast Charging External Battery Pack for MacBook Pro/Air, iPhone 17/16/15 Series, Samsung, Pixel, Airline Approved',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    asin: 'B0GHHDV7Y9',
    amazonUrl: 'https://www.amazon.com/dp/B0GHHDV7Y9?tag=chill-dogs-20',
    useCase: 'Review candidate for higher-capacity phone and device charging',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      '100W Ultra-Fast Output: Power your laptop anywhere. With a 100W peak output, this power bank can charge a MacBook Air 13" (M3) to 56% in just 30 mins. Stay productive on the go with high-speed delivery that rivals your original wall charger',
      '25,000mAh High Capacity: Airline approved. Rated at 90Wh, it safely fits FAA carry-on limits (under 100Wh). Provides up to 3.2 full charges for iPhone 17 Pro Max or 1.2 charges for MacBook Air—perfect for long flights and travel',
      'Charge 3 Devices at Once: Built-in convenience. Charge 3 Devices at Once: Built-in convenience. Equipped with an integrated USB-C cable, one USB-C port, and one USB-A port — charge your laptop, phone, and accessories at the same time without carrying extra cables',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/51zFD9uYSYL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'CUKTECH 25,000mAh Power Bank, 100W Max Portable Charger with Built-in USB-C Cable, Fast Charging External Battery Pack for MacBook Pro/Air, iPhone 17/16/15 Series, Samsung, Pixel, Airline Approved on a white background',
    },
  },
  {
    id: '50000mah-built-in-cable-power-bank',
    name: 'Portable Charger Power Bank 50000mAh, Massive Capacity Travel Essential, Built-in USB-C & iOS Cables, AC Wall Plug, 22.5W Fast Charging Battery Pack with LED Display for Camping, iPhone, Samsung',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    asin: 'B0GXF114LP',
    amazonUrl: 'https://www.amazon.com/dp/B0GXF114LP?tag=chill-dogs-20',
    useCase: 'Review candidate for a larger-capacity car or camping kit battery',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Massive 50000mAh Capacity - Days of Power: This heavy-duty battery bank delivers a week\'s worth of reliable energy, making it a travel camping essential for road trips, outdoor adventures, and remote work. With universal compatibility, it safely charges your iPhones, Android phones, and power-hungry tablets multiple times',
      '3-Year Free Replacement & Safe Charging Guarantee: Built with reliable safety protection and premium materials for worry-free charging. If any covered quality issue occurs within 3 years, we’ll send you a brand-new replacement, hassle-free',
      'Built-In Cables for All iPhones & Type-C Phones: Say goodbye to tangled messy cords and forgotten cables. This innovative power bank features a built-in Type-C cable and a Lightning cable, combined with an extra USB-C port to juice up multiple devices simultaneously. Ready to charge right out of the box, it simplifies your travel gear and keeps your essentials powered up anywhere',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71UH61Eu7xL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Portable Charger Power Bank 50000mAh, Massive Capacity Travel Essential, Built-in USB-C & iOS Cables, AC Wall Plug, 22.5W Fast Charging Battery Pack with LED Display for Camping, iPhone, Samsung on a white background',
    },
  },
  {
    id: 'iniu-magnetic-10000mah-power-bank',
    name: 'INIU Slimmest Power Bank for MagSafe, 10000mAh Qi2.2 Certified 25W Wireless & 45W Wired USB C Fast Charging Portable Charger, Flight-Safe Travel Phone Magnetic Battery Pack for iPhone etc, Orange',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    asin: 'B0G595GGPQ',
    amazonUrl: 'https://www.amazon.com/dp/B0G595GGPQ?tag=chill-dogs-20',
    useCase: 'Review candidate for a compact phone battery in a light trail kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Trusted INIU Quality with 3-Year Care: As the SAFE Fast Charge Pro trusted by over 38 million users, we ensure the safest charging with the highest-grade materials. With our industry-leading 3-year INIU care, if you have any issues in three years, a new one is on us.',
      'Market\'s Slimmest 10000mAh Qi2 25W Magnetic Power Bank: At just 0.5 inches thin, INIU Qi2 25W-certified magnetic power bank slips easily into any bag while packing a 10,000mAh capacity - power without the bulk.',
      'Save 30min with Ultra-Fast Qi2 25W Wireless Charging: INIU Qi2 25W-certified magnetic portable power bank wirelessly charges your iPhone 17 Pro from 0% to 50% in just 33min - 30min faster than other regular 7.5W magnetic power banks. Note: fast Qi2 25W magnetic wireless charging is supported only for iPhone 16 Plus/ Pro Max/17 series.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71U58faqOAL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'INIU Slimmest Power Bank for MagSafe, 10000mAh Qi2.2 Certified 25W Wireless & 45W Wired USB C Fast Charging Portable Charger, Flight-Safe Travel Phone Magnetic Battery Pack for iPhone etc, Orange on a white background',
    },
  },
  {
    id: '10000mah-built-in-cable-power-bank',
    name: 'Portable Charger 10000mAh Power Bank, Built-in 4 Cables & 6-Device Charging,Fast Charging with LCD Display,USB-C In/Out, Compatible with iPhone 17/16/15/14 for Travel Camping Essentials-Black',
    category: 'prevention',
    badge: 'Power Bank Candidate',
    asin: 'B0GTR1575S',
    amazonUrl: 'https://www.amazon.com/dp/B0GTR1575S?tag=chill-dogs-20',
    useCase: 'Review candidate for a compact all-in-one phone charger',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'This 10000mAh portable charger power bank combines convenience, portability and fast charging performance in one compact design. Featuring 4 built-in charging cables, USB-C input and output, and support for charging up to 6 devices simultaneously, it provides an easy all-in-one charging solution for everyday use. Compatible with iPhone 17/16/15/14 and many other USB-powered devices, this slim battery pack is ideal for travel, camping, commuting, office use and emergency backup charging. The LCD display shows accurate battery percentage information so you can monitor remaining power at a glance.',
      'Amazon listing describes a 10,000mAh portable charger.',
      'Includes built-in cables and an LCD display.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/81ZQvpeFRaL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Portable Charger 10000mAh Power Bank, Built-in 4 Cables & 6-Device Charging,Fast Charging with LCD Display,USB-C In/Out, Compatible with iPhone 17/16/15/14 for Travel Camping Essentials-Black on a white background',
    },
  },
  {
    id: 'black-diamond-cosmo-300-headlamp',
    name: 'Black Diamond Cosmo 300 Headlamp, Graphite',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    asin: 'B08BHJFSJ4',
    amazonUrl: 'https://www.amazon.com/dp/B08BHJFSJ4?tag=chill-dogs-20',
    useCase: 'Review candidate for hands-free light in a trail or car kit',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Amazon listing identifies this as the Black Diamond Cosmo 300 headlamp.',
      'Headlamps keep both hands free during low-light transport.',
      'Confirm current battery type, brightness, and water rating before buying.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71r9v00seoL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Black Diamond Cosmo 300 Headlamp, Graphite on a white background',
    },
  },
  {
    id: 'nebo-mycro-450-headlamp',
    name: 'NEBO MYCRO 450 Headlamp | 450 Lumens, 6 Light Modes, White Red & Green Light, USB-C Rechargeable, Water Resistant, Adjustable Strap, Cap Light Convertible, Bright Light for Camping & Hiking – Blue',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    asin: 'B0F1ZFMVXG',
    amazonUrl: 'https://www.amazon.com/dp/B0F1ZFMVXG?tag=chill-dogs-20',
    useCase: 'Review candidate for rechargeable hands-free light',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      '450 LUMEN RECHARGEABLE HEADLAMP FOR MAX BRIGHTNESS – Powerful LED headlamp delivers up to 450 lumens in Turbo mode with a focused spot beam for clear visibility during work, outdoor activities, and emergencies.',
      '6 LIGHT MODES FOR ANY SITUATION – Includes Turbo, High, Medium, Low, plus red and green light modes to preserve night vision. Smart Power Control optimizes brightness and runtime for efficient performance.',
      '2-IN-1 HEADLAMP + CAP LIGHT DESIGN – Quickly converts from a headlamp to a clip-on cap light for versatile, hands-free lighting. Ideal for running, camping, fishing, and everyday tasks.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/81qMbGgYilL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'NEBO MYCRO 450 Headlamp | 450 Lumens, 6 Light Modes, White Red & Green Light, USB-C Rechargeable, Water Resistant, Adjustable Strap, Cap Light Convertible, Bright Light for Camping & Hiking – Blue on a white background',
    },
  },
  {
    id: 'nitecore-nu20-classic-headlamp',
    name: 'Nitecore NU20 Classic Ultralight Headlamp, 360 Lumen USB-C Rechargeable Lightweight for Backpacking, Camping, Running with Auxilary White and Red Light',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    asin: 'B0DCQDXSS5',
    amazonUrl: 'https://www.amazon.com/dp/B0DCQDXSS5?tag=chill-dogs-20',
    useCase: 'Review candidate for a lightweight rechargeable headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'ULTRA-LIGHT & POWERFUL - Weighs just 1.34 oz yet delivers up to 360 lumens with a beam distance of 119 yards, perfect for all-day wear without strain.',
      '3 LIGHT MODES + SAFETY FEATURES - Main white LED with 3 brightness levels, plus SOS & Beacon, a soft reading light, and an auxiliary red light for night vision — ideal for camping, hiking, running, or emergencies.',
      'LONG RUNTIME & FAST CHARGING - Up to 97 hours of use on low mode; recharges in just over an hour via USB-C. Battery indicator ensures you’re never caught off guard.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71Dx1Xloz2L._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Nitecore NU20 Classic Ultralight Headlamp, 360 Lumen USB-C Rechargeable Lightweight for Backpacking, Camping, Running with Auxilary White and Red Light on a white background',
    },
  },
  {
    id: 'nitecore-nu25-headlamp',
    name: 'Nitecore NU25 360 Lumen Triple Output - White, Red, High CRI - Lightweight USB Rechargeable Headlamp (Black)',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    asin: 'B077Z3LNX9',
    amazonUrl: 'https://www.amazon.com/dp/B077Z3LNX9?tag=chill-dogs-20',
    useCase: 'Review candidate for a compact rechargeable headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      '360 LUMEN WIDE BEAM - Featuring a CREE XP-G2 S3 LED for a primary output, the NU25 is capable of 360 lumen max output and 88 yards of throw, perfect for biking, jogging and trekking.',
      'AUXILIARY HIGH CRI AND RED LED LIGHTS - The high CRI auxiliary light produces richer more natural looking colors over standard LEDs making it a great tool for up close tasks requiring fine detail while the auxiliary red LED is great for preserving night vision.',
      'COMPACT AND LIGHTWEIGHT - Weighing less than an ounce (0.99oz w/o headband, 1.9oz w/ headband) and small enough to fit in a pocket, the NU25 is comfortable for daily use and long excursions.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71Y2uzYi8WL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Nitecore NU25 360 Lumen Triple Output - White, Red, High CRI - Lightweight USB Rechargeable Headlamp (Black) on a white background',
    },
  },
  {
    id: 'energizer-led-headlamp',
    name: 'Energizer LED Headlamp, Bright and Durable, Lightweight, Built For Camping, Hiking, Outdoors, Emergency Light, Batteries Included',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    asin: 'B00TI8GSE2',
    amazonUrl: 'https://www.amazon.com/dp/B00TI8GSE2?tag=chill-dogs-20',
    useCase: 'Review candidate for a battery-powered emergency headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Amazon listing identifies this as an Energizer LED headlamp.',
      'Headlamps keep both hands free during low-light transport.',
      'Confirm batteries, brightness, and runtime before buying.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71x2yk0T1yL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Energizer LED Headlamp, Bright and Durable, Lightweight, Built For Camping, Hiking, Outdoors, Emergency Light, Batteries Included on a white background',
    },
  },
  {
    id: 'coast-wph34r-rechargeable-headlamp',
    name: 'Coast WPH34R 2000 Lumen Waterproof Ultra Bright IP68 USB Rechargeable-Dual Power Headlamp, 6 Modes with Spot and Flood Beams, Black/Grey',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    asin: 'B0BWSQWXPC',
    amazonUrl: 'https://www.amazon.com/dp/B0BWSQWXPC?tag=chill-dogs-20',
    useCase: 'Review candidate for a waterproof rechargeable headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'WATERPROOF: Sealed tight to withstand full submersion, this IP68-built headlamp shines in six output modes spanning three beam colors: Green, white and red.',
      'RECHARGEABLE PLUS: Boost your power and performance—with the optional upgrade to a secondary CR123 battery (purchased separately) that snaps into position on top of the integrated battery.',
      'TRI-COLOR: Select from two light colors—using the white utility beam for general use and the green and red anti-glare LED to prevent night blinding, detectability and emergency signaling.',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/71eXvU0NusL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'Coast WPH34R 2000 Lumen Waterproof Ultra Bright IP68 USB Rechargeable-Dual Power Headlamp, 6 Modes with Spot and Flood Beams, Black/Grey on a white background',
    },
  },
  {
    id: 'sunrei-rechargeable-headlamp',
    name: 'SUNREI Rechargeable Headlamp, Red Led Headlamp, 2200mAh Battery, Motion Sensor, Stepless Dimming, IPX6 Waterproof, 6 Light Modes, Type-C, Lightweight Outdoor Headlamp for Camping, Hiking, Running',
    category: 'prevention',
    badge: 'Headlamp Candidate',
    asin: 'B0G4W14R1Y',
    amazonUrl: 'https://www.amazon.com/dp/B0G4W14R1Y?tag=chill-dogs-20',
    useCase: 'Review candidate for a rechargeable outdoor headlamp',
    bestFor: 'Review before choosing for a snake-bite emergency kit.',
    bullets: [
      'Ultra-Bright 500 Lumens CREE LED Headlamp: This bright rechargeable LED headlamp delivers up to 500 lumens using a genuine CREE LED. Includes spotlight, floodlight, mixed beam, red light, and red flashing modes—ideal for camping, hiking, running, fishing, and other outdoor activities',
      'USB-C Rechargeable Headlamp with 2200mAh Battery: Features a built-in 2200mAh rechargeable battery for long runtime up to 200 hours. This USB C headlamp supports fast charging with power banks, wall chargers, or car adapters—perfect for camping gear or emergency kits',
      'Hands-Free Motion Sensor Headlamp: Activate the motion sensor mode to turn the headlamp on/off with just a wave. A great choice for work, repairs, night running, or using the lamp with gloves—true hands-free headlamp convenience',
    ],
    ctaLabel: 'Check Price on Amazon',
    image: {
      src: 'https://m.media-amazon.com/images/I/61FEUjQgqQL._AC_SX342_SY445_QL70_FMwebp_.jpg',
      alt: 'SUNREI Rechargeable Headlamp, Red Led Headlamp, 2200mAh Battery, Motion Sensor, Stepless Dimming, IPX6 Waterproof, 6 Light Modes, Type-C, Lightweight Outdoor Headlamp for Camping, Hiking, Running on a white background',
    },
  },
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
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/adventure-medical-kits-dog-series-me/dp/250997',
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
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/adventure-medical-kits-dog-series/dp/250999',
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
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/kurgo-first-aid-kit-dogs-cats/dp/56782',
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
    badge: 'Chewy First Aid Add-On',
    useCase: 'Chewy-only dog first aid pouch for car and trail kits',
    bestFor: 'Owners who want another compact dog-first-aid option from Chewy.',
    bullets: [
      'Compact first-aid add-on for general dog emergency supplies and clean handling.',
      'Useful if you want a smaller pouch to pair with a carry harness, slip lead, and vet info card.',
      'Review the current supply list and add your own route-to-vet notes before relying on it.',
    ],
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://www.chewy.com/kurgo-rsg-first-aid-kit-dogs/dp/207876',
        canonicalUrl: 'https://www.chewy.com/kurgo-rsg-first-aid-kit-dogs/dp/207876',
        merchantProductId: '207876',
        status: 'active' as const,
      },
    ],
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
