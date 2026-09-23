import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_POSTINGS, EMPTY_POSTINGS } from '../data/postingsData';
import { Posting } from '../types/posting';

// The ONE canonical transaction log every other accounting hook derives its
// view from. Mirrors useLedgerData()'s dataMode pattern — "Empty" means a
// brand-new set of books with no postings at all, not even the opening
// balances (see postingsData.ts).
export const usePostings = (): Posting[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_POSTINGS : EMPTY_POSTINGS;
};
