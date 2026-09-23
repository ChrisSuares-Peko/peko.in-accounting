import { useChartOfAccounts } from './useChartOfAccounts';
import { usePostings } from './usePostings';
import { EQUITY_NORMAL_SIDE } from '../data/equityData';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesForHead } from '../utils/postingsMath';

// Derived from the canonical posting log — see postingsMath.ts.
export const useEquityEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    const chart = useChartOfAccounts();
    return generalLedgerEntriesForHead(postings, chart, 'equity', EQUITY_NORMAL_SIDE);
};
