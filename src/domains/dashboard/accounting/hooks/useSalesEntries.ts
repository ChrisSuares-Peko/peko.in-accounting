import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { SALES_NORMAL_SIDE } from '../data/salesData';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesForHead } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts.
export const useSalesEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return generalLedgerEntriesForHead(postings, chart, 'sales', SALES_NORMAL_SIDE);
};
