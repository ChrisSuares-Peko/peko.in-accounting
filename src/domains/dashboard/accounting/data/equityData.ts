import { GeneralLedgerEntry, LedgerNormalSide } from '../types/generalLedger';

export const EQUITY_NORMAL_SIDE: LedgerNormalSide = 'Cr';

export const DUMMY_EQUITY_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'equity-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Cr',
        amount: 4550000,
        isOpeningBalance: true,
    },
    {
        id: 'equity-2',
        date: '2026-09-19',
        displayDate: '19 Sep',
        particulars: 'Current Year Earnings — Profit for the period',
        side: 'Cr',
        amount: 330000,
    },
    {
        id: 'equity-3',
        date: '2026-09-12',
        displayDate: '12 Sep',
        particulars: 'Drawings — Owner',
        side: 'Dr',
        amount: 50000,
    },
];

export const EMPTY_EQUITY_ENTRIES: GeneralLedgerEntry[] = [];
