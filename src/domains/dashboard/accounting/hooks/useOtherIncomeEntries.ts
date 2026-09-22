import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_OTHER_INCOME_ENTRIES, EMPTY_OTHER_INCOME_ENTRIES } from '../data/otherIncomeData';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useOtherIncomeEntries = (): GeneralLedgerEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_OTHER_INCOME_ENTRIES : EMPTY_OTHER_INCOME_ENTRIES;
};
