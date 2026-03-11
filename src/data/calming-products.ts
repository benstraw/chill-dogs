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
    bestFor: 'Dogs who respond well to wearable support during predictable stress',
    howItHelps: 'Gentle pressure support',
    considerIf: 'Your dog tolerates fitted gear and anxiety tends to spike in specific situations',
    image: { src: 'https://m.media-amazon.com/images/I/61PxVCtYzUL._SL500_.jpg', alt: 'ThunderShirt Classic Dog Anxiety Jacket' },
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
    bestFor: 'Dogs who panic at velcro ripping sounds or need quieter fastening during storms',
    howItHelps: 'Gentle compression with noise-free closure',
    considerIf: 'Your dog flinches at velcro noise or you need to adjust the wrap without adding stress',
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
    bestFor: 'Budget-conscious dog owners who want a basic anxiety wrap without overspending',
    howItHelps: 'Affordable gentle pressure support',
    considerIf: 'You want to try an anxiety wrap without the ThunderShirt price tag',
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
    bestFor: 'Dogs with noise phobias who benefit from ear coverage during storms or fireworks',
    howItHelps: 'Pressure wrap plus ear coverage for sound-sensitive dogs',
    considerIf: 'Your dog reacts to loud sounds and you want a wrap that also covers the ears and neck',
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
    bestFor: 'Dogs who need head and neck coverage during noise events without overheating',
    howItHelps: 'Torso compression plus adjustable hood for head coverage',
    considerIf: 'Your dog seeks to hide during loud events and might benefit from a hood for security',
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
    bestFor: 'Dogs who need firmer compression than standard wraps provide',
    howItHelps: 'Stronger double compression with adjustable tightness',
    considerIf: 'Your dog does not respond to lighter pressure wraps and may benefit from firmer hold',
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
    bestFor: 'Natural-leaning households that want a simple chew before stressful moments',
    howItHelps: 'Nutritional calming support',
    considerIf: 'You want a chewable option instead of a wearable product',
    image: { src: 'https://m.media-amazon.com/images/I/71wvagsKePL._SL500_.jpg', alt: 'Native Pet Calm Chews for Dogs' },
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
    image: { src: 'https://m.media-amazon.com/images/I/71UE9SW5IOL._SL500_.jpg', alt: 'Greenies Supplements Calming Chews' },
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
    image: { src: 'https://m.media-amazon.com/images/I/61nfdlquMVL._SL500_.jpg', alt: 'Pet Honesty Hemp Calming Chews' },
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
    image: { src: 'https://m.media-amazon.com/images/I/71srIBjOAhL._SL500_.jpg', alt: 'LickiMat Classic Soother Slow Feeder' },
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
    image: { src: 'https://m.media-amazon.com/images/I/71fXsViJtML._SL500_.jpg', alt: 'LUKITO Premium Silicone Licking Mat' },
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
    image: { src: 'https://m.media-amazon.com/images/I/812agfn++dL._SL500_.jpg', alt: 'Rundic Snuffle Mat for Dogs' },
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
    image: { src: 'https://m.media-amazon.com/images/I/71Wmu0n5rtL._SL500_.jpg', alt: 'AWOOF Pet Snuffle Mat for Dogs' },
  },
];

export function getCalmingProductsByCategory(category: CalmingProductCategory): CalmingProduct[] {
  return calmingProducts.filter((product) => product.category === category);
}
