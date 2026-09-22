import { GeneralLedgerEntry, LedgerNormalSide } from '../types/generalLedger';

export const STOCK_NORMAL_SIDE: LedgerNormalSide = 'Dr';

export const DUMMY_STOCK_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'stock-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Dr',
        amount: 940000,
        isOpeningBalance: true,
    },
    {
        id: 'stock-2',
        date: '2026-09-05',
        displayDate: '5 Sep',
        particulars: 'Anand Traders — Goods Received',
        side: 'Dr',
        amount: 360000,
    },
    {
        id: 'stock-3',
        date: '2026-09-11',
        displayDate: '11 Sep',
        particulars: 'Verma & Sons — Goods Received',
        side: 'Dr',
        amount: 240000,
    },
    {
        id: 'stock-4',
        date: '2026-09-15',
        displayDate: '15 Sep',
        particulars: 'Cost of Goods Sold — Sale to Kavya Textiles',
        side: 'Cr',
        amount: 145000,
    },
    {
        id: 'stock-5',
        date: '2026-09-18',
        displayDate: '18 Sep',
        particulars: 'Cost of Goods Sold — Sale to Rahul Enterprises',
        side: 'Cr',
        amount: 110000,
    },
];

export const EMPTY_STOCK_ENTRIES: GeneralLedgerEntry[] = [];
