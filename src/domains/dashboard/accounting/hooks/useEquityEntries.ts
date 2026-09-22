import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_EQUITY_ENTRIES, EMPTY_EQUITY_ENTRIES } from '../data/equityData';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useEquityEntries = (): GeneralLedgerEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_EQUITY_ENTRIES : EMPTY_EQUITY_ENTRIES;
};
