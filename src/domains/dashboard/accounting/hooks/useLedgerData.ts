import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_LEDGER_DATA, EMPTY_LEDGER_DATA } from '../data/ledgerData';
import { LedgerLineItem } from '../types/ledger';

// Reads the app-wide data mode toggle (see DataModeToggle) and returns the matching
// ledger dataset. Pages needing ledger figures should call this instead of importing
// DUMMY_LEDGER_DATA/EMPTY_LEDGER_DATA directly, so they react to the toggle automatically.
export const useLedgerData = (): LedgerLineItem[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_LEDGER_DATA : EMPTY_LEDGER_DATA;
};
