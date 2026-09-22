import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_LIABILITIES_ENTRIES, EMPTY_LIABILITIES_ENTRIES } from '../data/liabilitiesData';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useLiabilitiesEntries = (): GeneralLedgerEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_LIABILITIES_ENTRIES : EMPTY_LIABILITIES_ENTRIES;
};
