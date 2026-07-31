import { createChewyAffiliateLinkWithBase } from '../lib/affiliate/chewy';
import type { AffiliateOffer, OfferBackedProduct } from './products/types';

export type FleaTickProductCategory =
  | 'rx-oral-monthly'
  | 'rx-oral-quarterly'
  | 'rx-oral-combo'
  | 'otc-topical'
  | 'otc-collar'
  | 'natural-spray'
  | 'natural-spot-on'
  | 'natural-shampoo'
  | 'natural-collar'
  | 'natural-tag'
  | 'natural-chew'
  | 'natural-ear'
  | 'natural-surface'
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
    id: 'nexgard-10-24',
    name: 'NexGard Chews for Dogs, 10.1 to 24 lbs',
    category: 'rx-oral-monthly',
    badge: 'Monthly Rx chew',
    bestFor: 'Owners who want a widely used monthly oral flea-and-tick chew for a mid-size dog.',
    asin: 'B0DV56FRNC',
    amazonUrl: amazonUrl('B0DV56FRNC'),
    offers: [
      amazonOffer('B0DV56FRNC'),
      chewyOffer('https://www.chewy.com/nexgard-chews-for-dogs-101-24-lbs/dp/173249', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Afoxolaner',
    coverage: 'Fleas and ticks',
    duration: '1 month',
    howItWorks: 'Monthly isoxazoline chew with strong tick-kill coverage.',
    rxRequired: true,
    bullets: [
      'Monthly oral chew in the most commonly used Rx class',
      'Good fit for owners who want no-mess tick protection',
      'Discuss seizure history with your vet before using',
    ],
  },
  {
    id: 'simparica-22-44',
    name: 'Simparica for Dogs, 22.1 to 44 lbs (6-mo supply)',
    category: 'rx-oral-monthly',
    badge: 'Monthly Rx chew',
    bestFor: 'Owners who prefer a six-month supply cadence and oral monthly dosing.',
    asin: 'B0DYFXV29T',
    amazonUrl: amazonUrl('B0DYFXV29T'),
    offers: [amazonOffer('B0DYFXV29T')],
    activeIngredient: 'Sarolaner',
    coverage: 'Fleas and ticks',
    duration: '1 month per chew',
    howItWorks: 'Monthly oral isoxazoline option with broad tick coverage.',
    rxRequired: true,
    bullets: [
      'Oral monthly chew sold here as a six-month supply',
      'Useful for owners who want to set prevention on autopilot',
      'Keep the FDA neurologic warning in the conversation with your vet',
    ],
  },
  {
    id: 'bravecto-44-88',
    name: 'Bravecto Chews for Dogs, 44 to 88 lbs',
    category: 'rx-oral-quarterly',
    badge: '12-week Rx chew',
    bestFor: 'Owners who want fewer doses per year and a longer re-dose window.',
    asin: 'B0DFHLXL5B',
    amazonUrl: amazonUrl('B0DFHLXL5B'),
    offers: [
      amazonOffer('B0DFHLXL5B'),
      chewyOffer('https://www.chewy.com/bravecto-chews-for-dogs-44-88-lbs/dp/281402', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Fluralaner',
    coverage: 'Fleas and ticks',
    duration: '12 weeks',
    howItWorks: 'Quarterly isoxazoline chew for owners who hate monthly resets.',
    rxRequired: true,
    bullets: [
      'One chew covers roughly three months',
      'Best fit for owners who want fewer dosing reminders',
      'Still in the same FDA-alerted isoxazoline class as NexGard and Simparica',
    ],
  },
  {
    id: 'nexgard-plus-33-66',
    name: 'NexGard Plus for Dogs, 33.1 to 66 lbs',
    category: 'rx-oral-combo',
    badge: 'Monthly combo Rx',
    bestFor: 'Owners who want flea, tick, and heartworm coverage in one chew.',
    asin: 'B0DYKWKJ4K',
    amazonUrl: amazonUrl('B0DYKWKJ4K'),
    offers: [
      amazonOffer('B0DYKWKJ4K'),
      chewyOffer('https://www.chewy.com/nexgard-plus-chews-for-dogs-331-66/dp/899766', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Afoxolaner + moxidectin + pyrantel',
    coverage: 'Fleas, ticks, heartworm, roundworms, hookworms',
    duration: '1 month',
    howItWorks: 'Bundles parasite prevention into one monthly chew.',
    rxRequired: true,
    bullets: [
      'One chew replaces separate flea/tick and heartworm products',
      'Strong fit for owners who want to simplify monthly prevention',
      'Requires veterinary prescription and parasite-plan review',
    ],
  },
  {
    id: 'simparica-trio-22-44',
    name: 'Simparica Trio for Dogs, 22.1 to 44 lbs (6-mo supply)',
    category: 'rx-oral-combo',
    badge: 'Monthly combo Rx',
    bestFor: 'Owners who want one product for fleas, ticks, heartworm, and intestinal coverage.',
    asin: 'B0DVH5FJND',
    amazonUrl: amazonUrl('B0DVH5FJND'),
    offers: [
      amazonOffer('B0DVH5FJND'),
      chewyOffer('https://www.chewy.com/simparica-trio-chewable-tablets-dogs/dp/251348', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Sarolaner + moxidectin + pyrantel',
    coverage: 'Fleas, ticks, heartworm, roundworms, hookworms',
    duration: '1 month per chew',
    howItWorks: 'Single monthly chew for owners who want broad parasite coverage.',
    rxRequired: true,
    bullets: [
      'Popular combo chew for households that want one monthly reminder',
      'Useful when the dog already needs heartworm protection too',
      'Still merits a vet conversation for dogs with seizure history',
    ],
  },
  {
    id: 'frontline-plus-45-88',
    name: 'Frontline Plus for Dogs, 45 to 88 lbs (6-mo supply)',
    category: 'otc-topical',
    badge: 'OTC topical',
    bestFor: 'Owners who want widely available over-the-counter topical coverage.',
    asin: 'B0002J1FOO',
    amazonUrl: amazonUrl('B0002J1FOO'),
    offers: [
      amazonOffer('B0002J1FOO'),
      chewyOffer('https://www.chewy.com/frontline-plus-flea-tick-large-dogs/dp/34715', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Fipronil + (S)-methoprene',
    coverage: 'Fleas, flea eggs, ticks',
    duration: '1 month per dose',
    howItWorks: 'Classic no-prescription topical option with flea and tick coverage.',
    bullets: [
      'Easy OTC starting point when you are not ready for a prescription product',
      'Topical application can be messy and needs drying time',
      'Regional fipronil resistance is one reason to reassess if results disappoint',
    ],
  },
  {
    id: 'k9-advantix-21-55',
    name: 'K9 Advantix II for Dogs, 21 to 55 lbs (4-mo supply)',
    category: 'otc-topical',
    badge: 'OTC topical',
    bestFor: 'Dog-only households that want OTC tick coverage and mosquito repellency.',
    asin: 'B004QMX4YW',
    amazonUrl: amazonUrl('B004QMX4YW'),
    offers: [
      amazonOffer('B004QMX4YW'),
      chewyOffer('https://www.chewy.com/k9-advantix-ii-flea-tick-treatment/dp/102306', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Imidacloprid + permethrin + pyriproxyfen',
    coverage: 'Fleas, ticks, mosquitoes',
    duration: '1 month per dose',
    howItWorks: 'Strong OTC topical coverage with a serious cat-safety caveat.',
    caution: 'Contains permethrin. Do not use in homes where treated dogs closely share space with cats.',
    bullets: [
      'One of the stronger OTC tick options when you need no-prescription coverage',
      'Permethrin raises the stakes for multi-pet homes with cats',
      'Best reserved for dog-only homes or households that can separate pets safely',
    ],
  },
  {
    id: 'seresto-large',
    name: 'Seresto Flea and Tick Collar for Dogs Over 18 lbs',
    category: 'otc-collar',
    badge: 'OTC collar',
    bestFor: 'Owners who want an 8-month collar rather than monthly dosing.',
    asin: 'B00B8CG602',
    amazonUrl: amazonUrl('B00B8CG602'),
    offers: [
      amazonOffer('B00B8CG602'),
      chewyOffer('https://www.chewy.com/seresto-flea-tick-collar-large-dogs/dp/46497', 'best-flea-and-tick-medications-for-dogs'),
    ],
    activeIngredient: 'Imidacloprid + flumethrin',
    coverage: 'Fleas and ticks',
    duration: '8 months',
    howItWorks: 'Long-duration collar for owners who prioritize convenience.',
    caution: 'EPA reviewed adverse-event reports and kept the product on the market with updated labeling.',
    bullets: [
      'Eight-month collar appeals to owners who want fewer monthly tasks',
      'Still deserves a balanced safety read before you default to convenience',
      'Watch carefully for skin reactions or behavior changes after putting it on',
    ],
  },
  {
    id: 'wondercide-shampoo-amazon',
    name: 'Wondercide Flea & Tick Shampoo for Dogs & Cats (12 oz)',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Owners who want an Amazon-stocked bath-day shampoo to pair with sprays and coat checks.',
    asin: 'B09WLSNZZC',
    amazonUrl: amazonUrl('B09WLSNZZC'),
    offers: [amazonOffer('B09WLSNZZC')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61ylsHHZN5L._SL500_.jpg',
      alt: 'Wondercide Flea & Tick Shampoo for Dogs and Cats, 12 oz',
    },
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Essential-oil shampoo for bath-day cleanup that supports a routine rather than replacing prevention.',
    bullets: [
      'Plant-based essential-oil formula for bath-day cleanup, stocked on Amazon',
      'Labeled for dogs and cats over four months, so it fits mixed-pet bath days',
      'Cleanup and coat support, not standalone flea control',
    ],
  },
  {
    id: 'skouts-honor-flea-tick-shampoo',
    name: "Skout's Honor Natural Flea & Tick Shampoo for Dogs (16 oz)",
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Owners who want a bigger bottle of mint-and-cedarwood bath-day shampoo for a regular wash routine.',
    asin: 'B08ZWKN9KK',
    amazonUrl: amazonUrl('B08ZWKN9KK'),
    offers: [amazonOffer('B08ZWKN9KK')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61IwXIgqS8L._SL500_.jpg',
      alt: "Skout's Honor Natural Flea & Tick Shampoo for Dogs, 16 oz",
    },
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Mint and cedarwood essential-oil shampoo that the brand says targets larvae and eggs during the bath.',
    bullets: [
      'Mint and cedarwood essential-oil formula in a 16 oz bottle',
      'Skout’s Honor also markets it as repelling mosquitoes after a wash',
      'Bath-day cleanup and coat support, not standalone flea control',
    ],
  },
  {
    id: 'hartz-natures-shield-shampoo',
    name: "Hartz Nature's Shield Natural Flea & Tick Dog Shampoo (14 oz)",
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Owners who want the lowest-cost botanical shampoo here and the option to buy it on Amazon or Chewy.',
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
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Plant-based shampoo built on cinnamon, citronella, and rosemary oils for bath-day cleanup.',
    bullets: [
      'Cinnamon, citronella, and rosemary oils with vitamin E and glycerin for the coat',
      'Free of parabens, dyes, and alcohols, and stocked on both Amazon and Chewy',
      'Hartz labels it for routine baths; treat it as cleanup, not prevention',
    ],
  },
  {
    id: 'earth-animal-apothecary-shampoo',
    name: 'Earth Animal Apothecary Natural Flea & Tick Herbal Shampoo for Dogs (12 oz)',
    category: 'natural-shampoo',
    badge: 'Herbal shampoo',
    bestFor: 'Owners who already use Earth Animal herbal products and want the matching bath-day shampoo.',
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
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Herbal shampoo the brand positions for all breeds and life stages as part of its wider flea-and-tick line.',
    bullets: [
      'Herbal formula labeled for all breeds and life stages',
      'Available on Amazon and Chewy, so it is easy to reorder with the rest of a routine',
      'Made in the USA and free of synthetic pesticides',
    ],
  },
  {
    id: 'lillian-ruff-flea-tick-shampoo',
    name: 'Lillian Ruff Flea & Tick Dog Shampoo (16 fl oz)',
    category: 'natural-shampoo',
    badge: 'Natural shampoo',
    bestFor: 'Owners who want a tear-free essential-oil shampoo for dogs that hate bath time.',
    offers: [
      chewyOffer('https://www.chewy.com/lillian-ruff-flea-tick-dog-shampoo-16/dp/380716', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/is/image/catalog/354486_MAIN._AC_SX500_SY400_QL75_V1640041368_.jpg',
      alt: 'Lillian Ruff Flea & Tick Dog Shampoo, 16 fl oz bottle',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Essential-oil blend of rosemary, lavender, peppermint, thyme, wintergreen, lemongrass, citronella, and eucalyptus.',
    bullets: [
      'Tear-free and dye-free, which helps on dogs that fight the bath',
      'Chewy lists it for dogs; check the label before using it on cats or puppies',
      'Chewy-only pick, so pair it with an Amazon product if you want one cart',
    ],
  },
  {
    id: 'top-performance-natural-shampoo',
    name: 'Top Performance Natural Flea & Tick Dog & Cat Shampoo (17 fl oz)',
    category: 'natural-shampoo',
    badge: 'Budget shampoo',
    bestFor: 'Multi-pet homes that want a cheap grooming-style shampoo for both dogs and cats.',
    offers: [
      chewyOffer('https://www.chewy.com/top-performance-natural-flea-tick-dog/dp/237221', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/top-performance-natural-flea-tick-dog-cat-shampoo-17fl-oz-bottle/img-388419._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Top Performance Natural Flea & Tick Dog & Cat Shampoo, 17 fl oz bottle',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Bath-day cleanup support',
    duration: 'Per bath',
    howItWorks: 'Pyrethrin-free grooming shampoo with aloe, lanolin, lecithin, and vitamin E to condition the coat.',
    bullets: [
      'Cheapest shampoo on this page and labeled for dogs and cats',
      'Pyrethrin-free formula with a herbal scent and conditioning ingredients',
      'Grooming-aisle cleanup product, not a treatment for an active infestation',
    ],
  },
  {
    id: 'wondercide-spray-lemongrass-32oz',
    name: 'Wondercide Flea, Tick & Mosquito Spray',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor:
      'Kills by contact, repels, and helps prevent fleas, ticks, and mosquitoes with natural essential oils. Wondercide reports 98–100% efficacy in laboratory testing and says the formula targets eggs, larvae, and adults.',
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
      'Labeled for dogs and cats of all ages, including puppies, kittens, and senior pets, when used as directed; contains no artificial colors, fragrances, or dyes',
      'Three-in-one plant-powered formula for dogs, cats, and home surfaces such as carpet, furniture, bedding, and flooring',
      'Made in the USA with U.S. and global components; cruelty-free',
    ],
  },
  {
    id: 'natures-dome-cedarwood-spray',
    name: "Nature's Dome Cedarwood Flea & Tick Spray",
    category: 'natural-spray',
    badge: 'Natural oil spray',
    bestFor: 'Cedarwood oil helps kill and repel fleas, ticks, larvae, and eggs.',
    offers: [
      chewyOffer('https://www.chewy.com/natures-dome-cedarwood-flea-tick/dp/3684302', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06984af6-5eb4-7330-8000-51aa5ce6b490._AC_SX500_SY400_QL75_V1_.jpg',
      alt: "Nature's Dome Cedarwood Flea & Tick Spray for Dogs, 16 fl oz",
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Chewy lists this dog spray as pet-safe; check the label before use on cats or young animals',
      'Plant-based formula without harsh chemicals or synthetic pesticides',
      'Biodegradable, eco-friendly ingredients intended to be safer for pets, people, and the planet when used as directed',
    ],
  },
  {
    id: 'isabellas-clearly-natural-spray',
    name: "Isabella's Clearly Natural Flea & Tick Oil",
    category: 'natural-spray',
    badge: 'Natural oil spray',
    bestFor: 'A blend of essential oils in a nourishing sweet almond oil base for flea-and-tick protection.',
    offers: [
      chewyOffer('https://www.chewy.com/isabellas-clearly-natural-flea-tick/dp/3701295', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0693338a-c450-70cd-8000-f2fc87404143._AC_SX500_SY400_QL75_V1_.jpg',
      alt: "Isabella's Clearly Natural Flea & Tick Oil for Dogs, 2 fl oz",
    },
    ctaLabel: 'Check price on Chewy',
    bullets: [
      'Chewy lists this oil for dogs; check the label before use on cats or young animals',
      'Free from preservatives and conventional pesticides',
      'Made in the USA in small batches for quality assurance',
    ],
  },
  {
    id: 'pure-natural-pet-spray',
    name: 'Pure and Natural Pet Dog Flea & Tick Spray',
    category: 'natural-spray',
    badge: 'Natural spray',
    bestFor: 'Made with peppermint and cedarwood oils to repel pests.',
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
      'DEET-free and pyrethrin-free; labeled for dogs 16 weeks and older when used as directed',
    ],
  },
  {
    id: 'amdeiur-natural-flea-collar',
    name: 'AMDEIUR Natural Flea & Tick Collar for Dogs (2-Pack)',
    category: 'natural-collar',
    badge: 'Natural collar',
    bestFor: 'Owners who want a two-pack of adjustable collars so a replacement is already on the shelf.',
    asin: 'B0FYFDDM68',
    amazonUrl: amazonUrl('B0FYFDDM68'),
    offers: [amazonOffer('B0FYFDDM68')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61OuUQxyMRL._SL500_.jpg',
      alt: 'AMDEIUR Natural Flea & Tick Collar for Dogs, 2-pack',
    },
    coverage: 'Wearable preventative support',
    duration: 'Brand claims up to 8 months per collar',
    howItWorks: 'Adjustable leave-on collar for owners who would rather not run a daily spray routine.',
    bullets: [
      'Two adjustable collars per order, cut to fit most dog neck sizes',
      'Brand claims up to eight months of protection per collar',
      'Natural collars carry lighter evidence than conventional options; treat it as a layer',
    ],
  },
  {
    id: 'solpetti-botanical-flea-collar',
    name: 'SolPetti Botanical Flea & Tick Collar for Dogs (4-Pack)',
    category: 'natural-collar',
    badge: 'Natural collar',
    bestFor: 'Multi-dog homes or long seasons where you want a year of spare collars in one order.',
    asin: 'B0GWNBMSQ4',
    amazonUrl: amazonUrl('B0GWNBMSQ4'),
    offers: [amazonOffer('B0GWNBMSQ4')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71LlG9SX3CL._SL500_.jpg',
      alt: 'SolPetti Botanical Flea & Tick Collar for Dogs, 4-pack, gray',
    },
    coverage: 'Wearable preventative support',
    duration: 'Brand claims up to 8 months per collar',
    howItWorks: 'Botanical-oil collar sized for medium and large dogs, sold four to a pack.',
    bullets: [
      'Four adjustable, water-resistant collars sized for medium and large dogs',
      'Works out cheapest per collar if you are covering more than one dog',
      'Same lighter-evidence caveat as every wearable natural option',
    ],
  },
  {
    id: 'trihood-flea-tick-tag',
    name: 'Trihood Natural Flea & Tick Dog Tag (2-Pack + 4 Refills)',
    category: 'natural-tag',
    badge: 'Natural tag',
    bestFor: 'Owners who want a pendant that clips to an existing collar instead of adding a second collar.',
    asin: 'B0GVYVSDK5',
    amazonUrl: amazonUrl('B0GVYVSDK5'),
    offers: [amazonOffer('B0GVYVSDK5')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81OuVBoQyGL._SL500_.jpg',
      alt: 'Trihood Natural Flea & Tick Dog Tag pendants with refills',
    },
    coverage: 'Wearable preventative support',
    duration: 'Refill-based; includes four extra refills',
    howItWorks: 'Clip-on pendant for owners who already have a collar they like.',
    caution: 'The collar is not included; the tag attaches to your dog’s existing collar.',
    bullets: [
      'Two waterproof pendants plus four refills attach to a collar you already own',
      'Good fit when you do not want to swap your dog’s current collar',
      'Same lighter-evidence caveat as other wearable natural options',
    ],
  },
  {
    id: 'routade-flea-tick-pendant',
    name: 'ROUTADE Natural Flea & Tick Pendant for Dogs (2 Buckles + 4 Refills)',
    category: 'natural-tag',
    badge: 'Natural tag',
    bestFor: 'Owners who want a second refillable pendant option that clips onto the collar the dog already wears.',
    asin: 'B0H68SVCLV',
    amazonUrl: amazonUrl('B0H68SVCLV'),
    offers: [amazonOffer('B0H68SVCLV')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81korJDYRHL._SL500_.jpg',
      alt: 'ROUTADE Natural Flea & Tick Pendant for Dogs with silicone buckles and refills',
    },
    coverage: 'Wearable preventative support',
    duration: 'Refill-based; includes four refills',
    howItWorks: 'Refillable pendant with silicone buckles that attaches to an existing collar.',
    caution: 'The collar is not included; the pendant attaches to your dog’s existing collar.',
    bullets: [
      'Two silicone buckles plus four refills for indoor and outdoor wear',
      'Water-resistant build for dogs that swim or get rained on',
      'Wearable natural options are a layer, not rescue-level flea control',
    ],
  },
  {
    id: 'lkdhfjc-flea-tick-chews-200',
    name: 'LKDHFJC Natural Flea & Tick Soft Chews for Dogs (200 Count)',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Owners who want the largest count per jar for a single dog on a long season.',
    asin: 'B0GZNGT1HT',
    amazonUrl: amazonUrl('B0GZNGT1HT'),
    offers: [amazonOffer('B0GZNGT1HT')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71lWZ1NCBFL._SL500_.jpg',
      alt: 'LKDHFJC Natural Flea & Tick Soft Chews for Dogs, 200 count',
    },
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 200 chews per jar',
    howItWorks: 'Chicken-flavored daily chew marketed for skin, coat, and pest-defense support.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Chicken-flavored daily format for dogs that take chews easily',
      'A 200-count jar covers a long stretch for one dog',
      'Best seen as a light internal layer alongside real prevention, not a replacement',
    ],
  },
  {
    id: 'only-natural-pet-barrier-bites',
    name: 'Only Natural Pet EasyDefense Barrier Bites Soft Chews (3-Pack)',
    category: 'natural-chew',
    badge: 'Brand-name chew',
    bestFor: 'Owners who would rather buy a known natural pet brand than an unbranded jar.',
    asin: 'B0CFYJM6HN',
    amazonUrl: amazonUrl('B0CFYJM6HN'),
    offers: [amazonOffer('B0CFYJM6HN')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81aWNSjRDBL._SL500_.jpg',
      alt: 'Only Natural Pet EasyDefense Barrier Bites soft flea chews for dogs, 3-pack',
    },
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 90 chews per bag, three bags per order',
    howItWorks: 'Bacon-flavored daily chew the brand markets for skin, coat, and immune support alongside pest defense.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Established natural-pet brand rather than a generic marketplace jar',
      'Bacon flavor and a three-bag order for multi-dog or long-season use',
      'Priced well above the generic chews here, so buy it for the brand, not the claims',
    ],
  },
  {
    id: 'geynaw-flea-tick-chews',
    name: 'Geynaw Natural Flea & Tick Soft Chews for Dogs (180 Count)',
    category: 'natural-chew',
    badge: 'Daily chew',
    bestFor: 'Owners who want a mid-size jar with more reviews behind it than the newest listings.',
    asin: 'B0H35T1N1T',
    amazonUrl: amazonUrl('B0H35T1N1T'),
    offers: [amazonOffer('B0H35T1N1T')],
    image: {
      src: 'https://m.media-amazon.com/images/I/81BXineNWsL._SL500_.jpg',
      alt: 'Geynaw natural flea and tick soft chews for dogs, 180 count',
    },
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 180 chews per jar',
    howItWorks: 'Chicken-flavored soft chew sold for all breeds and ages as a daily supplement.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'A 180-count jar sized for one dog through a full season',
      'Chicken flavor and a soft texture for dogs that spit out hard tablets',
      'Supplement-level support that belongs alongside real prevention',
    ],
  },
  {
    id: 'yotango-flea-tick-chews',
    name: 'YOTANGO Flea & Tick Chews for Dogs with Fish Oil & B Vitamins',
    category: 'natural-chew',
    badge: 'Skin & coat chew',
    bestFor: 'Owners who want the daily chew to double as a skin, coat, and digestion supplement.',
    asin: 'B0GV2JL462',
    amazonUrl: amazonUrl('B0GV2JL462'),
    offers: [amazonOffer('B0GV2JL462')],
    image: {
      src: 'https://m.media-amazon.com/images/I/71ZSm7Xj6ML._SL500_.jpg',
      alt: 'YOTANGO flea and tick chews for dogs with fish oil and B vitamins',
    },
    coverage: 'Daily oral supplement support',
    duration: 'Daily chew',
    howItWorks: 'Chicken-flavored chew that adds fish oil and B vitamins to the usual pest-defense blend.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Fish oil and B vitamins aimed at skin, coat, digestion, and immune support',
      'Useful if you were already considering a separate coat supplement',
      'The supplement side is the real value here, not flea protection',
    ],
  },
  {
    id: 'beloved-pets-flea-tick-chews',
    name: 'Beloved Pets Flea & Tick Prevention Support Soft Chews (10 oz Jar)',
    category: 'natural-chew',
    badge: 'Chewy chew',
    bestFor: 'Owners who prefer to buy chews on Chewy and want a simple whole-food ingredient list.',
    offers: [
      chewyOffer('https://www.chewy.com/beloved-pets-flea-tick-prevention/dp/3614782', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/0690cb47-856a-7977-8000-ba707982b1df._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Beloved Pets Flea & Tick Prevention Support Soft Chews for Dogs, 10 oz jar',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 10 oz jar',
    howItWorks: 'Soft chew built on flaxseed meal, brewer’s yeast, apple cider vinegar, and coconut oil.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Short, recognizable ingredient list built around whole-food supplements',
      'Chewy-stocked, so it fits an autoship order with food and treats',
      'Skin and coat support first; prevention still has to come from somewhere else',
    ],
  },
  {
    id: 'dr-woow-flea-tick-chews',
    name: 'Dr Woow Flea & Tick Prevention Chews for Dogs (120 Count)',
    category: 'natural-chew',
    badge: 'Chewy chew',
    bestFor: 'Owners who want a botanical chew with gut and immune support on the same label.',
    offers: [
      chewyOffer('https://www.chewy.com/dr-woow-flea-tick-prevention-chews/dp/4356846', 'best-natural-flea-and-tick-products-for-dogs'),
    ],
    image: {
      src: 'https://image.chewy.com/catalog/general/images/moe/06a1d985-386b-785a-8000-852baa7b79d6._AC_SX500_SY400_QL75_V1_.jpg',
      alt: 'Dr Woow Flea & Tick Prevention Chews for Dogs, 120 count',
    },
    ctaLabel: 'Check price on Chewy',
    coverage: 'Daily oral supplement support',
    duration: 'Daily; 120 chews per bag',
    howItWorks: 'Botanical chew with coriander seed powder, pumpkin powder, coconut MCT oil, and B vitamins.',
    caution: 'Oral natural chews have thin evidence for actually stopping fleas and ticks; treat this as a supplement, not protection.',
    bullets: [
      'Botanical blend aimed at gut health, immune function, and energy',
      'Chicken-flavored and labeled for all life stages and breeds',
      'Dose by weight and keep it as a layer under your real prevention plan',
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
    id: 'rinseroo-original',
    name: 'Rinseroo Slip-On Tub Sprayer',
    category: 'bath-tool',
    badge: 'Bath tool',
    bestFor: 'Owners who want to make post-hike or flea-season baths less of a wrestling match.',
    asin: 'B0CSF2LLS3',
    amazonUrl: amazonUrl('B0CSF2LLS3'),
    offers: [amazonOffer('B0CSF2LLS3')],
    image: {
      src: 'https://m.media-amazon.com/images/I/61TF2a86MiL._SL500_.jpg',
      alt: 'Rinseroo Slip-On Tub Sprayer',
    },
    coverage: 'Bath setup convenience',
    duration: 'Reusable bath accessory',
    howItWorks: 'Turns an ordinary tub or shower into a faster rinse setup for dogs.',
    ctaLabel: 'See Rinseroo on Amazon',
    bullets: [
      'Best bath-convenience upgrade for apartment showers and guest tubs',
      'Makes rinse-heavy flea cleanup routines more realistic to stick with',
      'Not treatment on its own, but helpful when baths are part of the plan',
    ],
  },
  {
    id: 'rinseroo-shark-tank',
    name: 'Rinseroo Tub Sprayer (Shark Tank Version)',
    category: 'bath-tool',
    badge: 'Bath tool',
    bestFor: 'Owners who want the same slip-on bath idea in the newer branded version.',
    asin: 'B0CSF14JZZ',
    amazonUrl: amazonUrl('B0CSF14JZZ'),
    offers: [amazonOffer('B0CSF14JZZ')],
    image: {
      src: 'https://m.media-amazon.com/images/I/619HJ-VFtGL._SL500_.jpg',
      alt: 'Rinseroo Slip-On Tub Sprayer (Shark Tank version)',
    },
    coverage: 'Bath setup convenience',
    duration: 'Reusable bath accessory',
    howItWorks: 'Alternate Rinseroo listing for owners comparing versions or price.',
    ctaLabel: 'Check Shark Tank Version',
    bullets: [
      'Same core use case: faster rinse-downs during muddy or flea-heavy weeks',
      'Useful fallback listing if the original version is out of stock',
      'Best paired with a real shampoo-and-bedding routine, not treated as prevention alone',
    ],
  },
];

export function getFleaTickProductsByCategory(category: FleaTickProductCategory): FleaTickProduct[] {
  return fleaTickProducts.filter((product) => product.category === category);
}
