import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_BOOKS_ACCOUNTS, EMPTY_BOOKS_ACCOUNTS } from '../data/booksAccountsData';
import { BooksAccount } from '../types/booksAccount';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useBooksAccounts = (): BooksAccount[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_BOOKS_ACCOUNTS : EMPTY_BOOKS_ACCOUNTS;
};
