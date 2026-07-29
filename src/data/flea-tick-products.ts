import { createChewyAffiliateLinkWithBase } from '../lib/affiliate/chewy';
import type { AffiliateOffer, OfferBackedProduct } from './products/types';

export type FleaTickProductCategory =
  | 'rx-oral-monthly'
  | 'rx-oral-quarterly'
  | 'rx-oral-combo'
  | 'otc-topical'
  | 'otc-collar'
  | 'natural-spray'
  | 'natural-spot-on'
  | 'natural-shampoo'
  | 'natural-collar'
  | 'natural-tag'
  | 'natural-chew'
  | 'natural-ear'
  | 'natural-surface'
  | 'bath-tool';

export interface FleaTickProduct extends OfferBackedProduct {
  id: string;
  name: string;
  category: FleaTickProductCategory;
  badge: string;
  bestFor: string;
  bullets: string[];
  activeIngredient?: string;
  coverage?: string;
  duration?: string;
  howItWorks?: string;
  caution?: string;
  rxRequired?: boolean;
  ctaLabel?: string;
  image?: { src: string; alt: string };
}

const CHEWY_TRACKING_BASE = 'https://chewy.sjv.io/c/7067825/3054490/32975';

function amazonUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=chill-dogs-20`;
}

function amazonOffer(asin: string): AffiliateOffer {
  return {
    merchant: 'amazon',
    asin,
    merchantProductId: asin,
    url: amazonUrl(asin),
    status: 'active',
  };
}

function chewyOffer(canonicalUrl: string, articleSlug: string): AffiliateOffer {
  const merchantProductId = canonicalUrl.match(/\/dp\/(\d+)/)?.[1];

  return {
    merchant: 'chewy',
    merchantProductId,
    canonicalUrl,
    url: createChewyAffiliateLinkWithBase(CHEWY_TRACKING_BASE, canonicalUrl, {
      articleSlug,
      placement: 'product-card',
    }),
    status: 'active',
  };
}

export const fleaTickProducts: FleaTickProduct[] = [
  {
    id: 'nexgard-10-24',
    name: 'NexGard Chews for Dogs, 10.1 to 24 lbs',
    category: 'rx-oral-monthly',
    badge: 'Monthly Rx chew',
    bestFor: 'Owners who want a widely used monthly oral flea-and-tick chew for a mid-size dog.',
    asin: 'B0DV56FRNC',
    amazonUrl: amazonUrl('B0DV56FRNC'),
    offers: [
      amazonOffer('B0DV56FRNC'),
      chewyOffer('https://www.chewy.com/nexgard-chews-for-dogs-101-24-lbs/dp/173249', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Afoxolaner',
    coverage: 'Fleas and ticks',
    duration: '1 month',
    howItWorks: 'Monthly isoxazoline chew with strong tick-kill coverage.',
    rxRequired: true,
    bullets: [
      'Monthly oral chew in the most commonly used Rx class',
      'Good fit for owners who want no-mess tick protection',
      'Discuss seizure history with your vet before using',
    ],
  },
  {
    id: 'simparica-22-44',
    name: 'Simparica for Dogs, 22.1 to 44 lbs (6-mo supply)',
    category: 'rx-oral-monthly',
    badge: 'Monthly Rx chew',
    bestFor: 'Owners who prefer a six-month supply cadence and oral monthly dosing.',
    asin: 'B0DYFXV29T',
    amazonUrl: amazonUrl('B0DYFXV29T'),
    offers: [amazonOffer('B0DYFXV29T')],
    activeIngredient: 'Sarolaner',
    coverage: 'Fleas and ticks',
    duration: '1 month per chew',
    howItWorks: 'Monthly oral isoxazoline option with broad tick coverage.',
    rxRequired: true,
    bullets: [
      'Oral monthly chew sold here as a six-month supply',
      'Useful for owners who want to set prevention on autopilot',
      'Keep the FDA neurologic warning in the conversation with your vet',
    ],
  },
  {
    id: 'bravecto-44-88',
    name: 'Bravecto Chews for Dogs, 44 to 88 lbs',
    category: 'rx-oral-quarterly',
    badge: '12-week Rx chew',
    bestFor: 'Owners who want fewer doses per year and a longer re-dose window.',
    asin: 'B0DFHLXL5B',
    amazonUrl: amazonUrl('B0DFHLXL5B'),
    offers: [
      amazonOffer('B0DFHLXL5B'),
      chewyOffer('https://www.chewy.com/bravecto-chews-for-dogs-44-88-lbs/dp/281402', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Fluralaner',
    coverage: 'Fleas and ticks',
    duration: '12 weeks',
    howItWorks: 'Quarterly isoxazoline chew for owners who hate monthly resets.',
    rxRequired: true,
    bullets: [
      'One chew covers roughly three months',
      'Best fit for owners who want fewer dosing reminders',
      'Still in the same FDA-alerted isoxazoline class as NexGard and Simparica',
    ],
  },
  {
    id: 'nexgard-plus-33-66',
    name: 'NexGard Plus for Dogs, 33.1 to 66 lbs',
    category: 'rx-oral-combo',
    badge: 'Monthly combo Rx',
    bestFor: 'Owners who want flea, tick, and heartworm coverage in one chew.',
    asin: 'B0DYKWKJ4K',
    amazonUrl: amazonUrl('B0DYKWKJ4K'),
    offers: [
      amazonOffer('B0DYKWKJ4K'),
      chewyOffer('https://www.chewy.com/nexgard-plus-chews-for-dogs-331-66/dp/899766', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Afoxolaner + moxidectin + pyrantel',
    coverage: 'Fleas, ticks, heartworm, roundworms, hookworms',
    duration: '1 month',
    howItWorks: 'Bundles parasite prevention into one monthly chew.',
    rxRequired: true,
    bullets: [
      'One chew replaces separate flea/tick and heartworm products',
      'Strong fit for owners who want to simplify monthly prevention',
      'Requires veterinary prescription and parasite-plan review',
    ],
  },
  {
    id: 'simparica-trio-22-44',
    name: 'Simparica Trio for Dogs, 22.1 to 44 lbs (6-mo supply)',
    category: 'rx-oral-combo',
    badge: 'Monthly combo Rx',
    bestFor: 'Owners who want one product for fleas, ticks, heartworm, and intestinal coverage.',
    asin: 'B0DVH5FJND',
    amazonUrl: amazonUrl('B0DVH5FJND'),
    offers: [
      amazonOffer('B0DVH5FJND'),
      chewyOffer('https://www.chewy.com/simparica-trio-chewable-tablets-dogs/dp/251348', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Sarolaner + moxidectin + pyrantel',
    coverage: 'Fleas, ticks, heartworm, roundworms, hookworms',
    duration: '1 month per chew',
    howItWorks: 'Single monthly chew for owners who want broad parasite coverage.',
    rxRequired: true,
    bullets: [
      'Popular combo chew for households that want one monthly reminder',
      'Useful when the dog already needs heartworm protection too',
      'Still merits a vet conversation for dogs with seizure history',
    ],
  },
  {
    id: 'frontline-plus-45-88',
    name: 'Frontline Plus for Dogs, 45 to 88 lbs (6-mo supply)',
    category: 'otc-topical',
    badge: 'OTC topical',
    bestFor: 'Owners who want widely available over-the-counter topical coverage.',
    asin: 'B0002J1FOO',
    amazonUrl: amazonUrl('B0002J1FOO'),
    offers: [
      amazonOffer('B0002J1FOO'),
      chewyOffer('https://www.chewy.com/frontline-plus-flea-tick-large-dogs/dp/34715', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Fipronil + (S)-methoprene',
    coverage: 'Fleas, flea eggs, ticks',
    duration: '1 month per dose',
    howItWorks: 'Classic no-prescription topical option with flea and tick coverage.',
    bullets: [
      'Easy OTC starting point when you are not ready for a prescription product',
      'Topical application can be messy and needs drying time',
      'Regional fipronil resistance is one reason to reassess if results disappoint',
    ],
  },
  {
    id: 'k9-advantix-21-55',
    name: 'K9 Advantix II for Dogs, 21 to 55 lbs (4-mo supply)',
    category: 'otc-topical',
    badge: 'OTC topical',
    bestFor: 'Dog-only households that want OTC tick coverage and mosquito repellency.',
    asin: 'B004QMX4YW',
    amazonUrl: amazonUrl('B004QMX4YW'),
    offers: [
      amazonOffer('B004QMX4YW'),
      chewyOffer('https://www.chewy.com/k9-advantix-ii-flea-tick-treatment/dp/102306', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Imidacloprid + permethrin + pyriproxyfen',
    coverage: 'Fleas, ticks, mosquitoes',
    duration: '1 month per dose',
    howItWorks: 'Strong OTC topical coverage with a serious cat-safety caveat.',
    caution: 'Contains permethrin. Do not use in homes where treated dogs closely share space with cats.',
    bullets: [
      'One of the stronger OTC tick options when you need no-prescription coverage',
      'Permethrin raises the stakes for multi-pet homes with cats',
      'Best reserved for dog-only homes or households that can separate pets safely',
    ],
  },
  {
    id: 'seresto-large',
    name: 'Seresto Flea and Tick Collar for Dogs Over 18 lbs',
    category: 'otc-collar',
    badge: 'OTC collar',
    bestFor: 'Owners who want an 8-month collar rather than monthly dosing.',
    asin: 'B00B8CG602',
    amazonUrl: amazonUrl('B00B8CG602'),
    offers: [
      amazonOffer('B00B8CG602'),
      chewyOffer('https://www.chewy.com/seresto-flea-tick-collar-large-dogs/dp/46497', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Imidacloprid + flumethrin',
    coverage: 'Fleas and ticks',
    duration: '8 months',
    howItWorks: 'Long-duration collar for owners who prioritize convenience.',
    caution: 'EPA reviewed adverse-event reports and kept the product on the market with updated labeling.',
    bullets: [
      'Eight-month collar appeals to owners who want fewer monthly tasks',
      'Still deserves a balanced safety read before you default to convenience',
      'Watch carefully for skin reactions or behavior changes after putting it on',
    ],
  },
  {
    id: 'wondercide-shampoo-amazon',
    name: 'Wondercide Flea & Tick Shampoo for Dogs & Cats (12 oz)',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Owners who want an Amazon-stocked bath-day shampoo to pair with sprays and coat checks.',
    asin: 'B09WLSNZZC',
    amazonUrl: amazonUrl('B09WLSNZZC'),
    offers: [amazonOffer('B09WLSNZZC')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61ylsHHZN5L._SL500_.jpg',
      alt: 'Wondercide Flea & Tick Shampoo for Dogs and Cats, 12 oz',
    },
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Essential-oil shampoo for bath-day cleanup that supports a routine rather than replacing prevention.',
    bullets: [
      'Plant-based essential-oil formula for bath-day cleanup, stocked on Amazon',
      'Labeled for dogs and cats over four months, so it fits mixed-pet bath days',
      'Cleanup and coat support, not standalone flea control',
    ],
  },
  {
    id: 'wondercide-spray-lemongrass-32oz',
    name: 'Wondercide Flea, Tick & Mosquito Spray',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor:
      'Kills by contact, repels, and helps prevent fleas, ticks, and mosquitoes with natural essential oils. Wondercide reports 98–100% efficacy in laboratory testing and says the formula targets eggs, larvae, and adults.',
    asin: 'B00V75QXEY',
    amazonUrl: amazonUrl('B00V75QXEY'),
    offers: [
      amazonOffer('B00V75QXEY'),
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-dogs-home/dp/253125', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/61rdopZGPgL._SL500_.jpg',
      alt: 'Wondercide Flea, Tick & Mosquito Spray',
    },
    bullets: [
      'Labeled for dogs and cats of all ages, including puppies, kittens, and senior pets, when used as directed; contains no artificial colors, fragrances, or dyes',
      'Three-in-one plant-powered formula for dogs, cats, and home surfaces such as carpet, furniture, bedding, and flooring',
      'Made in the USA with U.S. and global components; cruelty-free',
    ],
  },
  {
    id: 'natures-dome-cedarwood-spray',
    name: "Nature's Dome Cedarwood Flea & Tick Spray",
    category: 'natural-spray',
    badge: 'Natural oil spray',
    bestFor: 'Cedarwood oil helps kill and repel fleas, ticks, larvae, and eggs.',
    offers: [
      chewyOffer('https://www.chewy.com/natures-dome-cedarwood-flea-tick/dp/3684302', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06984af6-5eb4-7330-8000-51aa5ce6b490._AC_SX500_SY400_QL75_V1_.jpg',
      alt: "Nature's Dome Cedarwood Flea & Tick Spray for Dogs, 16 fl oz",
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Chewy lists this dog spray as pet-safe; check the label before use on cats or young animals',
      'Plant-based formula without harsh chemicals or synthetic pesticides',
      'Biodegradable, eco-friendly ingredients intended to be safer for pets, people, and the planet when used as directed',
    ],
  },
  {
    id: 'isabellas-clearly-natural-spray',
    name: "Isabella's Clearly Natural Flea & Tick Oil",
    category: 'natural-spray',
    badge: 'Natural oil spray',
    bestFor: 'A blend of essential oils in a nourishing sweet almond oil base for flea-and-tick protection.',
    offers: [
      chewyOffer('https://www.chewy.com/isabellas-clearly-natural-flea-tick/dp/3701295', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0693338a-c450-70cd-8000-f2fc87404143._AC_SX500_SY400_QL75_V1_.jpg',
      alt: "Isabella's Clearly Natural Flea & Tick Oil for Dogs, 2 fl oz",
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Chewy lists this oil for dogs; check the label before use on cats or young animals',
      'Free from preservatives and conventional pesticides',
      'Made in the USA in small batches for quality assurance',
    ],
  },
  {
    id: 'pure-natural-pet-spray',
    name: 'Pure and Natural Pet Dog Flea & Tick Spray',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor: 'Made with peppermint and cedarwood oils to repel pests.',
    offers: [
      chewyOffer('https://www.chewy.com/pure-natural-pets-dog-flea-tick-spray/dp/2037798', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06846cfa-8b42-7c48-8000-dc24e263997a._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Pure and Natural Pet Dog Flea & Tick Spray, 10 fl oz',
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Refill option helps reduce plastic waste and packaging',
      'DEET-free and pyrethrin-free; labeled for dogs 16 weeks and older when used as directed',
    ],
  },
  {
    id: 'crobirware-natural-collar',
    name: 'Crobirware Natural Flea & Tick Collar for Dogs',
    category: 'natural-collar',
    badge: 'Natural collar',
    bestFor: 'Owners who want an adjustable, waterproof natural collar for small, medium, or large dogs.',
    asin: 'B0GSZH4JWF',
    amazonUrl: amazonUrl('B0GSZH4JWF'),
    offers: [amazonOffer('B0GSZH4JWF')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81bySjtIp0L._SL500_.jpg',
      alt: 'Crobirware Natural Flea & Tick Collar for Dogs',
    },
    coverage: 'Wearable preventative support',
    duration: 'Continuous wear',
    howItWorks: 'Adjustable waterproof collar for owners who prefer a leave-on natural layer.',
    bullets: [
      'Adjustable sizing and a waterproof design that fits small through large dogs',
      'Leave-on convenience for owners who dislike daily spray routines',
      'Natural collars carry lighter evidence than conventional options; treat it as a layer',
    ],
  },
  {
    id: 'trihood-flea-tick-tag',
    name: 'Trihood Natural Flea & Tick Dog Tag (2-Pack + 4 Refills)',
    category: 'natural-tag',
    badge: 'Natural tag',
    bestFor: 'Owners who want a pendant that clips to an existing collar instead of adding a second collar.',
    asin: 'B0GVYVSDK5',
    amazonUrl: amazonUrl('B0GVYVSDK5'),
    offers: [amazonOffer('B0GVYVSDK5')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81OuVBoQyGL._SL500_.jpg',
      alt: 'Trihood Natural Flea & Tick Dog Tag pendants with refills',
    },
    coverage: 'Wearable preventative support',
    duration: 'Refill-based; includes four extra refills',
    howItWorks: 'Clip-on pendant for owners who already have a collar they like.',
    caution: 'The collar is not included; the tag attaches to your dog’s existing collar.',
    bullets: [
      'Two waterproof pendants plus four refills attach to a collar you already own',
      'Good fit when you do not want to swap your dog’s current collar',
      'Same lighter-evidence caveat as other wearable natural options',
    ],
  },
  {
    id: 'lkdhfjc-flea-tick-chews',
    name: 'Natural Flea & Tick Soft Chews for Dogs (200 Count)',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Owners who want a chicken-flavored daily supplement as a light internal layer.',
    asin: 'B0H6B7W86G',
    amazonUrl: amazonUrl('B0H6B7W86G'),
    offers: [amazonOffer('B0H6B7W86G')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71XB0AgjT4L._SL500_.jpg',
      alt: 'Natural Flea & Tick Soft Chews for Dogs, 200 count',
    },
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 200 chews per jar',
    howItWorks: 'Chicken-flavored daily chew marketed for skin, coat, and pest-defense support.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Chicken-flavored daily format for dogs that take chews easily',
      'A 200-count jar covers a long stretch for one dog',
      'Best seen as a light internal layer alongside real prevention, not a replacement',
    ],
  },
  {
    id: 'wondercide-rescue-ear-drops',
    name: 'Wondercide Rescue Ear Drops for Dogs & Cats (4 oz)',
    category: 'natural-ear',
    badge: 'Grooming support',
    bestFor: 'Owners who want a gentle ear cleaner for routine wax and outdoor-debris cleanup.',
    asin: 'B0DWZLB7LX',
    amazonUrl: amazonUrl('B0DWZLB7LX'),
    offers: [amazonOffer('B0DWZLB7LX')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61QoLofSAWL._SL500_.jpg',
      alt: 'Wondercide Rescue Ear Drops for Dogs and Cats, 4 oz',
    },
    coverage: 'Routine ear cleaning',
    duration: 'As-needed cleaning',
    howItWorks: 'Hypochlorous ear drops for wiping out wax and outdoor grime during grooming.',
    caution: 'This is cleaning support, not a treatment for ear infections; see your vet for pain, discharge, or persistent head-shaking.',
    bullets: [
      'Hypochlorous formula for routine ear wipe-downs after outdoor time',
      'Handy when you are already checking coat and ears for pests after grassy walks',
      'For cleanup only; escalate suspected ear infections to a vet',
    ],
  },
  {
    id: 'wondercide-surface-disinfectant',
    name: 'Wondercide Multi-Surface Disinfectant Spray, Fragrance-Free (32 oz)',
    category: 'natural-surface',
    badge: 'Home support',
    bestFor: 'Owners who want a fragrance-free cleaner for pet areas as part of flea-season cleanup.',
    asin: 'B0FVZJ1S1Z',
    amazonUrl: amazonUrl('B0FVZJ1S1Z'),
    offers: [amazonOffer('B0FVZJ1S1Z')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61lnfenO+GL._SL500_.jpg',
      alt: 'Wondercide Multi-Surface Disinfectant Spray, fragrance-free, 32 oz',
    },
    coverage: 'Home and pet-area surfaces',
    duration: 'Reusable cleaner',
    howItWorks: 'Fragrance-free hypochlorous-acid surface spray for crates, floors, and pet zones during cleanup.',
    bullets: [
      'Fragrance-free hypochlorous cleaner for crates, floors, and pet-zone surfaces',
      'Supports the environmental-cleanup half of flea season that dog products cannot cover',
      'A surface cleaner for the home, not a flea treatment for the dog itself',
    ],
  },
  {
    id: 'rinseroo-original',
    name: 'Rinseroo Slip-On Tub Sprayer',
    category: 'bath-tool',
    badge: 'Bath tool',
    bestFor: 'Owners who want to make post-hike or flea-season baths less of a wrestling match.',
    asin: 'B0CSF2LLS3',
    amazonUrl: amazonUrl('B0CSF2LLS3'),
    offers: [amazonOffer('B0CSF2LLS3')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61TF2a86MiL._SL500_.jpg',
      alt: 'Rinseroo Slip-On Tub Sprayer',
    },
    coverage: 'Bath setup convenience',
    duration: 'Reusable bath accessory',
    howItWorks: 'Turns an ordinary tub or shower into a faster rinse setup for dogs.',
    ctaLabel: 'See Rinseroo on Amazon',
    bullets: [
      'Best bath-convenience upgrade for apartment showers and guest tubs',
      'Makes rinse-heavy flea cleanup routines more realistic to stick with',
      'Not treatment on its own, but helpful when baths are part of the plan',
    ],
  },
  {
    id: 'rinseroo-shark-tank',
    name: 'Rinseroo Tub Sprayer (Shark Tank Version)',
    category: 'bath-tool',
    badge: 'Bath tool',
    bestFor: 'Owners who want the same slip-on bath idea in the newer branded version.',
    asin: 'B0CSF14JZZ',
    amazonUrl: amazonUrl('B0CSF14JZZ'),
    offers: [amazonOffer('B0CSF14JZZ')],
    image: {
      src: 'https://m.media-amazon.com/images/I/619HJ-VFtGL._SL500_.jpg',
      alt: 'Rinseroo Slip-On Tub Sprayer (Shark Tank version)',
    },
    coverage: 'Bath setup convenience',
    duration: 'Reusable bath accessory',
    howItWorks: 'Alternate Rinseroo listing for owners comparing versions or price.',
    ctaLabel: 'Check Shark Tank Version',
    bullets: [
      'Same core use case: faster rinse-downs during muddy or flea-heavy weeks',
      'Useful fallback listing if the original version is out of stock',
      'Best paired with a real shampoo-and-bedding routine, not treated as prevention alone',
    ],
  },
];

export function getFleaTickProductsByCategory(category: FleaTickProductCategory): FleaTickProduct[] {
  return fleaTickProducts.filter((product) => product.category === category);
}
