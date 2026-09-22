import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_OTHER_EXPENSE_ENTRIES, EMPTY_OTHER_EXPENSE_ENTRIES } from '../data/otherExpenseData';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useOtherExpenseEntries = (): GeneralLedgerEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_OTHER_EXPENSE_ENTRIES : EMPTY_OTHER_EXPENSE_ENTRIES;
};
