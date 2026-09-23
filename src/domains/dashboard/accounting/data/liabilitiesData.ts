import { LedgerNormalSide } from '../types/generalLedger';

// The only thing this file exports now — entries themselves are derived from
// usePostings() (see useLiabilitiesEntries.ts), not stored here.
export const LIABILITIES_NORMAL_SIDE: LedgerNormalSide = 'Cr';
