export type RelaxationProductCategory = 'calming-beds' | 'orthopedic-beds' | 'crates' | 'travel-beds' | 'carriers' | 'travel-bags';

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
      'Decorative wood look is easier to live with than a basic wire crate',
      'Adjustable bowls and name tag add home-use convenience details',
    ],
    bestFor: 'Owners who want furniture-crate styling without a long assembly process',
    whyItWorks:
      'The foldable no-assembly format removes one of the biggest friction points in buying crate furniture',
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
      'The rotating bowls and foldable format give it a more functional day-to-day setup than decorative crates that focus only on appearance',
    considerIf:
      'You want furniture styling plus practical home-use features instead of just a crate that looks like an end table',
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
      'Aimed at large dogs that still need an indoor crate with a finished look',
    ],
    bestFor: 'Large dogs when you want furniture styling',
    whyItWorks:
      'It keeps the visual upgrade of crate furniture while offering more space and stronger structure for larger breeds',
    considerIf:
      'You need a larger indoor crate that still has storage and room-friendly furniture styling',
    image: { src: 'https://m.media-amazon.com/images/I/91-pfSgJ5dL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'IRONCK Extra Large Dog Crate Furniture' },
  },
  {
    id: 'bifanuo-dog-crate-furniture',
    asin: 'B0GJ66SX32',
    name: 'Bifanuo Dog Crate Furniture',
    category: 'crates',
    amazonUrl: 'https://www.amazon.com/dp/B0GJ66SX32/?tag=chill-dogs-20',
    bullets: [
      'Small decorative crate is framed as both pet house and side table',
      'Lockable enclosure supports indoor or sheltered outdoor placement',
      'Plastic-heavy decorative build gives it a different feel than wood furniture crates',
    ],
    bestFor: 'Small-dog owners who want a compact decorative kennel with a side-table footprint',
    whyItWorks:
      'It blends basic containment with a lighter decorative form factor for compact spaces',
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
      'The charging station turns it into genuinely useful room furniture instead of a decorative crate that only looks the part',
    considerIf:
      'You want the crate in a bedroom or living room and the charging-station feature would actually get used every day',
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
      'It sits between standard crate furniture and true heavy-duty crates, giving more structure without abandoning the decorative look',
    considerIf:
      'Your dog needs more strength than a lightweight furniture crate but you still want the crate to fit a finished room',
    image: { src: 'https://m.media-amazon.com/images/I/81VFBYh3TmL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Oranland Heavy Duty Dog Crate Furniture' },
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
      'You need true XXL sizing and a stronger build at the same time',
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
    name: 'Sherpa Original Deluxe Travel Pet Carrier, Medium',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B000FLETX8/?tag=chill-dogs-20',
    bullets: [
      'Guaranteed On Board program means Sherpa will replace the carrier if an airline rejects it at the gate',
      'Spring wire frame lets the bag compress to fit under the seat, then spring back to full shape after boarding',
      'Mesh panels on three sides give ventilation and line-of-sight, and a fleece liner is included for the floor',
    ],
    bestFor: 'Dogs flying in cabin who need a proven, airline-accepted soft-sided carrier',
    whyItWorks: 'The Guaranteed On Board program removes the biggest gamble in carrier buying — if an airline rejects it, Sherpa replaces it',
    considerIf: 'Your dog weighs under 16 lb and you want the most established in-cabin carrier on the market',
    image: { src: 'https://m.media-amazon.com/images/I/81gqQnt7waL._SL500_.jpg', alt: 'Sherpa Original Deluxe Travel Pet Carrier Medium' },
  },
  {
    id: 'sherpa-delta-airlines-carrier-medium',
    asin: 'B000633ZOY',
    name: 'Sherpa Delta Airlines Travel Pet Carrier, Medium',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B000633ZOY/?tag=chill-dogs-20',
    bullets: [
      'Sized and approved specifically for Delta Airlines in-cabin pet travel (18" x 11" x 10.5")',
      'Spring wire frame compresses to slide under the seat and returns to shape once stowed',
      'Mesh on three sides keeps airflow moving; removable fleece liner is washable',
    ],
    bestFor: 'Delta flyers who want a carrier confirmed to match Delta\'s specific under-seat dimensions',
    whyItWorks: 'Built to Delta\'s published dimensions, which differ from many other carriers — eliminates the guesswork of measuring and converting',
    considerIf: 'You fly Delta regularly and want a carrier purpose-built for their specific size requirements',
    image: { src: 'https://m.media-amazon.com/images/I/81ucY2o1GlL._AC_SL1500_.jpg', alt: 'Sherpa Delta Airlines Travel Pet Carrier Medium' },
  },
  {
    id: 'mr-peanuts-expandable-carrier',
    asin: 'B06Y5SB51H',
    name: "Mr. Peanut's Expandable Airline Approved Soft-Sided Pet Carrier",
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B06Y5SB51H/?tag=chill-dogs-20',
    bullets: [
      'Side panel unzips to expand the carrier once the plane is at cruising altitude, giving your dog more room mid-flight',
      'Padded shoulder strap and top handle make airport transit easier when juggling boarding documents',
      'Multiple mesh windows on all four sides maximize airflow in a closed cabin environment',
    ],
    bestFor: 'Dogs who do better with more space during the flight itself, not just at the gate',
    whyItWorks: 'The expansion panel lets the carrier meet under-seat requirements at boarding while giving your dog extra room once you\'re in the air',
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
      'Meets major airline under-seat dimensions at 18" x 11" x 11" in compressed configuration',
      'Removable and washable fleece mat is included; exterior pocket fits documents and treats',
    ],
    bestFor: 'Owners who want maximum flexibility in how the carrier expands during the flight',
    whyItWorks: 'Two-direction expansion gives more options for cramped seat configurations where one side may be blocked by the seat leg',
    considerIf: 'You want both top and side expansion options and prefer a newer brand at a lower price point than Sherpa',
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
      'Base dimensions of 18" x 11" x 11" meet most major airline under-seat requirements',
      'Mesh on three sides plus a top mesh window provide ventilation from multiple angles',
    ],
    bestFor: 'Dogs who prefer to sit upright rather than lie flat during flights',
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
      'Designed to meet Delta, American, and United under-seat dimensions at 18" x 11" x 11"',
      'Two-way zipper and breathable mesh panels on three sides keep the interior comfortable during a long boarding wait',
    ],
    bestFor: 'Flyers on the big three U.S. airlines who want a top-expanding carrier confirmed against published dimension requirements',
    whyItWorks: 'Marketed against Delta, American, and United\'s published dimensions specifically, giving more airline-specific confidence than generic "airline approved" labeling',
    considerIf: 'You want an affordable top-expanding option and frequently fly Delta, American, or United',
    image: { src: 'https://m.media-amazon.com/images/I/81MjgtZtakL._SL500_.jpg', alt: 'Lekereise Top-Expandable Pet Carrier' },
  },
  {
    id: 'siivton-4way-expandable-carrier',
    asin: 'B07FY4PNTY',
    name: 'Siivton 4-Way Expandable Pet Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B07FY4PNTY/?tag=chill-dogs-20',
    bullets: [
      '4-way expansion opens on top, both sides, and the front — the most expansion options of any carrier on this list',
      'Base dimensions of 18" x 11" x 11" fit under most airline seats; expansion is used after boarding',
      'Multiple entry points mean you can load or check on your dog from whatever angle is accessible mid-flight',
    ],
    bestFor: 'Dogs who need the most in-flight space possible within an under-seat carrier',
    whyItWorks: 'Four-directional expansion gives the most room to customize based on your specific seat configuration and your dog\'s preferred position',
    considerIf: 'You have a dog that struggles with confinement and want maximum in-flight flexibility after the carrier is stowed',
    image: { src: 'https://m.media-amazon.com/images/I/81w9IJI-lML._SL500_.jpg', alt: 'Siivton 4-Way Expandable Pet Carrier' },
  },
  {
    id: 'henkelion-airline-carrier',
    asin: 'B08CDJZBG6',
    name: 'Henkelion Pet Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B08CDJZBG6/?tag=chill-dogs-20',
    bullets: [
      'Airline-approved dimensions of 17" x 11" x 11" at a lower price point than most expandable options',
      'Mesh panels on both sides and the top keep airflow moving without relying on expansion',
      'Two entry options (top and front) make it easier to load a reluctant dog in a busy airport',
    ],
    bestFor: 'Budget-conscious travelers who need a straightforward airline-approved carrier without expansion features',
    whyItWorks: 'Covers the basics — correct dimensions, mesh ventilation, two-door loading — at a price that doesn\'t require committing to a premium carrier for an occasional flight',
    considerIf: 'You fly infrequently and want a reliable, no-frills carrier without paying for expansion features you may rarely use',
    image: { src: 'https://m.media-amazon.com/images/I/71GV5YYQXIL._SL500_.jpg', alt: 'Henkelion Pet Carrier' },
  },
  {
    id: 'vceoa-soft-sided-carrier',
    asin: 'B07ZPPSR2L',
    name: 'Vceoa Soft-Sided Pet Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B07ZPPSR2L/?tag=chill-dogs-20',
    bullets: [
      'Dimensions of 17.5" x 11" x 11" fit under most airline seats for in-cabin travel',
      'Mesh windows on three sides plus a roll-up front panel give ventilation and visibility without expansion',
      'Padded shoulder strap and removable fleece mat included; folds flat for storage when not traveling',
    ],
    bestFor: 'Occasional flyers who want a simple soft-sided carrier that folds flat between trips',
    whyItWorks: 'Fold-flat design makes it practical to store without dedicating closet space, while still meeting standard airline under-seat dimensions',
    considerIf: 'You travel a few times a year and want a carrier that packs away easily rather than occupying permanent shelf space',
    image: { src: 'https://m.media-amazon.com/images/I/612Kkc5U+nL._SL500_.jpg', alt: 'Vceoa Soft-Sided Pet Carrier' },
  },
  {
    id: 'amazon-basics-soft-sided-carrier',
    asin: 'B00QHC0050',
    name: 'Amazon Basics Soft-Sided Airline Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B00QHC0050/?tag=chill-dogs-20',
    bullets: [
      'Compact 16.5" x 10.6" x 11" footprint is easier to fit under seats than bulkier carriers',
      'Removable fleece pad is machine washable, which keeps cleanup simple between flights',
      'Front and top openings plus a shoulder strap cover the basics without overcomplicating the bag',
    ],
    bestFor: 'Small dogs whose owners want a simple, lower-cost in-cabin carrier from a familiar brand',
    whyItWorks: 'It stays focused on the features most travelers actually use: a compact shell, mesh airflow, easy loading, and a washable floor pad',
    considerIf: 'You want a researched budget carrier for occasional flights and do not need expansion panels or a tote-style look',
    image: { src: 'https://m.media-amazon.com/images/I/719971mj1eL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Amazon Basics soft-sided airline carrier' },
  },
  {
    id: 'petsfit-soft-sided-airline-carrier',
    asin: 'B0BZ8344GP',
    name: 'PETSFIT Soft-Sided Airline Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0BZ8344GP/?tag=chill-dogs-20',
    bullets: [
      'Shorter 17" x 10.25" x 10.25" shell is easier to compare against tighter under-seat limits',
      'Top opening, two side doors, shoulder strap, and luggage-pass-through make airport handling easier',
      'Includes a removable fleece mat and locking zippers for a more travel-ready setup',
    ],
    bestFor: 'Small dogs who need a compact carrier with easier airport handling than a basic two-door bag',
    whyItWorks: 'The shorter shell, luggage sleeve, and multi-door access make it more practical for real terminal use than many similarly priced carriers',
    considerIf: 'You want a compact carrier for small dogs and care about luggage-handle compatibility as much as in-cabin fit',
    image: { src: 'https://m.media-amazon.com/images/I/71HK16AZbXL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'PETSFIT soft-sided airline carrier' },
  },
  {
    id: 'lekereise-frontier-southwest-carrier',
    asin: 'B0F53SPX18',
    name: 'Lekereise Frontier & Southwest Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0F53SPX18/?tag=chill-dogs-20',
    bullets: [
      '18" x 13" x 9.5" shape is marketed around Frontier and Southwest under-seat limits rather than the taller 18" x 11" x 11" standard',
      'Top expansion panel adds extra room after boarding without requiring side clearance',
      'Locking zippers and anti-scratch mesh make it a stronger fit for dogs that paw at soft carriers',
    ],
    bestFor: 'Small dogs flying on airlines with flatter under-seat profiles such as Frontier or Southwest',
    whyItWorks: 'The lower, wider shape gives you a more airline-specific fit when a tall 11-inch carrier feels like too much of a gamble',
    considerIf: 'You need a soft-sided carrier for a small dog and want to compare against tighter budget-airline dimensions before flying',
    image: { src: 'https://m.media-amazon.com/images/I/81MjgtZtakL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'Lekereise Frontier and Southwest airline carrier' },
  },
  {
    id: 'pidipiti-budget-airline-carrier',
    asin: 'B0F48LRQ4X',
    name: 'pidipiti Frontier & Allegiant Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0F48LRQ4X/?tag=chill-dogs-20',
    bullets: [
      'Very low 17" x 13" x 8" profile is aimed at Frontier, Allegiant, and Breeze style under-seat limits',
      'Top expansion adds some breathing room once stowed, which matters when the compressed height is only 8 inches',
      'Built specifically for extra-small dogs rather than trying to stretch one carrier across every size use case',
    ],
    bestFor: 'Extra-small dogs and owners shopping for a budget-airline-style under-seat fit',
    whyItWorks: 'Its value is the unusually low profile: this is the kind of carrier you compare when mainstream 11-inch-tall bags look risky for your route',
    considerIf: 'Your dog is genuinely tiny and you want a compact carrier to compare against stricter or shallower under-seat spaces',
    image: { src: 'https://m.media-amazon.com/images/I/719dVzV+OOL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'pidipiti Frontier and Allegiant airline carrier' },
  },
  {
    id: 'jespet-compact-airline-carrier',
    asin: 'B077Y7SZQW',
    name: 'JESPET Compact Airline Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B077Y7SZQW/?tag=chill-dogs-20',
    bullets: [
      'Narrow 17" x 9" x 11.5" profile is useful for very small dogs that do not need a wider bag',
      'Top zipper access and multiple side openings make it easier to check on a dog in transit',
      'Seat-belt loop and side pocket add practical travel features without pushing the size up',
    ],
    bestFor: 'Teacup and very small dogs that need a narrower soft-sided carrier',
    whyItWorks: 'The slimmer body wastes less space on tiny dogs while still giving you ventilation, quick-access openings, and a practical airport-friendly format',
    considerIf: 'Your dog is under about 8 pounds or simply fits better in a narrower carrier than in the standard 11-inch-wide options',
    image: { src: 'https://m.media-amazon.com/images/I/715fH6bOkSL._AC_SY300_SX300_QL70_FMwebp_.jpg', alt: 'JESPET compact airline carrier' },
  },
  {
    id: 'petami-dog-purse-carrier',
    asin: 'B0BC33TBYR',
    name: 'PetAmi Dog Purse Carrier',
    category: 'carriers',
    amazonUrl: 'https://www.amazon.com/dp/B0BC33TBYR/?tag=chill-dogs-20',
    bullets: [
      'Tote-style 17" x 8" x 11" shape blends a handbag profile with a ventilated soft-sided carrier shell',
      'Front and rear pockets make it easier to carry treats, documents, and small travel essentials in one bag',
      'Removable sherpa-lined bed and top-opening design help small dogs settle more comfortably once inside',
    ],
    bestFor: 'Very small dogs and owners who want a tote-style carrier with real storage built in',
    whyItWorks: 'It gives you the convenience of a purse-style carrier without dropping the basics that still matter for flights: airflow, structure, and under-seat-friendly proportions',
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
      'Slim 16" x 7" x 11.5" footprint keeps the bag visually closer to a tote than a boxy travel carrier',
      'Three-side mesh ventilation and a wide top opening keep it more practical than many fashion-first pet purses',
      'Multiple small pockets and lightweight vegan leather construction work well for short travel days with tiny dogs',
    ],
    bestFor: 'Tiny dogs whose owners want a lighter tote-style carrier with a cleaner everyday look',
    whyItWorks: 'It keeps the tote-style profile narrow while still giving enough mesh ventilation and top access to stay usable for short in-cabin travel',
    considerIf: 'Your dog is under about 10 pounds and you want a soft-sided carrier that feels closer to a purse than a standard travel bag',
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
