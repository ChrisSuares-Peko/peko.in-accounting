import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_ANAND_TRADERS_ENTRIES, EMPTY_ANAND_TRADERS_ENTRIES } from '../data/anandTradersData';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useAnandTradersEntries = (): GeneralLedgerEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_ANAND_TRADERS_ENTRIES : EMPTY_ANAND_TRADERS_ENTRIES;
};
