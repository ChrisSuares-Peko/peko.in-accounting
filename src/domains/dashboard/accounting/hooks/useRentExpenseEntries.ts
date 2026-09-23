import { usePostings } from './usePostings';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesFor } from '../utils/postingsMath';

const RENT_EXPENSE_ACCOUNT_ID = '9001';

// Derived from the canonical posting log — see postingsMath.ts.
export const useRentExpenseEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    return generalLedgerEntriesFor(postings, [RENT_EXPENSE_ACCOUNT_ID], 'Dr');
};
