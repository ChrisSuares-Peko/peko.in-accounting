import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { ASSETS_NORMAL_SIDE } from '../data/assetsData';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesForHead } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts.
export const useAssetsEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return generalLedgerEntriesForHead(postings, chart, 'assets', ASSETS_NORMAL_SIDE);
};
