import type { AffiliateOffer } from './products/types';

export type CalmingProductCategory =
  | 'anxiety-wraps'
  | 'calming-treats'
  | 'lick-mats'
  | 'snuffle-mats';

export interface CalmingProduct {
  id: string;
  asin?: string;
  name: string;
  category: CalmingProductCategory;
  amazonUrl?: string;
  offers?: AffiliateOffer[];
  bullets: string[];
  image?: { src: string; alt: string };
}

export const calmingProducts: CalmingProduct[] = [
  {
    id: 'thundershirt-classic',
    asin: 'B0029PUFAE',
    name: 'ThunderShirt Classic Dog Anxiety Jacket',
    category: 'anxiety-wraps',
    amazonUrl:
      'https://www.amazon.com/ThunderShirt-Classic-Anxiety-Heather-X-Large/dp/B0029PUFAE/?tag=chill-dogs-20',
    bullets: [
      'Applies gentle, consistent pressure that can help some dogs settle faster',
      'Useful for storms, fireworks, travel, and guests at the door',
      'Simple hook-and-loop design makes it easy to put on before a stressful event',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/61PxVCtYzUL._SL500_.jpg', alt: 'ThunderShirt Classic Dog Anxiety Jacket' },
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/aNAy2R',
        status: 'active' as const,
      },
    ],
  },
  {
    id: 'dajidali-anxiety-vest',
    asin: 'B0G8LY8ZZ9',
    name: 'DAJIDALI Dog Anxiety Vest',
    category: 'anxiety-wraps',
    amazonUrl: 'https://www.amazon.com/dp/B0G8LY8ZZ9/?tag=chill-dogs-20',
    bullets: [
      'Silent self-gripping fabric instead of velcro, so fastening does not startle noise-sensitive dogs',
      'Two-piece adjustable design lets you fine-tune chest and belly compression separately',
      'Breathable mesh lining helps reduce overheating during longer wear sessions',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/712jcgYde6L._SL500_.jpg', alt: 'DAJIDALI Dog Anxiety Vest' },
  },
  {
    id: 'harbyel-anxiety-jacket',
    asin: 'B0G216WF68',
    name: 'Harbyel Dog Anxiety Jacket',
    category: 'anxiety-wraps',
    amazonUrl: 'https://www.amazon.com/dp/B0G216WF68/?tag=chill-dogs-20',
    bullets: [
      'Budget-friendly cotton blend that feels softer against the coat than synthetic wraps',
      'Quiet hook-and-loop fastening designed to reduce startling noise',
      'Available in XS through 2XL for a wider range of body types',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71plUgjjhoL._SL500_.jpg', alt: 'Harbyel Dog Anxiety Jacket' },
  },
  {
    id: 'beautyzoo-reversible-turtleneck',
    asin: 'B0FMQSMN93',
    name: 'BEAUTYZOO Reversible Dog Anxiety Shirt',
    category: 'anxiety-wraps',
    amazonUrl: 'https://www.amazon.com/dp/B0FMQSMN93/?tag=chill-dogs-20',
    bullets: [
      'Reversible design gives you two looks from one shirt — practical for everyday and stressful days',
      'Turtleneck extends over ears, which can help muffle sound for noise-phobic dogs',
      'Fleece blend with wide straps for a snug but comfortable fit across the torso',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/61Pplb6TlfL._SL500_.jpg', alt: 'BEAUTYZOO Reversible Dog Anxiety Shirt' },
  },
  {
    id: 'morvigive-hooded-vest',
    asin: 'B0G2BQGTQ7',
    name: 'MORVIGIVE Sleeveless Dog Anxiety Vest with Hood',
    category: 'anxiety-wraps',
    amazonUrl: 'https://www.amazon.com/dp/B0G2BQGTQ7/?tag=chill-dogs-20',
    bullets: [
      'Adjustable hood provides head and neck coverage that can help with noise anxiety',
      'Sleeveless cut reduces overheating risk compared to full-coverage wraps',
      'Soft, stretchy fabric makes it easy to put on dogs who resist rigid garments',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/61zRnyKGANL._SL500_.jpg', alt: 'MORVIGIVE Sleeveless Dog Anxiety Vest with Hood' },
  },
  {
    id: 'caslfuca-anxiety-vest',
    asin: 'B0F21GRFY9',
    name: 'Caslfuca Dog Anxiety Vest',
    category: 'anxiety-wraps',
    amazonUrl: 'https://www.amazon.com/dp/B0F21GRFY9/?tag=chill-dogs-20',
    bullets: [
      'Double compression design with adjustable belt for firmer, more targeted pressure',
      'Lightweight fabric keeps dogs comfortable during extended wear',
      'Simple pull-on style with belt adjustment makes fitting straightforward',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/61RSUfDB-yL._SL500_.jpg', alt: 'Caslfuca Dog Anxiety Vest' },
  },
  {
    id: 'native-pet-calm-chews',
    asin: 'B0BRPQV9XF',
    name: 'Native Pet Calm Chews for Dogs',
    category: 'calming-treats',
    amazonUrl:
      'https://www.amazon.com/Native-Pet-Calm-Melatonin-All-Natural/dp/B0BRPQV9XF/?tag=chill-dogs-20',
    bullets: [
      'Formulated for pet parents who prefer a more natural-feeling calming routine',
      'Designed for occasional stress like travel, visitors, or noisy evenings',
      'Soft chew format is easy to add before a known trigger',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71wvagsKePL._SL500_.jpg', alt: 'Native Pet Calm Chews for Dogs' },
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/PzVobQ',
        status: 'active' as const,
      },
    ],
  },
  {
    id: 'greenies-calming-chews',
    asin: 'B0CHVCLLFJ',
    name: 'Greenies Supplements Calming Chews',
    category: 'calming-treats',
    amazonUrl:
      'https://www.amazon.com/Greenies-Supplements-Calming-Chicken-Container/dp/B0CHVCLLFJ/?tag=chill-dogs-20',
    bullets: [
      'Familiar Greenies branding can feel less intimidating for first-time buyers',
      'Easy daily-use format for dogs already used to soft supplements',
      'Good fit for mild nervous energy and routine support',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71UE9SW5IOL._SL500_.jpg', alt: 'Greenies Supplements Calming Chews' },
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/1GP67m',
        status: 'active' as const,
      },
    ],
  },
  {
    id: 'pet-honesty-hemp-calming-chews',
    asin: 'B08J4HNQZF',
    name: 'Pet Honesty Hemp Calming Chews',
    category: 'calming-treats',
    amazonUrl:
      'https://www.amazon.com/Pet-Honesty-Strength-Valerian-Melatonin/dp/B08J4HNQZF/?tag=chill-dogs-20',
    bullets: [
      'Hemp-forward formula aimed at dogs with more noticeable nervous energy',
      'Commonly considered for travel, alone time, and loud-environment support',
      'Blends multiple calming ingredients into one chew',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/61nfdlquMVL._SL500_.jpg', alt: 'Pet Honesty Hemp Calming Chews' },
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/0GjbjJ',
        status: 'active' as const,
      },
    ],
  },
  {
    id: 'lickimat-classic-soother',
    asin: 'B09CPJKQLW',
    name: 'LickiMat Classic Soother Slow Feeder',
    category: 'lick-mats',
    amazonUrl:
      'https://www.amazon.com/LickiMat-Classic-Soother-Boredom-Alternative/dp/B09CPJKQLW/?tag=chill-dogs-20',
    bullets: [
      'Classic textured surface works well with yogurt, peanut butter, or wet food',
      'Useful as a short-term distraction during baths, nail trims, or brushing',
      'Simple design makes it easy to clean and store',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71srIBjOAhL._SL500_.jpg', alt: 'LickiMat Classic Soother Slow Feeder' },
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/oNLA0O',
        status: 'active' as const,
      },
    ],
  },
  {
    id: 'awoo-paradise-lick-mat',
    asin: 'B0F9LH962C',
    name: 'Awoo Paradise Silicone Dog Lick Mat',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0F9LH962C/?tag=chill-dogs-20',
    bullets: [
      'Wide silicone surface for peanut butter, yogurt, pumpkin, or wet food',
      'Useful for quiet indoor enrichment before fireworks, crate time, or evening wind-down',
      'Design works as a lick mat and a slow feeder',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/81prplvbKjL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Awoo Paradise Silicone Dog Lick Mat' },
  },
  {
    id: 'lukito-licking-mat',
    asin: 'B0CMH169XW',
    name: 'LUKITO Premium Silicone Licking Mat',
    category: 'lick-mats',
    amazonUrl:
      'https://www.amazon.com/LUKITO-Licking-Premium-Suction-Grooming/dp/B0CMH169XW/?tag=chill-dogs-20',
    bullets: [
      'Suction cups help keep the mat stable on smooth surfaces',
      'Attaches to wall or tub',
      'Silicone construction is practical for repeated use and cleanup',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71fXsViJtML._SL500_.jpg', alt: 'LUKITO Premium Silicone Licking Mat' },
  },
  {
    id: 'feelneedy-stainless-lick-mat',
    asin: 'B0GF179QJ5',
    name: 'FEELNEEDY Stainless Steel Lick Mat',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0GF179QJ5/?tag=chill-dogs-20',
    bullets: [
      'Stainless steel is a sturdier alternative to flexible silicone',
      'Flat textured surface supports spreadable treats and provides enrichment',
      'Dishwasher-safe material makes it practical for frequent use',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/81m9FkTp5JL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'FEELNEEDY Stainless Steel Lick Mat' },
  },
  {
    id: 'feedoo-stainless-lick-mat',
    asin: 'B0F5YF2N85',
    name: 'Feedoo Double Wall Stainless Steel Lick Mat',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0F5YF2N85/?tag=chill-dogs-20',
    bullets: [
      'Bowl-style stainless design helps contain wet food and frozen treats',
      'Heavier format can feel more stable than a thin silicone sheet',
      'Useful when durability matters more than portability',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71bbtFt5a2L._AC_SX300_SY300_QL70_FMwebp_.jpg', alt: 'Feedoo Double Wall Stainless Steel Lick Mat' },
  },
  {
    id: 'stainless-suction-lick-mat',
    asin: 'B0G2RMWLWR',
    name: 'Stainless Suction Textured Feeding Lick Mat',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0G2RMWLWR/?tag=chill-dogs-20',
    bullets: [
      'Stainless textured surface is a better alternative for heavy chewers',
      'Suction-style setup can help with crate-side or fixed-position enrichment',
      'Useful for dogs who push around lightweight mats',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/713geJVx6LL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Stainless Suction Textured Feeding Lick Mat' },
  },
  {
    id: 'pawnana-slow-feeder-lick-mat',
    asin: 'B0FWR1QSNN',
    name: 'Pawnana Slow Feeder Lick Mat',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0FWR1QSNN/?tag=chill-dogs-20',
    bullets: [
      'Bowl-style depth works well for freezer-friendly spreads and soaked food',
      'More contained than a flat mat for crate time or calm-room setup',
      'Good for when you want enrichment to last longer than a thin smear',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71JDi4WGGnL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Pawnana Slow Feeder Lick Mat' },
  },
  {
    id: 'quwou-dog-lick-bowl',
    asin: 'B0GQGYDKT2',
    name: 'QUWOU Dog Lick Bowl',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0GQGYDKT2/?tag=chill-dogs-20',
    bullets: [
      'Compact bowl format helps contain wet food or soft spreads',
      'Smaller footprint can work better for small spaces than a full mat',
      'Useful for dogs who do better with contained licking than a tray',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/61ge1Bwk88L._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'QUWOU Dog Lick Bowl' },
  },
  {
    id: 'west-paw-seaflex-feast-mat',
    asin: 'B0CVJF5PL1',
    name: 'West Paw Seaflex Bubbles Feast Mat',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0CVJF5PL1/?tag=chill-dogs-20',
    bullets: [
      'Made in the USA of recycled plastic',
      'Bubble-style surface gives spreadable treats more texture than a plain tray',
      'Dishwasher safe',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71jVXyAwNTL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'West Paw Seaflex Bubbles Feast Mat' },
  },
  {
    id: 'lickimat-outdoor-keeper',
    asin: 'B0C6RJKR5T',
    name: 'LickiMat Outdoor Keeper Feeding Station',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0C6RJKR5T/?tag=chill-dogs-20',
    bullets: [
      'Holder-style station helps keep compatible mats from sliding or flipping',
      'Outdoor-ready setup makes enrichment easier on patios, decks, or yards',
      'Useful for dogs who move lightweight mats before they finish',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71xcalwKR1L._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'LickiMat Outdoor Keeper Feeding Station' },
  },
  {
    id: 'byazletqan-portable-lick-mat',
    asin: 'B0GGN37P36',
    name: 'BYAZLETQAN Collapsible Portable Lick Mat',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0GGN37P36/?tag=chill-dogs-20',
    bullets: [
      'Clamshell-style portable design is easier to pack than a full-size mat',
      'Useful for hiking, road trips, and airline travel',
      'Helps keep travel enrichment more contained between stops',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/61TOUqACgaL._AC_SX300_SY300_QL70_FMwebp_.jpg', alt: 'BYAZLETQAN Collapsible Portable Lick Mat' },
  },
  {
    id: 'rundic-snuffle-mat',
    asin: 'B08JGHMDLX',
    name: 'Rundic Snuffle Mat for Dogs',
    category: 'snuffle-mats',
    amazonUrl:
      'https://www.amazon.com/RUNDA-Snuffle-Interactive-Encourages-Foraging/dp/B08JGHMDLX/?tag=chill-dogs-20',
    bullets: [
      'Colorful fabric layout encourages sniffing, searching, and slower feeding',
      'Helpful for indoor enrichment and redirecting restless energy',
      'Suction cups and non-slip bottom help to keep it in place',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/812agfn++dL._SL500_.jpg', alt: 'Rundic Snuffle Mat for Dogs' },
  },
  {
    id: 'evenco-slow-feeder-bowl',
    asin: 'B0D57XYN6S',
    name: 'Evenco Slow Feeder Bowl',
    category: 'lick-mats',
    amazonUrl: 'https://www.amazon.com/dp/B0D57XYN6S/?tag=chill-dogs-20',
    bullets: [
      'Meal-focused alternative for dogs whose main issue is eating too fast',
      'Works better for kibble or full meals than sticky spread enrichment',
      'Made from food-safe silicone. Dishwasher safe.',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/617uJkbtmHL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Evenco Slow Feeder Bowl' },
  },
  {
    id: 'awoof-snuffle-mat',
    asin: 'B07N1JYYCW',
    name: 'AWOOF Pet Snuffle Mat for Dogs',
    category: 'snuffle-mats',
    amazonUrl:
      'https://www.amazon.com/NEEDOON-Interactive-Encourages-Foraging-Dispenser/dp/B07N1JYYCW/?tag=chill-dogs-20',
    bullets: [
      'Puzzle-style layout gives you more ways to hide kibble or treats',
      'Useful for dogs that blow through basic enrichment too quickly',
      'Can help stretch feeding time and keep busy noses occupied',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71Wmu0n5rtL._SL500_.jpg', alt: 'AWOOF Pet Snuffle Mat for Dogs' },
    offers: [
      {
        merchant: 'chewy' as const,
        url: 'https://chewy.sjv.io/WOdbRA',
        status: 'active' as const,
      },
    ],
  },
];

export function getCalmingProductsByCategory(category: CalmingProductCategory): CalmingProduct[] {
  return calmingProducts.filter((product) => product.category === category);
}
