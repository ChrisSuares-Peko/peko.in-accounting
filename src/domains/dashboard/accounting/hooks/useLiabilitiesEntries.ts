import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { LIABILITIES_NORMAL_SIDE } from '../data/liabilitiesData';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesForHead } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts.
export const useLiabilitiesEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return generalLedgerEntriesForHead(postings, chart, 'liabilities', LIABILITIES_NORMAL_SIDE);
};
