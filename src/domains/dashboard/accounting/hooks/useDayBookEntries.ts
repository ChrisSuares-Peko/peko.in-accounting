import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_DAY_BOOK_ENTRIES, EMPTY_DAY_BOOK_ENTRIES } from '../data/dayBookData';
import { DayBookEntry } from '../types/dayBook';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useDayBookEntries = (): DayBookEntry[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_DAY_BOOK_ENTRIES : EMPTY_DAY_BOOK_ENTRIES;
};
