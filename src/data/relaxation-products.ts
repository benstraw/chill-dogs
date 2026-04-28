import { buildAmazonAffiliateUrl, getAmazonProductMetadata } from './amazon-product-metadata';

export type RelaxationProductCategory =
  | 'calming-beds'
  | 'orthopedic-beds'
  | 'chew-resistant-beds'
  | 'crates'
  | 'travel-beds'
  | 'carriers'
  | 'travel-bags';

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

function createFetchedRelaxationProduct(
  config: Omit<RelaxationProduct, 'name' | 'amazonUrl' | 'image'> & { category: RelaxationProductCategory }
): RelaxationProduct {
  const fetched = getAmazonProductMetadata(config.asin);

  return {
    ...config,
    name: fetched.title,
    amazonUrl: buildAmazonAffiliateUrl(config.asin),
    image: fetched.image,
  };
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
  createFetchedRelaxationProduct({
    id: 'dogbed4less-xl-memory-foam-bed',
    asin: 'B00HT9NR2S',
    category: 'orthopedic-beds',
    bullets: [
      '47-by-29-inch memory-foam bed gives large dogs a roomy flat surface with more structure than basic crate mats',
      'Waterproof internal case plus removable washable denim cover makes it practical for daily use and occasional messes',
      'Sized to fit many 48-by-30-inch crates, making it useful both as a room bed and a crate-friendly orthopedic option',
    ],
    bestFor: 'A premium all-around orthopedic pick when you want memory foam, washable layers, and a crate-friendly footprint',
    whyItWorks:
      'Dense memory foam, a waterproof inner layer, and a straightforward flat shape cover the core needs most orthopedic-bed shoppers care about',
    considerIf:
      'You want one supportive bed that can work in open floor space now and inside a large crate later',
  }),
  createFetchedRelaxationProduct({
    id: 'furhaven-luxe-lounger-orthopedic',
    asin: 'B073Q15NR2',
    category: 'orthopedic-beds',
    bullets: [
      'Solid orthopedic foam slab gives bigger dogs a flatter, more even sleep surface than polyfill-style mats',
      'Low-profile lounger shape is easy for dogs to step onto and works well beside a wall or in an open room',
      'Removable washable cover keeps upkeep simple without adding bulky bolsters around the sleep area',
    ],
    bestFor: 'Dogs who sprawl out and do better on a flat orthopedic lounger than on a sofa-style bed with sides',
    whyItWorks:
      'The slab-style base prioritizes usable sleeping area and consistent support instead of dividing space with raised edges',
    considerIf:
      'Your dog stretches fully to sleep or you want an orthopedic bed that stays simple and easy to place around the house',
  }),
  createFetchedRelaxationProduct({
    id: 'eheyciga-xl-orthopedic-sofa',
    asin: 'B0BDLGZCTY',
    category: 'orthopedic-beds',
    bullets: [
      '44-by-32-inch sofa profile gives extra-large dogs meaningful space while still adding supportive sides',
      'Waterproof memory-foam build and removable cover make it easier to live with than plush couch beds that trap messes',
      'High review count makes it one of the more established sofa-style orthopedic options in this size range',
    ],
    bestFor: 'Large dogs that want both orthopedic foam and a sofa-style edge to lean against',
    whyItWorks:
      'It balances spacious sizing, supportive foam, and side bolsters without forcing you into a smaller sleeping area',
    considerIf:
      'You want a roomy orthopedic couch bed for a bigger dog rather than a flat pad or a compact crate bed',
  }),
  createFetchedRelaxationProduct({
    id: 'bedsure-supportmax-orthopedic-sofa',
    asin: 'B0FND8HGHC',
    category: 'orthopedic-beds',
    bullets: [
      'Extra-thick sofa build gives large dogs more height and structure than thin crate-style mats',
      'Waterproof washable cover and nonskid bottom make it easier to use on hard floors in main living spaces',
      '45-inch surface hits a useful middle ground for dogs that need more room without jumping all the way to giant sizes',
    ],
    bestFor: 'Large dogs that need a supportive everyday sofa bed with more thickness than standard orthopedic mats',
    whyItWorks:
      'The thicker profile and couch-style edges make the bed feel substantial enough for heavy daily rest instead of occasional naps',
    considerIf:
      'You want an orthopedic sofa that looks home-friendly and still offers waterproof, washable practicality',
  }),
  createFetchedRelaxationProduct({
    id: 'wnpethome-waterproof-orthopedic-bed',
    asin: 'B0BRZW6LFZ',
    category: 'orthopedic-beds',
    bullets: [
      'Low-profile 42-by-30-inch footprint works well in crates, against walls, or anywhere a flatter orthopedic bed makes sense',
      'Waterproof removable cover and quilted top make cleanup easier without moving to a fully slick outdoor fabric',
      'Established review history makes it a practical choice for shoppers who want a straightforward waterproof orthopedic bed',
    ],
    bestFor: 'A simple waterproof orthopedic bed when you want easy cleanup and a flatter profile',
    whyItWorks:
      'It focuses on the core features that matter most for everyday orthopedic use: foam support, washable layers, and a stable footprint',
    considerIf:
      'You want waterproof practicality without paying for extra bolsters or an oversized premium build',
  }),
  createFetchedRelaxationProduct({
    id: 'furtime-xl-orthopedic-bed',
    asin: 'B0CRL4TCND',
    category: 'orthopedic-beds',
    bullets: [
      'XL sofa-style shape gives bigger dogs supportive foam plus raised edges for head and shoulder support',
      'Waterproof cover and washable setup make it easier to manage muddy paws, drool, or the occasional accident',
      '42-by-32-inch footprint is roomy enough for many large breeds without feeling oversized for typical living rooms',
    ],
    bestFor: 'Large dogs that need an orthopedic sofa bed with waterproof practicality for everyday home use',
    whyItWorks:
      'It delivers a familiar couch-bed feel while still prioritizing washable, supportive construction over pure plush softness',
    considerIf:
      'You want more structure and side support than a flat mat but still care about waterproof cleanup',
  }),
  createFetchedRelaxationProduct({
    id: 'noah-paw-denim-orthopedic-bed',
    asin: 'B0DS6BZRJ1',
    category: 'orthopedic-beds',
    bullets: [
      'Cooling-gel memory foam adds a different feel from standard egg-crate beds without moving into specialty cooling products',
      'Waterproof inner cover and machine-washable outer layer keep the bed practical for dogs that use it heavily every day',
      'Denim-inspired collection gives it a sturdier, furniture-friendly look than many fuzzy orthopedic sofas',
    ],
    bestFor: 'Shoppers who want a supportive orthopedic bed with washable waterproof layers and a less plush finish',
    whyItWorks:
      'The layered washable build and gel-infused foam make it feel like a step up from entry-level orthopedic couches',
    considerIf:
      'You want a waterproof orthopedic sofa that looks a little cleaner and less fuzzy in shared rooms',
  }),
  createFetchedRelaxationProduct({
    id: 'friends-forever-orthopedic-sofa',
    asin: 'B01EMBB5V0',
    category: 'orthopedic-beds',
    bullets: [
      'Memory-foam sofa build adds a supportive base plus a wall-rim pillow around the sleep area',
      'Water-resistant liner and washable cover make it better suited to daily use than decorative-only couch beds',
      'Long review history gives it more track record than many newer orthopedic sofa listings',
    ],
    bestFor: 'Dogs who want a classic orthopedic sofa bed with bolsters and a long-established review history',
    whyItWorks:
      'The memory-foam base supports the body while the perimeter rim gives dogs a place to rest their head without collapsing the bed shape',
    considerIf:
      'You want a familiar sofa-style orthopedic bed rather than a flat mattress or a fully enclosed bolster design',
  }),
  createFetchedRelaxationProduct({
    id: 'rainmr-memory-foam-bed',
    asin: 'B0CJHWCDQZ',
    category: 'orthopedic-beds',
    bullets: [
      'Seven-inch-thick memory-foam build gives larger dogs a deeper, flatter support surface than entry-level orthopedic beds',
      'Durable microsuede-style cover, waterproof liner, and washable setup make it feel more substantial than a basic crate mat',
      '48-by-30-inch size lands in a strong large-to-XL range for dogs that need more room without going all the way to giant sizes',
    ],
    bestFor: 'A more premium flat orthopedic bed when you want deeper memory foam and a large usable sleep surface',
    whyItWorks:
      'The thicker memory-foam profile gives bigger dogs more compression room while still preserving a simple flat format',
    considerIf:
      'You want a roomy orthopedic bed with more foam depth than typical three- or four-inch mats provide',
  }),
  createFetchedRelaxationProduct({
    id: 'casa-paw-waterproof-xl-bed',
    asin: 'B0BXY2VRNX',
    category: 'orthopedic-beds',
    bullets: [
      '45-by-35-inch footprint gives large dogs more room than many sofa beds in the same price band',
      'Waterproof egg-crate foam build and removable cover make it a practical pick for daily-use cleanup',
      'Raised sides add head-resting support without making the bed feel overly enclosed',
    ],
    bestFor: 'A roomy waterproof orthopedic sofa when you want more surface area than standard large couch beds offer',
    whyItWorks:
      'It combines easy-clean layers with an extra-large footprint, which is often the missing piece in lower-cost waterproof sofas',
    considerIf:
      'You want a spacious waterproof bed with sides but do not need the thickest premium memory-foam build',
  }),
  createFetchedRelaxationProduct({
    id: 'bfpethome-waterproof-orthopedic-sofa',
    asin: 'B09N8W2SC4',
    category: 'orthopedic-beds',
    bullets: [
      'Waterproof couch-style build gives dogs a defined space while still focusing on orthopedic foam underneath',
      'Removable washable cover keeps it more practical than soft sofa beds that are harder to strip and clean',
      'Mid-size 36-by-27-inch footprint works when you want a living-room-friendly orthopedic bed that is not oversized',
    ],
    bestFor: 'A medium-to-large waterproof orthopedic sofa when you want easy cleanup and a familiar couch shape',
    whyItWorks:
      'It covers the main sofa-bed needs well: supportive foam, raised edges, and washable waterproof layers',
    considerIf:
      'You want a home-friendly orthopedic couch bed that stays easier to manage than extra-large oversized options',
  }),
  createFetchedRelaxationProduct({
    id: 'eheyciga-xl-memory-foam-couch',
    asin: 'B0DF2LMWQJ',
    category: 'orthopedic-beds',
    bullets: [
      '42-by-30-inch memory-foam couch bed blends a roomy sleep surface with sides that support chin-resting and curling',
      'Waterproof liner, washable cover, and nonskid bottom make it easy to use in high-traffic rooms with hard floors',
      'Sofa profile sits between a flat lounger and a fully enclosed bolster bed, which makes it a versatile middle-ground pick',
    ],
    bestFor: 'Dogs that want orthopedic memory foam plus moderate side support without moving to a fully enclosed bolster bed',
    whyItWorks:
      'It gives dogs both a supportive core and enough edge definition to feel settled without cutting too much into the center space',
    considerIf:
      'You want a flexible all-around couch bed that balances open sleeping area and leaning support',
  }),
  createFetchedRelaxationProduct({
    id: 'invenho-xl-orthopedic-sofa',
    asin: 'B0D5B4PCDR',
    category: 'orthopedic-beds',
    bullets: [
      '42-by-32-inch XL sofa adds more stretch room than the smaller INVENHO couch listing already on the page',
      'Egg-crate foam, waterproof lining, and nonskid bottom make it a practical step up for bigger dogs or shared spaces',
      'Wider footprint works well for large breeds that want a couch shape without being squeezed into standard large sizes',
    ],
    bestFor: 'Large dogs that want an orthopedic sofa bed with a little more width than many entry-level couch options',
    whyItWorks:
      'The broader sleeping area helps larger dogs use the supportive foam more effectively instead of spilling onto the bolsters',
    considerIf:
      'You like the sofa-bed format but need more room than compact large sizes usually provide',
  }),
  createFetchedRelaxationProduct({
    id: 'wnpethome-xl-orthopedic-sofa',
    asin: 'B0C3R2NDZP',
    category: 'orthopedic-beds',
    bullets: [
      'XL couch-style design gives dogs bolsters to lean on while still keeping the center sleep zone reasonably open',
      'Removable waterproof cover makes the sofa format easier to live with than plush one-piece loungers',
      '41-by-28-inch footprint works well when you want a large orthopedic sofa without stepping into true XXL territory',
    ],
    bestFor: 'A value-oriented orthopedic sofa bed with bolsters and washable waterproof layers',
    whyItWorks:
      'It keeps the familiar couch-bed feel while still covering the support and cleanup features most orthopedic shoppers actually need',
    considerIf:
      'You want bolster support on a practical budget rather than paying up for a thicker premium memory-foam bed',
  }),
  createFetchedRelaxationProduct({
    id: 'comfort-expression-bolster-bed',
    asin: 'B0D5YQJ996',
    category: 'orthopedic-beds',
    bullets: [
      'Removable bolster layout gives dogs supportive edges while making the bed easier to clean and adjust than fixed-wall sofas',
      '42-by-30-inch XL size fits many large dogs well while still offering egg-crate orthopedic support underneath',
      'Water-resistant layers and washable cover keep the more cushioned couch feel practical for regular use',
    ],
    bestFor: 'Dogs that want a supportive orthopedic couch with removable bolsters and a roomy XL footprint',
    whyItWorks:
      'The removable bolster approach adds flexibility: you still get edge support, but with a layout that is easier to manage than some fixed couches',
    considerIf:
      'You want bolster support and easier cleaning access rather than a completely fixed surround',
  }),
  createFetchedRelaxationProduct({
    id: 'cozy-kiss-xl-bolster-bed',
    asin: 'B0FWCBBH37',
    category: 'orthopedic-beds',
    bullets: [
      '44-by-32-inch bolster sofa gives larger dogs both head support and more sleeping room than compact couch beds',
      'Egg-crate foam base and removable washable cover keep it focused on support rather than just plushness',
      'Lower price than many similarly sized bolster sofas makes it useful when you want a roomy couch shape on a firmer budget',
    ],
    bestFor: 'Large dogs that like sofa-style edges but still need a fairly roomy orthopedic sleeping area',
    whyItWorks:
      'It balances the comfort of side bolsters with a footprint that still gives bigger dogs real room to settle',
    considerIf:
      'You want a large orthopedic bolster bed without immediately jumping to premium-brand pricing',
  }),
  createFetchedRelaxationProduct({
    id: 'bedsure-crate-orthopedic-mat',
    asin: 'B0F1TTSB45',
    category: 'orthopedic-beds',
    bullets: [
      'Low-profile flat mat is explicitly sized for crates, making it easier to fit than many thick bolster beds',
      'Egg-crate foam and removable machine-washable cover keep the design simple but more supportive than basic plush pads',
      'Non-slip bottom helps it stay in place whether you use it inside a crate or directly on the floor',
    ],
    bestFor: 'A straightforward orthopedic crate mat when you want easier fit and simpler cleanup than a full sofa bed',
    whyItWorks:
      'The flatter build preserves crate space while still giving dogs a more supportive rest surface than thin filler mats',
    considerIf:
      'You need an orthopedic bed primarily for crate use, travel kennels, or a tight room footprint',
  }),
  createFetchedRelaxationProduct({
    id: 'nupida-xl-crate-bed',
    asin: 'B0DC6P1VFN',
    category: 'orthopedic-beds',
    bullets: [
      '41-by-27-inch quilting-style mattress is clearly shaped for crate floors and other tighter rectangular spaces',
      'Removable washable cover and waterproof construction make it a practical kennel-bed upgrade over basic plush pads',
      'Low-profile shape preserves more crate headroom than thick sofa beds with bolsters',
    ],
    bestFor: 'A waterproof orthopedic crate bed when you want a straightforward rectangular fit for larger crates',
    whyItWorks:
      'Its flatter crate-first design keeps the supportive foam in a format that is easier to fit and easier to clean',
    considerIf:
      'You want orthopedic support in a crate without adding bulky side walls or a very tall bed profile',
  }),
  createFetchedRelaxationProduct({
    id: 'eheyciga-medium-crate-sofa',
    asin: 'B0BZYDN8SJ',
    category: 'orthopedic-beds',
    bullets: [
      '30-by-20-inch size fills an important gap for smaller dogs that need orthopedic foam in crates or tighter rooms',
      'Memory-foam couch style adds some edge support while still staying compact enough for many crate setups',
      'Waterproof removable cover makes the smaller format easy to keep in rotation as an everyday rest spot',
    ],
    bestFor: 'Small or medium dogs when you want a more supportive compact bed that can still work in crate-sized spaces',
    whyItWorks:
      'Most orthopedic pages skew large; this one keeps the same washable supportive formula in a genuinely smaller footprint',
    considerIf:
      'You need orthopedic support for a smaller dog and larger 36- or 42-inch beds are simply too much',
  }),
  createFetchedRelaxationProduct({
    id: 'ksiia-crate-orthopedic-bed',
    asin: 'B0CG9LCN8B',
    category: 'orthopedic-beds',
    bullets: [
      '35-by-22-inch flat waterproof crate pad fits a common large-crate footprint without bulky side bolsters',
      'Egg-crate foam and removable cover strike a practical balance between support, cleanability, and price',
      'Low-cost entry point makes it easier to add orthopedic support in a crate without committing to a premium sofa bed',
    ],
    bestFor: 'Budget-minded crate use when you still want orthopedic foam and a removable cover',
    whyItWorks:
      'It keeps the format simple and crate-friendly while still covering the basic orthopedic features most dogs benefit from',
    considerIf:
      'You want a flatter waterproof crate bed rather than a taller couch-style orthopedic option',
  }),
  createFetchedRelaxationProduct({
    id: 'dog-bed-wont-go-flat-crate-bed',
    asin: 'B0FY3YKBYZ',
    category: 'orthopedic-beds',
    bullets: [
      '45D orthopedic memory foam is aimed at bigger, heavier dogs that can flatten cheaper foam more quickly',
      'Sized for 54-inch crates and giant breeds, giving it a clearer crate-use case than most generic orthopedic beds',
      'Waterproof liner and removable washable cover make the heavy-duty build easier to maintain over time',
    ],
    bestFor: 'Large and giant breeds when you want a crate-friendly orthopedic bed with a more heavy-duty foam claim',
    whyItWorks:
      'The thicker foam and large crate-oriented footprint make it a stronger fit for big dogs than standard flat crate mats',
    considerIf:
      'Your dog is over 100 pounds or you specifically need an orthopedic bed sized for a 54-inch crate',
  }),
  createFetchedRelaxationProduct({
    id: 'liorce-xxl-orthopedic-bed',
    asin: 'B0CLV4GWCP',
    category: 'orthopedic-beds',
    bullets: [
      'Six-inch-thick XXL memory-foam build gives extra-large dogs a deeper support layer than typical three-inch mats',
      'Waterproof removable cover and wrap-around zipper make it easier to strip and clean than one-piece beds',
      '48-by-30-inch footprint lands in a useful XXL range without jumping to the largest giant-breed sizes',
    ],
    bestFor: 'Extra-large dogs when you want a thicker memory-foam bed without moving to a bulky sofa design',
    whyItWorks:
      'The deep foam profile gives bigger dogs more real compression room than entry-level orthopedic beds often do',
    considerIf:
      'Your dog is outgrowing standard large sizes and you want a flat XXL bed with washable waterproof layers',
  }),
  createFetchedRelaxationProduct({
    id: 'veehoo-xxl-memory-foam-bed',
    asin: 'B0F2MYP4L9',
    category: 'orthopedic-beds',
    bullets: [
      'Seven-inch-thick XXL memory-foam bed offers one of the deeper support profiles in this orthopedic group',
      '52-by-36-inch size gives sprawling extra-large dogs more room to stretch fully without hanging off the edges',
      'Waterproof liner and removable washable cover make the oversized format more practical for everyday use',
    ],
    bestFor: 'Very large dogs that need a roomy, thick orthopedic bed with a softer top surface',
    whyItWorks:
      'The combination of extra depth and extra width makes it better suited to big sprawlers than standard large dog beds',
    considerIf:
      'You want more plush top comfort over a thick orthopedic base and have the floor space for a true XXL bed',
  }),
  createFetchedRelaxationProduct({
    id: 'laifug-xxl-memory-foam-bed',
    asin: 'B0757MKHP1',
    category: 'orthopedic-beds',
    bullets: [
      '50-by-36-inch pillow-style bed gives giant breeds a wide, flat surface with substantial depth',
      'Waterproof liner and removable washable cover make it easier to justify as a long-term everyday bed',
      'Long review history makes it one of the more established XXL memory-foam options on the page',
    ],
    bestFor: 'Giant breeds that need a large flat orthopedic bed with a long-established track record',
    whyItWorks:
      'Its oversized footprint and substantial foam depth make it a cleaner fit for giant dogs than most standard XL listings',
    considerIf:
      'You want a true XXL orthopedic bed without adding sofa bolsters that eat into the sleeping surface',
  }),
  createFetchedRelaxationProduct({
    id: 'noah-paw-giant-orthopedic-bed',
    asin: 'B0DS6GN236',
    category: 'orthopedic-beds',
    bullets: [
      '55-by-45-inch giant format gives very large dogs real sprawl room that few mainstream orthopedic beds match',
      'Cooling-gel memory foam, waterproof layers, and washable cover make the huge size more practical for daily living',
      'Sofa-style shape keeps some edge definition without shrinking the center sleeping area too aggressively',
    ],
    bestFor: 'Giant dogs when you want one of the roomiest orthopedic beds on the page',
    whyItWorks:
      'The oversized footprint solves the most common XXL problem: beds that are technically large but still not spacious enough for true giant breeds',
    considerIf:
      'You have the floor space and want a giant orthopedic bed that feels meaningfully larger than standard XL choices',
  }),
  createFetchedRelaxationProduct({
    id: 'bedsure-flat-orthopedic-bed',
    asin: 'B07ZGMGTCJ',
    category: 'orthopedic-beds',
    bullets: [
      'Flat egg-crate foam design keeps the bed easy to place in crates, corners, or smaller rooms',
      'Removable washable cover and non-slip bottom cover the core practical features without pushing the price too high',
      'Extremely high review count makes it a common entry point for shoppers moving up from basic plush mats',
    ],
    bestFor: 'A budget-friendly flat orthopedic bed when you want a recognizable, established option',
    whyItWorks:
      'It focuses on the main orthopedic upgrade most dogs need: a supportive foam base that is still easy to wash and easy to fit',
    considerIf:
      'You want a practical starter orthopedic bed before spending more on thicker XXL or sofa-style models',
  }),
  createFetchedRelaxationProduct({
    id: 'ohgeni-orthopedic-bed',
    asin: 'B0FY55X61J',
    category: 'orthopedic-beds',
    bullets: [
      '41-by-28-inch flat bed offers a useful large-dog or crate-friendly size at a lower price than many thicker sofa beds',
      'Washable removable cover, waterproof design, and carry handle make it practical for moving between rooms or crates',
      'High-density egg-crate foam keeps the design more supportive than a basic pillow mat without making it bulky',
    ],
    bestFor: 'Shoppers who want an affordable orthopedic bed that can work as a floor bed or a crate bed',
    whyItWorks:
      'It covers the practical basics well: supportive foam, washable layers, and a shape that fits more places around the house',
    considerIf:
      'You want value and flexibility more than the thickest foam or the plushest sofa styling',
  }),
  createFetchedRelaxationProduct({
    id: 'sunheir-orthopedic-crate-bed',
    asin: 'B0BNT3SV9H',
    category: 'orthopedic-beds',
    bullets: [
      '35-by-22-inch waterproof crate bed fits many large-crate setups while still working as a simple floor mat',
      'Egg-crate foam, removable cover, and anti-slip bottom make it more practical than generic plush kennel pads',
      'Lower price point makes it a useful budget orthopedic pick for secondary rooms, crates, or trial use',
    ],
    bestFor: 'A lower-cost orthopedic crate bed when you want waterproof practicality and a familiar kennel-pad footprint',
    whyItWorks:
      'It gives you the main orthopedic upgrade over basic crate pads without pushing you into premium pricing or bulky sides',
    considerIf:
      'You need something affordable for crate use, guest spaces, or dogs that do better on flatter beds',
  }),

  // ── Travel Beds ───────────────────────────────────────────────────────────

  createFetchedRelaxationProduct({
    id: 'furhaven-outdoor-travel-dog-bed',
    asin: 'B08FNVH7VB',
    category: 'travel-beds',
    bullets: [
      'Lightweight pillow-style mat with a stuff sack keeps packed size reasonable for road trips and camping bins',
      'Machine-washable construction is practical when the bed picks up dirt, sand, or hotel-floor grime',
      '39-by-27-inch footprint gives larger dogs more real sleeping room than the thinnest travel mats',
    ],
    bestFor: 'Large dogs when you want a packable bed that still feels more like a real sleep surface than a thin pad',
    whyItWorks:
      'The quilted, low-profile shape gives dogs a familiar place to settle without demanding much cargo space between stops',
    considerIf:
      'You want a travel bed that stays easy to carry but still gives your dog more cushion than an ultrathin roll-up mat',
  }),
  createFetchedRelaxationProduct({
    id: 'chuckit-travel-bed',
    asin: 'B00027466A',
    category: 'travel-beds',
    bullets: [
      'Water-resistant shell and raised pillow-style edge make it feel more finished than a bare travel mat',
      '39-by-30-inch size works for a wide range of medium and large dogs on hotel floors, patios, or campsites',
      'High review count makes it one of the more established travel-bed picks in this category',
    ],
    bestFor: 'Travelers who want the clearest all-around pick for road trips, hotel stops, patios, and casual camping',
    whyItWorks:
      'It balances portability, washable outdoor-friendly materials, and enough structure to feel like a real bed at the destination',
    considerIf:
      'You want one travel bed that can move between the car, hotel room, patio, and campsite without feeling flimsy',
  }),
  createFetchedRelaxationProduct({
    id: 'coleman-roll-up-travel-bed',
    asin: 'B01MSZJ3IX',
    category: 'travel-beds',
    bullets: [
      'Roll-up design is straightforward to pack, stow, and carry between the car and each overnight stop',
      'Padded construction gives a little more insulation from hard or cool ground than the thinnest mats',
      'Coleman travel focus makes it a natural fit for camp setups and road-trip gear bins',
    ],
    bestFor: 'Owners who specifically want a simple roll-up bed they can keep ready for road trips and campground stops',
    whyItWorks:
      'The packed roll format makes this bed easy to treat like travel gear instead of a bulky spare bed that lives loose in the cargo area',
    considerIf:
      'You care more about easy pack-and-go storage than about the plushest surface in the category',
  }),
  createFetchedRelaxationProduct({
    id: 'kindtail-nomad-nap-mat',
    asin: 'B0F2GFMG74',
    category: 'travel-beds',
    bullets: [
      'Folds to a compact travel size and weighs about 1.5 pounds, which is unusually easy to carry through hotels or vacation rentals',
      'Water-resistant washable build makes it practical for airport waiting areas, destination floors, and repeated travel days',
      'Sized for pets up to 50 pounds, so it works best when you want a portable familiar mat rather than a sprawling XL bed',
    ],
    bestFor: 'Small-to-medium dogs that need a lightweight familiar mat for hotels, airport downtime, and destination settling',
    whyItWorks:
      'Its very low packed size makes it easy to bring along even when luggage space is limited, which means your dog is more likely to actually get the same resting surface each trip',
    considerIf:
      'You want a compact mat for travel routines, but do not need the thicker cushion of a larger camping-style bed',
  }),
  createFetchedRelaxationProduct({
    id: 'onetigris-travel-dog-bed',
    asin: 'B0B6ZJWBZ3',
    category: 'travel-beds',
    bullets: [
      'Waterproof anti-slip base helps it stay put on tent floors, slick hotel surfaces, and outdoor patios',
      'Plush interior gives dogs a warmer, more familiar resting surface than bare nylon camping mats',
      'Portable format makes it realistic to keep in the car instead of leaving it behind between trips',
    ],
    bestFor: 'Dogs who travel often and need a portable bed that still feels cozy enough for real overnight use',
    whyItWorks:
      'The combination of travel-friendly packed size and a softer sleep surface makes it easier for dogs to settle quickly in unfamiliar places',
    considerIf:
      'You want one of the more camping-friendly options but do not want to give up all the softness of a true bed',
  }),
  createFetchedRelaxationProduct({
    id: 'kurgo-loft-wander-bed',
    asin: 'B01JFEAL1O',
    category: 'travel-beds',
    bullets: [
      'Large 48-by-36-inch size gives bigger dogs more room to stretch out at camp, in cabins, or on hotel floors',
      'Durable water-resistant top and non-slip bottom suit repeated road-trip and campsite use',
      'Roll-up travel format keeps it portable despite being one of the roomier picks in the group',
    ],
    bestFor: 'Travelers who want a more premium large-format bed for longer trips, camp setups, or bigger dogs',
    whyItWorks:
      'It gives larger dogs a destination bed that feels substantial while still packing as intentional travel gear rather than a bulky home bed',
    considerIf:
      'You have the cargo space for a larger roll-up bed and want more room and durability than the lighter travel mats offer',
  }),
  createFetchedRelaxationProduct({
    id: 'yofang-extra-large-travel-bed',
    asin: 'B0FXTTLYSX',
    category: 'travel-beds',
    bullets: [
      '47-by-32-inch footprint is one of the better size options here for larger dogs',
      'Waterproof ripstop nylon and anti-slip backing make it better suited to wet grass, campsite dirt, and harder outdoor surfaces',
      'Machine-washable build helps when the bed is doing both car-duty and outdoor-duty on the same trip',
    ],
    bestFor: 'Large dogs that need a more weather-friendly mat for camping, patios, and rougher road-trip stops',
    whyItWorks:
      'The larger waterproof platform gives big dogs a defined place to settle outside without relying on a bulky full-home bed',
    considerIf:
      'Your dog is large, messy, or likely to use the bed on damp ground and outdoor surfaces instead of only inside hotels',
  }),
  createFetchedRelaxationProduct({
    id: 'bingpet-outdoor-travel-bed',
    asin: 'B0DQCV6CF9',
    category: 'travel-beds',
    bullets: [
      'Carry-bag format keeps the setup simple for budget-minded road trips, camping kits, and trunk storage',
      'Portable washable design covers the main travel-bed basics without pushing into premium pricing',
      '43-by-26-inch size works for many medium dogs and lighter large dogs that do not need a thicker mattress',
    ],
    bestFor: 'Budget-focused shoppers who want a straightforward portable mat for road trips, car use, and campground stops',
    whyItWorks:
      'It covers the practical travel-bed requirements of portability, washability, and familiar destination setup without costing as much as the premium outdoor picks',
    considerIf:
      'You want a lower-cost travel mat for occasional trips and do not need the thickest cushioning in the category',
  }),

  // ── Chew-Resistant Beds ──────────────────────────────────────────────────

  createFetchedRelaxationProduct({
    id: 'k9-ballistics-armored-crate-bed',
    asin: 'B0FHS4FGS8',
    category: 'chew-resistant-beds',
    bullets: [
      'Armored padded crate-bed format gives dogs a tougher sleeping surface without exposed plush seams or loose stuffing',
      'Easy-clean ripstop ballistic polyester is better suited to repeated scratching, nesting, and moderate bed destruction than standard fabric beds',
      'Orthopedic-style padding makes it a stronger premium option when you need both toughness and actual sleep support',
    ],
    bestFor: 'A premium crate-safe bed when you want the toughest overall padded option on the page',
    whyItWorks:
      'It takes the crate-bed route instead of the plush-home-bed route, which removes a lot of the weak points that attract dogs to softer bedding',
    considerIf:
      'You want a tougher padded bed for crate use, but still understand that a highly determined chewer may need supervision or a harder setup',
  }),
  createFetchedRelaxationProduct({
    id: 'fxw-titannest-elevated-bed',
    asin: 'B0D5QZ1RCV',
    category: 'chew-resistant-beds',
    bullets: [
      'Elevated cot style removes stuffing, bolsters, and loose seams that many dogs target first',
      'Washable raised design works indoors, outdoors, and on trips where the bed needs to dry fast and stay cleaner',
      'Extra-large footprint makes it a realistic option for bigger dogs that destroy smaller soft beds',
    ],
    bestFor: 'Large dogs when you want an elevated washable cot-style bed instead of another stuffed bed experiment',
    whyItWorks:
      'Cot beds reduce the soft edges and fill material that make standard plush beds easy targets for shredding',
    considerIf:
      'Your dog destroys stuffed beds quickly, but is likely to accept a raised cot instead of a more nest-like bed shape',
  }),
  createFetchedRelaxationProduct({
    id: 'veehoo-chewproof-elevated-bed',
    asin: 'B0DY49VGG7',
    category: 'chew-resistant-beds',
    bullets: [
      'Budget-friendlier elevated design still removes stuffing and pillow edges that invite chewing',
      'Breathable mesh surface is useful for dogs that also run warm on dense padded beds',
      'Washable, non-slip cot format works for indoor use, patios, and covered outdoor setups',
    ],
    bestFor: 'The lower-cost elevated option when you want to stop replacing soft beds every few weeks',
    whyItWorks:
      'It leans on cot structure rather than thick padding, which gives chewers fewer obvious targets than a standard stuffed bed',
    considerIf:
      'You want to try an elevated chew-resistant format first without paying premium K9 Ballistics pricing',
  }),
  createFetchedRelaxationProduct({
    id: 'k9-ballistics-ripstop-oval-bolster-bed',
    asin: 'B0CW5963B8',
    category: 'chew-resistant-beds',
    bullets: [
      'Rip-stop cover is tougher than plush upholstery for scratching, digging, and moderate chewing',
      'Machine-washable construction is practical when the bed also needs to survive muddy paws and repeated cleanup',
      'Oval den-style shape gives dogs a more enclosed feel than flat cot beds, which matters for dogs that still want a nest-like sleep spot',
    ],
    bestFor: 'Moderate chewers that still settle best in a round or den-style washable bed',
    whyItWorks:
      'It offers a tougher cover than standard comfort beds while still preserving the curled-up shape some dogs prefer',
    considerIf:
      'Your dog likes enclosed bed shapes, but you can supervise enough to know bolsters and raised seams may still be tempting chew targets',
  }),
  createFetchedRelaxationProduct({
    id: 'k9-ballistics-rectangle-pillow-bed',
    asin: 'B00D7GEKI2',
    category: 'chew-resistant-beds',
    bullets: [
      'Rectangular tougher-cover format avoids some of the extra edges and corners of more decorative plush beds',
      'Removable washable cover and water-resistant build make it more practical than standard big stuffed beds',
      'XL size works for bigger home setups where a crate mat or cot may not be the right sleep format',
    ],
    bestFor: 'Big dogs that need a tougher floor bed at home, not just a crate pad or raised cot',
    whyItWorks:
      'It gives heavy resters a more familiar padded floor-bed experience while using tougher materials than standard plush rectangle beds',
    considerIf:
      'You want a home-bed format for a larger dog, but still need something tougher and easier to clean than a typical soft bed',
  }),
  createFetchedRelaxationProduct({
    id: 'vivifying-chew-resistant-crate-pad',
    asin: 'B0GK66SQWG',
    category: 'chew-resistant-beds',
    bullets: [
      'Low-profile waterproof kennel-mat style keeps loose edges and exposed stuffing to a minimum',
      'Machine-washable build fits the practical reality of crate use, accidents, and repeated cleanup',
      'Indoor-outdoor format makes it usable as a simple pad in crates, kennels, or travel setups',
    ],
    bestFor: 'A washable waterproof crate pad when you need something simpler and flatter than a full bed',
    whyItWorks:
      'Flat crate-pad formats tend to give bed destroyers fewer obvious starting points than plush pillows and bolstered beds',
    considerIf:
      'You mainly need a kennel or crate pad for moderate chewers, not a plush home bed for unsupervised severe destruction',
  }),
  createFetchedRelaxationProduct({
    id: 'sytopia-orthopedic-chew-resistant-bed',
    asin: 'B0GJ2LKC1M',
    category: 'chew-resistant-beds',
    bullets: [
      'Orthopedic-style flat bed gives you a more supportive at-home option than most crate pads or elevated cots',
      'Waterproof easy-clean build is useful for dogs that are rough on bedding and messy at the same time',
      'Lower-profile design is a better fit than bolsters for dogs that chew raised edges first',
    ],
    bestFor: 'An orthopedic-style flat bed when you want more support without moving back to a plush seam-heavy bed',
    whyItWorks:
      'It aims for the middle ground between support and toughness, which is often what heavy resters need when cots alone are not the right fit',
    considerIf:
      'You want a flatter supportive bed for home use and can accept that even tougher padded beds are not a guarantee against a determined destroyer',
  }),
  createFetchedRelaxationProduct({
    id: 'sytopia-elevated-chew-resistant-bed',
    asin: 'B0GCH5Q4PK',
    category: 'chew-resistant-beds',
    bullets: [
      'Breathable raised-cot setup keeps the chew-resistant strategy simple: fewer seams, no stuffing, more airflow',
      'Large 47-inch footprint makes it a real option for bigger dogs that overheat or flatten smaller beds',
      'Waterproof easy-clean format fits indoor, patio, and travel-adjacent use',
    ],
    bestFor: 'A breathable elevated option for larger dogs when airflow and reduced chew targets both matter',
    whyItWorks:
      'Raised mesh cots strip the sleep surface down to the essentials, which often works better for destroyers than padded beds with more edges to attack',
    considerIf:
      'You want an elevated alternative to stuffed beds and your dog is likely to rest well on a firmer breathable surface',
  }),
  createFetchedRelaxationProduct({
    id: 'brands1231-chew-resistant-crate-mat',
    asin: 'B0G1CMH3QM',
    category: 'chew-resistant-beds',
    bullets: [
      'Purpose-built crate-mat format is a better match than a fluffy bed when the real use case is kennel bedding',
      'Machine-washable ripstop Oxford construction is more practical than plush fill for chewers that shred crate bedding',
      'Soft-but-flatter design keeps comfort in the picture without adding the same seam and stuffing targets as a pillow bed',
    ],
    bestFor: 'The crate-mat pick when your dog destroys kennel bedding but still needs something softer than a bare tray',
    whyItWorks:
      'It stays focused on crate use instead of pretending to be a full decorative home bed, which makes it a better match for dogs that chew bedding in confinement',
    considerIf:
      'Your dog mainly destroys bedding inside the crate and you need a lower-profile crate liner rather than another stuffed bed',
  }),

  // ── Crates ───────────────────────────────────────────────────────────────

  {
    id: 'kindtail-pawd-collapsible-crate',
    asin: 'B0CWNXMYW1',
    name: 'KindTail PAWD Collapsible Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0CWNXMYW1/?tag=chill-dogs-20',
    bullets: [
      'Collapsible panel design folds flat for storage or moving around the house',
      'Includes a washable padded bed for a more finished puppy rest setup',
      'Medium size is listed for small-to-medium pets between 15 and 25 pounds',
    ],
    bestFor: 'Puppy owners who want a cleaner-looking, portable indoor crate instead of a standard wire crate',
    whyItWorks:
      'The collapsible hard-panel format gives puppies a defined resting space while feeling more like home furniture than a basic wire crate',
    considerIf:
      'You want the featured puppy-crate pick and your puppy fits the listed medium size range',
    image: { src: 'https://m.media-amazon.com/images/I/71+6X5mSFIL.jpg', alt: 'KindTail PAWD Collapsible Dog Crate' },
  },
  {
    id: 'midwest-icrate-puppy',
    asin: 'B000TZ59ES',
    name: 'MidWest iCrate Dog Crate (18-Inch)',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B000TZ59ES/?tag=chill-dogs-20',
    bullets: [
      '18-inch iCrate size is listed for tiny breeds up to 10 pounds',
      'Includes a divider panel so the usable crate space can grow with a small puppy',
      'Folding wire design is easy to move, store, or reposition around the house',
    ],
    bestFor: 'Tiny-breed puppies who need a small, straightforward first wire crate with a divider',
    whyItWorks:
      'The smaller puppy-specific size keeps the crate from starting too large while preserving the divider-based housebreaking setup',
    considerIf:
      'You want the simpler, lighter Midwest option for a tiny puppy and do not need the heavier-gauge Life Stages build',
    image: { src: 'https://m.media-amazon.com/images/I/81Cpkz5lEPL.jpg', alt: 'MidWest iCrate 18-Inch Dog Crate' },
  },
  {
    id: 'midwest-life-stages-puppy-crate',
    asin: 'B0002TKBU8',
    name: 'MidWest Life Stages Dog Crate (22-Inch)',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0002TKBU8/?tag=chill-dogs-20',
    bullets: [
      '22-inch Life Stages size is listed for extra-small breeds up to 15 pounds',
      'Includes a divider panel for puppy-to-adult crate setup in a smaller footprint',
      'Heavier-gauge steel than the iCrate line for a sturdier wire-crate feel',
    ],
    bestFor: 'Extra-small puppies when you want the sturdier Midwest wire crate in a puppy-sized model',
    whyItWorks:
      'It keeps the same divider-based training logic as iCrate but uses a heavier build for extra durability',
    considerIf:
      'You do not mind extra weight and want the sturdier Midwest option for a small puppy',
    image: { src: 'https://m.media-amazon.com/images/I/91Xxqc6WtBL.jpg', alt: 'MidWest Life Stages 22-Inch Dog Crate' },
  },
  {
    id: 'internets-best-small-wire-crate',
    asin: 'B01LZXRF98',
    name: "Internet's Best Double Door Wire Dog Kennel (Blue)",
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B01LZXRF98/?tag=chill-dogs-20',
    bullets: [
      'Small 24-inch double-door wire crate for puppies, cats, or small dogs',
      'Blue finish gives it a different look from the all-black wire crates that dominate this category',
      'Front and side doors keep placement flexible in bedrooms, offices, or living spaces',
    ],
    bestFor: 'Owners who want a small puppy wire crate with a bit more personality than the standard black look',
    whyItWorks:
      'It covers the same basic wire-crate training job while giving color-conscious buyers a real alternative to the usual black crate format',
    considerIf:
      'You want a functional puppy wire crate but care about color and room fit instead of settling for another plain black crate',
    image: { src: 'https://m.media-amazon.com/images/I/81MsY7MTquL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: "Internet's Best Double Door Wire Dog Kennel Blue" },
  },
  {
    id: 'midwest-icrate',
    asin: 'B000QFT1RC',
    name: 'MidWest iCrate Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B000QFT1RC/?tag=chill-dogs-20',
    bullets: [
      'Includes a divider panel so the usable crate space can grow with a puppy',
      'Folding wire design is easy to move, store, or reposition around the house',
      'A practical, budget-friendly starting point for standard puppy crate training',
    ],
    bestFor: 'Most puppies who need a straightforward first wire crate with a divider',
    whyItWorks:
      'The divider lets you size the sleeping area smaller during housebreaking, then open up more room as the puppy grows',
    considerIf:
      'You want the simpler, lighter Midwest option and do not need the heavier-gauge Life Stages build',
    image: { src: 'https://m.media-amazon.com/images/I/916OE0sVPqL.jpg', alt: 'MidWest iCrate Dog Crate' },
  },
  {
    id: 'midwest-life-stages-crate',
    asin: 'B0002AT3ME',
    name: 'MidWest Life Stages Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0002AT3ME/?tag=chill-dogs-20',
    bullets: [
      'Includes multiple sizes and a divider panel for puppy-to-adult crate setup',
      'Heavier-gauge steel than the iCrate line for a sturdier wire-crate feel',
      'A stronger choice for an especially active puppy',
    ],
    bestFor: 'Owners who want a sturdier wire crate for a strong or active puppy',
    whyItWorks:
      'It keeps the same divider-based training logic as iCrate but uses a heavier build for extra durability',
    considerIf:
      'You do not mind a heavier crate that feels more solid',
    image: { src: 'https://m.media-amazon.com/images/I/91NBxSDchXL.jpg', alt: 'MidWest Life Stages Dog Crate' },
  },
  {
    id: 'petmate-training-retreat-kennel',
    asin: 'B005U6UOEQ',
    name: 'Petmate Training Retreat Kennel',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B005U6UOEQ/?tag=chill-dogs-20',
    bullets: [
      'Two-door layout gives you more placement options in bedrooms, kitchens, or living rooms',
      'Wire construction keeps airflow and visibility high during early crate introduction',
      'Useful alternative if the room layout makes a single front door awkward',
    ],
    bestFor: 'Puppy owners who want flexible door access for different room setups',
    whyItWorks:
      'A second access point can make daily crate routines easier when the crate sits beside furniture or against a wall',
    considerIf:
      'You want a wire training crate but need side-door access more than the sturdier Life Stages build',
    image: { src: 'https://m.media-amazon.com/images/I/81abUgMp5uL.jpg', alt: 'Petmate Training Retreat Kennel' },
  },
  {
    id: 'impact-high-anxiety-crate',
    asin: 'B0CV4KXTPR',
    name: 'Impact High Anxiety Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0CV4KXTPR/?tag=chill-dogs-20',
    bullets: [
      'Powder-coated aluminum crate built for dogs who damage standard wire crates',
      'Zinc steel paddle latch plus four butterfly latches add multiple security points',
      'Small circular ventilation holes are designed to limit tooth access while preserving airflow',
    ],
    bestFor: 'Escape artists who have already bent wire crates or injured themselves trying to get out',
    whyItWorks:
      'The heavier enclosure, reinforced latching, and smaller ventilation openings are aimed at containment when standard crates are not enough',
    considerIf:
      'Your dog has a proven escape history and you are using the crate as part of a broader safety and behavior plan',
    image: { src: 'https://m.media-amazon.com/images/I/71PqD1QxTFL.jpg', alt: 'Impact High Anxiety Dog Crate' },
  },
  {
    id: 'petmate-sky-kennel',
    asin: 'B003E6YYYK',
    name: 'Petmate Sky Kennel',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B003E6YYYK/?tag=chill-dogs-20',
    bullets: [
      'Enclosed plastic shell reduces visual stimulation compared to open wire crates',
      '360-degree ventilation and tie-down holes support travel use',
      'Includes travel-prep accessories such as live-animal stickers, cup, ID stickers, and absorbent pad',
    ],
    bestFor: 'Anxious dogs who settle better with a more enclosed den-like crate',
    whyItWorks:
      'The plastic shell creates a quieter, more contained environment while still allowing ventilation from all sides',
    considerIf:
      'Your dog is crate-trained but gets overstimulated by open wire visibility or needs a travel-ready kennel',
    image: { src: 'https://m.media-amazon.com/images/I/71HTfabbQ3L.jpg', alt: 'Petmate Sky Kennel' },
  },
  {
    id: 'petsafe-happy-ride-travel-crate',
    asin: 'B09T1P2B7J',
    name: 'PetSafe Happy Ride Collapsible Travel Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B09T1P2B7J/?tag=chill-dogs-20',
    bullets: [
      'Designed for car travel with seat belt straps and a headrest loop for back-seat setup',
      'Collapsible soft-sided format folds flat for storage between road trips',
      'Mesh windows, dual side doors, storage pockets, and waterproof fleece pad for long-drive convenience',
    ],
    bestFor: 'Road trips where you want a travel-specific crate that is easier to pack than a standard indoor crate',
    whyItWorks:
      'It is built around for car use rather than house-training, making it great for road trips',
    considerIf:
      'Your dog is calm enough for a soft travel crate and you want a crate that packs down between drives',
    image: { src: 'https://m.media-amazon.com/images/I/81LvTZeUnwL.jpg', alt: 'PetSafe Happy Ride Collapsible Travel Crate' },
  },
  {
    id: 'elitefield-three-door-soft-crate',
    asin: 'B01HKF4AQW',
    name: 'EliteField 3-Door Folding Soft Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B01HKF4AQW/?tag=chill-dogs-20',
    bullets: [
      'Three mesh doors on top, front, and side make access easier in cars, hotels, and temporary setups',
      'Folds down to a low profile and includes a carrying bag and fleece bed',
      'Steel-tube frame with fabric and mesh cover is convenient for trained dogs who settle calmly',
    ],
    bestFor: 'Crate-trained dogs who travel well',
    whyItWorks:
      'The three-door layout makes placement more flexible when a crate is moving between the car, hotel room, and campsite',
    considerIf:
      'Your dog is already calm in a crate and you want a soft folding crate with more door options than most',
    image: { src: 'https://m.media-amazon.com/images/I/81eoHEQHU3L.jpg', alt: 'EliteField 3-Door Folding Soft Dog Crate' },
  },
  {
    id: 'lesure-soft-collapsible-crate',
    asin: 'B0G3PBR7XS',
    name: 'Lesure Soft Collapsible Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0G3PBR7XS/?tag=chill-dogs-20',
    bullets: [
      'Soft collapsible frame folds into a compact package with included storage bag',
      'Quick setup and disassembly make it practical for travel stops and temporary rooms',
      'Four-sided breathable mesh and removable mat keep the setup light and easy to maintain',
    ],
    bestFor: 'Calm, trained dogs whose owners prioritize the lightest, most portable soft crate setup',
    whyItWorks:
      'The compact folding design favors convenience and fast setup over hard-sided structure',
    considerIf:
      'You want easy carry-and-store travel convenience and your dog will not chew, claw, or push at soft crate walls',
    image: { src: 'https://m.media-amazon.com/images/I/8111DM2a0KL.jpg', alt: 'Lesure Soft Collapsible Dog Crate' },
  },
  {
    id: 'collapsible-hard-sided-travel-crate',
    asin: 'B0FPF6VZJ7',
    name: 'Collapsible Hard-Sided Travel Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0FPF6VZJ7/?tag=chill-dogs-20',
    bullets: [
      'Hard-sided collapsible design gives a different look and feel than soft folding travel crates',
      'No-tool folding format and wheels are built around easier carry and storage',
      'Works as a middle-ground option when you want more structure than fabric without a full fixed kennel',
    ],
    bestFor: 'Road-trip buyers who want a more structured collapsible crate without jumping to a full fixed hard-sided kennel',
    whyItWorks:
      'It sits between soft folding crates and fully rigid kennels, which makes it useful for buyers who want both structure and portability',
    considerIf:
      'You like the convenience of a collapsible crate but want a more substantial look and shell than a mesh-heavy soft crate',
    image: { src: 'https://m.media-amazon.com/images/I/712Iv0QSn0L._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Collapsible Hard-Sided Travel Crate' },
  },
  {
    id: 'zomisia-collapsible-steel-crate',
    asin: 'B0FDPVJH5Q',
    name: 'ZOMISIA Collapsible Steel Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0FDPVJH5Q/?tag=chill-dogs-20',
    bullets: [
      'Fold-flat steel-sided crate gives a more structured look than fabric travel crates',
      'Wheels and no-tool setup make it easier to move and store between trips',
      'Beige finish and enclosed frame feel different from both basic wire crates and soft travel crates',
    ],
    bestFor: 'Owners who want a collapsible road-trip crate with a more enclosed, furniture-like look than a standard soft crate',
    whyItWorks:
      'It gives you portability and fold-flat storage while still feeling more substantial than the typical soft-sided travel crate',
    considerIf:
      'You want a travel crate with a different visual style and more structure than soft mesh options usually provide',
    image: { src: 'https://m.media-amazon.com/images/I/81YdRCpJqKL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'ZOMISIA Collapsible Steel Dog Crate' },
  },
  {
    id: 'sportpet-airline-compliant-kennel',
    asin: 'B0DZF3X8WC',
    name: 'SportPet Airline Compliant Travel Kennel',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0DZF3X8WC/?tag=chill-dogs-20',
    bullets: [
      'Hard-sided kennel built around airline-compliant travel use rather than home crate training',
      'Removable wheels and food bowls help with airport handling and flight prep',
      'Reinforced hardware, tie-down points, and full ventilation support cargo-style requirements',
    ],
    bestFor: 'Flight prep when you want a kennel designed around airline-style travel requirements',
    whyItWorks:
      'It combines a rigid shell, flight-oriented hardware, and airport-friendly transport details in one kennel',
    considerIf:
      'You need a crate for flying with your dog and want a more travel-specific setup than a standard home kennel',
    image: { src: 'https://m.media-amazon.com/images/I/71SqUKBgQWL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'SportPet Airline Compliant Travel Kennel' },
  },
  {
    id: 'amazon-basics-hard-sided-carrier',
    asin: 'B00OP6SVJW',
    name: 'Amazon Basics Hard-Sided Pet Travel Carrier',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B00OP6SVJW/?tag=chill-dogs-20',
    bullets: [
      'Hard-sided plastic shell with both top and front entry for small dogs or cats',
      'Secure ventilation and carry handle make it practical for short travel and transport',
      'Straightforward budget-friendly option when you need a rigid small-pet carrier',
    ],
    bestFor: 'Smaller pets who need a basic rigid carrier',
    whyItWorks:
      'The rigid shell gives you more structure than a soft carrier while keeping the format simple and portable',
    considerIf:
      'You need a smaller hard-sided carrier for transport and your pet fits the listed size range comfortably',
    image: { src: 'https://m.media-amazon.com/images/I/71KLUcxRWML._AC_SX300_SY300_QL70_FMwebp_.jpg', alt: 'Amazon Basics Hard-Sided Pet Travel Carrier' },
  },
  {
    id: 'petmate-two-door-kennel',
    asin: 'B0062JFGM0',
    name: 'Petmate Two-Door Kennel',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0062JFGM0/?tag=chill-dogs-20',
    bullets: [
      'Plastic kennel with both top and front access for easier loading',
      'Den-like shell works for small dogs or cats that do better in a more enclosed carrier',
      'Simple rigid travel option that is easier to carry than a larger cargo kennel',
    ],
    bestFor: 'Small pets that need a rigid kennel with easier top-and-front loading',
    whyItWorks:
      'The extra access point can reduce loading friction when a pet resists a standard front-entry carrier',
    considerIf:
      'You want a smaller enclosed kennel and top access matters more than a full airline-focused feature set',
    image: { src: 'https://m.media-amazon.com/images/I/71AC0Sv6arL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Petmate Two-Door Kennel' },
  },
  {
    id: 'amazon-basics-furniture-style-crate',
    asin: 'B0DR7TWYBN',
    name: 'Amazon Basics Furniture Style Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0DR7TWYBN/?tag=chill-dogs-20',
    bullets: [
      'Blends a wood-look finish with an indoor dog kennel layout',
      'Includes two bowls for an all-in-one home setup',
      'A practical decorative option when you want the crate to fit a visible room',
    ],
    bestFor: 'Owners who want a simple furniture-style crate in a classic design',
    whyItWorks:
      'It gives you the visual upgrade of crate furniture without jumping straight to the most expensive decorative options',
    considerIf:
      'You want a cleaner indoor look and the crate will live in a visible shared space',
    image: { src: 'https://m.media-amazon.com/images/I/71WXadC2-EL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Amazon Basics Furniture Style Dog Crate' },
  },
  {
    id: 'dwanton-dog-crate-furniture',
    asin: 'B09V4N9VFN',
    name: 'DWANTON Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B09V4N9VFN/?tag=chill-dogs-20',
    bullets: [
      'Wooden crate table is designed to function as both kennel and side table',
      'Double-door layout gives more flexibility for room placement',
      'Comes with a cushion for a more finished indoor setup',
    ],
    bestFor: 'Homes where the crate needs to blend in with the other furniture in the room',
    whyItWorks:
      'The end-table form helps the crate blend into bedrooms and living rooms more naturally than all-wire setups',
    considerIf:
      'You care as much about how the crate looks in the room as how it functions for daily use',
    image: { src: 'https://m.media-amazon.com/images/I/81Q3DMv-W7L._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'DWANTON Dog Crate Furniture' },
  },
  {
    id: 'rehomerance-dog-crate-furniture',
    asin: 'B09WF65MM6',
    name: 'rehomerance Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B09WF65MM6/?tag=chill-dogs-20',
    bullets: [
      'Decorative crate furniture sized for medium and large dogs',
      'Rustic wood finish works for visible placement in common rooms',
      'Designed as a pet house plus end table instead of a standard kennel look',
    ],
    bestFor: 'Medium or large dogs whose crate needs to fit into home decor more gracefully',
    whyItWorks:
      'It gives larger dogs a furniture-style option instead of forcing owners into a purely utilitarian wire crate',
    considerIf:
      'You want a larger decorative crate and do not need heavy-duty escape-proof containment',
    image: { src: 'https://m.media-amazon.com/images/I/71JHGz9ucFL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'rehomerance Dog Crate Furniture' },
  },
  {
    id: 'internets-best-decorative-kennel',
    asin: 'B076HB1NGW',
    name: "Internet's Best Decorative Dog Kennel",
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B076HB1NGW/?tag=chill-dogs-20',
    bullets: [
      'Decorative small-dog kennel designed to double as a side table or nightstand',
      'Includes a pet bed for a more complete indoor furniture setup',
      'Double-door layout gives easier access than many decorative crates',
    ],
    bestFor: 'Small dogs when you want decorative crate furniture with a finished bedside-table look',
    whyItWorks:
      'It is built around small-space indoor use where the crate has to function visually as furniture',
    considerIf:
      'Your dog is small and the crate will sit in a bedroom, office, or living room rather than a utility area',
    image: { src: 'https://m.media-amazon.com/images/I/71U1gwRTARL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: "Internet's Best Decorative Dog Kennel" },
  },
  {
    id: 'lyromix-dog-crate-furniture',
    asin: 'B0FXRSF8LQ',
    name: 'Lyromix Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0FXRSF8LQ/?tag=chill-dogs-20',
    bullets: [
      'Three-door wooden crate design improves access from different room angles',
      'Built for small dogs and can be combined with additional units',
      'End-table styling helps it read as furniture in tight indoor spaces',
    ],
    bestFor: 'Small-dog owners who want more access points in a decorative indoor crate',
    whyItWorks:
      'The extra door flexibility helps when a furniture crate has to fit around real room constraints',
    considerIf:
      'You want a furniture crate for a small dog and value side access or modular layout options',
    image: { src: 'https://m.media-amazon.com/images/I/71d-pddTVAL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Lyromix Dog Crate Furniture' },
  },
  {
    id: 'easycom-foldable-dog-crate-furniture',
    asin: 'B0FGY2SYPJ',
    name: 'Easycom Foldable Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0FGY2SYPJ/?tag=chill-dogs-20',
    bullets: [
      'No-assembly foldable furniture crate is designed for quick setup right out of the box',
      'Decorative wood looks more like furniture than a basic wire crate',
      'Adjustable bowls are convenient for dog feeding',
    ],
    bestFor: 'Owners who want furniture-crate styling without a long assembly process',
    whyItWorks:
      'The foldable format is easier to assemble than standard crate furniture',
    considerIf:
      'You want the furniture look but still care about being able to move, store, or set up the crate quickly',
    image: { src: 'https://m.media-amazon.com/images/I/81s6bZdJqIL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Easycom Foldable Dog Crate Furniture' },
  },
  {
    id: 'rotating-bowl-furniture-crate',
    asin: 'B0G5PLC4JY',
    name: 'Folding Furniture Crate with Rotating Bowls',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0G5PLC4JY/?tag=chill-dogs-20',
    bullets: [
      'Furniture-style crate includes 360-degree rotating bowls for built-in feeding convenience',
      'Folding format makes it more flexible than fixed decorative crate furniture',
      'Wood-and-metal build gives it a more substantial feel than lightweight decorative options',
    ],
    bestFor: 'Owners who like furniture-crate styling but want integrated feeding convenience and foldable setup',
    whyItWorks:
      'The rotating bowls and foldable format are more functional than standard decorative crates',
    considerIf:
      'You want furniture styling plus practical home-use features',
    image: { src: 'https://m.media-amazon.com/images/I/71-oYVgYdTL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Folding Furniture Crate with Rotating Bowls' },
  },
  {
    id: 'ironck-extra-large-dog-crate-furniture',
    asin: 'B0FH69ZJQX',
    name: 'IRONCK Extra Large Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0FH69ZJQX/?tag=chill-dogs-20',
    bullets: [
      'Extra-large decorative crate adds storage and hooks for a more built-in furniture feel',
      'Reinforced metal construction is sturdier than lightweight decorative crates',
      'Suitable for large dogs',
    ],
    bestFor: 'Large dogs when you want furniture styling',
    whyItWorks:
      'It keeps the visual upgrade of crate furniture while offering more space and stronger structure for larger breeds',
    considerIf:
      'You need a larger indoor crate with room-friendly furniture styling',
    image: { src: 'https://m.media-amazon.com/images/I/91-pfSgJ5dL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'IRONCK Extra Large Dog Crate Furniture' },
  },
  {
    id: 'bifanuo-dog-crate-furniture',
    asin: 'B0GJ66SX32',
    name: 'Bifanuo Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0GJ66SX32/?tag=chill-dogs-20',
    bullets: [
      'Small decorative crate is both a kennel and a side table',
      'Lockable enclosure supports indoor or sheltered outdoor placement',
      'Plastic-heavy decorative build gives it a different feel than wood furniture crates',
    ],
    bestFor: 'Small-dog owners who want a compact decorative kennel that can be used as a side table',
    whyItWorks:
      'It blends containment with a lighter decorative form for compact spaces',
    considerIf:
      'You want a smaller furniture-style crate and do not need a heavier wood-and-steel build',
    image: { src: 'https://m.media-amazon.com/images/I/71eX3avmroL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Bifanuo Dog Crate Furniture' },
  },
  {
    id: 'charging-station-furniture-crate',
    asin: 'B0GCK3SXGH',
    name: 'Modern Dog Crate Furniture with Charging Station',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0GCK3SXGH/?tag=chill-dogs-20',
    bullets: [
      'Built-in charging station is the clear standout feature for nightstand or living-room placement',
      'Modern furniture styling is designed to function as both kennel and side table',
      'Flip-up hidden acrylic door gives it a more polished furniture look than many decorative crates',
    ],
    bestFor: 'Owners who want a furniture crate that doubles as a real usable side table with charging access',
    whyItWorks:
      'The charging station turns it into genuinely useful room furniture instead of just a crate',
    considerIf:
      'You want the crate in a bedroom or living room and want charging capabilities',
    image: { src: 'https://m.media-amazon.com/images/I/71iS8C25R0L._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Modern Dog Crate Furniture with Charging Station' },
  },
  {
    id: 'oranland-heavy-duty-furniture-crate',
    asin: 'B0GHRQ1KJF',
    name: 'Oranland Heavy Duty Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0GHRQ1KJF/?tag=chill-dogs-20',
    bullets: [
      'Decorative crate furniture uses thicker steel tubes than lighter furniture-style options',
      'Designed for medium and large dogs that need a more substantial indoor setup',
      'Blends crate furniture aesthetics with a heavier-duty frame',
    ],
    bestFor: 'Owners who want furniture styling but need a sturdier crate than most decorative options',
    whyItWorks:
      'It sits between standard crate furniture and true heavy-duty crates, providing more structure while still looking decorative',
    considerIf:
      'Your dog needs a stronger kennel than a lightweight furniture crate, but you still want the crate to complement home decor',
    image: { src: 'https://m.media-amazon.com/images/I/81VFBYh3TmL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Oranland Heavy Duty Dog Crate Furniture' },
  },
  {
    id: 'ironck-small-furniture-crate',
    asin: 'B0DNDT7Z55',
    name: 'IRONCK Furniture Dog Crate with Flip-Top Drawer',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0DNDT7Z55/?tag=chill-dogs-20',
    bullets: [
      'Flip-top drawer adds a functional surface for keys, remotes, or a lamp above the kennel',
      'Built-in charging station makes it a practical nightstand or side table for small-dog owners',
      'Steel-tube and wood construction in a rustic brown finish complements home decor',
    ],
    bestFor: 'Small-dog owners who want a furniture crate that functions as a side table',
    whyItWorks:
      'The flip-top drawer and charging station make it genuinely useful as furniture, not just as a kennel, especially in a bedroom or living room',
    considerIf:
      'Your dog is small, the crate will sit in a visible room, and you want the surface to actually be usable as a nightstand or side table',
    image: { src: 'https://m.media-amazon.com/images/I/81RbcLjaKsL._SL500_.jpg', alt: 'IRONCK Furniture Dog Crate with Flip-Top Drawer' },
  },
  {
    id: 'feandrea-furniture-crate',
    asin: 'B0GJCYKK3X',
    name: 'Feandrea Modern Furniture Dog Crate with Charging Station',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0GJCYKK3X/?tag=chill-dogs-20',
    bullets: [
      'Natural walnut finish and flip-up hidden acrylic door give it a cleaner, more modern furniture look than most rustic-style crates',
      'Built-in charging station makes the top surface usable as a side table with power access',
      'Sized for small and medium dogs up to 45 lb with a side-table footprint that fits most rooms',
    ],
    bestFor: 'Owners who want a modern, polished furniture crate rather than a rustic wood look — and will actually use the charging station',
    whyItWorks:
      'The walnut finish and hidden acrylic door make it look more like intentional furniture than a crate in disguise, which matters for visible bedroom or living-room placement',
    considerIf:
      'Your dog is under 45 lb, your home leans toward modern or Scandinavian styling, and the charging station would genuinely get daily use',
    image: { src: 'https://m.media-amazon.com/images/I/816kOPz+6rL._SL500_.jpg', alt: 'Feandrea Modern Furniture Dog Crate with Charging Station' },
  },
  {
    id: 'saksun-furniture-crate',
    asin: 'B0FYD4WQJG',
    name: 'SAKSUN Furniture Dog Crate with Sliding Barn Door',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0FYD4WQJG/?tag=chill-dogs-20',
    bullets: [
      'Sliding barn door and multi-point locking system add more closure security than most standard decorative crate furniture',
      'Available in 32", 39", and 44" to give medium dogs more sizing options within the furniture-crate format',
      '360-degree rotating feed rack and two-door layout allow practical access in different room setups',
    ],
    bestFor: 'Owners who want furniture styling with more closure security than lightweight decorative crates typically provide',
    whyItWorks:
      'The multi-lock barn door makes it a more credible option for dogs who have pushed past simpler latch mechanisms, without requiring a full switch to a utility-style heavy-duty crate',
    considerIf:
      'You like the furniture look but your dog has tested the latches on lighter crates, and you still want something that fits a visible room',
    image: { src: 'https://m.media-amazon.com/images/I/81NGP7WR7dL._SL500_.jpg', alt: 'SAKSUN Furniture Dog Crate with Sliding Barn Door' },
  },
  {
    id: 'hzuaneri-furniture-dog-crate',
    asin: 'B0D4HM56TR',
    name: 'Hzuaneri Anti-Chew Furniture Dog Crate with Barn Door',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0D4HM56TR/?tag=chill-dogs-20',
    bullets: [
      '0.4-inch steel tubes with double-welded joints form the cage structure, and the board edges are recessed so dogs cannot access them for chewing',
      'Sliding barn door with a multi-lock closure addresses the single-latch failure mode common in lighter decorative furniture crates',
      'Chipboard panels with wear-resistant surface and steel-tube framing support up to 220 lbs on top, giving it real table-surface utility',
    ],
    bestFor: 'Small to medium dogs up to 44 lbs that have pushed past basic single-latch mechanisms.  The anti-chew edge treatment and double-welded steel address persistent but not extreme escape behavior',
    whyItWorks:
      'The recessed board edges remove the easiest chewing targets, and the multi-lock barn door addresses the sliding or pawing-open failure modes in standard decorative crate latches',
    considerIf:
      'Your small or medium dog works at latch edges or chews at crate openings, and you want a furniture-style option instead of a heavier utility crate',
    image: { src: 'https://m.media-amazon.com/images/I/810zxDD9MdL._SL500_.jpg', alt: 'Hzuaneri Anti-Chew Furniture Dog Crate with Barn Door' },
  },
  {
    id: 'rexwelten-furniture-dog-crate',
    asin: 'B0GJS5BV3Z',
    name: 'REXWELTEN Heavy-Duty Enclosed Furniture Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0GJS5BV3Z/?tag=chill-dogs-20',
    bullets: [
      'Enclosed panel design with 0.5-inch ventilation holes replaces open bar construction.  There are no exposed bars for dogs to grip, bite, or use as lever points',
      'High-quality steel and reinforced particleboard build with an upgraded double-door lock system designed to contain dogs that push standard latches',
      'Removable metal floor panel cleans more easily than wire floors and provides stable paw support for dogs that pace or shift weight while inside',
    ],
    bestFor: 'Medium to large dogs that target the bars themselves. The enclosed panel approach removes the primary gripping and chewing surface that persistent escape artists find on open-bar furniture crates',
    whyItWorks:
      'Switching from bar-grid to enclosed panel removes the most accessible chewing and gripping surfaces, which is what many persistent dogs find first on standard furniture crates',
    considerIf:
      'Your dog targets the bars or mesh rather than the door latch.  An enclosed panel means there is nothing for the dog to physically grab onto, rather than just adding more locks to the same vulnerable structure',
    image: { src: 'https://m.media-amazon.com/images/I/71Hbp8TTNUL._SL500_.jpg', alt: 'REXWELTEN Heavy-Duty Enclosed Furniture Dog Crate' },
  },
  {
    id: 'petrova-furniture-dog-crate',
    asin: 'B0F9NXMGQM',
    name: 'Petrova Heavy-Duty Furniture Dog Crate with Sliding Door',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0F9NXMGQM/?tag=chill-dogs-20',
    bullets: [
      '0.4-inch thick steel bars on a sliding front door plus two hinged side doors.',
      'Sized at 46.5 inches for large-breed dogs.  Can function as a TV stand or end table with a stable wood base',
      'Sliding front door eliminates the outward swing of a hinged door.  Useful for placement in the corner of a room',
    ],
    bestFor: 'Large dog owners who want strong steel bars, three access options, and a sliding front door',
    whyItWorks:
      'The sliding door mechanism has less swing-out gap and less torque leverage than a hinged door, which reduces the chance of a dog escaping by repeatedly nosing or pawing a swinging door open',
    considerIf:
      'You need a crate in a corner or against a wall.  You want a large-dog furniture crate with stronger steel bars rather than lightweight decorative framing.  You want a crate that looks and functions as furniture',
    image: { src: 'https://m.media-amazon.com/images/I/71RxdhVH0zL._SL500_.jpg', alt: 'Petrova Heavy-Duty Furniture Dog Crate with Sliding Door' },
  },
  {
    id: 'rovibek-double-dog-crate-furniture',
    asin: 'B0D9JBY7X5',
    name: 'Rovibek Double Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0D9JBY7X5/?tag=chill-dogs-20',
    bullets: [
      '86-inch double-crate design fits two dogs up to 70 lbs each, with a removable divider that converts to one large open space',
      'Engineered-wood build with iron reinforcement supports over 400 lbs on top, suitable for use as a TV stand or console table',
      'Can be arranged in an L-shape corner configuration, side-by-side, or split into two separate crates depending on room layout',
    ],
    bestFor: 'Two-dog households that want a single furniture-style piece that keeps both dogs in their own crated space',
    whyItWorks:
      'The removable divider gives each dog their own separate section, while the single footprint keeps the room organized',
    considerIf:
      'You have two dogs that do fine in separate spaces and want to avoid two individual crates sitting side by side in the same room',
    image: { src: 'https://m.media-amazon.com/images/I/81y29uEOExL._SL500_.jpg', alt: 'Rovibek Double Dog Crate Furniture' },
  },
  {
    id: 'hugcoz-double-furniture-dog-crate',
    asin: 'B0FQ56N8ZT',
    name: 'HugCoz Double-Door Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0FQ56N8ZT/?tag=chill-dogs-20',
    bullets: [
      'Lift-and-push front door opens upward rather than outward, saving floor space around the crate and reducing tripping risk',
      'Four lockable caster wheels let you roll the crate between rooms for cleaning, repositioning, or following sunlight',
      'Includes a removable blackout curtain that attaches or removes easily for privacy during naps or busy household moments',
    ],
    bestFor: 'Large-dog owners who want a furniture crate they can reposition across the house and close off for naptime privacy',
    whyItWorks:
      'Wheel mobility and the blackout curtain are two practical features that most decorative wood-panel crates skip entirely',
    considerIf:
      'Your large dog settles better without visual stimulation and you want a crate-table that can easily move from room to room without heavy lifting',
    image: { src: 'https://m.media-amazon.com/images/I/81eV2cWZNWL._SL500_.jpg', alt: 'HugCoz Double-Door Dog Crate Furniture' },
  },
  {
    id: 'pawhut-furniture-dog-crate-double',
    asin: 'B09T92J9SB',
    name: 'PawHut Double-Door Wire Furniture Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B09T92J9SB/?tag=chill-dogs-20',
    bullets: [
      'Wire mesh end-table design keeps the interior visible and well-ventilated compared to solid-panel wood crates',
      'Front and side double-door layout provides convenient access',
      'Compact end-table footprint keeps the scale realistic for smaller living rooms or bedrooms where a large crate-table would feel oversized',
    ],
    bestFor: 'Small or medium dog owners who want an end-table furniture crate with open wire visibility rather than a fully enclosed wood panel design',
    whyItWorks:
      'The wire end-table is less expensive than a solid-panel wood furniture crate while still looking more intentional than a standard wire crate in a visible room',
    considerIf:
      'Your dog is small enough for an end-table crate and does better with the open-air feel of wire over the more enclosed environment of a solid-panel wood kennel',
    image: { src: 'https://m.media-amazon.com/images/I/61O8jnv+AOL._SL500_.jpg', alt: 'PawHut Double-Door Wire Furniture Dog Crate' },
  },
  {
    id: 'oranland-heavy-duty-dog-crate',
    asin: 'B0DCFRJTP4',
    name: 'Oranland Heavy Duty Indestructible Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0DCFRJTP4/?tag=chill-dogs-20',
    bullets: [
      'Heavy steel build and reinforced base are designed for large dogs that overpower standard crates',
      'Double-door layout and wheels make for easier management',
      'A stronger containment option than ordinary wire or decorative crates',
    ],
    bestFor: 'Large dogs that need reinforced containment beyond a standard wire crate',
    whyItWorks:
      'The heavier frame and reinforced base are built for dogs that push, paw, or damage lighter crates',
    considerIf:
      'You already know a normal crate is not sufficient and your dog needs more serious containment',
    image: { src: 'https://m.media-amazon.com/images/I/81aSK08xZWL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Oranland Heavy Duty Indestructible Dog Crate' },
  },
  {
    id: 'kokotangs-heavy-duty-dog-crate',
    asin: 'B0CRS489BJ',
    name: 'KOKOTANGS Heavy Duty Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0CRS489BJ/?tag=chill-dogs-20',
    bullets: [
      'Heavy steel construction is chew-proof and escape-resistant',
      'Double-door access, sturdy locks, and sliding tray',
      'Large sizing suits bigger or stronger dogs',
    ],
    bestFor: 'Larger dogs that need more security points and more structure than a basic crate offers',
    whyItWorks:
      'It combines a heavier frame with stronger latching for dogs that test ordinary crate walls and doors',
    considerIf:
      'Your dog has started pushing beyond what a wire crate can realistically contain',
    image: { src: 'https://m.media-amazon.com/images/I/71BPouKuP9L._AC_SX300_SY300_QL70_FMwebp_.jpg', alt: 'KOKOTANGS Heavy Duty Dog Crate' },
  },
  {
    id: 'gardner-pet-heavy-duty-crate',
    asin: 'B0FWJVHFJN',
    name: 'Gardner Pet Heavy Duty Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0FWJVHFJN/?tag=chill-dogs-20',
    bullets: [
      'Stackable small-dog heavy-duty crate uses thicker steel than standard small wire crates',
      'Triple-door access and removable tray',
      'Built for small dogs with escape or chewing issues rather than general puppy training',
    ],
    bestFor: 'Small dogs that still need reinforced containment instead of a basic wire crate',
    whyItWorks:
      'It fills the gap between tiny starter crates and the much larger heavy-duty models built for big dogs',
    considerIf:
      'Your dog is small but determined enough that ordinary small wire crates are not a good long-term fit',
    image: { src: 'https://m.media-amazon.com/images/I/71mgtvn3eqL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Gardner Pet Heavy Duty Dog Crate' },
  },
  {
    id: 'xxl-heavy-duty-dog-crate',
    asin: 'B0GM672PS3',
    name: 'Heavy Duty Dog Crate XXL',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0GM672PS3/?tag=chill-dogs-20',
    bullets: [
      '54-inch heavy-duty metal kennel is built for very large dogs that need more room and stronger walls',
      'Escape-resistant framing, tray, and wheels target large-breed management',
      'Useful when standard XXL wire crates still feel too flimsy',
    ],
    bestFor: 'Very large dogs that need both oversized space and reinforced containment',
    whyItWorks:
      'It addresses the needs of extra-large dogs who outgrow the size and strength of standard crates',
    considerIf:
      'You need true XXL sizing and a stronger build',
    image: { src: 'https://m.media-amazon.com/images/I/81JfbDGBGSL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Heavy Duty Dog Crate XXL' },
  },
  {
    id: 'hiwokk-large-dog-crate',
    asin: 'B0FQHZ7R3Y',
    name: 'HIWOKK Large Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0FQHZ7R3Y/?tag=chill-dogs-20',
    bullets: [
      'Large escape-resistant wire-style crate adds dual door locks and swivel casters',
      'Removable tray and mobile base make cleanup and repositioning easier',
      'Bridges the gap between a standard wire crate and a fully enclosed heavy-duty kennel',
    ],
    bestFor: 'Owners who want stronger large-crate hardware without moving to a fully enclosed aluminum-style crate',
    whyItWorks:
      'It adds more security and sturdier handling details than a basic large wire crate while staying more familiar in form',
    considerIf:
      'Your dog needs a step up from a standard large wire crate but not necessarily the most enclosed heavy-duty option',
    image: { src: 'https://m.media-amazon.com/images/I/81trYMp3QqL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'HIWOKK Large Dog Crate' },
  },

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

  // ── Airline Carriers ──────────────────────────────────────────────────────

  {
    id: 'sherpa-original-deluxe-carrier-medium',
    asin: 'B000FLETX8',
    name: 'Sherpa Original Deluxe Travel Pet Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B000FLETX8/?tag=chill-dogs-20',
    bullets: [
      'Guaranteed On Board program means Sherpa will replace the carrier if an airline rejects it at the gate',
      'Spring wire frame lets the rear end of the bag compress to fit under the seat, then spring back to full shape after boarding. Folds flat when not in use.',
      'Mesh panels on three sides give ventilation and clear line-of-sight. Fleece base liner is included.',
    ],
    bestFor: 'Dogs flying in cabin who need a proven, airline-accepted soft-sided carrier',
    whyItWorks: 'The Guaranteed On Board program means Sherpa will replace it if an airline rejects it.',
    considerIf: 'Your dog weighs under 16 lb and you want the most established in-cabin carrier on the market',
    image: { src: 'https://m.media-amazon.com/images/I/81gqQnt7waL._SL500_.jpg', alt: 'Sherpa Original Deluxe Travel Pet Carrier Medium' },
  },
  {
    id: 'sherpa-delta-airlines-carrier-medium',
    asin: 'B000633ZOY',
    name: 'Sherpa Delta Airlines Travel Pet Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B000633ZOY/?tag=chill-dogs-20',
    bullets: [
      'Sized and approved specifically for Delta Airlines in-cabin pet travel (18" x 11" x 10.5")',
      'Spring wire frame compresses to slide under the seat and returns to shape once stowed',
      'Mesh on three sides keeps airflow moving; removable fleece liner is washable',
    ],
    bestFor: 'Delta flyers who want a carrier confirmed to match Delta\'s specific under-seat dimensions',
    whyItWorks: 'Built to Delta\'s published dimensions, which differ from many other carriers',
    considerIf: 'You fly Delta regularly and want a carrier purpose-built for their specific size requirements',
    image: { src: 'https://m.media-amazon.com/images/I/81IWGNpchBL._AC_SL1500_.jpg', alt: 'Sherpa Delta Airlines Travel Pet Carrier Medium' },
  },
  {
    id: 'mr-peanuts-expandable-carrier',
    asin: 'B06Y5SB51H',
    name: "Mr. Peanut's Expandable Airline Approved Soft-Sided Pet Carrier",
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B06Y5SB51H/?tag=chill-dogs-20',
    bullets: [
      'Side panel unzips to expand the carrier once the plane is at cruising altitude, giving your dog more room mid-flight',
      'Padded shoulder strap and top handle make airport transit easier',
      'Mesh windows on all four sides maximize airflow in a closed cabin environment',
    ],
    bestFor: 'Dogs who do better with more space during the flight itself, not just at the gate',
    whyItWorks: 'The expansion panel means the carrier meets under-seat requirements at boarding, while giving your dog extra room once you are in the air',
    considerIf: 'Your dog fits the base dimensions for boarding but tends to get restless and would benefit from more stretch room once airborne',
    image: { src: 'https://m.media-amazon.com/images/I/716JjBt7o+L._SL500_.jpg', alt: "Mr. Peanut's Expandable Airline Approved Soft-Sided Pet Carrier" },
  },
  {
    id: 'petskd-top-side-expandable-carrier',
    asin: 'B0GF263XKY',
    name: 'Petskd Top and Side Expandable Pet Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0GF263XKY/?tag=chill-dogs-20',
    bullets: [
      'Expands from both the top and side, giving two options for where your dog\'s extra space opens up',
      'Meets major airline under-seat dimension specifications',
      'Removable and washable fleece mat is included; exterior pocket fits documents and treats',
    ],
    bestFor: 'Owners who want maximum flexibility in how the carrier expands during the flight',
    whyItWorks: 'Two-direction expansion gives another option for extra room',
    considerIf: 'You want both top and side expansion options',
    image: { src: 'https://m.media-amazon.com/images/I/71w8VK00EGL._SL500_.jpg', alt: 'Petskd Top and Side Expandable Pet Carrier' },
  },
  {
    id: 'petskd-top-expandable-carrier',
    asin: 'B0DMVQWM66',
    name: 'Petskd Top-Expandable Pet Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0DMVQWM66/?tag=chill-dogs-20',
    bullets: [
      'Top panel unzips to expand upward once stowed, adding height for dogs who prefer to sit up',
      'Base dimensions meet most major airline under-seat requirements',
      'Mesh on three sides plus a top mesh window provide ventilation from multiple angles',
    ],
    bestFor: 'Dogs that prefer to sit upright rather than lie down during flights',
    whyItWorks: 'Top-only expansion adds height without requiring side clearance, which can be limited by the seat structure in front of you',
    considerIf: 'Your dog habitually sits up or stands during car rides and would benefit from added vertical room',
    image: { src: 'https://m.media-amazon.com/images/I/810Neazl1UL._SL500_.jpg', alt: 'Petskd Top-Expandable Pet Carrier' },
  },
  {
    id: 'lekereise-top-expandable-carrier',
    asin: 'B0G4M3W62D',
    name: 'Lekereise Top-Expandable Pet Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0G4M3W62D/?tag=chill-dogs-20',
    bullets: [
      'Top expansion panel adds vertical room once you\'re seated, without extending the carrier footprint sideways',
      'Designed to meet Delta, American, and United Airline under-seat dimension specifications',
      'Two-way zipper and breathable mesh panels on three sides keep the interior comfortable and well-ventilated',
    ],
    bestFor: 'Flyers on the big three U.S. airlines who want a top-expanding carrier confirmed against published dimension requirements',
    whyItWorks: 'Designed to meet Delta, American, and United\'s published dimensions specifications',
    considerIf: 'You want an affordable, top-expanding carrier and frequently fly Delta, American, and/or United',
    image: { src: 'https://m.media-amazon.com/images/I/81MjgtZtakL._SL500_.jpg', alt: 'Lekereise Top-Expandable Pet Carrier' },
  },
  {
    id: 'amazon-basics-soft-sided-carrier',
    asin: 'B00QHC0050',
    name: 'Amazon Basics Soft-Sided Airline Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B00QHC0050/?tag=chill-dogs-20',
    bullets: [
      'Compact footprint fits under most airline seats',
      'Removable fleece pad is machine washable',
      'Front and top openings with handles and a removable shoulder strap',
    ],
    bestFor: 'Small dogs whose owners want a simple, lower-cost in-cabin carrier from a familiar brand',
    whyItWorks: 'It provides a compact shell, mesh airflow, easy loading, and a washable floor pad',
    considerIf: 'You want a proven, budget carrier from an established brand',
    image: { src: 'https://m.media-amazon.com/images/I/719971mj1eL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Amazon Basics soft-sided airline carrier' },
  },
  {
    id: 'petsfit-soft-sided-airline-carrier',
    asin: 'B0BZ8344GP',
    name: 'PETSFIT Soft-Sided Airline Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0BZ8344GP/?tag=chill-dogs-20',
    bullets: [
      'Shorter shell fits in tighter under-seat spaces',
      'Top opening, two side doors, shoulder strap, and luggage-pass-through make airport handling easier',
      'Includes a removable fleece mat and locking zippers for a more travel-ready setup',
    ],
    bestFor: 'Small dogs who need a compact carrier with easier airport handling than a basic two-door bag',
    whyItWorks: 'The shorter shell, luggage sleeve, and multi-door access make it practical for terminal use',
    considerIf: 'You want a compact carrier for a small dog and care about luggage-handle compatibility as much as in-cabin fit',
    image: { src: 'https://m.media-amazon.com/images/I/71HK16AZbXL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'PETSFIT soft-sided airline carrier' },
  },
  {
    id: 'lekereise-frontier-southwest-carrier',
    asin: 'B0F53SPX18',
    name: 'Lekereise Frontier & Southwest Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0F53SPX18/?tag=chill-dogs-20',
    bullets: [
      'Designed to meet Frontier and Southwest under-seat dimension specifications',
      'Top expansion panel adds extra room after boarding without requiring side clearance',
      'Locking zippers and anti-scratch mesh make it a good choice for dogs that paw at soft carriers',
    ],
    bestFor: 'Small dogs flying on airlines with flatter under-seat profiles such as Frontier or Southwest',
    whyItWorks: 'The lower, wider shape gives you a more airline-specific fit',
    considerIf: 'You need a soft-sided carrier for a small dog that prefers to sit or stand during travel',
    image: { src: 'https://m.media-amazon.com/images/I/81MjgtZtakL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Lekereise Frontier and Southwest airline carrier' },
  },
  {
    id: 'pidipiti-budget-airline-carrier',
    asin: 'B0F48LRQ4X',
    name: 'pidipiti Frontier & Allegiant Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0F48LRQ4X/?tag=chill-dogs-20',
    bullets: [
      'Very low profile meets Frontier, Allegiant, and Breeze under-seat dimension specifications',
      'Top expansion adds some breathing room once the carrier is stowed and the plane is in flight',
      'Built specifically for very small dogs',
    ],
    bestFor: 'Tiny dogs whose carriers need to fit in small spaces',
    whyItWorks: 'Its unusually low profile allows it to fit in small spaces',
    considerIf: 'Your dog is genuinely tiny and you want a compact carrier for shallow under-seat spaces',
    image: { src: 'https://m.media-amazon.com/images/I/719dVzV+OOL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'pidipiti Frontier and Allegiant airline carrier' },
  },
  {
    id: 'jespet-compact-airline-carrier',
    asin: 'B077Y7SZQW',
    name: 'JESPET Compact Airline Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B077Y7SZQW/?tag=chill-dogs-20',
    bullets: [
      'Narrow profile is useful for very small dogs that do not need a wider bag',
      'Top zipper access and multiple side openings make it easier to check on a dog in transit',
      'Seat-belt loop and side pocket add practical travel features without increasing the size of the bag',
    ],
    bestFor: 'Teacup and very small dogs that fit in narrower soft-sided carriers',
    whyItWorks: 'The slim bag profile has sufficient room for tiny dogs while still providing ventilation, quick-access openings, and a practical airport-friendly design',
    considerIf: 'Your dog is under about 8 pounds or simply fits better in a more narrow carrier',
    image: { src: 'https://m.media-amazon.com/images/I/715fH6bOkSL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'JESPET compact airline carrier' },
  },
  {
    id: 'petami-dog-purse-carrier',
    asin: 'B0BC33TBYR',
    name: 'PetAmi Dog Purse Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0BC33TBYR/?tag=chill-dogs-20',
    bullets: [
      'Tote-bag style blends a handbag profile with a ventilated soft-sided carrier shell',
      'Front and rear pockets make it easier to carry treats, documents, and small travel essentials in one bag',
      'Removable sherpa-lined bed and top-opening design help small dogs settle more comfortably once inside',
    ],
    bestFor: 'Very small dogs and owners who want a tote-style carrier with built in storage',
    whyItWorks: 'It gives you the convenience of a purse-style carrier without sacrificing the basics that matter for flights: airflow, structure, and under-seat-friendly proportions',
    considerIf: 'You want a softer handbag-style look for a small dog and still need pockets, ventilation, and an airline-travel-friendly footprint',
    image: { src: 'https://m.media-amazon.com/images/I/818qa6V-TgL._AC_SX300_SY300_QL70_FMwebp_.jpg', alt: 'PetAmi dog purse carrier' },
  },
  {
    id: 'lasaviin-dog-carrier-purse',
    asin: 'B0D6R2NDK5',
    name: 'Lasaviin Dog Carrier Purse',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0D6R2NDK5/?tag=chill-dogs-20',
    bullets: [
      'Slim footprint looks more like a tote than a boxy travel carrier',
      'Three-side mesh ventilation and a wide top opening make it more practical than many fashion-first pet purses',
      'Multiple small pockets and lightweight vegan leather construction work well for short travel days with tiny dogs',
    ],
    bestFor: 'Tiny dogs whose owners want a lighter tote-style carrier with a cleaner everyday look',
    whyItWorks: 'It keeps the tote-style profile narrow while allowing enough ventilation and access to make it useful for short in-cabin travel',
    considerIf: 'Your dog is about 10 pounds or lighter and you want a soft-sided carrier that feels closer to a purse than a standard travel bag',
    image: { src: 'https://m.media-amazon.com/images/I/71XupbJZnVL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Lasaviin dog carrier purse' },
  },

  // ── Travel Bags ───────────────────────────────────────────────────────────

  {
    id: 'fct-dog-travel-backpack',
    asin: 'B0F8H5ZVYC',
    name: 'FCT Dog Travel Backpack',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B0F8H5ZVYC/?tag=chill-dogs-20',
    bullets: [
      'Multiple pockets organize food, treats, collapsible bowl, leash, and documents in separate compartments',
      'Main carry pocket is large enough for a day\'s worth of supplies without overpacking',
      'Padded back panel and adjustable straps make it comfortable to carry through long airport terminals',
    ],
    bestFor: 'Travelers who want a dedicated day-of-flight backpack with clear compartment separation',
    whyItWorks: 'Dedicated sections for dog gear prevent digging through a general bag at security or boarding, keeping paperwork and essentials accessible when you need them',
    considerIf: 'You prefer a backpack carry style and want everything organized and reachable without opening multiple bags',
    image: { src: 'https://m.media-amazon.com/images/I/61RB5siFcXL._SL500_.jpg', alt: 'FCT Dog Travel Backpack' },
  },
  {
    id: 'igolumon-dog-travel-bag',
    asin: 'B0D1C7LTPF',
    name: 'Igolumon Dog Travel Bag',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B0D1C7LTPF/?tag=chill-dogs-20',
    bullets: [
      'Rollable tote design collapses flat when not in use and expands to carry a full weekend\'s worth of dog gear',
      'Interior organizer keeps bowls, treats, medications, and documents separated without extra pouches',
      'Doubles as an under-seat personal item on many airlines when lightly packed',
    ],
    bestFor: 'Short-trip travelers who want one bag that handles both the flight and the stay at the destination',
    whyItWorks: 'Roll-flat construction stores easily between trips without sacrificing carry capacity when you need it',
    considerIf: 'You pack light and want a single tote that functions as your carry-on bag and fits under the seat',
    image: { src: 'https://m.media-amazon.com/images/I/81rNHYHsJaL._SL500_.jpg', alt: 'Igolumon Dog Travel Bag' },
  },
  {
    id: 'delomo-dog-travel-backpack',
    asin: 'B0B7XM2JF4',
    name: 'DELOMO Dog Travel Backpack',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B0B7XM2JF4/?tag=chill-dogs-20',
    bullets: [
      'Six-compartment layout with labeled sections for food, treats, bowls, leash, waste bags, and paperwork',
      'Insulated food pocket keeps kibble dry and separated from other gear throughout a long travel day',
      'Fits comfortably over rolling luggage handle so you don\'t have to carry it through the airport',
    ],
    bestFor: 'Organized packers who want every item in its own dedicated spot for fast access during travel',
    whyItWorks: 'Pre-assigned compartments are convenient for check-in, security, and boarding',
    considerIf: 'You tend to overpack and want a bag that enforces organization through its structure',
    image: { src: 'https://m.media-amazon.com/images/I/81OVQqFgiUL._SL500_.jpg', alt: 'DELOMO Dog Travel Backpack' },
  },
  {
    id: 'mancro-dog-travel-bag',
    asin: 'B0BQ6R7SDB',
    name: 'Mancro Dog Travel Bag',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B0BQ6R7SDB/?tag=chill-dogs-20',
    bullets: [
      'Compact tote handles the essentials — bowl, leash, treats, waste bags — without excess bulk or weight',
      'Zipper top keeps contents secure in overhead bins or under seats',
      'Price point makes it a practical choice for many fliers',
    ],
    bestFor: 'Budget-conscious travelers who need a reliable dog kit bag without paying for extra features',
    whyItWorks: 'It includes everything you need for the flight and the duration of your trip',
    considerIf: 'You fly occasionally and want a simple, affordable dedicated dog bag rather than a feature-heavy backpack',
    image: { src: 'https://m.media-amazon.com/images/I/81ILyFK9lxL._SL500_.jpg', alt: 'Mancro Dog Travel Bag' },
  },
  {
    id: 'baglher-dog-travel-backpack',
    asin: 'B08CXHLV4C',
    name: 'Baglher Dog Travel Backpack',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B08CXHLV4C/?tag=chill-dogs-20',
    bullets: [
      'Large main compartment with internal dividers organizes supplies for multi-day trips',
      'Side pockets accommodate a water bottle and collapsible bowl without opening the main compartment',
      'Padded shoulder straps and chest clip distribute weight comfortably during long transit days',
    ],
    bestFor: 'Multi-day travelers who need a backpack that carries supplies for several days, not just a one-way flight',
    whyItWorks: 'Larger capacity and internal dividers make it practical for weekend trips where you\'re packing food, medications, and gear for multiple days away',
    considerIf: 'Your trips last more than one night and you want one bag that handles everything from the flight through the stay',
    image: { src: 'https://m.media-amazon.com/images/I/714XDoYmSiL._SL500_.jpg', alt: 'Baglher Dog Travel Backpack' },
  },
  {
    id: 'petami-dog-travel-backpack',
    asin: 'B08CS2B781',
    name: 'PetAmi Dog Travel Backpack',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B08CS2B781/?tag=chill-dogs-20',
    bullets: [
      'Well-reviewed backpack with multiple pockets for day-of supplies, treats, bowls, and documents',
      'Water-resistant exterior keeps contents dry during outdoor transit between gate and ground transportation',
      'Luggage strap on back slides over rolling bag handles for hands-free airport navigation',
    ],
    bestFor: 'Frequent flyers who want a proven backpack with practical airport features',
    whyItWorks: 'Water-resistant construction and luggage pass-through strap are convenient for airport travel',
    considerIf: 'You want a backpack with a solid track record and practical features for moving through airports efficiently',
    image: { src: 'https://m.media-amazon.com/images/I/A1t1j1QO7NL._SL500_.jpg', alt: 'PetAmi Dog Travel Backpack' },
  },
  {
    id: 'mobile-dog-gear-day-tote',
    asin: 'B072LMBZGJ',
    name: 'Mobile Dog Gear Day Tote',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B072LMBZGJ/?tag=chill-dogs-20',
    bullets: [
      'Tote format fits comfortably under airline seats without the bulk of a backpack',
      'Stocked with a collapsible silicone bowl, water bottle, treat bag, and waste bag dispenser',
      'Sewn-in organization keeps included accessories in place during transit',
    ],
    bestFor: 'Travelers who prefer a tote over a backpack and want a bag that comes with useful accessories',
    whyItWorks: 'It comes pre-organized with practical accessories',
    considerIf: 'You find backpack straps uncomfortable during long travel days and prefer a tote you can drop and pick up easily',
    image: { src: 'https://m.media-amazon.com/images/I/71aib5MhqvL._SL500_.jpg', alt: 'Mobile Dog Gear Day Tote' },
  },
  {
    id: 'mobile-dog-gear-week-away',
    asin: 'B072PP482P',
    name: 'Mobile Dog Gear Week Away Bag',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B072PP482P/?tag=chill-dogs-20',
    bullets: [
      'Sized for week-long trips with separate compartments for food, gear, documents, and waste supplies',
      'Includes collapsible bowls, treat bag, waste bag dispenser, and food carrier in a single organized system',
      'Duffel-style carry with both shoulder strap and handles for flexibility in different transit environments',
    ],
    bestFor: 'Extended trip travelers who want a single, fully organized system for a week or more of dog supplies',
    whyItWorks: 'Full-week capacity with included accessories, so you don\'t have to assemble a kit piece by piece.',
    considerIf: 'You travel for a week or more at a time and want a bag that carries sufficient supplies so you don\'t have to restock mid-trip.',
    image: { src: 'https://m.media-amazon.com/images/I/81em6fyVBFL._SL500_.jpg', alt: 'Mobile Dog Gear Week Away Bag' },
  },
  {
    id: 'clawist-dog-travel-bag',
    asin: 'B0G64FN8VQ',
    name: 'Clawist Dog Travel Bag',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B0G64FN8VQ/?tag=chill-dogs-20',
    bullets: [
      'Slim profile fits under most airline seats as a personal item without using carry-on overhead space',
      'Quick-access front pocket keeps leash, treats, and boarding documents reachable without opening the main compartment',
      'Includes a lightweight collapsible bowl that tucks into a dedicated side pocket',
    ],
    bestFor: 'Minimalist travelers who want a slim, under-seat bag that doesn\'t take up carry-on overhead space',
    whyItWorks: 'Slim design that qualifies as a personal item fits comfortably under the seat and keeps dog supplies within reach',
    considerIf: 'You bring a carry-on bag on every flight and need the dog gear to fit under the seat without competing for overhead space',
    image: { src: 'https://m.media-amazon.com/images/I/71VR8shgxpL._SL500_.jpg', alt: 'Clawist Dog Travel Bag' },
  },
  {
    id: 'anild-dog-travel-backpack',
    asin: 'B0F5B5VZPG',
    name: 'Anild Dog Travel Backpack',
    category: 'travel-bags',
    amazonUrl: 'https://www.amazon.com/dp/B0F5B5VZPG/?tag=chill-dogs-20',
    bullets: [
      'Thoughtfully sized main compartment carries food, treats, collapsible gear, and documents',
      'Multiple exterior pockets keep frequently used items like leash and waste bags accessible',
      'Durable construction holds up to repeated trips without zippers or seams failing under normal airport use',
    ],
    bestFor: 'Regular flyers who want a durable backpack that holds up across many trips without showing wear',
    whyItWorks: 'Emphasis on durability and practical pocket placement makes it a reliable option for multiple uses',
    considerIf: 'You fly with your dog several times a year, and you want a functional and organized bag that holds up trip after trip',
    image: { src: 'https://m.media-amazon.com/images/I/81gA-nAEDcL._SL500_.jpg', alt: 'Anild Dog Travel Backpack' },
  },
];

export function getRelaxationProductsByCategory(category: RelaxationProductCategory): RelaxationProduct[] {
  return relaxationProducts.filter((p) => p.category === category);
}
