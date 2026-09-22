import { GeneralLedgerEntry, LedgerNormalSide } from '../types/generalLedger';

export const PURCHASES_NORMAL_SIDE: LedgerNormalSide = 'Dr';

// Note: office supplies/stationery never appears here — that's an operating
// expense, not cost of goods, so it belongs on Other Expense only (see
// otherExpenseData.ts's "Staples & Co. — Stationery" entry).
export const DUMMY_PURCHASES_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'purchases-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Dr',
        amount: 2680000,
        isOpeningBalance: true,
    },
    {
        id: 'purchases-2',
        date: '2026-09-05',
        displayDate: '5 Sep',
        particulars: 'Anand Traders — Vendor Bill',
        side: 'Dr',
        amount: 76400,
    },
    {
        id: 'purchases-3',
        date: '2026-09-10',
        displayDate: '10 Sep',
        particulars: 'Shree Packaging Co. — Vendor Bill',
        side: 'Dr',
        amount: 118500,
    },
    {
        id: 'purchases-4',
        date: '2026-09-08',
        displayDate: '8 Sep',
        particulars: 'Anand Traders — Packaging Materials',
        side: 'Dr',
        amount: 12300,
    },
    {
        id: 'purchases-5',
        date: '2026-09-12',
        displayDate: '12 Sep',
        particulars: 'Verma & Sons — Raw Material Purchase',
        side: 'Dr',
        amount: 280000,
    },
    {
        id: 'purchases-6',
        date: '2026-09-16',
        displayDate: '16 Sep',
        particulars: 'Anand Traders — Purchase Return',
        side: 'Cr',
        amount: 27200,
    },
];

export const EMPTY_PURCHASES_ENTRIES: GeneralLedgerEntry[] = [];
