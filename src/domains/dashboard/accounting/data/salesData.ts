import { GeneralLedgerEntry, LedgerNormalSide } from '../types/generalLedger';

export const SALES_NORMAL_SIDE: LedgerNormalSide = 'Cr';

export const DUMMY_SALES_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'sales-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Cr',
        amount: 4420000,
        isOpeningBalance: true,
    },
    {
        id: 'sales-2',
        date: '2026-09-06',
        displayDate: '6 Sep',
        particulars: 'Kavya Textiles — Invoice INV-1083',
        side: 'Cr',
        amount: 185000,
    },
    {
        id: 'sales-3',
        date: '2026-09-09',
        displayDate: '9 Sep',
        particulars: 'Verma & Sons — Invoice INV-1084',
        side: 'Cr',
        amount: 95000,
    },
    {
        id: 'sales-4',
        date: '2026-09-18',
        displayDate: '18 Sep',
        particulars: 'Rahul Enterprises — Invoice INV-1082',
        side: 'Cr',
        amount: 245000,
    },
    {
        id: 'sales-5',
        date: '2026-09-15',
        displayDate: '15 Sep',
        particulars: 'Meridian Textiles — Invoice INV-1078',
        side: 'Cr',
        amount: 380000,
    },
    {
        id: 'sales-6',
        date: '2026-09-14',
        displayDate: '14 Sep',
        particulars: 'Aarav Distributors — Sales Return, Credit Note',
        side: 'Dr',
        amount: 50000,
    },
];

export const EMPTY_SALES_ENTRIES: GeneralLedgerEntry[] = [];
