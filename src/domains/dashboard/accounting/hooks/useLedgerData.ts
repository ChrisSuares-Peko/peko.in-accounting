import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { LedgerLineItem } from '../types/ledger';
import { ledgerLineItemsFromPostings } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts.
export const useLedgerData = (): LedgerLineItem[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return ledgerLineItemsFromPostings(postings, chart);
};
