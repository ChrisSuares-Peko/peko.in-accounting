import { LedgerNormalSide } from '../types/generalLedger';

// The only thing this file exports now — entries themselves are derived from
// usePostings() (see usePurchasesEntries.ts), not stored here.
export const PURCHASES_NORMAL_SIDE: LedgerNormalSide = 'Dr';
