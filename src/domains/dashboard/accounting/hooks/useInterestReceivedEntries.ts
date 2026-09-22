import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import {
    DUMMY_INTEREST_RECEIVED_ENTRIES,
    EMPTY_INTEREST_RECEIVED_ENTRIES,
} from '../data/interestReceivedData';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useInterestReceivedEntries = (): GeneralLedgerEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_INTEREST_RECEIVED_ENTRIES : EMPTY_INTEREST_RECEIVED_ENTRIES;
};
