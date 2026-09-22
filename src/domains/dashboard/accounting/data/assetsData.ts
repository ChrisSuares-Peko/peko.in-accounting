import { GeneralLedgerEntry, LedgerNormalSide } from '../types/generalLedger';

export const ASSETS_NORMAL_SIDE: LedgerNormalSide = 'Dr';

export const DUMMY_ASSETS_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'assets-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Dr',
        amount: 3820000,
        isOpeningBalance: true,
    },
    {
        id: 'assets-2',
        date: '2026-09-06',
        displayDate: '6 Sep',
        particulars: 'Rahul Enterprises — Invoice Raised',
        side: 'Dr',
        amount: 245000,
    },
    {
        id: 'assets-3',
        date: '2026-09-09',
        displayDate: '9 Sep',
        particulars: 'Kavya Textiles — Invoice Raised',
        side: 'Dr',
        amount: 185000,
    },
    {
        id: 'assets-4',
        date: '2026-09-13',
        displayDate: '13 Sep',
        particulars: 'Office Equipment — Purchased',
        side: 'Dr',
        amount: 210000,
    },
    {
        id: 'assets-5',
        date: '2026-09-16',
        displayDate: '16 Sep',
        particulars: 'Depreciation — Office Equipment',
        side: 'Cr',
        amount: 52500,
    },
    {
        id: 'assets-6',
        date: '2026-09-17',
        displayDate: '17 Sep',
        particulars: 'Prepaid Insurance Expensed',
        side: 'Cr',
        amount: 50000,
    },
];

export const EMPTY_ASSETS_ENTRIES: GeneralLedgerEntry[] = [];
