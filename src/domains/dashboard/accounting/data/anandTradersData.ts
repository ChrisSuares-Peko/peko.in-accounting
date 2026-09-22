import { GeneralLedgerEntry } from '../types/generalLedger';

export const DUMMY_ANAND_TRADERS_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'anand-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Cr',
        amount: 148500,
        isOpeningBalance: true,
    },
    {
        id: 'anand-2',
        date: '2026-09-05',
        displayDate: '5 Sep',
        particulars: 'Purchases — Vendor Bill',
        side: 'Cr',
        amount: 76400,
    },
    {
        id: 'anand-3',
        date: '2026-09-12',
        displayDate: '12 Sep',
        particulars: 'Packaging Materials',
        side: 'Cr',
        amount: 12300,
    },
    {
        id: 'anand-4',
        date: '2026-09-16',
        displayDate: '16 Sep',
        particulars: 'Purchase Return',
        side: 'Dr',
        amount: 27200,
    },
];

export const EMPTY_ANAND_TRADERS_ENTRIES: GeneralLedgerEntry[] = [];
