import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_RECENT_TRANSACTIONS, EMPTY_RECENT_TRANSACTIONS } from '../data/transactionData';
import { RecentTransaction } from '../types/transaction';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useRecentTransactions = (): RecentTransaction[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_RECENT_TRANSACTIONS : EMPTY_RECENT_TRANSACTIONS;
};
