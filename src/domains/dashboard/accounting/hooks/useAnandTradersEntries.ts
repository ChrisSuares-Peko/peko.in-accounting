import { usePostings } from './usePostings';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesFor } from '../utils/postingsMath';

const ANAND_TRADERS_ACCOUNT_ID = '4002';

// Derived from the canonical posting log — see postingsMath.ts.
export const useAnandTradersEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    return generalLedgerEntriesFor(postings, [ANAND_TRADERS_ACCOUNT_ID], 'Cr');
};
