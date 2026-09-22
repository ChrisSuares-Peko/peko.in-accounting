import { RecentTransaction } from '../types/transaction';

// Sample recent activity for the accounting dashboard — one leg per row, viewed
// from that row's own ledger (standard "recent transactions" list convention, not
// a full double-entry pair per row).
export const DUMMY_RECENT_TRANSACTIONS: RecentTransaction[] = [
    {
        id: 'txn-1',
        date: '2026-09-22',
        ledger: 'HDFC Bank – Current A/c',
        narration: 'Payment received – Rahul Enterprises',
        debit: 245000,
        credit: 0,
    },
    {
        id: 'txn-2',
        date: '2026-09-21',
        ledger: 'Sales – Domestic',
        narration: 'Invoice #INV-1042 – Zenith Traders',
        debit: 0,
        credit: 185000,
    },
    {
        id: 'txn-3',
        date: '2026-09-20',
        ledger: 'Rent Expense',
        narration: 'Office rent – September',
        debit: 60000,
        credit: 0,
    },
    {
        id: 'txn-4',
        date: '2026-09-19',
        ledger: 'GST Payable',
        narration: 'GSTR-3B payment – August',
        debit: 38000,
        credit: 0,
    },
    {
        id: 'txn-5',
        date: '2026-09-18',
        ledger: 'Accounts Payable – Shree Packaging Co.',
        narration: 'Purchase invoice – packaging materials',
        debit: 0,
        credit: 42500,
    },
    {
        id: 'txn-6',
        date: '2026-09-17',
        ledger: 'Salaries & Wages',
        narration: 'Salary disbursement – September (partial)',
        debit: 155000,
        credit: 0,
    },
];

export const EMPTY_RECENT_TRANSACTIONS: RecentTransaction[] = [];
