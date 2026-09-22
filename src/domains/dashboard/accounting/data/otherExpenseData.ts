import { GeneralLedgerEntry, LedgerNormalSide } from '../types/generalLedger';

export const OTHER_EXPENSE_NORMAL_SIDE: LedgerNormalSide = 'Dr';

export const DUMMY_OTHER_EXPENSE_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'other-expense-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Dr',
        amount: 1495000,
        isOpeningBalance: true,
    },
    {
        id: 'other-expense-2',
        date: '2026-09-16',
        displayDate: '16 Sep',
        particulars: 'Rent Expense — September',
        side: 'Dr',
        amount: 85000,
    },
    {
        id: 'other-expense-3',
        date: '2026-09-04',
        displayDate: '4 Sep',
        particulars: 'Salaries & Wages — September',
        side: 'Dr',
        amount: 240000,
    },
    {
        id: 'other-expense-4',
        date: '2026-09-14',
        displayDate: '14 Sep',
        particulars: 'Electricity Board',
        side: 'Dr',
        amount: 18600,
    },
    {
        id: 'other-expense-5',
        date: '2026-09-08',
        displayDate: '8 Sep',
        particulars: 'Staples & Co. — Stationery',
        side: 'Dr',
        amount: 12300,
    },
    {
        id: 'other-expense-6',
        date: '2026-09-19',
        displayDate: '19 Sep',
        particulars: 'Bank Charges',
        side: 'Dr',
        amount: 9100,
    },
];

export const EMPTY_OTHER_EXPENSE_ENTRIES: GeneralLedgerEntry[] = [];
