import type { Allowlist } from '../helpers/ratchet';

/**
 * Pages where an affiliate link appears before any disclosure (FTC: disclose before
 * the link, not after it). Ratchet: remove entries as pages are fixed, never add.
 */
export const DISCLOSURE_ALLOWLIST: Allowlist = {
  'index.html': 'Homepage picks render before any disclosure.',
  'shop/index.html': 'Browse grid has no disclosure above the first card.',
  'gear/aorkuler-gps-dog-tracker-review/index.html': 'Brand-provided review unit; disclosure sits below the first CTA.',
  'gear/garmin-dog-tracking-collars/index.html': 'Disclosure below the first CTA.',
  'calming/crate-training-for-dogs/index.html': 'Inline product link before the disclosure.',
  'cooling/keep-dog-cool-in-car/index.html': 'Inline product link before the disclosure.',
  'shelter-dog-charities/index.html': 'Amazon links with no disclosure component on the page.',
};
