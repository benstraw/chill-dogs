import type { Allowlist } from '../helpers/ratchet';

/** Known JSON-LD problems on shipped pages. Ratchet: remove entries, never add. */
export const JSON_LD_ALLOWLIST: Allowlist = {
  'gear/fi-dog-collar-review/index.html: Review missing reviewRating.ratingValue':
    'Review schema with no rating; Google ignores it. Needs an editorial rating (as the Aorkuler review has) or a switch to Article.',
};
