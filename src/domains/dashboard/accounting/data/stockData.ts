import { LedgerNormalSide } from '../types/generalLedger';

// The only thing this file exports now — entries themselves are derived from
// usePostings() (see useStockEntries.ts), not stored here.
export const STOCK_NORMAL_SIDE: LedgerNormalSide = 'Dr';
