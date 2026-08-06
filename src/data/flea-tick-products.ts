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
    name: 'Wondercide Flea & Tick Shampoo for Dogs & Cats',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Helps kill and repel fleas and ticks on contact',
    asin: 'B09WLSNZZC',
    amazonUrl: amazonUrl('B09WLSNZZC'),
    offers: [
      amazonOffer('B09WLSNZZC'),
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-peppermint-cat/dp/639662', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/61ylsHHZN5L._SL500_.jpg',
      alt: 'Wondercide Flea & Tick Shampoo for Dogs and Cats, 12 oz',
    },
    bullets: [
      'Powered by plants',
      'Safe for dogs four months old and older',
      'Features natural essential oils',
      'pH balanced. Helps soothe itchy skin',
    ],
  },
  {
    id: 'hartz-natures-shield-shampoo',
    name: "Hartz Nature's Shield Natural Flea & Tick Dog Shampoo",
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Natural oils help to kill fleas, ticks and flea eggs on contact',
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
    bullets: [
      'Repels mosquitoes for up to 24 hours',
      'Contains plant-based ingredients like cinnamon, citronella, and rosemary oils',
      'Free of parabens, dyes and alcohol',
      "Vitamin E and glycerin help to clean, deodorize and nourish your dog's skin and coat",
      'Safe for pets, people and the planet when used as directed',
    ],
  },
  {
    id: 'earth-animal-apothecary-shampoo',
    name: 'Earth Animal Apothecary Natural Flea & Tick Herbal Shampoo for Dogs',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Infused with cedarwood and peppermint oils',
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
    bullets: [
      'Repels fleas, ticks and mosquitoes',
      'No harmful chemicals',
      'Made in the USA by Earth Animal, a certified B Corp',
    ],
  },
  {
    id: 'lillian-ruff-flea-tick-shampoo',
    name: 'Lillian Ruff Flea & Tick Dog Shampoo',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Natural essential oils help to repel fleas and ticks',
    offers: [
      chewyOffer('https://www.chewy.com/lillian-ruff-flea-tick-dog-shampoo-16/dp/380716', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/is/image/catalog/354486_MAIN._AC_SX500_SY400_QL75_V1640041368_.jpg',
      alt: 'Lillian Ruff Flea & Tick Dog Shampoo, 16 fl oz bottle',
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Rosemary oil acts as a repellent and antiseptic to soothe irritated skin',
      'Aloe soothes and moisturizes the skin',
      'Tear-free, dye-free, gluten-free, paraben-free, and vegan',
      'Cruelty free',
      'Made in the USA',
    ],
  },
  {
    id: 'top-performance-natural-shampoo',
    name: 'Top Performance Natural Flea & Tick Dog & Cat Shampoo',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Kills fleas and ticks on contact, and helps to prevent future reinfestation',
    offers: [
      chewyOffer('https://www.chewy.com/top-performance-natural-flea-tick-dog/dp/237221', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/top-performance-natural-flea-tick-dog-cat-shampoo-17fl-oz-bottle/img-388419._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Top Performance Natural Flea & Tick Dog & Cat Shampoo, 17 fl oz bottle',
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'No harsh chemicals or pesticides',
      'Includes gentle yet effective ingredients to help condition and moisturize the skin',
      'Safe for dogs 12 weeks old and older',
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
    bestFor: 'Natural ingredients keep fleas and ticks away from your dog',
    asin: 'B0FYFDDM68',
    amazonUrl: amazonUrl('B0FYFDDM68'),
    offers: [amazonOffer('B0FYFDDM68')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61OuUQxyMRL._SL500_.jpg',
      alt: 'AMDEIUR Natural Flea & Tick Collar for Dogs, 2-pack',
    },
    bullets: [
      'Provides 8 months of protection',
      'Lightweight',
      'Adjustable fit',
      'Indoor and outdoor use',
      'Water resistant',
    ],
  },
  {
    id: 'solpetti-botanical-flea-collar',
    name: 'SolPetti Botanical Flea & Tick Collar for Dogs (4-Pack)',
    category: 'natural-collar',
    badge: 'Natural collar',
    bestFor: 'Natural ingredients keep fleas and ticks away from your dog',
    asin: 'B0GWNBMSQ4',
    amazonUrl: amazonUrl('B0GWNBMSQ4'),
    offers: [amazonOffer('B0GWNBMSQ4')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71LlG9SX3CL._SL500_.jpg',
      alt: 'SolPetti Botanical Flea & Tick Collar for Dogs, 4-pack, gray',
    },
    bullets: [
      'Provides 8 months of protection',
      'Lightweight',
      'Adjustable fit',
      'Indoor and outdoor use',
      'Water resistant',
    ],
  },
  {
    id: 'trihood-flea-tick-tag',
    name: 'Trihood Natural Flea & Tick Dog Tag (2-Pack + 4 Refills)',
    category: 'natural-tag',
    badge: 'Natural tag',
    bestFor: 'Plant-based protection repels fleas, ticks, and mosquitoes',
    asin: 'B0GVYVSDK5',
    amazonUrl: amazonUrl('B0GVYVSDK5'),
    offers: [amazonOffer('B0GVYVSDK5')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81OuVBoQyGL._SL500_.jpg',
      alt: 'Trihood Natural Flea & Tick Dog Tag pendants with refills',
    },
    bullets: [
      'Formulated with natural essential oils including peppermint, citronella, and rosemary',
      'No harsh chemicals',
      'Lightweight',
      'Attaches to any collar',
      'Indoor and outdoor use',
      'Water resistant',
    ],
  },
  {
    id: 'routade-flea-tick-pendant',
    name: 'ROUTADE Natural Flea & Tick Pendant for Dogs (2 Buckles + 4 Refills)',
    category: 'natural-tag',
    badge: 'Natural tag',
    bestFor: 'Plant-based protection repels fleas, ticks, and mosquitoes',
    asin: 'B0H68SVCLV',
    amazonUrl: amazonUrl('B0H68SVCLV'),
    offers: [amazonOffer('B0H68SVCLV')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81korJDYRHL._SL500_.jpg',
      alt: 'ROUTADE Natural Flea & Tick Pendant for Dogs with silicone buckles and refills',
    },
    bullets: [
      'Formulated with natural essential oils including lemongrass, citronella, rosemary, cedarwood, and peppermint',
      'No harsh chemicals',
      'Lightweight',
      'Attaches to any collar',
      'Indoor and outdoor use',
      'Water resistant',
    ],
  },
  {
    id: 'lkdhfjc-flea-tick-chews-200',
    name: 'LKDHFJC Natural Flea & Tick Soft Chews',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Flea, tick and mosquito protection',
    asin: 'B0GZNGT1HT',
    amazonUrl: amazonUrl('B0GZNGT1HT'),
    offers: [amazonOffer('B0GZNGT1HT')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71lWZ1NCBFL._SL500_.jpg',
      alt: 'LKDHFJC Natural Flea & Tick Soft Chews for Dogs, 200 count',
    },
    bullets: [
      'Supports immune health',
      'Helps maintain healthy skin and coat',
      'Natural ingredients include Vitamin B1, Vitamin B6, Vitamin B12, Brewer’s Yeast, Flaxseed Meal, and Apple Cider Vinegar Powder',
    ],
  },
  {
    id: 'geynaw-flea-tick-chews',
    name: 'Geynaw Natural Flea & Tick Soft Chews',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Flea, tick and mosquito protection',
    asin: 'B0H35T1N1T',
    amazonUrl: amazonUrl('B0H35T1N1T'),
    offers: [amazonOffer('B0H35T1N1T')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81BXineNWsL._SL500_.jpg',
      alt: 'Geynaw natural flea and tick soft chews for dogs, 180 count',
    },
    bullets: [
      'Supports immune health',
      'Helps maintain healthy skin and coat',
      'Natural ingredients include Vitamin B1, Vitamin B6, Vitamin B12, Brewer’s Yeast, Coriander, and Neem',
      'No artificial flavoring, no artificial preservatives, no gluten',
      'Made in USA',
    ],
  },
  {
    id: 'yotango-flea-tick-chews',
    name: 'YOTANGO Flea & Tick Chews',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Flea, tick and mosquito protection',
    asin: 'B0GV2JL462',
    amazonUrl: amazonUrl('B0GV2JL462'),
    offers: [amazonOffer('B0GV2JL462')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71ZSm7Xj6ML._SL500_.jpg',
      alt: 'YOTANGO flea and tick chews for dogs with fish oil and B vitamins',
    },
    bullets: [
      'Supports immune health',
      'Helps maintain healthy skin and coat',
      'Supports digestive balance',
      'No artificial colors or flavors',
      'Natural ingredients include Vitamin B1, Vitamin B6, Vitamin B12, Coconut Oil, Brewer’s Yeast, Flaxseed Meal, Neem Leaf Extract, Carrot Juice Powder, Apple Cider Vinegar Powder, Zinc, and Biotin',
    ],
  },
  {
    id: 'beloved-pets-flea-tick-chews',
    name: 'Beloved Pets Flea & Tick Prevention Support Soft Chews',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Flea, tick and mosquito protection',
    offers: [
      chewyOffer('https://www.chewy.com/beloved-pets-flea-tick-prevention/dp/3614782', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0690cb47-856a-7977-8000-ba707982b1df._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Beloved Pets Flea & Tick Prevention Support Soft Chews for Dogs, 10 oz jar',
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Supports immune health',
      'Helps maintain healthy skin and coat',
      'Natural ingredients include Vitamin B1, Vitamin B3, Vitamin B6, Vitamin B12, Coconut Oil, Brewer’s Yeast, Flaxseed Meal, Apple Cider Vinegar, Garlic Powder, and Zinc',
    ],
  },
  {
    id: 'dr-woow-flea-tick-chews',
    name: 'Dr Woow Flea & Tick Prevention Chews',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Flea, tick and mosquito protection',
    asin: 'B0GX95TKVQ',
    amazonUrl: amazonUrl('B0GX95TKVQ'),
    offers: [
      amazonOffer('B0GX95TKVQ'),
      chewyOffer('https://www.chewy.com/dr-woow-flea-tick-prevention-chews/dp/4356846', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06a1d985-386b-785a-8000-852baa7b79d6._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Dr Woow Flea & Tick Prevention Chews for Dogs, 120 count',
    },
    bullets: [
      'Supports immune health',
      'Helps maintain healthy skin and coat',
      'Supports digestive balance',
      'No artificial flavors or preservatives',
      'Natural ingredients include Vitamin B1, Vitamin B6, Vitamin B12, Coriander Seed, Pumpkin Powder, and Coconut Oil MCT',
      'Made in USA',
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
