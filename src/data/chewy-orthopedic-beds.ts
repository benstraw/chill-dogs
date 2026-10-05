import { createChewyAffiliateLinkWithBase } from '../lib/affiliate/chewy';
import type { AffiliateOffer, ProductVariantGroup } from './products/types';
import type { RelaxationProduct } from './relaxation-products';

/**
 * Chewy-only orthopedic beds for /comforting/best-orthopedic-dog-beds/ (issues #380, #381).
 *
 * Every bed is sold on Chewy as a family of per-size listings, so each record carries a size
 * `variantGroup`. The default variant is the listing the issue linked, and `offers` mirrors it.
 * Sizes are limited to the default colour and to listings Chewy showed as in stock when the
 * catalog was pulled; names, bullets and images are hand-written review copy, not provider text.
 */

const CHEWY_TRACKING_BASE = 'https://chewy.sjv.io/c/7067825/3054490/32975';
const PAGE_SLUG = 'best-orthopedic-dog-beds';

function chewyOffer(canonicalUrl: string): AffiliateOffer {
  return {
    merchant: 'chewy',
    merchantProductId: canonicalUrl.match(/\/dp\/(\d+)/)?.[1],
    canonicalUrl,
    url: createChewyAffiliateLinkWithBase(CHEWY_TRACKING_BASE, canonicalUrl, {
      articleSlug: PAGE_SLUG,
      placement: 'product-card',
    }),
    status: 'active',
  };
}

const sizeAxis = { id: 'dog-size', label: 'Size', hint: 'Measure your dog before choosing' } as const;

