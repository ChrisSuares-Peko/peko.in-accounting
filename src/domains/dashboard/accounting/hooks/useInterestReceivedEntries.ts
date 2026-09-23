import { usePostings } from './usePostings';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { generalLedgerEntriesFor } from '../utils/postingsMath';

const INTEREST_RECEIVED_ACCOUNT_ID = '8001';

// Derived from the canonical posting log — see postingsMath.ts.
export const useInterestReceivedEntries = (): GeneralLedgerEntry[] => {
    const postings = usePostings();
    return generalLedgerEntriesFor(postings, [INTEREST_RECEIVED_ACCOUNT_ID], 'Cr');
};
