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
  amazonUrl: string;
  bullets: [string, string, string];
  bestFor: string;
  howItHelps: string;
  considerIf: string;
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
    bestFor: 'Dogs who respond well to wearable support during predictable stress',
    howItHelps: 'Gentle pressure support',
    considerIf: 'Your dog tolerates fitted gear and anxiety tends to spike in specific situations',
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
    bestFor: 'Natural-leaning households that want a simple chew before stressful moments',
    howItHelps: 'Nutritional calming support',
    considerIf: 'You want a chewable option instead of a wearable product',
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
    bestFor: 'Dog owners who want a recognizable brand and straightforward calming chew',
    howItHelps: 'Daily or situational nutritional support',
    considerIf: 'Your dog already does well with soft supplement-style treats',
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
    bestFor: 'Pet parents specifically looking for a hemp-based calming chew',
    howItHelps: 'Multi-ingredient calming support',
    considerIf: 'You want hemp positioned as part of your calming routine',
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
      'Simple design makes it easy to introduce if you are new to lick mats',
    ],
    bestFor: 'Everyday grooming distraction and short calming sessions',
    howItHelps: 'Licking and steady focus',
    considerIf: 'You want the most straightforward lick-mat format',
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
      'Budget-friendly pick for bath time, grooming, or crate-side distraction',
      'Silicone construction is practical for repeated use and cleanup',
    ],
    bestFor: 'Budget-conscious dog owners who want extra stability during grooming',
    howItHelps: 'Licking with added suction stability',
    considerIf: 'You need a mat that stays put on tile, tub walls, or smooth floors',
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
      'Helpful for indoor boredom and redirecting restless energy into nose work',
      'Works well when you want a lower-cost enrichment option',
    ],
    bestFor: 'Dogs who need indoor enrichment and a simple nose-work outlet',
    howItHelps: 'Foraging and mental engagement',
    considerIf: 'You want a snuffle mat with an approachable, playful design',
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
    bestFor: 'Dogs who need a more adjustable nose-work challenge',
    howItHelps: 'Adjustable foraging puzzle',
    considerIf: 'Your dog gets bored with simpler enrichment setups',
  },
];

export function getCalmingProductsByCategory(category: CalmingProductCategory): CalmingProduct[] {
  return calmingProducts.filter((product) => product.category === category);
}
