import { createChewyAffiliateLinkWithBase } from '../lib/affiliate/chewy';
import type { AffiliateOffer, OfferBackedProduct } from './products/types';

export type FleaTickProductCategory =
  | 'natural-spray'
  | 'natural-shampoo'
  | 'natural-collar'
  | 'natural-tag'
  | 'natural-chew'
  | 'natural-ear'
  | 'natural-surface'
  | 'grooming-tool'
  | 'tick-remover'
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
    id: 'skouts-honor-flea-tick-shampoo',
    name: "Skout's Honor Natural Flea & Tick Shampoo for Dogs (16 oz)",
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Owners who want a bigger bottle of mint-and-cedarwood bath-day shampoo for a regular wash routine.',
    asin: 'B08ZWKN9KK',
    amazonUrl: amazonUrl('B08ZWKN9KK'),
    offers: [amazonOffer('B08ZWKN9KK')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61IwXIgqS8L._SL500_.jpg',
      alt: "Skout's Honor Natural Flea & Tick Shampoo for Dogs, 16 oz",
    },
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Mint and cedarwood essential-oil shampoo that the brand says targets larvae and eggs during the bath.',
    bullets: [
      'Mint and cedarwood essential-oil formula in a 16 oz bottle',
      'Skout’s Honor also markets it as repelling mosquitoes after a wash',
      'Bath-day cleanup and coat support, not standalone flea control',
    ],
  },
  {
    id: 'hartz-natures-shield-shampoo',
    name: "Hartz Nature's Shield Natural Flea & Tick Dog Shampoo (14 oz)",
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Owners who want the lowest-cost botanical shampoo here and the option to buy it on Amazon or Chewy.',
    asin: 'B0BW2NS3DC',
    amazonUrl: amazonUrl('B0BW2NS3DC'),
    offers: [
      amazonOffer('B0BW2NS3DC'),
      chewyOffer('https://www.chewy.com/hartz-natures-shield-natural-flea/dp/766534', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/71oQsRJMGYL._SL500_.jpg',
      alt: "Hartz Nature's Shield Natural Flea & Tick Dog Shampoo, 14 oz",
    },
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Plant-based shampoo built on cinnamon, citronella, and rosemary oils for bath-day cleanup.',
    bullets: [
      'Cinnamon, citronella, and rosemary oils with vitamin E and glycerin for the coat',
      'Free of parabens, dyes, and alcohols, and stocked on both Amazon and Chewy',
      'Hartz labels it for routine baths; treat it as cleanup, not prevention',
    ],
  },
  {
    id: 'earth-animal-apothecary-shampoo',
    name: 'Earth Animal Apothecary Natural Flea & Tick Herbal Shampoo for Dogs (12 oz)',
    category: 'natural-shampoo',
    badge: 'Herbal shampoo',
    bestFor: 'Owners who already use Earth Animal herbal products and want the matching bath-day shampoo.',
    asin: 'B094451Q3H',
    amazonUrl: amazonUrl('B094451Q3H'),
    offers: [
      amazonOffer('B094451Q3H'),
      chewyOffer('https://www.chewy.com/earth-animal-apothecary-natural-flea/dp/1992606', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/71Su0t-7xiL._SL500_.jpg',
      alt: 'Earth Animal Apothecary Natural Flea & Tick Herbal Shampoo for Dogs, 12 oz',
    },
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Herbal shampoo the brand positions for all breeds and life stages as part of its wider flea-and-tick line.',
    bullets: [
      'Herbal formula labeled for all breeds and life stages',
      'Available on Amazon and Chewy, so it is easy to reorder with the rest of a routine',
      'Made in the USA and free of synthetic pesticides',
    ],
  },
  {
    id: 'lillian-ruff-flea-tick-shampoo',
    name: 'Lillian Ruff Flea & Tick Dog Shampoo (16 fl oz)',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Owners who want a tear-free essential-oil shampoo for dogs that hate bath time.',
    offers: [
      chewyOffer('https://www.chewy.com/lillian-ruff-flea-tick-dog-shampoo-16/dp/380716', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/is/image/catalog/354486_MAIN._AC_SX500_SY400_QL75_V1640041368_.jpg',
      alt: 'Lillian Ruff Flea & Tick Dog Shampoo, 16 fl oz bottle',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Essential-oil blend of rosemary, lavender, peppermint, thyme, wintergreen, lemongrass, citronella, and eucalyptus.',
    bullets: [
      'Tear-free and dye-free, which helps on dogs that fight the bath',
      'Chewy lists it for dogs; check the label before using it on cats or puppies',
      'Chewy-only pick, so pair it with an Amazon product if you want one cart',
    ],
  },
  {
    id: 'top-performance-natural-shampoo',
    name: 'Top Performance Natural Flea & Tick Dog & Cat Shampoo (17 fl oz)',
    category: 'natural-shampoo',
    badge: 'Budget shampoo',
    bestFor: 'Multi-pet homes that want a cheap grooming-style shampoo for both dogs and cats.',
    offers: [
      chewyOffer('https://www.chewy.com/top-performance-natural-flea-tick-dog/dp/237221', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/top-performance-natural-flea-tick-dog-cat-shampoo-17fl-oz-bottle/img-388419._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Top Performance Natural Flea & Tick Dog & Cat Shampoo, 17 fl oz bottle',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Pyrethrin-free grooming shampoo with aloe, lanolin, lecithin, and vitamin E to condition the coat.',
    bullets: [
      'Cheapest shampoo on this page and labeled for dogs and cats',
      'Pyrethrin-free formula with a herbal scent and conditioning ingredients',
      'Grooming-aisle cleanup product, not a treatment for an active infestation',
    ],
  },
  {
    id: 'wondercide-spray-lemongrass-32oz',
    name: 'Wondercide Flea, Tick & Mosquito Spray',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor:
      'Kills by contact, repels, and helps prevent fleas, ticks, and mosquitoes with natural essential oils',
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
      '98-100% efficacy in laboratory testing',
      'Targets eggs, larvae and adults',
      'Safe for dogs and cats of all ages, including puppies, kittens and senior pets, when used as directed',
      'Contains no artificial colors, fragrances, or dyes',
      'Three-in-one plant-powered formula for dogs, cats and home surfaces such as carpet, furniture, bedding and flooring',
      'Made in the USA with U.S. and global components',
      'Cruelty-free',
    ],
  },
  {
    id: 'natures-dome-peppermint-spray',
    name: "Nature's Dome Peppermint Flea & Tick Spray",
    category: 'natural-spray',
    badge: 'Natural oil spray',
    bestFor: 'Peppermint oil helps kill and repel fleas, ticks, larvae and eggs',
    offers: [
      chewyOffer('https://www.chewy.com/natures-dome-peppermint-flea-tick/dp/3684310', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06984af5-d2d4-7fe4-8000-06bc2273adb8._AC_SX500_SY400_QL75_V1_.jpg',
      alt: "Nature's Dome Peppermint Flea & Tick Spray for Dogs, 16 fl oz",
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Plant-based formula without harsh chemicals or synthetic pesticides',
      'Biodegradable, eco-friendly ingredients intended to be safer for pets, people, and the planet when used as directed',
    ],
  },
  {
    id: 'isabellas-clearly-natural-spray',
    name: "Isabella's Clearly Natural Flea & Tick Oil",
    category: 'natural-spray',
    badge: 'Natural oil',
    bestFor: 'A blend of essential oils in a nourishing sweet almond oil base for flea and tick protection',
    offers: [
      chewyOffer('https://www.chewy.com/isabellas-clearly-natural-flea-tick/dp/3701295', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0693338a-c450-70cd-8000-f2fc87404143._AC_SX500_SY400_QL75_V1_.jpg',
      alt: "Isabella's Clearly Natural Flea & Tick Oil for Dogs, 2 fl oz",
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Free from toxins, preservatives, pesticides and harmful chemicals',
      'Safe for pets, people and the planet when used as directed',
      'Conditions, moisturizes, and soothes irritated skin while adding shine to a dull coat',
      'Made in the USA in small batches for quality assurance',
    ],
  },
  {
    id: 'pure-natural-pet-spray',
    name: 'Pure and Natural Pet Dog Flea & Tick Spray',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor: 'Made with peppermint and cedarwood oils to repel pests',
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
      'Non-toxic, DEET-free and pyrethrin-free',
      'Safe for dogs 16 weeks and older when used as directed',
    ],
  },
  {
    id: 'duty-mitt-flea-tick-mitt',
    name: 'The Duty Mitt Tick & Flea Repellent Mitt for Dogs',
    category: 'natural-spray',
    badge: 'Repellent mitt',
    bestFor: 'Made with a potent blend of essential oils to effectively repel fleas and ticks',
    offers: [
      chewyOffer('https://www.chewy.com/duty-mitt-tick-flea-repellent-mitt/dp/3976198', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06a18a09-de4c-71d9-8000-2064d1284dec._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'The Duty Mitt Tick & Flea Repellent Mitt for Dogs, 6-count box',
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'No harsh chemicals or pesticides',
      'Safe for pets, people and the planet when used as directed',
      'Easy-to-use mitt format for precise application without any sprays',
      "Gentle and non-greasy formula won't strip away your pet's natural coat oils",
      'Hand-guided application allows for targeted protection while avoiding sensitive areas like the eyes and mouth',
    ],
  },
  {
    id: 'amdeiur-natural-flea-collar',
    name: 'AMDEIUR Natural Flea & Tick Collar for Dogs (2-Pack)',
    category: 'natural-collar',
    badge: 'Natural collar',
    bestFor: 'Owners who want a two-pack of adjustable collars so a replacement is already on the shelf.',
    asin: 'B0FYFDDM68',
    amazonUrl: amazonUrl('B0FYFDDM68'),
    offers: [amazonOffer('B0FYFDDM68')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61OuUQxyMRL._SL500_.jpg',
      alt: 'AMDEIUR Natural Flea & Tick Collar for Dogs, 2-pack',
    },
    coverage: 'Wearable preventative support',
    duration: 'Brand claims up to 8 months per collar',
    howItWorks: 'Adjustable leave-on collar for owners who would rather not run a daily spray routine.',
    bullets: [
      'Two adjustable collars per order, cut to fit most dog neck sizes',
      'Brand claims up to eight months of protection per collar',
      'Natural collars carry lighter evidence than conventional options; treat it as a layer',
    ],
  },
  {
    id: 'solpetti-botanical-flea-collar',
    name: 'SolPetti Botanical Flea & Tick Collar for Dogs (4-Pack)',
    category: 'natural-collar',
    badge: 'Natural collar',
    bestFor: 'Multi-dog homes or long seasons where you want a year of spare collars in one order.',
    asin: 'B0GWNBMSQ4',
    amazonUrl: amazonUrl('B0GWNBMSQ4'),
    offers: [amazonOffer('B0GWNBMSQ4')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71LlG9SX3CL._SL500_.jpg',
      alt: 'SolPetti Botanical Flea & Tick Collar for Dogs, 4-pack, gray',
    },
    coverage: 'Wearable preventative support',
    duration: 'Brand claims up to 8 months per collar',
    howItWorks: 'Botanical-oil collar sized for medium and large dogs, sold four to a pack.',
    bullets: [
      'Four adjustable, water-resistant collars sized for medium and large dogs',
      'Works out cheapest per collar if you are covering more than one dog',
      'Same lighter-evidence caveat as every wearable natural option',
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
    id: 'routade-flea-tick-pendant',
    name: 'ROUTADE Natural Flea & Tick Pendant for Dogs (2 Buckles + 4 Refills)',
    category: 'natural-tag',
    badge: 'Natural tag',
    bestFor: 'Owners who want a second refillable pendant option that clips onto the collar the dog already wears.',
    asin: 'B0H68SVCLV',
    amazonUrl: amazonUrl('B0H68SVCLV'),
    offers: [amazonOffer('B0H68SVCLV')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81korJDYRHL._SL500_.jpg',
      alt: 'ROUTADE Natural Flea & Tick Pendant for Dogs with silicone buckles and refills',
    },
    coverage: 'Wearable preventative support',
    duration: 'Refill-based; includes four refills',
    howItWorks: 'Refillable pendant with silicone buckles that attaches to an existing collar.',
    caution: 'The collar is not included; the pendant attaches to your dog’s existing collar.',
    bullets: [
      'Two silicone buckles plus four refills for indoor and outdoor wear',
      'Water-resistant build for dogs that swim or get rained on',
      'Wearable natural options are a layer, not rescue-level flea control',
    ],
  },
  {
    id: 'lkdhfjc-flea-tick-chews-200',
    name: 'LKDHFJC Natural Flea & Tick Soft Chews for Dogs (200 Count)',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Owners who want the largest count per jar for a single dog on a long season.',
    asin: 'B0GZNGT1HT',
    amazonUrl: amazonUrl('B0GZNGT1HT'),
    offers: [amazonOffer('B0GZNGT1HT')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71lWZ1NCBFL._SL500_.jpg',
      alt: 'LKDHFJC Natural Flea & Tick Soft Chews for Dogs, 200 count',
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
    id: 'only-natural-pet-barrier-bites',
    name: 'Only Natural Pet EasyDefense Barrier Bites Soft Chews (3-Pack)',
    category: 'natural-chew',
    badge: 'Brand-name chew',
    bestFor: 'Owners who would rather buy a known natural pet brand than an unbranded jar.',
    asin: 'B0CFYJM6HN',
    amazonUrl: amazonUrl('B0CFYJM6HN'),
    offers: [amazonOffer('B0CFYJM6HN')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81aWNSjRDBL._SL500_.jpg',
      alt: 'Only Natural Pet EasyDefense Barrier Bites soft flea chews for dogs, 3-pack',
    },
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 90 chews per bag, three bags per order',
    howItWorks: 'Bacon-flavored daily chew the brand markets for skin, coat, and immune support alongside pest defense.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Established natural-pet brand rather than a generic marketplace jar',
      'Bacon flavor and a three-bag order for multi-dog or long-season use',
      'Priced well above the generic chews here, so buy it for the brand, not the claims',
    ],
  },
  {
    id: 'geynaw-flea-tick-chews',
    name: 'Geynaw Natural Flea & Tick Soft Chews for Dogs (180 Count)',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Owners who want a mid-size jar with more reviews behind it than the newest listings.',
    asin: 'B0H35T1N1T',
    amazonUrl: amazonUrl('B0H35T1N1T'),
    offers: [amazonOffer('B0H35T1N1T')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81BXineNWsL._SL500_.jpg',
      alt: 'Geynaw natural flea and tick soft chews for dogs, 180 count',
    },
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 180 chews per jar',
    howItWorks: 'Chicken-flavored soft chew sold for all breeds and ages as a daily supplement.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'A 180-count jar sized for one dog through a full season',
      'Chicken flavor and a soft texture for dogs that spit out hard tablets',
      'Supplement-level support that belongs alongside real prevention',
    ],
  },
  {
    id: 'yotango-flea-tick-chews',
    name: 'YOTANGO Flea & Tick Chews for Dogs with Fish Oil & B Vitamins',
    category: 'natural-chew',
    badge: 'Skin & coat chew',
    bestFor: 'Owners who want the daily chew to double as a skin, coat, and digestion supplement.',
    asin: 'B0GV2JL462',
    amazonUrl: amazonUrl('B0GV2JL462'),
    offers: [amazonOffer('B0GV2JL462')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71ZSm7Xj6ML._SL500_.jpg',
      alt: 'YOTANGO flea and tick chews for dogs with fish oil and B vitamins',
    },
    coverage: 'Daily oral supplement support',
    duration: 'Daily chew',
    howItWorks: 'Chicken-flavored chew that adds fish oil and B vitamins to the usual pest-defense blend.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Fish oil and B vitamins aimed at skin, coat, digestion, and immune support',
      'Useful if you were already considering a separate coat supplement',
      'The supplement side is the real value here, not flea protection',
    ],
  },
  {
    id: 'beloved-pets-flea-tick-chews',
    name: 'Beloved Pets Flea & Tick Prevention Support Soft Chews (10 oz Jar)',
    category: 'natural-chew',
    badge: 'Chewy chew',
    bestFor: 'Owners who prefer to buy chews on Chewy and want a simple whole-food ingredient list.',
    offers: [
      chewyOffer('https://www.chewy.com/beloved-pets-flea-tick-prevention/dp/3614782', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0690cb47-856a-7977-8000-ba707982b1df._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Beloved Pets Flea & Tick Prevention Support Soft Chews for Dogs, 10 oz jar',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 10 oz jar',
    howItWorks: 'Soft chew built on flaxseed meal, brewer’s yeast, apple cider vinegar, and coconut oil.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Short, recognizable ingredient list built around whole-food supplements',
      'Chewy-stocked, so it fits an autoship order with food and treats',
      'Skin and coat support first; prevention still has to come from somewhere else',
    ],
  },
  {
    id: 'dr-woow-flea-tick-chews',
    name: 'Dr Woow Flea & Tick Prevention Chews for Dogs (120 Count)',
    category: 'natural-chew',
    badge: 'Chewy chew',
    bestFor: 'Owners who want a botanical chew with gut and immune support on the same label.',
    offers: [
      chewyOffer('https://www.chewy.com/dr-woow-flea-tick-prevention-chews/dp/4356846', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06a1d985-386b-785a-8000-852baa7b79d6._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Dr Woow Flea & Tick Prevention Chews for Dogs, 120 count',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 120 chews per bag',
    howItWorks: 'Botanical chew with coriander seed powder, pumpkin powder, coconut MCT oil, and B vitamins.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Botanical blend aimed at gut health, immune function, and energy',
      'Chicken-flavored and labeled for all life stages and breeds',
      'Dose by weight and keep it as a layer under your real prevention plan',
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
    id: 'tropiclean-flea-spray-home',
    name: 'TropiClean Maximum Strength Flea Spray for Dogs & Home (16 oz)',
    category: 'natural-surface',
    badge: 'Home & pet spray',
    bestFor: 'Owners who want one bottle for the dog and the bedding, carpet, and furniture it sleeps on.',
    asin: 'B01DS73GTI',
    amazonUrl: amazonUrl('B01DS73GTI'),
    offers: [amazonOffer('B01DS73GTI')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71VbhkahZ+L._SL500_.jpg',
      alt: 'TropiClean Maximum Strength Flea Spray for Dogs and Home, 16 oz',
    },
    coverage: 'Dog coat plus home surfaces',
    duration: 'Reusable spray',
    howItWorks: 'Dual-purpose spray labeled for dogs and for the bedding and surfaces around them.',
    caution: 'Read the label before spraying near cats and keep pets off treated surfaces until they dry.',
    bullets: [
      'One bottle covers the dog and the bedding, carpet, and furniture it uses',
      'The most-reviewed home product on this page by a wide margin',
      'Environmental cleanup still needs washing and vacuuming, not spray alone',
    ],
  },
  {
    id: 'green-pet-double-sided-flea-comb',
    name: 'Green Pet Double-Sided Flea Comb Set (3-Pack)',
    category: 'grooming-tool',
    badge: 'Flea comb',
    bestFor: 'Owners who want the cheapest way to actually check a coat after every walk.',
    asin: 'B0G4RDKG6P',
    amazonUrl: amazonUrl('B0G4RDKG6P'),
    offers: [amazonOffer('B0G4RDKG6P')],
    image: {
      src: 'https://m.media-amazon.com/images/I/41XYrGUZyNL._SL500_.jpg',
      alt: 'Green Pet double-sided flea comb set, 3 pieces',
    },
    coverage: 'Coat checks and flea-dirt removal',
    duration: 'Reusable tool',
    howItWorks: 'Fine-and-wide-tooth combs that pull fleas, flea dirt, and loose hair out of the coat.',
    bullets: [
      'Fine and wide teeth on one comb for checking and detangling in the same pass',
      'Three combs per set, so one can live by the door and one in the bath kit',
      'Combing is how you find a problem early; it is not treatment on its own',
    ],
  },
  {
    id: 'ikkab-flea-comb-set',
    name: 'IKKAB Flea Comb Set for Dogs & Cats (7-Piece)',
    category: 'grooming-tool',
    badge: 'Comb set',
    bestFor: 'Multi-pet homes that want a comb for every job and every animal.',
    asin: 'B0GHY17Y9S',
    amazonUrl: amazonUrl('B0GHY17Y9S'),
    offers: [amazonOffer('B0GHY17Y9S')],
    image: {
      src: 'https://m.media-amazon.com/images/I/41asQo1g--L._SL500_.jpg',
      alt: 'IKKAB 7-piece flea comb set for cats and dogs',
    },
    coverage: 'Coat checks and flea-dirt removal',
    duration: 'Reusable tools',
    howItWorks: 'Seven stainless and plastic combs covering flea removal, tear stains, and general grooming.',
    bullets: [
      'Seven combs covering flea checks, eye-area cleaning, and everyday grooming',
      'Mix of stainless steel and plastic for different coat types',
      'Good starting kit if you do not own a flea comb yet',
    ],
  },
  {
    id: 'vomroju-flea-lice-comb-set',
    name: 'Vomroju Stainless Steel Flea & Lice Comb Set (6-Piece)',
    category: 'grooming-tool',
    badge: 'Comb set',
    bestFor: 'Owners who want all-metal fine-tooth combs rather than plastic ones.',
    asin: 'B0GWCYBYWD',
    amazonUrl: amazonUrl('B0GWCYBYWD'),
    offers: [amazonOffer('B0GWCYBYWD')],
    image: {
      src: 'https://m.media-amazon.com/images/I/412bST7LkpL._SL500_.jpg',
      alt: 'Vomroju 6-piece stainless steel flea and lice comb set',
    },
    coverage: 'Coat checks and flea-dirt removal',
    duration: 'Reusable tools',
    howItWorks: 'Fine-tooth stainless combs for flea checks and tear-stain cleanup around the eyes.',
    bullets: [
      'All-stainless fine-tooth combs that hold up better than plastic teeth',
      'Six pieces including a dedicated eye-area comb',
      'Pair combing with a white towel so you can spot flea dirt as it comes out',
    ],
  },
  {
    id: 'tweezerman-precision-flea-comb',
    name: 'Tweezerman Precision Single Row Flea Comb for Dogs',
    category: 'grooming-tool',
    badge: 'Flea comb',
    bestFor: 'Owners who comb often enough that a grip and tooth spacing they actually like is worth paying for.',
    offers: [
      chewyOffer('https://www.chewy.com/tweezerman-precision-single-row-flea/dp/3969334', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0699c28a-a53f-7941-8000-078536bb9a5b._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Tweezerman Precision Single Row Flea Comb for Dogs',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Coat checks and flea-dirt removal',
    duration: 'Reusable tool',
    howItWorks: 'Single-row comb with finely spaced teeth and a non-slip handle for repeat coat passes.',
    bullets: [
      'Finely spaced single row pulls fleas and flea dirt without snagging the coat',
      'Ergonomic non-slip handle is the difference on a dog that squirms through combing',
      'Costs several times what the multipacks here do, so buy it for the handle, not extra coverage',
    ],
  },
  {
    id: 'wahl-flea-finishing-comb',
    name: 'Wahl Flea & Finishing Dog Comb',
    category: 'grooming-tool',
    badge: 'Dual-purpose comb',
    bestFor: 'Owners who want one comb that handles the flea check and the post-check tidy-up.',
    offers: [
      chewyOffer('https://www.chewy.com/wahl-flea-finishing-dog-comb/dp/3514926', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/068e80e8-8957-7b24-8000-2c6aecad578d._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Wahl Flea & Finishing Dog Comb in orange and white',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Coat checks and finishing work',
    duration: 'Reusable tool',
    howItWorks: 'Flea-comb teeth on one side and wider finishing teeth on the other for light mats after the check.',
    bullets: [
      'Flea side catches fleas, eggs, and debris; finishing side works out the light tangles you find',
      'Known grooming brand at a mid-range price between the multipacks and the Tweezerman comb',
      'Chewy-only pick here, so pair it with an Amazon item if you want a single cart',
    ],
  },
  {
    id: 'anrundar-grooming-kit',
    name: 'Anrundar 5-Piece Dog Grooming Kit with Flea Comb',
    category: 'grooming-tool',
    badge: 'Grooming kit',
    bestFor: 'Long-haired and doodle coats where you have to get through the undercoat before you can check skin.',
    asin: 'B0H2PDVZML',
    amazonUrl: amazonUrl('B0H2PDVZML'),
    offers: [amazonOffer('B0H2PDVZML')],
    image: {
      src: 'https://m.media-amazon.com/images/I/51rxMhS+UpL._SL500_.jpg',
      alt: 'Anrundar 5-piece dog grooming kit with slicker brush, undercoat rake, bath brush, metal comb, and flea comb',
    },
    coverage: 'Coat work plus flea checks',
    duration: 'Reusable tools',
    howItWorks: 'Slicker brush, undercoat rake, bath brush, metal comb, and flea comb in one kit.',
    bullets: [
      'Undercoat rake and slicker get you down to skin on doodle and long-haired coats',
      'Includes the bath brush, which makes shampoo days go faster',
      'Most useful pick here if thick coat is why you keep missing ticks',
    ],
  },
  {
    id: 'homesake-tick-remover-kit',
    name: 'Homesake Tick Remover Tool Kit with Fine-Tip Tweezers',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor: 'Households that want one tick kit that works on the dog and on people.',
    asin: 'B0883ZB976',
    amazonUrl: amazonUrl('B0883ZB976'),
    offers: [amazonOffer('B0883ZB976')],
    image: {
      src: 'https://m.media-amazon.com/images/I/710I6aesL8L._SL500_.jpg',
      alt: 'Homesake stainless steel tick remover tool kit with fine-tip tweezers and pouch',
    },
    coverage: 'Tick removal for dogs and people',
    duration: 'Reusable tools',
    howItWorks: 'Stainless removal tools plus fine-tip tweezers for getting the head and body out cleanly.',
    caution: 'Save the tick and call your vet or doctor if the bite site stays inflamed or symptoms follow.',
    bullets: [
      'Fine-tip tweezers are the part that matters for small deer ticks',
      'Pouch and ID card make it realistic to keep in a pack instead of a drawer',
      'Labeled for dogs, cats, and humans, so one kit covers the household',
    ],
  },
  {
    id: 'ahhomatata-tick-twister-set',
    name: 'AHHOMATATA 10-in-1 Tick Removal & Twister Kit',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor: 'Hikers and campers who want spare tick tools in more than one bag.',
    asin: 'B0GHGJVRFL',
    amazonUrl: amazonUrl('B0GHGJVRFL'),
    offers: [amazonOffer('B0GHGJVRFL')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71BLK1bSzYL._SL500_.jpg',
      alt: 'AHHOMATATA 10-in-1 stainless steel tick removal and twister kit',
    },
    coverage: 'Tick removal for dogs and people',
    duration: 'Reusable tools',
    howItWorks: 'Ten stainless pullers, twisters, and tweezers sized for different tick sizes.',
    caution: 'Save the tick and call your vet or doctor if the bite site stays inflamed or symptoms follow.',
    bullets: [
      'Enough tools to stock the car, the pack, and the house at once',
      'Twister-style hooks handle engorged ticks that tweezers can crush',
      'Worth keeping wherever you actually finish walks, not in a cabinet',
    ],
  },
  {
    id: 'tweezerman-tick-removal-kit',
    name: 'Tweezerman Tick Removal Kit for Dogs',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor: 'Owners who want one well-made tool that covers both nymph-sized and engorged ticks.',
    offers: [
      chewyOffer('https://www.chewy.com/tweezerman-tick-removal-kit-dogs/dp/3969342', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0699c28a-9afb-7ff9-8000-fbbc8d9dafca._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Tweezerman Tick Removal Kit for Dogs with dual-ended tweezer and travel case',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Tick removal for dogs',
    duration: 'Reusable tool',
    howItWorks: 'Dual-ended stainless tool with a V-shaped end for larger ticks and tweezer tips for small ones.',
    caution: 'Save the tick and call your vet or doctor if the bite site stays inflamed or symptoms follow.',
    bullets: [
      'One tool covers both tick sizes instead of making you pick the right piece from a kit',
      'Travel case makes it realistic to keep in the pack rather than a kitchen drawer',
      'Stainless build sanitizes easily between uses',
    ],
  },
  {
    id: 'tweezerman-tick-tweezer',
    name: 'Tweezerman Stainless Steel Portable Tick Removal Tweezer for Pets',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor: 'Owners who only want the tweezer and already know fine tips are the part that matters.',
    offers: [
      chewyOffer('https://www.chewy.com/tweezerman-tick-removal-tweezer-pets/dp/1522510', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0682dd37-1a86-72c4-8000-51c51e9d964f._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Tweezerman Stainless Steel Portable Tick Removal Tweezer for Pets',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Tick removal for dogs and cats',
    duration: 'Reusable tool',
    howItWorks: 'Tapered, hand-aligned tips that grip under the tick body so mouthparts come out with it.',
    caution: 'Save the tick and call your vet or doctor if the bite site stays inflamed or symptoms follow.',
    bullets: [
      'Aligned tapered tips are what keep the head from breaking off under the skin',
      'Textured grip helps when your hands are cold or wet after a walk',
      'Single tool, so keep a second one wherever you actually finish hikes',
    ],
  },
  {
    id: 'tickcheck-premium-tick-kit',
    name: 'TickCheck Premium Dog Tick Removal Kit',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor: 'Households in high tick-disease regions that want a fork, fine tweezers, and an ID card together.',
    offers: [
      chewyOffer('https://www.chewy.com/tickcheck-premium-dog-tick-removal/dp/352001', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/tickcheck-premium-dog-tick-removal-kit/img-436238._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'TickCheck Premium Dog Tick Removal Kit with stainless fork, tweezers, pouch, and tick ID card',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Tick removal for dogs, cats, and people',
    duration: 'Reusable tools',
    howItWorks: 'Stainless removal fork for embedded ticks plus ultra-fine tweezers for deer ticks and nymphs.',
    caution: 'Save the tick and call your vet or doctor if the bite site stays inflamed or symptoms follow.',
    bullets: [
      'Fork lifts larger embedded ticks; the fine tips handle nymphs the fork cannot grip',
      'ID card diagrams the common North American species, which matters for what you do next',
      'Leatherette pouch keeps both tools together in a pack or glovebox',
    ],
  },
  {
    id: 'tickcheck-remover-spoon',
    name: 'TickCheck Remover Spoon with Tick ID Card (3-Pack)',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor: 'Owners who want the cheapest way to keep a tick tool in the car, the pack, and the house.',
    offers: [
      chewyOffer('https://www.chewy.com/tickcheck-remover-spoon-tick-id-card/dp/352007', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/tickcheck-remover-spoon-with-tick-id-card-3-pack/img-202294._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'TickCheck Remover Spoon with Tick ID Card, 3-pack with carabiner',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Tick removal for dogs and people',
    duration: 'Reusable tools',
    howItWorks: 'Notched plastic spoons that slide under the tick and hold it after removal for identification.',
    caution: 'Save the tick and call your vet or doctor if the bite site stays inflamed or symptoms follow.',
    bullets: [
      'Cheapest tick tool on this page and it comes three to a pack',
      'The spoon shape holds the tick after removal instead of losing it on the floor',
      'Carabiner and laminated instructions clip straight to a leash or pack strap',
    ],
  },
  {
    id: 'rinseroo-original',
    name: 'Rinseroo Slip-On Sprayer',
    category: 'bath-tool',
    badge: 'Bath tool',
    bestFor: 'Owners who want to make post-hike or flea-season baths less of a wrestling match.',
    asin: 'B0CSF2LLS3',
    amazonUrl: amazonUrl('B0CSF2LLS3'),
    offers: [
      amazonOffer('B0CSF2LLS3'),
      chewyOffer('https://www.chewy.com/rinseroo-slip-on-sprayer-cat-portable/dp/3650750', 'natural-flea-and-tick-prevention-for-dogs'),
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/61TF2a86MiL._SL500_.jpg',
      alt: 'Rinseroo Slip-On Sprayer hose attachment for dog baths',
    },
    coverage: 'Bath setup convenience',
    duration: 'Reusable bath accessory',
    howItWorks: 'Turns an ordinary tub or shower into a faster rinse setup for dogs.',
    bullets: [
      'Best bath-convenience upgrade for apartment showers and guest tubs',
      'Makes rinse-heavy flea cleanup routines more realistic to stick with',
      'Check the fitting before you buy: the Amazon listing is the tub-faucet slip-on, the Chewy listing is the showerhead version',
      'Not treatment on its own, but helpful when baths are part of the plan',
    ],
  },
];

export function getFleaTickProductsByCategory(category: FleaTickProductCategory): FleaTickProduct[] {
  return fleaTickProducts.filter((product) => product.category === category);
}
