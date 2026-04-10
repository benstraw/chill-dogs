export type RelaxationProductCategory = 'calming-beds' | 'orthopedic-beds' | 'crates' | 'travel-beds';

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

  // ── Travel Beds ───────────────────────────────────────────────────────────

  {
    id: 'onetigris-travel-dog-bed',
    asin: 'B0B6YYPYC4',
    name: 'OneTigris Travel Dog Bed',
    category: 'travel-beds',
    amazonUrl: 'https://www.amazon.com/dp/B0B6YYPYC4/?tag=chill-dogs-20',
    bullets: [
      'Sleeping-bag style packs down to near water-bottle size — fits in any bag, suitcase, or cargo area',
      'Waterproof, anti-slip base stays put on hotel floors, tent floors, and hard surfaces',
      'Cushioned plush interior gives dogs a consistent, familiar sleep surface at every stop',
    ],
    bestFor: 'Dogs who travel frequently and need a packable but genuinely comfortable off-road sleep surface',
    whyItWorks:
      'A consistent sleep surface at every stop reduces novelty stress — dogs settle faster when their bed smells and feels the same whether it\'s night 1 or night 10',
    considerIf:
      'You want a travel bed that takes up almost no space but still gives your dog a proper sleep surface instead of a folded blanket',
    image: { src: 'https://m.media-amazon.com/images/I/71riy3hJGtL._SL500_.jpg', alt: 'OneTigris Travel Dog Bed' },
  },

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
    id: 'midwest-icrate',
    asin: 'B000QFT1RC',
    name: 'MidWest iCrate Dog Crate',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B000QFT1RC/?tag=chill-dogs-20',
    bullets: [
      'Includes a divider panel so the usable crate space can grow with a puppy',
      'Folding wire design is easy to move, store, or reposition around the house',
      'A practical budget-friendly starting point for standard puppy crate training',
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
      'A stronger choice when the price gap is small or the puppy is especially active',
    ],
    bestFor: 'Owners who want a sturdier wire crate for a strong or active puppy',
    whyItWorks:
      'It keeps the same divider-based training logic as iCrate but uses a heavier build for extra durability',
    considerIf:
      'You do not mind extra weight and want the crate that feels more solid between the two Midwest options',
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
      'Enclosed plastic shell reduces visual stimulation compared with open wire crates',
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
      'Designed around car travel with seat belt straps and a headrest loop for back-seat setup',
      'Collapsible soft-sided format folds flat for storage between road trips',
      'Mesh windows, dual side doors, storage pockets, and waterproof fleece pad support long-drive convenience',
    ],
    bestFor: 'Road trips where you want a travel-specific crate that is easier to pack than a standard indoor crate',
    whyItWorks:
      'It is built around car-use details rather than house-training, making it the cleanest all-around road trip pick',
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
    bestFor: 'Crate-trained dogs who travel well and benefit from multiple access points',
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
