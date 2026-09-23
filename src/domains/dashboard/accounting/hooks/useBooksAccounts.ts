import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { BooksAccount } from '../types/booksAccount';
import { booksAccountsFromPostings } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts.
export const useBooksAccounts = (): BooksAccount[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return booksAccountsFromPostings(postings, chart);
};
