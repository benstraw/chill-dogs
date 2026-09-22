import { createChewyAffiliateLinkWithBase } from '../lib/affiliate/chewy';
import type { AffiliateOffer, OfferBackedProduct } from './products/types';

export type FleaTickProductCategory =
  | 'otc-topical'
  | 'otc-collar'
  | 'natural-spray'
  | 'natural-spot-on'
  | 'natural-shampoo'
  | 'natural-collar'
  | 'natural-tag'
  | 'natural-chew'
  | 'grooming-tool'
  | 'tick-remover'
  | 'bath-tool';

export interface FleaTickProduct extends OfferBackedProduct {
  id: string;
  name: string;
  category: FleaTickProductCategory;
  badge: string;
  /** Optional: cards whose copy is a plain bullet list omit the "best for" line. */
  bestFor?: string;
  bullets: string[];
  activeIngredient?: string;
  coverage?: string;
  duration?: string;
  howItWorks?: string;
  caution?: string;
  rxRequired?: boolean;
  ctaLabel?: string;
  image?: { src: string; alt: string };
  /** Hand-authored gallery override. Normally galleries live in src/data/product-galleries.ts;
   *  read both through getProductImages() in src/data/products/images.ts. */
  images?: readonly { src: string; alt: string }[];
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
    id: 'vectra-3d-xl-95-plus',
    name: 'Vectra 3D for Dogs',
    category: 'otc-topical',
    badge: 'Topical treatment',
    asin: 'B071JS3MYK',
    amazonUrl: amazonUrl('B071JS3MYK'),
    offers: [
      amazonOffer('B071JS3MYK'),
      chewyOffer(
        'https://www.chewy.com/vectra-3d-flea-tick-control-dogs-over/dp/756022',
        'best-flea-and-tick-products-for-dogs',
      ),
    ],
    image: {
      src: 'https://m.media-amazon.com/images/I/61OiU7XqOaL._AC_SX300_SY300_QL70_FMwebp_.jpg',
      alt: 'Vectra 3D flea, tick and mosquito topical treatment for dogs',
    },
    activeIngredient: 'Dinotefuran + permethrin + pyriproxyfen',
    coverage: 'Fleas, ticks, mosquitoes',
    duration: '1 month per dose',
    caution: 'Contains permethrin. Do not use in homes where treated dogs closely share space with cats.',
    bullets: [
      'Fast-acting treatment begins reducing flea feeding in as little as five minutes and kills fleas within four hours',
      'Built for dogs with more everyday exposure, from yards and parks to trails and travel',
      'Waterproof after 24 hours, and available without a prescription',
      'Permethrin makes this a dog-only-household product; see the caution before buying',
      'Dosing is by weight band, so use the size selector below to land on the listing for your dog',
    ],
    variantGroup: {
      axis: {
        id: 'dog-size',
        label: 'Dog weight',
        hint: 'Weigh your dog first. A band too low underdoses, and the bands do not overlap.',
      },
      defaultVariantId: 'over-95',
      variants: [
        {
          id: '5-10',
          label: '5–10 lbs',
          longLabel: 'Extra small dogs, 5 to 10 lbs',
          offers: [
            amazonOffer('B071ZZHCB8'),
            chewyOffer(
              'https://www.chewy.com/vectra-3d-flea-tick-spot-treatment/dp/189443',
              'best-flea-and-tick-products-for-dogs',
            ),
          ],
        },
        {
          id: '11-20',
          label: '11–20 lbs',
          longLabel: 'Small dogs, 11 to 20 lbs',
          offers: [
            amazonOffer('B071G1CW6Z'),
            chewyOffer(
              'https://www.chewy.com/vectra-3d-flea-tick-spot-treatment/dp/189435',
              'best-flea-and-tick-products-for-dogs',
            ),
          ],
        },
        {
          id: '21-55',
          label: '21–55 lbs',
          longLabel: 'Medium dogs, 21 to 55 lbs',
          offers: [
            amazonOffer('B072PSXSNM'),
            chewyOffer(
              'https://www.chewy.com/vectra-3d-flea-tick-spot-treatment/dp/189437',
              'best-flea-and-tick-products-for-dogs',
            ),
          ],
        },
        {
          id: '56-95',
          label: '56–95 lbs',
          longLabel: 'Large dogs, 56 to 95 lbs',
          offers: [
            amazonOffer('B071JS3N2K'),
            chewyOffer(
              'https://www.chewy.com/vectra-3d-flea-tick-spot-treatment/dp/189441',
              'best-flea-and-tick-products-for-dogs',
            ),
          ],
        },
        {
          id: 'over-95',
          label: 'Over 95 lbs',
          longLabel: 'Extra large dogs, over 95 lbs',
          offers: [
            amazonOffer('B071JS3MYK'),
            chewyOffer(
              'https://www.chewy.com/vectra-3d-flea-tick-control-dogs-over/dp/756022',
              'best-flea-and-tick-products-for-dogs',
            ),
          ],
        },
      ],
    },
  },
  {
    id: 'trioak-topical-medium-23-44',
    name: 'TriOak Flea & Tick Topical for Dogs',
    category: 'otc-topical',
    badge: 'Topical treatment',
    asin: 'B0HBRLNV8D',
    amazonUrl: amazonUrl('B0HBRLNV8D'),
    offers: [amazonOffer('B0HBRLNV8D')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71diirijNGL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'TriOak flea and tick topical treatment for dogs',
    },
    activeIngredient: 'Pyriproxyfen',
    coverage: 'Fleas, ticks, lice',
    duration: '1 month per dose',
    bullets: [
      'Starts working within 24 hours',
      '30 days of continuous protection',
      'Available without a prescription',
      'Odorless and waterproof',
      'Helps break the flea life cycle',
    ],
  },
  {
    id: 'udyoude-flea-collar-large-2pack',
    name: 'UDyoude Flea & Tick Collar for Large Dogs (2-Pack)',
    category: 'otc-collar',
    badge: 'Flea and tick collar',
    asin: 'B0GS5QSQ9M',
    amazonUrl: amazonUrl('B0GS5QSQ9M'),
    offers: [amazonOffer('B0GS5QSQ9M')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61WKFGE421L._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'UDyoude flea and tick collar for large dogs, 2-pack',
    },
    coverage: 'Fleas and ticks',
    duration: 'Up to 8 months per collar',
    bullets: [
      'Flexible collar adjusts to fit medium and large dog breeds',
      'Active ingredients: Citronella, Cinnamon and Garlic Oil',
      'Waterproof design',
    ],
  },
  {
    id: 'cabins-flea-collar-4pack',
    name: 'Cabins Flea & Tick Collar for Dogs (4-Count)',
    category: 'otc-collar',
    badge: 'Flea and tick collar',
    asin: 'B0H858PN38',
    amazonUrl: amazonUrl('B0H858PN38'),
    offers: [amazonOffer('B0H858PN38')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81J9AWjy75L._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Cabins flea and tick collar for dogs, 4-count set',
    },
    coverage: 'Fleas, ticks, larvae, lice',
    duration: 'Up to 6 months per collar',
    bullets: [
      'One size fits all breeds buckle system',
      'Active ingredients: Peppermint, Citronella and Lemongrass oil',
      'Waterproof design',
    ],
  },
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
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-peppermint-cat/dp/639662', 'best-flea-and-tick-products-for-dogs'),
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
      chewyOffer('https://www.chewy.com/hartz-natures-shield-natural-flea/dp/766534', 'best-flea-and-tick-products-for-dogs'),
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
      chewyOffer('https://www.chewy.com/earth-animal-apothecary-natural-flea/dp/1992606', 'best-flea-and-tick-products-for-dogs'),
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
      chewyOffer('https://www.chewy.com/lillian-ruff-flea-tick-dog-shampoo-16/dp/380716', 'best-flea-and-tick-products-for-dogs'),
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
      chewyOffer('https://www.chewy.com/top-performance-natural-flea-tick-dog/dp/237221', 'best-flea-and-tick-products-for-dogs'),
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
    id: 'tevrapet-naturals-flea-tick-shampoo',
    name: 'TevraPet Naturals Flea & Tick Dog & Cat Shampoo',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'A small bottle for households that bathe both dogs and cats',
    offers: [
      chewyOffer('https://www.chewy.com/tevrapet-naturals-flea-tick-dog-cat/dp/332995', 'best-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/068b8723-5c52-77b1-8000-960839338a78._AC_SS1800_V1_.jpg',
      alt: 'TevraPet Naturals Flea & Tick Dog & Cat Shampoo, 8 fl oz bottle',
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Covers fleas, ticks, and mosquitoes in a single wash',
      'Hypoallergenic formula aimed at pets with sensitive skin',
      'Labeled for use on both dogs and cats',
      '8 fl oz — the smallest bottle in this section, useful for trying a formula before committing',
    ],
  },
  {
    id: 'we-love-doodles-flea-tick-shampoo',
    name: 'We Love Doodles 5-in-1 Flea & Tick Peppermint Dog Shampoo',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Thick and curly coats that mat easily after a bath',
    offers: [
      chewyOffer('https://www.chewy.com/we-love-doodles-flea-tick-dog-shampoo/dp/3987470', 'best-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/069a9dd9-cb30-7478-8000-553f5f4ab2bf._AC_SS1800_V1_.jpg',
      alt: 'We Love Doodles 5-in-1 Flea & Tick Peppermint Dog Shampoo, 16 fl oz bottle',
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Peppermint formula that cleans the coat and repels fleas and ticks',
      'No harsh chemicals, and formulated for all coat types',
      'Lifts dirt without stripping the coat of its natural oils',
      'Peppermint oil can be toxic to cats — this one is labeled for dogs only',
      '16 fl oz bottle',
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
      chewyOffer('https://www.chewy.com/wondercide-flea-tick-dogs-home/dp/253125', 'best-flea-and-tick-products-for-dogs'),
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
      chewyOffer('https://www.chewy.com/natures-dome-peppermint-flea-tick/dp/3684310', 'best-flea-and-tick-products-for-dogs'),
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
      chewyOffer('https://www.chewy.com/isabellas-clearly-natural-flea-tick/dp/3701295', 'best-flea-and-tick-products-for-dogs'),
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
      chewyOffer('https://www.chewy.com/pure-natural-pets-dog-flea-tick-spray/dp/2037798', 'best-flea-and-tick-products-for-dogs'),
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
    id: 'ortho-pawz-natural-flea-tick-spray',
    name: 'Ortho Pawz All Natural Dog & Cat Flea & Tick Spray',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor: 'A citrus-oil spray for households with both dogs and cats',
    offers: [
      chewyOffer('https://www.chewy.com/ortho-pawz-all-natural-dog-cat-flea/dp/4320046', 'best-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06a0f626-39ae-75fc-8000-fb139d5f7291._AC_SS1800_V1_.jpg',
      alt: 'Ortho Pawz All Natural Dog & Cat Flea & Tick Spray, 8 fl oz bottle',
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Citrus oil formula rather than synthetic pesticides',
      'Targets fleas, ticks, mosquitoes, lice, and mites on contact',
      'Labeled for daily use on dogs and cats, including puppies and kittens',
      'Can also be used on bedding and grooming tools',
      'Made in the USA, 8 fl oz bottle',
    ],
  },
  {
    id: 'duty-mitt-flea-tick-mitt',
    name: 'The Duty Mitt Tick & Flea Repellent Mitt for Dogs',
    category: 'natural-spray',
    badge: 'Repellent mitt',
    bestFor: 'Made with a potent blend of essential oils to effectively repel fleas and ticks',
    offers: [
      chewyOffer('https://www.chewy.com/duty-mitt-tick-flea-repellent-mitt/dp/3976198', 'best-flea-and-tick-products-for-dogs'),
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
    id: 'tenerolike-essential-oil-collar-5pack',
    name: 'tenerolike Natural Flea & Tick Collar for Dogs (5-Pack)',
    category: 'natural-collar',
    badge: 'Natural collar',
    asin: 'B0H5CPWNV6',
    amazonUrl: amazonUrl('B0H5CPWNV6'),
    offers: [amazonOffer('B0H5CPWNV6')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71grh6AWVWL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'tenerolike natural essential-oil flea and tick collars for dogs, 5-pack in grey',
    },
    bullets: [
      'Interrupts the life cycle of fleas and ticks',
      'Each collar provides up to 8 months of protection',
      'Crafted with natural plant-derived ingredients: Lavender oil, Lemon eucalyptus oil, Linaloe oil, Citronella, Lemongrass oil, and Geraniol',
      'No synthetic pesticides or harmful chemicals',
      'Made of soft material with smooth rounded edges',
      'Adjustable size',
      'Water-resistant',
    ],
  },
  {
    id: 'crobirware-natural-flea-collar-6pack',
    name: 'Crobirware Natural Flea & Tick Collar for Dogs (6-Pack)',
    category: 'natural-collar',
    badge: 'Natural collar',
    asin: 'B0H6PZ4XFQ',
    amazonUrl: amazonUrl('B0H6PZ4XFQ'),
    offers: [amazonOffer('B0H6PZ4XFQ')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81KJ9XIFoNL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Crobirware natural flea and tick collars for dogs, 6-pack in black and gold',
    },
    bullets: [
      'Interrupts the life cycle of fleas and ticks',
      'Each collar provides up to 8 months of protection',
      'Made of natural essential oils: Cedarwood, Geranium, Lemongrass and Rosemary',
      'No synthetic pesticides or harmful chemicals',
      'Made from flexible material with a smooth surface',
      'Adjustable size',
      'Water-resistant',
    ],
  },
  {
    id: 'njkpuyt-flea-collar-small-4pack',
    name: 'NJKPUYT Flea & Tick Collar for Small Dogs (4-Pack)',
    category: 'natural-collar',
    badge: 'Natural collar',
    asin: 'B0H36B5838',
    amazonUrl: amazonUrl('B0H36B5838'),
    offers: [amazonOffer('B0H36B5838')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61JRGESgPuL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'NJKPUYT flea and tick collars for small dogs, 4-pack',
    },
    bullets: [
      'Fits most dogs under 18 pounds',
      'Interrupts the life cycle of fleas and ticks',
      'Each collar provides up to 8 months of protection',
      'Made of plant-based ingredients',
      'No synthetic pesticides or harmful chemicals',
      'Lightweight and soft design',
      'Adjustable size',
      'Water-resistant',
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
      chewyOffer('https://www.chewy.com/beloved-pets-flea-tick-prevention/dp/3614782', 'best-flea-and-tick-products-for-dogs'),
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
      chewyOffer('https://www.chewy.com/dr-woow-flea-tick-prevention-chews/dp/4356846', 'best-flea-and-tick-products-for-dogs'),
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
    id: 'lkdhfjc-natural-defense-chews-200',
    name: 'Natural Flea & Tick Prevention Chews',
    category: 'natural-chew',
    badge: 'Daily chew',
    asin: 'B0HC7LX8LQ',
    amazonUrl: amazonUrl('B0HC7LX8LQ'),
    offers: [amazonOffer('B0HC7LX8LQ')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71XB0AgjT4L._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Natural flea and tick prevention chews for dogs, 200-count chicken flavor',
    },
    bullets: [
      'Helps repel fleas and ticks',
      "Boosts your dog's immune system",
      'Soothes itchy skin and promotes a shiny coat',
      'Natural ingredients: Brewers Yeast, Vitamin B1, B6, B12, Omega-3, Neem, Apple Cider Powder, Pumpkin Seed Powder',
      'No harsh chemicals',
    ],
  },
  {
    id: 'petrivium-flea-tick-chews-150',
    name: 'Petrivium Natural Flea & Tick Prevention Chews',
    category: 'natural-chew',
    badge: 'Natural chew',
    asin: 'B0H98W2JTH',
    amazonUrl: amazonUrl('B0H98W2JTH'),
    offers: [amazonOffer('B0H98W2JTH')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71hLJ5ophbL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'Petrivium natural flea and tick prevention chews for dogs, 150 count',
    },
    bullets: [
      'Helps repel fleas and ticks',
      "Boosts your dog's immune system",
      'Soothes itchy skin and promotes a shiny coat',
      'Natural ingredients: Brewers Yeast, Vitamin B1, Rosemary extract, Omega-3, Coconut oil, Neem extract',
      'No harsh chemicals',
      'Cruelty free',
      'Made in USA',
    ],
  },
  {
    id: 'green-pet-double-sided-flea-comb',
    name: 'Green Pet Double-Sided Flea Comb Set (3-Pack)',
    category: 'grooming-tool',
    badge: 'Flea comb',
    bestFor: 'Double-sided flea comb',
    asin: 'B0G4RDKG6P',
    amazonUrl: amazonUrl('B0G4RDKG6P'),
    offers: [amazonOffer('B0G4RDKG6P')],
    image: {
      src: 'https://m.media-amazon.com/images/I/41XYrGUZyNL._SL500_.jpg',
      alt: 'Green Pet double-sided flea comb set, 3 pieces',
    },
    bullets: [
      'Fine teeth on one side for flea detection and removal',
      'Wider teeth on the other side for general grooming',
      'Ergonomically designed handles',
    ],
  },
  {
    id: 'ikkab-flea-comb-set',
    name: 'IKKAB Flea Comb Set (7-Piece)',
    category: 'grooming-tool',
    badge: 'Comb set',
    bestFor:
      'Complete grooming set of 7 tools: Fine-tooth handle comb, Beizi comb, Fence comb, Double-row flea comb, Double-hole detangling comb, Dense & wide tooth comb, and a Gentle dog eye comb',
    asin: 'B0GHY17Y9S',
    amazonUrl: amazonUrl('B0GHY17Y9S'),
    offers: [amazonOffer('B0GHY17Y9S')],
    image: {
      src: 'https://m.media-amazon.com/images/I/41asQo1g--L._SL500_.jpg',
      alt: 'IKKAB 7-piece flea comb set for cats and dogs',
    },
    bullets: [
      'Made with premium stainless steel and lightweight flexible plastic',
      'Smooth rounded teeth',
      'Ergonomic grip design',
    ],
  },
  {
    id: 'vomroju-flea-lice-comb-set',
    name: 'Vomroju Stainless Steel Flea & Lice Comb Set (6-Piece)',
    category: 'grooming-tool',
    badge: 'Comb set',
    bestFor:
      'Grooming set of 6 combs: Professional curved dog eye comb, Long handle comb, Double sided comb, Long needle comb, and 2 Short needle combs',
    asin: 'B0GWCYBYWD',
    amazonUrl: amazonUrl('B0GWCYBYWD'),
    offers: [amazonOffer('B0GWCYBYWD')],
    image: {
      src: 'https://m.media-amazon.com/images/I/412bST7LkpL._SL500_.jpg',
      alt: 'Vomroju 6-piece stainless steel flea and lice comb set',
    },
    bullets: [
      'Made with premium stainless steel and lightweight flexible plastic',
      'Smooth rounded teeth',
      'Anti-slip handle grip',
    ],
  },
  {
    id: 'tweezerman-precision-flea-comb',
    name: 'Tweezerman Precision Single Row Flea Comb',
    category: 'grooming-tool',
    badge: 'Flea comb',
    bestFor: 'Made of stainless steel and lightweight plastic',
    asin: 'B0GK34GTCC',
    amazonUrl: amazonUrl('B0GK34GTCC'),
    offers: [
      amazonOffer('B0GK34GTCC'),
      chewyOffer('https://www.chewy.com/tweezerman-precision-single-row-flea/dp/3969334', 'best-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0699c28a-a53f-7941-8000-078536bb9a5b._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Tweezerman Precision Single Row Flea Comb for Dogs',
    },
    bullets: [
      'Rounded-tip bristles are gentle on the skin',
      'Finely spaced bristles precisely spot and grab fleas',
      'Ergonomic handle',
    ],
  },
  {
    id: 'wahl-flea-finishing-comb',
    name: 'Wahl Flea & Finishing Comb',
    category: 'grooming-tool',
    badge: 'Flea & finishing comb',
    bestFor: '2-level comb side for picking mats, and a shorter side for finishing',
    asin: 'B079SYNQQ5',
    amazonUrl: amazonUrl('B079SYNQQ5'),
    offers: [
      amazonOffer('B079SYNQQ5'),
      chewyOffer('https://www.chewy.com/wahl-flea-finishing-dog-comb/dp/3514926', 'best-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/068e80e8-8957-7b24-8000-2c6aecad578d._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Wahl Flea & Finishing Dog Comb in orange and white',
    },
    bullets: [
      'Untangle mats and stimulate blood flow',
      'Detect and capture fleas, flea eggs, and ticks',
      'Ergonomic non-slip grip handle',
    ],
  },
  {
    id: 'anrundar-grooming-kit',
    name: 'Anrundar Grooming Kit with Flea Comb (5-Piece)',
    category: 'grooming-tool',
    badge: 'Grooming kit',
    bestFor:
      'Grooming set of 5 pieces: Slicker brush, Undercoat Rake, Silicone bath brush, Stainless steel metal comb, and Flea comb',
    asin: 'B0H2PDVZML',
    amazonUrl: amazonUrl('B0H2PDVZML'),
    offers: [amazonOffer('B0H2PDVZML')],
    image: {
      src: 'https://m.media-amazon.com/images/I/51rxMhS+UpL._SL500_.jpg',
      alt: 'Anrundar 5-piece dog grooming kit with slicker brush, undercoat rake, bath brush, metal comb, and flea comb',
    },
    bullets: [
      'For long-haired breeds',
      'Made of stainless steel and lightweight plastic',
      'Ergonomic anti-slip grip handles',
    ],
  },
  {
    id: 'homesake-tick-remover-kit',
    name: 'Homesake Tick Remover Tool Kit with Fine-Tip Tweezers',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor: 'Precision-designed tick remover and stainless steel tweezers',
    asin: 'B0883ZB976',
    amazonUrl: amazonUrl('B0883ZB976'),
    offers: [amazonOffer('B0883ZB976')],
    image: {
      src: 'https://m.media-amazon.com/images/I/710I6aesL8L._SL500_.jpg',
      alt: 'Homesake stainless steel tick remover tool kit with fine-tip tweezers and pouch',
    },
    caution: 'If the bite site stays inflamed or symptoms follow, save the tick and call your vet.',
    bullets: [
      'Storage pouch',
      'Tick identification card',
    ],
  },
  {
    id: 'ahhomatata-tick-twister-set',
    name: 'AHHOMATATA 10-in-1 Tick Removal & Twister Kit',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor:
      '10-in-one complete tool remover kit: Tick remover, tweezers, clips, 2 spoon-shaped remover tools, 2 flea combs, Magnifying glass, 10 cleaning pads, Tick identification card, and mesh storage bag',
    asin: 'B0GHGJVRFL',
    amazonUrl: amazonUrl('B0GHGJVRFL'),
    offers: [amazonOffer('B0GHGJVRFL')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71BLK1bSzYL._SL500_.jpg',
      alt: 'AHHOMATATA 10-in-1 stainless steel tick removal and twister kit',
    },
    caution: 'If the bite site stays inflamed or symptoms follow, save the tick and call your vet.',
    bullets: ['Made of stainless steel and lightweight plastic'],
  },
  {
    id: 'tweezerman-tick-removal-kit',
    name: 'Tweezerman Tick Removal Kit',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor: 'Hand-crafted, perfectly aligned tweezers',
    asin: 'B0GK3BSK56',
    amazonUrl: amazonUrl('B0GK3BSK56'),
    offers: [
      amazonOffer('B0GK3BSK56'),
      chewyOffer('https://www.chewy.com/tweezerman-tick-removal-kit-dogs/dp/3969342', 'best-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0699c28a-9afb-7ff9-8000-fbbc8d9dafca._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Tweezerman Tick Removal Kit for Dogs with dual-ended tweezer and travel case',
    },
    caution: 'If the bite site stays inflamed or symptoms follow, save the tick and call your vet.',
    bullets: [
      'V-shaped end extracts large ticks while the pointed tips extract smaller nymph ticks',
      'Ergonomic design',
      'Made of stainless steel',
      'Storage pouch',
    ],
  },
  {
    id: 'tweezerman-tick-tweezer',
    name: 'Tweezerman Pet Collection Stainless Steel Portable Tick Removal Tweezer',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor: 'Hand-crafted and perfectly aligned to safely remove ticks',
    asin: 'B0D236JZGJ',
    amazonUrl: amazonUrl('B0D236JZGJ'),
    offers: [
      amazonOffer('B0D236JZGJ'),
      chewyOffer('https://www.chewy.com/tweezerman-tick-removal-tweezer-pets/dp/1522510', 'best-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0682dd37-1a86-72c4-8000-51c51e9d964f._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Tweezerman Stainless Steel Portable Tick Removal Tweezer for Pets',
    },
    caution: 'If the bite site stays inflamed or symptoms follow, save the tick and call your vet.',
    bullets: [
      'Ergonomic design and no-slip grip',
      'Made of stainless steel',
    ],
  },
  {
    id: 'tickcheck-premium-tick-kit',
    name: 'TickCheck Premium Tick Removal Kit',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor:
      'Kit includes tick remover for larger embedded ticks and fine-tip tweezers for removing nymphs and small deer ticks',
    asin: 'B075DKL3Z6',
    amazonUrl: amazonUrl('B075DKL3Z6'),
    offers: [
      amazonOffer('B075DKL3Z6'),
      chewyOffer('https://www.chewy.com/tickcheck-premium-dog-tick-removal/dp/352001', 'best-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/tickcheck-premium-dog-tick-removal-kit/img-436238._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'TickCheck Premium Dog Tick Removal Kit with stainless fork, tweezers, pouch, and tick ID card',
    },
    caution: 'If the bite site stays inflamed or symptoms follow, save the tick and call your vet.',
    bullets: [
      'Made of stainless steel',
      'Tick identification card',
      'A portion of the proceeds of this tick remover kit helps fund university research on ticks and Lyme disease',
      'Leatherette pouch',
    ],
  },
  {
    id: 'tickcheck-remover-spoon',
    name: 'TickCheck Remover Spoon with Tick ID Card (3-Pack)',
    category: 'tick-remover',
    badge: 'Tick removal',
    bestFor:
      'Three tick removal spoons with a deep notch for safely removing embedded adult and nymph ticks of any size',
    asin: 'B07K4F66LH',
    amazonUrl: amazonUrl('B07K4F66LH'),
    offers: [
      amazonOffer('B07K4F66LH'),
      chewyOffer('https://www.chewy.com/tickcheck-remover-spoon-tick-id-card/dp/352007', 'best-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/tickcheck-remover-spoon-with-tick-id-card-3-pack/img-202294._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'TickCheck Remover Spoon with Tick ID Card, 3-pack with carabiner',
    },
    caution: 'If the bite site stays inflamed or symptoms follow, save the tick and call your vet.',
    bullets: [
      'Carabiner so you can attach the kit to your backpack, first-aid kit or belt loop',
      'Made of lightweight plastic',
      'Waterproof tick identification card',
    ],
  },
  {
    id: 'tick-key-original-7pack',
    name: 'The Original Tick Key',
    category: 'tick-remover',
    badge: 'Tick removal',
    asin: 'B09WGFLCKF',
    amazonUrl: amazonUrl('B09WGFLCKF'),
    offers: [amazonOffer('B09WGFLCKF')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81DKpuQxnvL._AC_SY300_SX300_QL70_FMwebp_.jpg',
      alt: 'The Original Tick Key tick removal tool',
    },
    bullets: [
      'Detaches ticks of every size and kind with ease',
      'Lightweight',
      'Attachable to collars or bags',
      'Made in USA',
    ],
    caution: 'If the bite site stays inflamed or symptoms follow, save the tick and call your vet.',
  },
  {
    id: 'rinseroo-original',
    name: 'Rinseroo Slip-On Sprayer',
    category: 'bath-tool',
    badge: 'Sprayer',
    asin: 'B0CSF2LLS3',
    amazonUrl: amazonUrl('B0CSF2LLS3'),
    offers: [amazonOffer('B0CSF2LLS3')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61TF2a86MiL._SL500_.jpg',
      alt: 'Rinseroo Slip-On Sprayer hose attachment for dog baths',
    },
    bullets: [
      'Turns any tub faucet into a swift rinsing station',
      'Attaches to faucets up to 3 inches in diameter',
      'Slips on in seconds, no tools required',
      'Comes with 5 foot hose',
    ],
  },
  {
    id: 'g-promise-dog-wash-shower-attachment',
    name: 'G-Promise 3-Mode Dog Wash Shower Attachment',
    category: 'bath-tool',
    badge: 'Sprayer',
    asin: 'B0GVJSFLWP',
    amazonUrl: amazonUrl('B0GVJSFLWP'),
    offers: [amazonOffer('B0GVJSFLWP')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71sTkjpI6iL._SL500_.jpg',
      alt: 'G-Promise dog wash shower attachment wand with brush head and long hose',
    },
    bullets: [
      'Outdoor spray with 100 inch hose',
      'Three function: Spray mode, Rinse mode, and Power Washer mode',
      'Built-in brush for easy wash and groom',
      'Pause button on the handle lets you stop the water while you lather',
      'Made of rust-resistant stainless steel',
      'Comes with all the tools needed for installation',
      'Fits standard 3/4 inch outdoor faucets',
    ],
  },
  {
    id: 'fly2sky-portable-pet-shower',
    name: 'FLY2SKY Rechargeable Portable Pet Shower',
    category: 'bath-tool',
    badge: 'Sprayer',
    asin: 'B0GSVMVPTG',
    amazonUrl: amazonUrl('B0GSVMVPTG'),
    offers: [amazonOffer('B0GSVMVPTG')],
    image: {
      src: 'https://m.media-amazon.com/images/I/819yJ4yfm6L._SL500_.jpg',
      alt: 'FLY2SKY rechargeable portable pet shower pump with LED temperature display and brush head',
    },
    bullets: [
      'Portable shower kit',
      'Rechargeable shower pump battery runs 120–150 minutes on a 3 hour charge',
      'LED display shows power charge and water temperature',
      'Waterproof and anti-clog structure',
      '3-in-1 multifunctional showerhead combines soft silicone bath brush, water spray rinser, and massage function',
      'Comes with a mesh travel bag',
    ],
  },
  {
    id: 'oleamuo-self-cleaning-bath-brush',
    name: 'Oleamuo Self-Cleaning Dog Bath Brush',
    category: 'bath-tool',
    badge: 'Bath brush',
    asin: 'B0H2V9G7DD',
    amazonUrl: amazonUrl('B0H2V9G7DD'),
    offers: [amazonOffer('B0H2V9G7DD')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71WS0oSTPJL._SL500_.jpg',
      alt: 'Oleamuo purple self-cleaning dog bath brush with flexible bristles',
    },
    bullets: [
      "Deep cleans and massages your dog's coat",
      'Removes loose hair',
      'Improves circulation',
      'One-click self-cleaning',
      'Ergonomic handle',
    ],
  },
  {
    id: 'doggy-style-bamboo-bath-scrubber',
    name: 'Doggy Style Large Bamboo Dog Bath Scrubber',
    category: 'bath-tool',
    badge: 'Bath brush',
    asin: 'B0FFHM8L6V',
    amazonUrl: amazonUrl('B0FFHM8L6V'),
    offers: [amazonOffer('B0FFHM8L6V')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71QleUBUPTL._SL500_.jpg',
      alt: 'Doggy Style bamboo-handled dog bath scrubber with soft silicone bristles',
    },
    bullets: [
      'For medium and large dogs',
      '4-inch scrub surface',
      'Soft, flexible rubber bristles',
      'Bamboo handle',
      'Ergonomic design',
    ],
  },
  {
    id: 'troisamis-double-sided-bath-brush',
    name: 'TroisAmis Double-Sided Silicone Bath Brush',
    category: 'bath-tool',
    badge: 'Bath brush',
    asin: 'B0FNCVB4H2',
    amazonUrl: amazonUrl('B0FNCVB4H2'),
    offers: [amazonOffer('B0FNCVB4H2')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71uOI8kFr4L._SL500_.jpg',
      alt: 'TroisAmis double-sided silicone dog bath brush with finger holes',
    },
    bullets: [
      'Made of soft silicone',
      'Double-sided brush with dense bristles on one side and wider nubs on the other',
      'Unique anti-slip design allows your to slip your hand through the brush for better grip and control',
    ],
  },
  {
    id: 'jelly-pet-deshedding-bath-brush',
    name: 'JELLY PET Deshedding Dog Bath Brush for Short Haired Dogs',
    category: 'bath-tool',
    badge: 'Bath brush',
    asin: 'B0CQD37KK3',
    amazonUrl: amazonUrl('B0CQD37KK3'),
    offers: [amazonOffer('B0CQD37KK3')],
    image: {
      src: 'https://m.media-amazon.com/images/I/31cNFA7x3oL._SL500_.jpg',
      alt: 'JELLY PET green rubber deshedding dog bath brush with grip handle',
    },
    bullets: [
      'Use on wet or dry dog coats',
      'Soft and gentle flexible rubber nubs',
      'Stimulates natural oil production',
      'Non-slip grip handle',
    ],
  },
  {
    id: 'ropo-double-sided-bath-brush',
    name: 'ROPO Double-Sided Dog Bath Brush',
    category: 'bath-tool',
    badge: 'Bath brush',
    asin: 'B0FKHDJCF3',
    amazonUrl: amazonUrl('B0FKHDJCF3'),
    offers: [amazonOffer('B0FKHDJCF3')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71j94PPB42L._SL500_.jpg',
      alt: 'ROPO double-sided dog bath brush with long teeth and rounded massage teeth',
    },
    bullets: [
      'Double sided brush with long needle teeth on one side and plum blossom teeth on the other',
      'Stimulates blood circulation',
      'Ergonomic design',
    ],
  },
  {
    id: 'hop-wooden-handle-bath-brush',
    name: 'HOP Wooden-Handle Dog Bath Brush',
    category: 'bath-tool',
    badge: 'Bath brush',
    asin: 'B0GGGZRKZ1',
    amazonUrl: amazonUrl('B0GGGZRKZ1'),
    offers: [amazonOffer('B0GGGZRKZ1')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61D2J6zkE+L._SL500_.jpg',
      alt: 'HOP dog bath brush with beech wood handle and soft TPR bristles',
    },
    bullets: [
      'Bath and massage brush',
      'For wet and dry use',
      'Improves circulation',
      'Ergonomic, solid wood non-slip handle',
    ],
  },
  {
    id: 'unmeee-silicone-shampoo-brush',
    name: 'Soft Silicone Bath Brush with Shampoo Dispenser',
    category: 'bath-tool',
    badge: 'Bath brush',
    asin: 'B0GV3M33WC',
    amazonUrl: amazonUrl('B0GV3M33WC'),
    offers: [amazonOffer('B0GV3M33WC')],
    image: {
      src: 'https://m.media-amazon.com/images/I/710hMP6EN0L._SL500_.jpg',
      alt: 'Pink soft silicone dog bath brush with built-in shampoo dispenser',
    },
    bullets: [
      'For short and medium coats',
      'Compact dimension for easy pet bathing',
      'Made of high quality soft silicone',
      'Ergonomic design',
    ],
  },
  {
    id: 'techcare-foaming-bath-brush',
    name: 'TechCare Auto-Foaming Dog Bath Brush',
    category: 'bath-tool',
    badge: 'Powered bath brush',
    asin: 'B0DSGH6SPN',
    amazonUrl: amazonUrl('B0DSGH6SPN'),
    offers: [amazonOffer('B0DSGH6SPN')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71S3D49oj5L._SL500_.jpg',
      alt: 'TechCare cordless dog bath brush with automatic foam shampoo dispenser',
    },
    bullets: [
      'Cordless and portable',
      'Battery powered',
      'Auto foam shampoo dispenser',
      'One-click bubble brush with soft, gentle silicone bristles',
    ],
  },
  {
    id: 'masterpeak-3-in-1-grooming-kit',
    name: 'MasterPeak 3-in-1 Rake, Comb, and Bath Brush Set',
    category: 'bath-tool',
    badge: 'Grooming kit',
    asin: 'B0H51VJ7SD',
    amazonUrl: amazonUrl('B0H51VJ7SD'),
    offers: [amazonOffer('B0H51VJ7SD')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71dtNaXYJ-L._SL500_.jpg',
      alt: 'MasterPeak 3-in-1 pet grooming kit with undercoat rake, metal comb, and silicone bath brush',
    },
    bullets: [
      'For all fur types',
      'Premium rust-proof stainless steel construction',
      'Smooth rounded edges prevent scratches and irritation to sensitive skin',
      'Double sided comb- wide side removes knots and dense side removes loose hair',
      'Lightweight ergonomic design',
    ],
  },
  {
    id: 'lyongsment-7-in-1-grooming-set',
    name: 'LYONGSMENT 7-in-1 Deshedding and Grooming Set',
    category: 'bath-tool',
    badge: 'Grooming kit',
    asin: 'B0C4SV8SD6',
    amazonUrl: amazonUrl('B0C4SV8SD6'),
    offers: [amazonOffer('B0C4SV8SD6')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71oyhLwtdeL._SL500_.jpg',
      alt: 'LYONGSMENT 7-in-1 pet deshedding and grooming set with brushes, combs, and carpet tools',
    },
    bullets: [
      '7 piece set: Deshedding brush, Self-cleaning slicker brush, Flea comb, Grooming comb, Double-sided carpet brush, Pet hair removal tool, and Bath washing brush',
      'Made of lightweight, high quality rubber and stainless steel',
    ],
  },
  {
    id: 'brooklyn-pet-gear-3-piece-kit',
    name: 'Brooklyn Pet Gear 3-Piece Grooming Set',
    category: 'bath-tool',
    badge: 'Grooming kit',
    asin: 'B0G5BKGPQX',
    amazonUrl: amazonUrl('B0G5BKGPQX'),
    offers: [amazonOffer('B0G5BKGPQX')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61-eWbtpV0L._SL500_.jpg',
      alt: 'Brooklyn Pet Gear 3-piece grooming kit with slicker brush, bath brush, and undercoat rake',
    },
    bullets: [
      '3 piece set: Slicker brush, Bath brush, and Undercoat rake',
      'Skin-safe and gentle design',
      'Easy cleaning',
      'Ergonomic handles',
    ],
  },
  {
    id: 'cxtiefanzyl-3-piece-grooming-kit',
    name: 'CXTIEFANZYL 3 Piece Grooming Kit',
    category: 'bath-tool',
    badge: 'Grooming kit',
    asin: 'B0FS11QXVH',
    amazonUrl: amazonUrl('B0FS11QXVH'),
    offers: [amazonOffer('B0FS11QXVH')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61QxgdHGJuL._SL500_.jpg',
      alt: 'Three-piece dog grooming set with self-cleaning slicker brush, deshedding tool, and TPR bath brush',
    },
    bullets: [
      '3 piece set: Slicker brush, Bath brush and Undercoat rake',
      'Made of high quality stainless steel, rubber and plastic',
      'Easy cleaning',
      'Ergonomic design',
    ],
  },
  {
    id: 'tuff-pupper-drying-bathrobe',
    name: 'Tuff Pupper Fast-Drying Dog Bathrobe',
    category: 'bath-tool',
    badge: 'Drying robe',
    asin: 'B0BY9GBMXX',
    amazonUrl: amazonUrl('B0BY9GBMXX'),
    offers: [amazonOffer('B0BY9GBMXX')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61OK8kwHFxL._SL500_.jpg',
      alt: 'Tuff Pupper blue microfiber dog bathrobe with adjustable hood and belly strap',
    },
    bullets: [
      'Sizes for every breed',
      'Quick drying for bath time, rainy walks, beach visits and hiking trips',
      'Made of plush, absorbent microfiber',
      'Custom adjustable fit',
      'Hooded collar flap and elastic leg straps',
      'Hand and machine washable',
    ],
    variantGroup: {
      axis: {
        id: 'dog-size',
        label: 'Size',
        hint: 'Measure your dog from collar to tail base and check the listing size chart.',
      },
      defaultVariantId: 'large',
      variants: [
        { id: 'x-small', label: 'X-Small', offers: [amazonOffer('B0BY9C5HFB')] },
        { id: 'small', label: 'Small', offers: [amazonOffer('B0BY9CT5FF')] },
        { id: 'medium', label: 'Medium', offers: [amazonOffer('B0BY9CZMBJ')] },
        { id: 'large', label: 'Large', offers: [amazonOffer('B0BY9GBMXX')] },
        { id: 'x-large', label: 'X-Large', offers: [amazonOffer('B0BY9F964J')] },
        { id: 'xx-large', label: 'XX-Large', offers: [amazonOffer('B0BY9C72VY')] },
        { id: 'xxx-large', label: 'XXX-Large', offers: [amazonOffer('B0BY9HHQ48')] },
        { id: 'giant', label: 'Giant', offers: [amazonOffer('B0CK4LFD8S')] },
      ],
    },
  },
  {
    id: 'paw-mountain-3-piece-bath-set',
    name: 'Paw Mountain 3-Piece Dog Bathing Set',
    category: 'bath-tool',
    badge: 'Towel and brush set',
    asin: 'B0G5VBRYKY',
    amazonUrl: amazonUrl('B0G5VBRYKY'),
    offers: [amazonOffer('B0G5VBRYKY')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71GVaeK0PFL._SL500_.jpg',
      alt: 'Paw Mountain 3-piece dog bathing set with microfiber towel, grooming glove, and bath brush',
    },
    bullets: [
      '3 piece set: Brush glove, Bath brush, and Absorbent microfiber towel',
      'Ergonomic design',
      'Machine washable',
    ],
  },
  {
    id: 'wondurdog-outdoor-hose-nozzle',
    name: 'Wondurdog Outdoor Garden Hose Nozzle Attachment',
    category: 'bath-tool',
    badge: 'Outdoor rinse',
    asin: 'B07CV3F6DS',
    amazonUrl: amazonUrl('B07CV3F6DS'),
    offers: [
      amazonOffer('B07CV3F6DS'),
      chewyOffer('https://www.chewy.com/wondurdog-outdoor-garden-hose-nozzle/dp/332622', 'dog-bath-tools-for-flea-season'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/wondurdog-dog-washing-paw-rinse-outdoor-garden-hose-nozzle-attachment/img-191279._AC_SS1800_V1_.jpg',
      alt: 'Wondurdog outdoor garden hose nozzle attachment with splash shield and rubber grooming brush',
    },
    bullets: [
      'Pet washing station for outdoor baths',
      'Innovative splash shield handle keeps you dry',
      'Rubber grooming brush, metal swivel, water pressure control valve',
      'Fits standard garden hoses',
      'Metal garden hose connector for a sturdy, leak-free connection',
      'Ergonomic design and on/off switch',
    ],
  },
  {
    id: 'wondurdog-deluxe-indoor-kit',
    name: 'Wondurdog Deluxe Indoor Dog & Cat Washing Shower Kit',
    category: 'bath-tool',
    badge: 'Indoor shower kit',
    offers: [
      chewyOffer('https://www.chewy.com/wondurdog-deluxe-indoor-dog-cat/dp/397024', 'dog-bath-tools-for-flea-season'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/wondurdog-deluxe-indoor-dog-cat-washing-shower-kit/img-494673._AC_SS1800_V1_.jpg',
      alt: 'Wondurdog deluxe indoor dog and cat washing shower kit with splash shield brush head',
    },
    bullets: [
      'Bath hose attachment',
      'Innovative splash shield handle keeps you dry',
      'Rubber grooming brush, splash shield, 8 foot flexible stainless steel hose, suction cup holder, 3-way shower diverter',
      'Water pressure control valve',
      'Ergonomic design',
    ],
  },
  {
    id: 'furesh-elevated-folding-tub',
    name: 'Furesh Elevated Folding Pet Bath Tub & Wash Station for Small and Medium Dogs',
    category: 'bath-tool',
    badge: 'Wash station',
    asin: 'B0858ZL2P1',
    amazonUrl: amazonUrl('B0858ZL2P1'),
    offers: [
      amazonOffer('B0858ZL2P1'),
      chewyOffer('https://www.chewy.com/furesh-elevated-folding-pet-bath-tub/dp/264272', 'dog-bath-tools-for-flea-season'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/furesh-elevated-folding-pet-bath-tub-wash-station-gray/img-322821._AC_SS1800_V1_.jpg',
      alt: 'Furesh elevated folding pet bath tub and wash station in gray',
    },
    bullets: [
      'Portable, Indoor or Outdoor Use',
      '360 degree access to your pet',
      'Allows you to bathe your dog at an ergonomic height (36 inches)',
      'Two side pockets for shampoo and bath tools',
      'Lightweight design easily folds in seconds for storage',
      'Made of marine grade PVC and stainless aluminum tubing',
      'Comes with a removable stopper and a built-in drainage hose',
      'Fits pets up to 40 lbs, with a three point leash for safety',
    ],
  },
  {
    id: 'we-love-doodles-long-pin-bath-brush',
    name: 'We Love Doodles Long Pin Dog Bath Brush',
    category: 'bath-tool',
    badge: 'Bath brush',
    offers: [
      chewyOffer('https://www.chewy.com/we-love-doodles-long-pin-dog-bath/dp/4011390', 'dog-bath-tools-for-flea-season'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/069d6b9c-78c6-7f96-8000-e204bfc12442._AC_SS1800_V1_.jpg',
      alt: 'We Love Doodles professional grooming long pin dog bath brush, large',
    },
    bullets: [
      "Uniquely designed, flexible bristles work deep into your dog's coat for a thorough clean",
      'Gentle massaging action stimulates the skin without causing irritation',
      'Ergonomic shape and non-slip grip',
    ],
  },
  {
    id: 'chemical-guys-furrocious-towel',
    name: 'Chemical Guys Furrocious Pet Towel',
    category: 'bath-tool',
    badge: 'Plush towel',
    offers: [
      chewyOffer('https://www.chewy.com/chemical-guys-furrocious-pet-towel/dp/2075838', 'dog-bath-tools-for-flea-season'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0685598b-fdbb-7aae-8000-1ae6375502c3._AC_SS1800_V1_.jpg',
      alt: 'Chemical Guys Furrocious plush microfiber pet towel in blue',
    },
    bullets: [
      'For dogs of all sizes',
      'Made of ultra-plush microfiber',
      'Can also be used as crate bedding',
      'Machine washable',
    ],
  },
  {
    id: 'dog-gone-smart-shammy-grey',
    name: 'Dog Gone Smart Dirty Dog Shammy Towel',
    category: 'bath-tool',
    badge: 'Shammy towel',
    offers: [
      chewyOffer('https://www.chewy.com/dog-gone-smart-dirty-dog-shammy-towel/dp/132883', 'dog-bath-tools-for-flea-season'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/dog-gone-smart-dirty-dog-shammy-towel-grey/img-258598._AC_SS1800_V1_.jpg',
      alt: 'Dog Gone Smart Dirty Dog microfiber shammy towel in grey, 31 by 13 inches',
    },
    bullets: [
      'Made of absorbent microfiber blend',
      "Soft and gentle on dog's coat while trapping mud, dirt and moisture",
      'Dries up to 8x faster than a cotton towel',
      'Built-in hand pocket for better control',
      'Machine washable and long-lasting',
    ],
  },
  {
    id: 'fido-fave-1500w-dryer',
    name: 'Fido Fave 1500W Professional Grooming Pet Hair Blow Dryer',
    category: 'bath-tool',
    badge: 'Grooming dryer',
    offers: [
      chewyOffer('https://www.chewy.com/fido-fave-dog-hair-dryer/dp/3603814', 'dog-bath-tools-for-flea-season'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0690cf97-3bf3-7fb8-8000-d287ae6949b0._AC_SS1800_V1_.jpg',
      alt: 'Fido Fave 1500W professional grooming pet hair blow dryer for dogs and cats',
    },
    bullets: [
      '3 nozzle set includes flat, round and eight-finger nozzles for targeted drying, fluffing and detangling across all coat lengths and textures',
      '1500W high-power motor delivers intense airflow to quickly dry thick coats and remove loose fur, dirt and dander',
      'Achieve salon-quality results at home',
      'Nine adjustable airflow levels',
      'Precise temperature controls from 86 degrees to 140 degrees',
      'Negative ion switch releases ions to minimize static, detangle fur, and enhance shine for a healthy, soft coat',
      'Designed with a pet-friendly, quiet operation that runs at a low 70-90 dB for a stress-free, comfortable grooming experience',
    ],
  },
  {
    id: 'flying-pig-one-hv-dryer',
    name: 'Flying Pig Grooming One High Velocity Dog Grooming Dryer',
    category: 'bath-tool',
    badge: 'Grooming dryer',
    offers: [
      chewyOffer('https://www.chewy.com/flying-pig-grooming-one-high-velocity/dp/3768774', 'dog-bath-tools-for-flea-season'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06965482-f05c-7d58-8000-38cf3ffe13c8._AC_SS1800_V1_.jpg',
      alt: 'Flying Pig Grooming One high velocity dog grooming dryer in yellow with black logo',
    },
    bullets: [
      'Dual functionality with a powerful dryer and built-in heater',
      'Variable speed and temperature control for tailored settings',
      'Low-noise operation and minimal vibration for a stress-free grooming experience',
      'Durable and portable design',
      'Compact and lightweight',
      'Comes with a flexible hose, flat nozzle, round nozzle and an extra filter for added convenience',
    ],
  },
  {
    id: 'pet-life-dry-shampoo-applicator',
    name: 'Pet Life Unlimited Dry Shampoo Refillable Applicator for Dogs',
    category: 'bath-tool',
    badge: 'Dry shampoo applicator',
    offers: [
      chewyOffer('https://www.chewy.com/pet-life-unlimited-dry-shampoo/dp/2112062', 'dog-bath-tools-for-flea-season'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06851b96-3842-72c1-8000-8e702d6e973e._AC_SS1800_V1_.jpg',
      alt: 'Pet Life Unlimited dry shampoo refillable applicator brush for dogs in blue',
    },
    bullets: [
      'No water needed',
      'Deep-clean design applies dry shampoo through the coat and down to the skin',
      'Flexisoft bristles gently massage and exfoliate loose hair and dirt',
      'Dual-release deodorizer removes odors and leaves a light scent',
      'Click-close cap',
      'Refill-ready for dry shampoo powder refills (1 starter packet included, refills sold separately)',
    ],
  },
];

export function getFleaTickProductsByCategory(category: FleaTickProductCategory): FleaTickProduct[] {
  return fleaTickProducts.filter((product) => product.category === category);
}
