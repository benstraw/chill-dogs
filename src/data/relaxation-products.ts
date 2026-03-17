export type RelaxationProductCategory = 'calming-beds' | 'orthopedic-beds' | 'crates';

export interface RelaxationProduct {
  id: string;
  asin: string;
  name: string;
  category: RelaxationProductCategory;
  amazonUrl: string;
  bullets: [string, string, string];
  bestFor: string;
  whyItWorks: string;
  considerIf: string;
  image?: { src: string; alt: string };
}

export const relaxationProducts: RelaxationProduct[] = [
  // ── Calming Beds ──────────────────────────────────────────────────────────

  {
    id: 'bedstill-donut-calming-bed',
    asin: 'B0DXVPJ3XM',
    name: 'BedStill Donut Calming Dog Bed',
    category: 'calming-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0DXVPJ3XM/?tag=chill-dogs-20',
    bullets: [
      'Raised rim gives dogs a place to rest their chin and feel supported on all sides',
      'Donut shape encourages curling, the position many dogs naturally seek during deep rest',
      'Machine washable cover makes upkeep practical for dogs who use their bed heavily',
    ],
    bestFor: 'Dogs who like to curl, burrow, or press against something when resting',
    whyItWorks: 'Raised border and round shape create an enclosed feel that many dogs seek out on their own',
    considerIf: 'Your dog tends to curl tightly or consistently gravitates toward corners and edges during naps',
    image: { src: 'https://m.media-amazon.com/images/I/71hPsNDImjL._SL500_.jpg', alt: 'BedStill Donut Calming Dog Bed' },
  },
  {
    id: 'chixnuggle-dog-bed',
    asin: 'B0FS6MK1HH',
    name: 'ChiXnuggle Dog Bed',
    category: 'calming-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0FS6MK1HH/?tag=chill-dogs-20',
    bullets: [
      'Snuggle-style design with a recessed center lets dogs nestle in rather than lie on top',
      'Soft fill provides cushion without pressure-point buildup during long rest sessions',
      'Sized for medium dogs who want enclosed comfort without a full raised donut rim',
    ],
    bestFor: 'Medium dogs who prefer a cozy, nestled sleeping position',
    whyItWorks: 'Recessed center and snuggle-focused fill support the natural positions dogs choose for deep rest',
    considerIf: 'Your dog regularly seeks out confined spaces, tight spots, or curls tightly when napping',
    image: { src: 'https://m.media-amazon.com/images/I/61Wrn3q+2yL._SL500_.jpg', alt: 'ChiXnuggle Dog Bed' },
  },
  {
    id: 'pendleton-fleece-kuddler',
    asin: 'B0DK9XLLZP',
    name: 'Pendleton Fleece Kuddler Dog Bed',
    category: 'calming-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0DK9XLLZP/?tag=chill-dogs-20',
    bullets: [
      "Pendleton's heritage fleece fabric in a classic pattern brings warmth and softness together",
      'Kuddler shape has lower sides and a plush center for dogs who sprawl or lay flat',
      'Washable construction keeps upkeep practical despite the premium materials',
    ],
    bestFor: 'Dogs who sprawl out to sleep and owners who want a visually distinctive bed',
    whyItWorks: 'Pendleton fleece provides deep softness that encourages dogs to settle and stay put through full naps',
    considerIf:
      'You want a bed that looks as good as it functions and your dog favors flat or low-profile resting',
    image: { src: 'https://m.media-amazon.com/images/I/71sayTkHvuL._SL500_.jpg', alt: 'Pendleton Fleece Kuddler Dog Bed' },
  },
  {
    id: 'carolina-pet-bolster-sm',
    asin: 'B0DCGR557N',
    name: 'Carolina Pet Company Microfiber Tipped Bolster Bed',
    category: 'calming-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0DCGR557N/?tag=chill-dogs-20',
    bullets: [
      'Microfiber fill and tipped fabric give this bolster a higher-end feel than standard poly beds',
      'Raised bolster edges give dogs a perimeter to lean against during rest',
      'Carolina Pet Company is a US-based manufacturer with a track record of quality construction',
    ],
    bestFor: 'Dogs who like to rest their head on a raised edge or lean against a bolster',
    whyItWorks: 'Raised bolster perimeter supports resting heads and creates a defined, comforting sleeping area',
    considerIf: 'Your dog regularly leans against furniture, walls, or cushions when settling in for a nap',
    image: { src: 'https://m.media-amazon.com/images/I/51zWC7FVLdL._SL500_.jpg', alt: 'Carolina Pet Company Microfiber Tipped Bolster Bed' },
  },
  {
    id: 'invenho-orthopedic-couch-bed',
    asin: 'B0D5B56X9V',
    name: 'INVENHO Orthopedic Dog Couch Bed',
    category: 'orthopedic-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0D5B56X9V/?tag=chill-dogs-20',
    bullets: [
      'Egg-crate foam base distributes body weight more evenly than flat poly fill',
      'Waterproof lining and washable removable cover make cleanup practical for daily use',
      'Couch-style profile with raised back gives dogs a surface to rest against during sleep',
    ],
    bestFor: 'Dogs who like a raised back to lean against and need orthopedic joint support',
    whyItWorks: 'Egg-crate foam provides better pressure distribution than standard foam, reducing buildup at hips and shoulders during long rest',
    considerIf: 'Your dog actively seeks out furniture or walls to lean against when napping',
    image: { src: 'https://m.media-amazon.com/images/I/610mMpDp39L._SL500_.jpg', alt: 'INVENHO Orthopedic Dog Couch Bed' },
  },
  {
    id: 'bedsure-comfyfleece-orthopedic',
    asin: 'B0DTH4195V',
    name: 'Bedsure ComfyFleece Orthopedic Dog Bed with Sides',
    category: 'orthopedic-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0DTH4195V/?tag=chill-dogs-20',
    bullets: [
      'Memory foam and egg-crate base combined in a sofa-style profile with raised sides',
      'ComfyFleece corduroy cover adds texture and warmth without trapping excess heat',
      'Non-slip bottom keeps the bed stable on hardwood and tile floors',
    ],
    bestFor: 'Dogs who want both memory foam support and the enclosed feel of raised sides',
    whyItWorks: 'Memory foam conforms to the dog\'s shape while raised sides provide the perimeter security many dogs naturally seek',
    considerIf: 'You want a bed that looks like furniture and your dog benefits from both joint support and a contained sleeping area',
    image: { src: 'https://m.media-amazon.com/images/I/81-9n7k4bTL._SL500_.jpg', alt: 'Bedsure ComfyFleece Orthopedic Dog Bed with Sides' },
  },

  // ── Orthopedic Beds ───────────────────────────────────────────────────────

  {
    id: 'invenho-orthopedic-bed',
    asin: 'B0CCDVNH7N',
    name: 'INVENHO Washable Orthopedic Dog Bed',
    category: 'orthopedic-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0CCDVNH7N/?tag=chill-dogs-20',
    bullets: [
      'Orthopedic foam base reduces pressure on joints during extended rest periods',
      'Anti-slip bottom keeps the bed from shifting on hardwood, tile, or vinyl floors',
      'Fully washable construction — cover and foam — for dogs who spend a lot of time in their bed',
    ],
    bestFor: 'Active dogs, larger breeds, or dogs who rest heavily and need consistent joint support',
    whyItWorks:
      'Dense orthopedic foam distributes body weight more evenly than poly fill, reducing pressure buildup during long sleep sessions',
    considerIf: 'Your dog rests heavily, is over 40 lbs, or you want a bed that stays in one place on smooth floors',
    image: { src: 'https://m.media-amazon.com/images/I/71UWPGl3COL._SL500_.jpg', alt: 'INVENHO Washable Orthopedic Dog Bed' },
  },
  {
    id: 'anti-anxiety-orthopedic-bed',
    asin: 'B097XMD33D',
    name: 'Anti-Anxiety Orthopedic Dog Bed with Bolster',
    category: 'orthopedic-beds',
    amazonUrl: 'https://www.amazon.com/dp/B097XMD33D/?tag=chill-dogs-20',
    bullets: [
      'Orthopedic base combined with raised bolster sides addresses both comfort and security in one bed',
      'Attached design means the bolster and base stay together — no separating components',
      'Anti-slip backing keeps the bed stable on smooth floors during rest',
    ],
    bestFor: 'Dogs who need both joint support and the enclosed feel of a bolster-surround design',
    whyItWorks: 'Combines dense foam support with a contained perimeter that many dogs actively seek out during rest',
    considerIf: 'Your dog wants both body support and the security of a surrounded sleeping area',
    image: { src: 'https://m.media-amazon.com/images/I/81n7foznoHL._SL500_.jpg', alt: 'Anti-Anxiety Orthopedic Dog Bed with Bolster' },
  },
  {
    id: 'zomisia-orthopedic-bed',
    asin: 'B0DBLBH8Q9',
    name: 'ZOMISIA Orthopedic Dog Bed for Large Dogs',
    category: 'orthopedic-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0DBLBH8Q9/?tag=chill-dogs-20',
    bullets: [
      'Large-format orthopedic foam built specifically for bigger dogs who need more surface area',
      'Foam base provides the joint support larger breeds typically need for comfortable, sustained rest',
      'Simple, clean design works well in open spaces or alongside furniture',
    ],
    bestFor: 'Large or extra-large dogs who need full-length orthopedic support during rest and sleep',
    whyItWorks:
      'Oversized foam gives bigger dogs enough room to fully stretch without losing support at the edges',
    considerIf:
      'You have a large breed dog that currently sleeps on the floor or regularly falls off smaller beds',
    image: { src: 'https://m.media-amazon.com/images/I/71bAiTc5GCL._SL500_.jpg', alt: 'ZOMISIA Orthopedic Dog Bed for Large Dogs' },
  },
  {
    id: 'cwawz-orthopedic-bolster',
    asin: 'B0FGX7Q8DD',
    name: 'CWAWZ Orthopedic Dog Bed with Full-Surround Bolsters',
    category: 'orthopedic-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0FGX7Q8DD/?tag=chill-dogs-20',
    bullets: [
      'Full-surround bolster raises all four edges, creating a completely enclosed resting space',
      'Dual-sided construction gives you two surface options as materials wear differently over time',
      'Orthopedic foam base supports the body while the bolster perimeter supports resting heads and necks',
    ],
    bestFor: 'Dogs who like to rest their head on the bed edge or want to feel fully enclosed during sleep',
    whyItWorks:
      'Full perimeter bolsters combined with orthopedic base support both body and head from every angle',
    considerIf:
      'Your dog constantly repositions to lean against a bed edge — full-surround means there is always one in reach',
    image: { src: 'https://m.media-amazon.com/images/I/71wdK2f8JkL._SL500_.jpg', alt: 'CWAWZ Orthopedic Dog Bed with Full-Surround Bolsters' },
  },
  {
    id: 'carolina-pet-bolster-lg',
    asin: 'B0DCGQLJJ8',
    name: 'Carolina Pet Company Microfiber Tipped Bolster Bed (Large)',
    category: 'orthopedic-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0DCGQLJJ8/?tag=chill-dogs-20',
    bullets: [
      'Microfiber fill compresses more slowly than poly fill, keeping the sleeping surface supportive longer',
      'Bolster profile is lower than a full donut, making it accessible for dogs who prefer a gentle edge',
      'Quality construction from a US-based pet bed manufacturer with consistent sizing',
    ],
    bestFor: 'Mid-to-large dogs who want bolster support without a full raised donut rim',
    whyItWorks:
      'Microfiber construction holds loft longer than standard poly, so the bed stays comfortable through regular use',
    considerIf:
      'Your dog prefers a medium-depth sleeping bowl over a flat mat or a fully raised donut bed',
    image: { src: 'https://m.media-amazon.com/images/I/51pzu55J+1L._SL500_.jpg', alt: 'Carolina Pet Company Microfiber Tipped Bolster Bed Large' },
  },

  // ── Crates (future page) ─────────────────────────────────────────────────

  {
    id: 'kindtail-collapsible-crate',
    asin: 'B09D8KSWTV',
    name: 'KindTail Collapsible Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B09D8KSWTV/?tag=chill-dogs-20',
    bullets: [
      'Pop-up fabric design folds flat for travel and storage in minutes',
      'Machine washable cover and waterproof base make cleanup after muddy adventures easy',
      'Stylish patterns look better in a living room than standard wire or plastic crates',
    ],
    bestFor: 'Dogs who need a portable rest space for travel, crate training, or a dedicated nap spot at home',
    whyItWorks:
      'A dedicated enclosed space gives dogs the den-like environment that helps many dogs wind down between activities',
    considerIf:
      'You want a crate that works at home and on the road without the bulk of traditional wire or plastic options',
    image: { src: 'https://m.media-amazon.com/images/I/61jTpS6FsTL._SL500_.jpg', alt: 'KindTail Collapsible Dog Crate' },
  },
];

export function getRelaxationProductsByCategory(category: RelaxationProductCategory): RelaxationProduct[] {
  return relaxationProducts.filter((p) => p.category === category);
}
