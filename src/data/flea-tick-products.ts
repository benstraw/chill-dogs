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
    id: 'wondercide-spray-lemongrass',
    name: 'Wondercide Flea & Tick Spray, Lemongrass (16 oz)',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor: 'Owners who want Wondercide’s most common plant-based spray format.',
    asin: 'B01M8GFPXG',
    amazonUrl: amazonUrl('B01M8GFPXG'),
    offers: [
      amazonOffer('B01M8GFPXG'),
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-dogs-home/dp/253125', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    coverage: 'Kills on contact when used as directed; also marketed for repelling',
    duration: 'Short-interval reapplication',
    howItWorks: 'Spray-on plant-oil product that is strongest as part of a layered routine.',
    caution: 'Lemongrass oil can be a cat-safety issue. Use extra caution in mixed-pet homes.',
    bullets: [
      'Best natural first-line option for owners who want something to spray now',
      'Works best when expectations stay realistic about reapplication and exposure level',
      'Read the exact label language before assuming every Wondercide product does the same job',
    ],
  },
  {
    id: 'wondercide-spray-peppermint',
    name: 'Wondercide Flea & Tick Spray, Peppermint (16 oz)',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor: 'Owners who prefer the peppermint version and will read cat-safety details closely.',
    asin: 'B076VTZZ6N',
    amazonUrl: amazonUrl('B076VTZZ6N'),
    offers: [
      amazonOffer('B076VTZZ6N'),
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-dogs-home/dp/253129', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    coverage: 'Kills on contact when used as directed; also marketed for repelling',
    duration: 'Short-interval reapplication',
    howItWorks: 'Peppermint-scent version of Wondercide’s best-known natural spray.',
    caution: 'Peppermint oil also merits extra caution around cats.',
    bullets: [
      'Same general use case as the lemongrass spray with a different scent profile',
      'Better framed as a layered natural tool than as a one-and-done seasonal fix',
      'Mixed-pet homes should read the cat language twice before using it',
    ],
  },
  {
    id: 'wondercide-spray-cedarwood',
    name: 'Wondercide Flea & Tick Spray, Cedarwood (16 oz)',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor: 'Owners who want the cedarwood-centered Wondercide spray without peppermint or lemongrass scent.',
    asin: 'B01M626UN6',
    amazonUrl: amazonUrl('B01M626UN6'),
    offers: [
      amazonOffer('B01M626UN6'),
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-dogs-home/dp/253121', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    coverage: 'Kills on contact when used as directed; also marketed for repelling',
    duration: 'Short-interval reapplication',
    howItWorks: 'Cedarwood-forward Wondercide spray for routine natural prevention layers.',
    bullets: [
      'Good fit for owners who want a Wondercide spray but dislike minty scents',
      'Still requires repeated use and realistic expectations in high-pressure regions',
      'Best paired with bedding cleanup, coat checks, and environmental control',
    ],
  },
  {
    id: 'wondercide-spot-on-medium',
    name: 'Wondercide Spot On for Dogs, Medium (Peppermint)',
    category: 'natural-spot-on',
    badge: 'Natural spot-on',
    bestFor: 'Owners who want a lower-fuss natural preventative than a daily spray routine.',
    asin: 'B09XTNNN2Q',
    amazonUrl: amazonUrl('B09XTNNN2Q'),
    offers: [
      amazonOffer('B09XTNNN2Q'),
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-spot-dogs/dp/639710', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    coverage: 'Plant-based preventative support',
    duration: 'Label-directed recurring use',
    howItWorks: 'Spot-on format for owners who want ongoing prevention without full-body spraying.',
    bullets: [
      'Best natural pick when owners want less daily work than a spray',
      'Still a prevention-first product, not an answer for a house-wide infestation',
      'Good candidate for lower-exposure dogs whose owners want a lighter routine',
    ],
  },
  {
    id: 'wondercide-shampoo-peppermint',
    name: 'Wondercide Flea & Tick Shampoo, Peppermint (12 oz)',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Owners who want bath-day support alongside sprays, checks, and bedding cleanup.',
    offers: [
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-shampoo-dogs/dp/639662', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    coverage: 'Bath support and coat cleanup',
    duration: 'Per bath',
    howItWorks: 'Shampoo helps with bath-day cleanup but does not replace a prevention plan.',
    bullets: [
      'Most useful as part of a cleanup routine after exposure or during light flea pressure',
      'Better treated as support than as standalone flea control',
      'Easy cross-over product for the bath-tools page too',
    ],
  },
  {
    id: 'wondercide-collar-peppermint',
    name: 'Wondercide Flea & Tick Collar, Peppermint (S/M)',
    category: 'natural-collar',
    badge: 'Natural collar',
    bestFor: 'Owners who prefer a wearable natural option and accept lighter evidence than Rx or OTC meds.',
    offers: [
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-dogs-collar/dp/550726', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    coverage: 'Preventative wearable support',
    duration: 'Continuous wear',
    howItWorks: 'Wearable natural option for owners who prefer a collar format.',
    bullets: [
      'Good for owners who want a leave-on natural option instead of spray-only routines',
      'Evidence is still weaker than conventional medication categories',
      'Works best for lighter-pressure households that already do coat checks and cleanup',
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
