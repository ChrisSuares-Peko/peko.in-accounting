import { GeneralLedgerEntry } from '../types/generalLedger';

export const DUMMY_INTEREST_RECEIVED_ENTRIES: GeneralLedgerEntry[] = [
    {
        id: 'interest-received-detail-1',
        date: '2026-09-01',
        displayDate: '1 Sep',
        particulars: 'Balance b/d',
        side: 'Cr',
        amount: 82000,
        isOpeningBalance: true,
    },
    {
        id: 'interest-received-detail-2',
        date: '2026-09-11',
        displayDate: '11 Sep',
        particulars: 'Bank — Fixed Deposit Interest',
        side: 'Cr',
        amount: 38000,
    },
];

export const EMPTY_INTEREST_RECEIVED_ENTRIES: GeneralLedgerEntry[] = [];
