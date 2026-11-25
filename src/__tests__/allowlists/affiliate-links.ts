import type { Allowlist } from '../helpers/ratchet';

/** Merchant-host links that are deliberately not affiliate links. Ratchet: remove entries, never add. */
export const AFFILIATE_LINK_ALLOWLIST: Allowlist = {
  'safety/natural-flea-and-tick-prevention-for-dogs/index.html :: www.chewy.com/education/dog/flea-and-tick/can-you-use-essential-oils-for-':
    'Cited source in the article’s references list, not a product link.',
};