export const chewyOrthopedicBeds: RelaxationProduct[] = [
  {
    id: 'eheyciga-waterproof-sofa-bed',
    name: 'EHEYCIGA Waterproof Memory Foam Sofa Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/eheyciga-waterproof-memory-foam/dp/3816406')],
    bullets: [
      'Memory-foam base with an egg-crate layer gives joints a contoured surface and helps air move under the dog',
      'Raised sides give dogs that like to curl up, or lean on something, a secure edge',
      'Removable machine-washable cover and a non-slip bottom keep it easy to clean and steady on hard floors',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/06972834-3e06-7221-8000-1565897e4320._AC_SS500_V1_.jpg', alt: 'EHEYCIGA Waterproof Memory Foam Sofa Dog Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: '44x32-in',
      variants: [
        {
          id: '36x27-in',
          label: '36 × 27 in',
          offers: [chewyOffer('https://www.chewy.com/eheyciga-waterproof-memory-foam/dp/3816662')],
        },
        {
          id: '41x27-in',
          label: '41 × 27 in',
          offers: [chewyOffer('https://www.chewy.com/eheyciga-waterproof-memory-foam/dp/3816590')],
        },
        {
          id: '44x32-in',
          label: '44 × 32 in',
          offers: [chewyOffer('https://www.chewy.com/eheyciga-waterproof-memory-foam/dp/3816406')],
        },
        {
          id: '48x35-in',
          label: '48 × 35 in',
          offers: [chewyOffer('https://www.chewy.com/eheyciga-waterproof-memory-foam/dp/3816534')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'eheyciga-high-back-sofa-bed',
    name: 'EHEYCIGA High-Back Memory Foam Sofa Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/eheyciga-memory-foam-orthopedic/dp/3816182')],
    bullets: [
      'Three-sided bolster and a high back support the head and neck for dogs that like to sleep propped up',
      'Memory foam over an egg-crate layer, topped with a soft striped fleece cover',
      'Reversible machine-washable cover has an internal waterproof layer, and the non-slip bottom keeps the bed in place',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/069f4ffe-ed94-7269-8000-a729bf665359._AC_SS500_V1_.jpg', alt: 'EHEYCIGA High-Back Memory Foam Sofa Dog Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: '42x30-in',
      variants: [
        {
          id: '36x27-in',
          label: '36 × 27 in',
          offers: [chewyOffer('https://www.chewy.com/eheyciga-memory-foam-orthopedic/dp/3816142')],
        },
        {
          id: '41x27-in',
          label: '41 × 27 in',
          offers: [chewyOffer('https://www.chewy.com/eheyciga-memory-foam-orthopedic/dp/3816270')],
        },
        {
          id: '42x30-in',
          label: '42 × 30 in',
          offers: [chewyOffer('https://www.chewy.com/eheyciga-memory-foam-orthopedic/dp/3816182')],
        },
        {
          id: '45x35-in',
          label: '45 × 35 in',
          offers: [chewyOffer('https://www.chewy.com/eheyciga-memory-foam-orthopedic/dp/3816222')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'noah-paw-velvet-orthopedic-bed',
    name: 'Noah & Paw Velvet Orthopedic Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/noah-paw-velvet-collection-orthopedic/dp/1971958')],
    bullets: [
      'Seven-inch-thick foam base is aimed at older dogs and larger breeds that need deeper support',
      'Cooling-gel top layer of foam with a waterproof lining under a removable, machine-washable cover',
      'Heavy-duty zippers with zipper covers make it harder for chewers to get at the cover',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/068a8cd6-84cd-7eda-8000-615031c76b88._AC_SS500_V1_.jpg', alt: 'Noah & Paw Velvet Orthopedic Dog Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: 'large',
      variants: [
        {
          id: 'small',
          label: 'Small',
          offers: [chewyOffer('https://www.chewy.com/noah-paw-velvet-collection-orthopedic/dp/1971886')],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [chewyOffer('https://www.chewy.com/noah-paw-velvet-collection-orthopedic/dp/1971958')],
        },
        {
          id: 'x-large',
          label: 'X-Large',
          offers: [chewyOffer('https://www.chewy.com/noah-paw-velvet-collection-orthopedic/dp/1972006')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'noah-paw-denim-collection-bed',
    name: 'Noah & Paw Denim Orthopedic Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/noah-paw-denim-collection-orthopedic/dp/1971414')],
    bullets: [
      'Seven-inch-thick foam base is aimed at older dogs and larger breeds that need deeper support',
      'Denim-style cover gives it a sturdier, furniture-friendly look than most fuzzy orthopedic sofas',
      'Cooling-gel top layer and a waterproof lining, with a removable, machine-washable cover',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/068a8cc7-bc3f-7460-8000-2ccee671daca._AC_SS500_V1_.jpg', alt: 'Noah & Paw Denim Orthopedic Dog Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: 'xx-large',
      variants: [
        {
          id: 'small',
          label: 'Small',
          offers: [chewyOffer('https://www.chewy.com/noah-paw-denim-collection-orthopedic/dp/1971270')],
        },
        {
          id: 'medium',
          label: 'Medium',
          offers: [chewyOffer('https://www.chewy.com/noah-paw-denim-collection-orthopedic/dp/1971318')],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [chewyOffer('https://www.chewy.com/noah-paw-denim-collection-orthopedic/dp/1971350')],
        },
        {
          id: 'x-large',
          label: 'X-Large',
          offers: [chewyOffer('https://www.chewy.com/noah-paw-denim-collection-orthopedic/dp/1971382')],
        },
        {
          id: 'xx-large',
          label: 'XX-Large',
          offers: [chewyOffer('https://www.chewy.com/noah-paw-denim-collection-orthopedic/dp/1971414')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'carolina-pet-berber-bolster-bed',
    name: 'Carolina Pet Microfiber & Berber Bolster Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/carolina-pet-microfiber-tipped-berber/dp/1384590')],
    bullets: [
      'Built-in bolster cushion wraps around the dog for a snug, secure feel',
      'High-loft polyester fill lifts dogs off cold floors; it is a softer, lighter option than the memory-foam beds on this page',
      'Microfiber cover with a tipped Berber fleece surface; the cover unzips and goes in the washing machine',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/0682e0a7-42ed-728c-8000-b78f41795ec9._AC_SS500_V1_.jpg', alt: 'Carolina Pet Microfiber & Berber Bolster Dog Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: 'small',
      variants: [
        {
          id: 'small',
          label: 'Small',
          offers: [chewyOffer('https://www.chewy.com/carolina-pet-microfiber-tipped-berber/dp/1384590')],
        },
        {
          id: 'medium',
          label: 'Medium',
          offers: [chewyOffer('https://www.chewy.com/carolina-pet-microfiber-tipped-berber/dp/1384598')],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [chewyOffer('https://www.chewy.com/carolina-pet-microfiber-tipped-berber/dp/1384606')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'furhaven-cable-corduroy-couch-bed',
    name: 'Furhaven Cable Corduroy Orthopedic Couch Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/furhaven-plush-cable-corduroy-comfy/dp/3305502')],
    bullets: [
      'Orthopedic foam base with bolstered sides cushions the neck and spine whether your dog curls up or sprawls',
      'Cable corduroy cover with faux-leather piping suits living-room décor',
      'Removable, reinforced cover makes upkeep simple',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/068d444a-f3c9-7e65-8000-cb02711ea5e7._AC_SS500_V1_.jpg', alt: 'Furhaven Cable Corduroy Orthopedic Couch Dog Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: 'medium',
      variants: [
        {
          id: 'medium',
          label: 'Medium',
          offers: [chewyOffer('https://www.chewy.com/furhaven-plush-cable-corduroy-comfy/dp/3305502')],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [chewyOffer('https://www.chewy.com/furhaven-plush-cable-corduroy-comfy/dp/3305510')],
        },
        {
          id: 'jumbo',
          label: 'Jumbo',
          offers: [chewyOffer('https://www.chewy.com/furhaven-plush-cable-corduroy-comfy/dp/3305518')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'kylinsure-all-around-bolster-bed',
    name: 'Kylinsure All-Around Orthopedic Bolster Sofa Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/kylinsure-all-around-orthopedic/dp/4529006')],
    bullets: [
      'Full-coverage bolster cradles the head and neck, with a slimmer front edge that flows into a thicker, plush back',
      'Contoured foam balances plush softness with firm support, under an ultrasoft fleece sleeping surface',
      'Corduroy outer cover with a built-in waterproof lining that protects the foam from spills and accidents',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/06a441d9-7179-7168-8000-8fc58ad97256._AC_SS500_V1_.jpg', alt: 'Kylinsure All-Around Orthopedic Bolster Sofa Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: 'x-large',
      variants: [
        {
          id: 'medium',
          label: 'Medium',
          offers: [chewyOffer('https://www.chewy.com/kylinsure-all-around-orthopedic/dp/4528990')],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [chewyOffer('https://www.chewy.com/kylinsure-all-around-orthopedic/dp/4528998')],
        },
        {
          id: 'x-large',
          label: 'X-Large',
          offers: [chewyOffer('https://www.chewy.com/kylinsure-all-around-orthopedic/dp/4529006')],
        },
        {
          id: 'jumbo',
          label: 'Jumbo',
          offers: [chewyOffer('https://www.chewy.com/kylinsure-all-around-orthopedic/dp/4529014')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'furhaven-embossed-velvet-sofa-bed',
    name: 'Furhaven Embossed Velvet Orthopedic Sofa Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/furhaven-plush-embossed-velvet/dp/3305926')],
    bullets: [
      'Orthopedic foam base with plush bolsters supports the spine and gives dogs an edge to lean on',
      'Velvety sleeping surface flows into the supportive sides for a sofa-style look',
      'Removable zippered cover and a built-in carry handle make it easy to wash and move',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/068d443d-ab20-74bb-8000-b78dc32dae62._AC_SS500_V1_.jpg', alt: 'Furhaven Embossed Velvet Orthopedic Sofa Dog Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: 'jumbo',
      variants: [
        {
          id: 'medium',
          label: 'Medium',
          offers: [chewyOffer('https://www.chewy.com/furhaven-plush-embossed-velvet/dp/3305910')],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [chewyOffer('https://www.chewy.com/furhaven-plush-embossed-velvet/dp/3305918')],
        },
        {
          id: 'jumbo',
          label: 'Jumbo',
          offers: [chewyOffer('https://www.chewy.com/furhaven-plush-embossed-velvet/dp/3305926')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'comfort-expression-waterproof-foam-bed',
    name: 'Comfort Expression Waterproof Orthopedic Foam Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/comfort-expression-waterproof/dp/1886782')],
    bullets: [
      'Thick egg-crate orthopedic foam gives dogs of all sizes cushioned support, especially seniors and dogs with sore joints',
      'Removable, washable cover is waterproof, so spills and accidents wipe up without soaking the bed',
      'Non-slip bottom keeps the bed in place on hard floors',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/06a0b6a0-d5b9-78fb-8000-cffdbd609849._AC_SS500_V1_.jpg', alt: 'Comfort Expression Waterproof Orthopedic Foam Dog Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: '36x27-in',
      variants: [
        {
          id: '36x27-in',
          label: '36 × 27 in',
          longLabel: '36 × 27 × 7.5 in',
          offers: [chewyOffer('https://www.chewy.com/comfort-expression-waterproof/dp/1886782')],
        },
        {
          id: '42x30-in',
          label: '42 × 30 in',
          longLabel: '42 × 30 × 9.0 in',
          offers: [chewyOffer('https://www.chewy.com/comfort-expression-waterproof/dp/1886830')],
        },
        {
          id: '45x35-in',
          label: '45 × 35 in',
          longLabel: '45 × 35 × 9.0 in',
          offers: [chewyOffer('https://www.chewy.com/comfort-expression-waterproof/dp/1886878')],
        },
        {
          id: '53x42-in',
          label: '53 × 42 in',
          longLabel: '53 × 42 × 9.5 in',
          offers: [chewyOffer('https://www.chewy.com/comfort-expression-waterproof/dp/1886926')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'zomisia-fluffy-egg-foam-bed',
    name: 'ZOMISIA Fluffy Egg-Foam Dog Bed with Raised Bolster',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/zomisia-fluffy-waterproof-supportive/dp/4371206')],
    bullets: [
      'A 360-degree raised bolster filled with chopped foam gives dogs a nest-like edge to lean on',
      'Egg-crate foam base adds cushioning under a faux-fur cover',
      'Waterproof liner protects the foam, and the removable cover is machine washable',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/06a29824-5660-73bf-8000-e69c31d97ec3._AC_SS500_V1_.jpg', alt: 'ZOMISIA Fluffy Egg-Foam Dog Bed with Raised Bolster' },
  },
  {
    id: 'laifug-orthopedic-memory-foam-bed',
    name: 'LaiFug Orthopedic Memory Foam Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/laifug-orthopedic-memory-foam-dog-bed/dp/907414')],
    bullets: [
      'High-density memory foam paired with a two-inch foam layer springs back to full after use',
      'Soft removable cover sits over a waterproof liner to protect the foam',
      'Washable cover makes it simple to refresh the bed',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/laifug-orthopedic-memory-foam-dog-bed-gray-orchid-medium/img-564541._AC_SS500_V1_.jpg', alt: 'LaiFug Orthopedic Memory Foam Dog Bed' },
  },
  {
    id: 'kylinsure-orthopedic-pillow-bed',
    name: 'Kylinsure Orthopedic Pillow Dog & Cat Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/kylinsure-orthopedic-pillow-dog-cat/dp/3763614')],
    bullets: [
      'High-density egg-crate foam conforms to the body and eases pressure points',
      'Low-bunk design makes stepping in and out easier for older dogs and dogs with limited mobility',
      'Curly faux-fur cover with padded edges; the cover comes off for washing',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/06a15f92-d517-74b4-8000-867f9823d67a._AC_SS500_V1_.jpg', alt: 'Kylinsure Orthopedic Pillow Dog & Cat Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: 'large',
      variants: [
        {
          id: 'small',
          label: 'Small',
          offers: [chewyOffer('https://www.chewy.com/kylinsure-orthopedic-pillow-dog-cat/dp/3763598')],
        },
        {
          id: 'medium',
          label: 'Medium',
          offers: [chewyOffer('https://www.chewy.com/kylinsure-orthopedic-pillow-dog-cat/dp/3763606')],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [chewyOffer('https://www.chewy.com/kylinsure-orthopedic-pillow-dog-cat/dp/3763614')],
        },
        {
          id: 'x-large',
          label: 'X-Large',
          offers: [chewyOffer('https://www.chewy.com/kylinsure-orthopedic-pillow-dog-cat/dp/3763622')],
        },
        {
          id: 'xx-large',
          label: 'XX-Large',
          offers: [chewyOffer('https://www.chewy.com/kylinsure-orthopedic-pillow-dog-cat/dp/3763630')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'veehoo-elevated-memory-foam-bed',
    name: 'Veehoo Elevated Orthopedic Memory Foam Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/veehoo-orthopedic-memory-foam/dp/3276798')],
    bullets: [
      'Thick memory foam over firm-support foam is aimed at senior and large-breed dogs',
      'Dual-layer waterproof protection helps keep the foam core clean and dry',
      'Plush cover is removable and washable',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/068d11fe-8e6c-75c7-8000-a2a6d28ad00f._AC_SS500_V1_.jpg', alt: 'Veehoo Elevated Orthopedic Memory Foam Dog Bed' },
  },
  {
    id: 'berenlefe-oversized-lounge-bed',
    name: 'Berenlefe Oversized Memory Foam Lounge Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/berenlefe-oversized-orthopedic-memory/dp/4177406')],
    bullets: [
      'Sized for a dog and a person to share, with raised edges and a plush faux-fur surface',
      'Eggcrate-textured orthopedic memory-foam base spreads weight evenly for long lounging sessions',
      'Comes with a pillow and blanket and has a non-slip bottom; measure your space before ordering',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/moe/069e0f77-cd05-7dba-8000-60241de1a9a7._AC_SS500_V1_.jpg', alt: 'Berenlefe Oversized Memory Foam Lounge Bed' },
  },
  {
    id: 'timberdog-ruffrest-travel-bed',
    name: 'Timberdog RuffRest Orthopedic Travel Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/timberdog-ruffrest-stormy-orthopedic/dp/1506782')],
    bullets: [
      'Built-in blanket converts into a three-season sleeping bag, so the bed doubles as travel gear',
      'Opens like a suitcase and packs up for trips, with a removable see-through organizer for essentials',
      'Elevated orthopedic build with a removable cover, aimed at dogs that travel with you',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/timberdog-ruffrest-orthopedic-ultimate-travel-cat-dog-bed-with-removable-cover-orion-bluetangerineteal-medium/img-321160._AC_SS500_V1_.jpg', alt: 'Timberdog RuffRest Orthopedic Travel Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: 'medium',
      variants: [
        {
          id: 'small',
          label: 'Small',
          offers: [chewyOffer('https://www.chewy.com/timberdog-ruffrest-stormy-orthopedic/dp/1506790')],
        },
        {
          id: 'medium',
          label: 'Medium',
          offers: [chewyOffer('https://www.chewy.com/timberdog-ruffrest-stormy-orthopedic/dp/1506782')],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [chewyOffer('https://www.chewy.com/timberdog-ruffrest-stormy-orthopedic/dp/1506774')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
  {
    id: 'three-dog-ez-wash-softshell-bolster-bed',
    name: '3 Dog Pet Supply EZ Wash Softshell Orthopedic Bolster Dog Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/3-dog-pet-supply-ez-wash-softshell/dp/255891')],
    bullets: [
      'Memory foam over support foam with a plush bolster helps relieve pressure on joints',
      'Waterproof protective liner and a fully removable cover make cleanup easy',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/3-dog-pet-supply-ez-wash-softshell-orthopedic-bolster-dog-bed-with-removable-cover-slate-medium/img-242754._AC_SS500_V1_.jpg', alt: '3 Dog Pet Supply EZ Wash Softshell Orthopedic Bolster Dog Bed' },
  },
  {
    id: 'snoozer-cozy-cave-orthopedic-bed',
    name: 'Snoozer Cozy Cave Orthopedic Dog & Cat Bed',
    category: 'orthopedic-beds',
    offers: [chewyOffer('https://www.chewy.com/snoozer-pet-products-100-washable/dp/1098158')],
    bullets: [
      'Cave-style design gives dogs and cats that like to burrow a more enclosed place to rest',
      'Orthopedic cushioning with a removable cover for easy washing',
    ],
    image: { src: 'https://image.chewy.com/catalog/general/images/snoozer-pet-products-100-washable-forgiveness-cozy-cave-orthopedic-dog-cat-crate-bed-with-removable-cover-olive-small/img-118213._AC_SS500_V1_.jpg', alt: 'Snoozer Cozy Cave Orthopedic Dog & Cat Bed' },
    variantGroup: {
      axis: sizeAxis,
      defaultVariantId: 'small',
      variants: [
        {
          id: 'small',
          label: 'Small',
          offers: [chewyOffer('https://www.chewy.com/snoozer-pet-products-100-washable/dp/1098158')],
        },
        {
          id: 'medium',
          label: 'Medium',
          offers: [chewyOffer('https://www.chewy.com/snoozer-pet-products-100-washable/dp/1098166')],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [chewyOffer('https://www.chewy.com/snoozer-pet-products-100-washable/dp/1098174')],
        },
        {
          id: 'x-large',
          label: 'X-Large',
          offers: [chewyOffer('https://www.chewy.com/snoozer-pet-products-100-washable/dp/1098182')],
        },
      ],
    } satisfies ProductVariantGroup,
  },
];

export const chewyOrthopedicBedIds = {
  sofa: ['eheyciga-waterproof-sofa-bed', 'eheyciga-high-back-sofa-bed', 'noah-paw-velvet-orthopedic-bed', 'noah-paw-denim-collection-bed', 'carolina-pet-berber-bolster-bed', 'furhaven-cable-corduroy-couch-bed', 'kylinsure-all-around-bolster-bed', 'furhaven-embossed-velvet-sofa-bed'],
  foam: ['comfort-expression-waterproof-foam-bed', 'zomisia-fluffy-egg-foam-bed', 'laifug-orthopedic-memory-foam-bed', 'kylinsure-orthopedic-pillow-bed', 'veehoo-elevated-memory-foam-bed', 'berenlefe-oversized-lounge-bed'],
  crate: ['timberdog-ruffrest-travel-bed', 'three-dog-ez-wash-softshell-bolster-bed', 'snoozer-cozy-cave-orthopedic-bed'],
} as const;
