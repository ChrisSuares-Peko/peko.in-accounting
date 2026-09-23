import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { OTHER_EXPENSE_NORMAL_SIDE } from '../data/otherExpenseData';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesForHead } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts.
export const useOtherExpenseEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return generalLedgerEntriesForHead(postings, chart, 'otherExpense', OTHER_EXPENSE_NORMAL_SIDE);
};
