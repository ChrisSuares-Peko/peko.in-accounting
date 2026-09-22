import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_ASSETS_ENTRIES, EMPTY_ASSETS_ENTRIES } from '../data/assetsData';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useAssetsEntries = (): GeneralLedgerEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_ASSETS_ENTRIES : EMPTY_ASSETS_ENTRIES;
};
