import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { OTHER_INCOME_NORMAL_SIDE } from '../data/otherIncomeData';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesForHead } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts.
export const useOtherIncomeEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return generalLedgerEntriesForHead(postings, chart, 'otherIncome', OTHER_INCOME_NORMAL_SIDE);
};
