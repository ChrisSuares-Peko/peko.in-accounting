import { GeneralLedgerEntry, LedgerNormalSide } from '../types/generalLedger';

export const OTHER_INCOME_NORMAL_SIDE: LedgerNormalSide = 'Cr';

export const DUMMY_OTHER_INCOME_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'other-income-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Cr',
        amount: 140000,
        isOpeningBalance: true,
    },
    {
        id: 'other-income-2',
        date: '2026-09-11',
        displayDate: '11 Sep',
        particulars: 'Interest Received — Fixed Deposit',
        side: 'Cr',
        amount: 38000,
    },
    {
        id: 'other-income-3',
        date: '2026-09-17',
        displayDate: '17 Sep',
        particulars: 'Discount Received — Anand Traders',
        side: 'Cr',
        amount: 7000,
    },
];

export const EMPTY_OTHER_INCOME_ENTRIES: GeneralLedgerEntry[] = [];
