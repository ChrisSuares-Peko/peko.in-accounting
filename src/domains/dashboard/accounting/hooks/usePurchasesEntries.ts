import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { PURCHASES_NORMAL_SIDE } from '../data/purchasesData';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesForHead } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts.
export const usePurchasesEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return generalLedgerEntriesForHead(postings, chart, 'purchases', PURCHASES_NORMAL_SIDE);
};
