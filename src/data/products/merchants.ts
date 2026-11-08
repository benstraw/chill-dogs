import type { MerchantId } from './types';

export interface MerchantConfig {
  id: MerchantId;
  label: string;
  domain: string;
  ctaCopy: string;
  displayOrder: number;
}

export const merchants: Record<MerchantId, MerchantConfig> = {
  // displayOrder 0: the only product carrying an Aorkuler offer is the Aorkuler
  // tracker itself, and the brand pays more on a direct sale than Amazon does, so
  // direct leads its offer stack. No other product's ordering is affected.
  aorkuler: {
    id: 'aorkuler',
    label: 'Aorkuler',
    domain: 'aorkuler.com',
    ctaCopy: 'Buy direct from Aorkuler',
    displayOrder: 0,
  },
  amazon: {
    id: 'amazon',
    label: 'Amazon',
    domain: 'amazon.com',
    ctaCopy: 'Check price on Amazon',
    displayOrder: 1,
  },
  chewy: {
    id: 'chewy',
    label: 'Chewy',
    domain: 'chewy.com',
    ctaCopy: 'Check price on Chewy',
    displayOrder: 2,
  },
};
