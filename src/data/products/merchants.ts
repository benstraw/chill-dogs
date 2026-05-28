import type { MerchantId } from './types';

export interface MerchantConfig {
  id: MerchantId;
  label: string;
  domain: string;
  ctaCopy: string;
  displayOrder: number;
}

export const merchants: Record<MerchantId, MerchantConfig> = {
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
