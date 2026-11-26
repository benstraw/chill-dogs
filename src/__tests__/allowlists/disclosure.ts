import type { Allowlist } from '../helpers/ratchet';

/**
 * Pages where an affiliate link appears before any disclosure (FTC: disclose before
 * the link, not after it). Ratchet: remove entries as pages are fixed, never add.
 */
export const DISCLOSURE_ALLOWLIST: Allowlist = {
  'calming/crate-training-for-dogs/index.html': 'Inline product link before the disclosure.',
  'cooling/keep-dog-cool-in-car/index.html': 'Inline product link before the disclosure.',
};
