import { GeneralLedgerEntry, LedgerNormalSide } from '../types/generalLedger';

export const LIABILITIES_NORMAL_SIDE: LedgerNormalSide = 'Cr';

export const DUMMY_LIABILITIES_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'liabilities-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Cr',
        amount: 3180000,
        isOpeningBalance: true,
    },
    {
        id: 'liabilities-2',
        date: '2026-09-07',
        displayDate: '7 Sep',
        particulars: 'Anand Traders — Bill Received',
        side: 'Cr',
        amount: 250000,
    },
    {
        id: 'liabilities-3',
        date: '2026-09-14',
        displayDate: '14 Sep',
        particulars: 'GST Payable — Output Tax, September',
        side: 'Cr',
        amount: 383500,
    },
    {
        id: 'liabilities-4',
        date: '2026-09-10',
        displayDate: '10 Sep',
        particulars: 'Shree Packaging Co. — Payment Made',
        side: 'Dr',
        amount: 118500,
    },
    {
        id: 'liabilities-5',
        date: '2026-09-18',
        displayDate: '18 Sep',
        particulars: 'TDS Payable — Deposited',
        side: 'Dr',
        amount: 75000,
    },
];

export const EMPTY_LIABILITIES_ENTRIES: GeneralLedgerEntry[] = [];
