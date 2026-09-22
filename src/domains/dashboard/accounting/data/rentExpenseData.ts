import { GeneralLedgerEntry } from '../types/generalLedger';

export const DUMMY_RENT_EXPENSE_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'rent-expense-detail-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Dr',
        amount: 425000,
        isOpeningBalance: true,
    },
    {
        id: 'rent-expense-detail-2',
        date: '2026-09-16',
        displayDate: '16 Sep',
        particulars: 'Bank — Office Rent, September',
        side: 'Dr',
        amount: 85000,
    },
];

export const EMPTY_RENT_EXPENSE_ENTRIES: GeneralLedgerEntry[] = [];
