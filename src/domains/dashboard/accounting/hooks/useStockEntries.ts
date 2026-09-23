import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { STOCK_NORMAL_SIDE } from '../data/stockData';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesForHead } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts. Note the
// generator (postingsGenerator.ts) never posts against Stock: nothing in the
// spec models inventory movement, so this head sits at its 1 Jan opening
// balance all period, same as several other chart accounts with no activity.
export const useStockEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return generalLedgerEntriesForHead(postings, chart, 'stock', STOCK_NORMAL_SIDE);
};
