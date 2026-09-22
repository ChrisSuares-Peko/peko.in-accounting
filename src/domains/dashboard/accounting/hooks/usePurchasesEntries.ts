import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_PURCHASES_ENTRIES, EMPTY_PURCHASES_ENTRIES } from '../data/purchasesData';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const usePurchasesEntries = (): GeneralLedgerEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_PURCHASES_ENTRIES : EMPTY_PURCHASES_ENTRIES;
};
