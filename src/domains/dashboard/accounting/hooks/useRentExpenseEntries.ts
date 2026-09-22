import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_RENT_EXPENSE_ENTRIES, EMPTY_RENT_EXPENSE_ENTRIES } from '../data/rentExpenseData';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useRentExpenseEntries = (): GeneralLedgerEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_RENT_EXPENSE_ENTRIES : EMPTY_RENT_EXPENSE_ENTRIES;
};
