import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_CASH_BOOK_ENTRIES, EMPTY_CASH_BOOK_ENTRIES } from '../data/cashBookData';
import { CashBookEntry } from '../types/cashBook';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useCashBookEntries = (): CashBookEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_CASH_BOOK_ENTRIES : EMPTY_CASH_BOOK_ENTRIES;
};
