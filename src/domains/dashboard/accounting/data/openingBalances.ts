import { Posting } from '../types/posting';

export const OPENING_BALANCE_DATE = '2026-01-01';

const OPENING_BALANCE_EQUITY = '5099';

// One posting per opening balance, each Dr [account] / Cr "Opening Balance
// Equity" (or the mirror, Dr "Opening Balance Equity" / Cr [account], for
// accounts that open on the Cr side) — structurally identical Postings, not a
// special-cased data shape. Verified balanced: the Dr-opening accounts below
// sum to ₹65,60,000, exactly matching the Cr-opening accounts' ₹65,60,000, so
// Opening Balance Equity nets to exactly zero once every line here is posted.
// Do not adjust any of these without re-verifying that balance.
//
// No opening AR/AP balances (every customer/vendor relationship starts fresh
// on 1 Jan 2026) and no opening Reserves & Surplus (this is a first full year
// of generated history) — so neither appears here.
export const OPENING_BALANCES: Posting[] = [
    {
        id: 'ob-1001',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0001',
        narration: 'Opening Balance — Petty Cash',
        drAccountId: '1001',
        crAccountId: OPENING_BALANCE_EQUITY,
        amount: 20000,
        source: 'Manual',
    },
    {
        id: 'ob-1101',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0002',
        narration: 'Opening Balance — HDFC Bank – Current A/c',
        drAccountId: '1101',
        crAccountId: OPENING_BALANCE_EQUITY,
        amount: 1200000,
        source: 'Manual',
    },
    {
        id: 'ob-1102',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0003',
        narration: 'Opening Balance — ICICI Bank – Current A/c',
        drAccountId: '1102',
        crAccountId: OPENING_BALANCE_EQUITY,
        amount: 800000,
        source: 'Manual',
    },
    {
        id: 'ob-2001',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0004',
        narration: 'Opening Balance — Raw Materials',
        drAccountId: '2001',
        crAccountId: OPENING_BALANCE_EQUITY,
        amount: 350000,
        source: 'Manual',
    },
    {
        id: 'ob-2002',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0005',
        narration: 'Opening Balance — Finished Goods – Trading Stock',
        drAccountId: '2002',
        crAccountId: OPENING_BALANCE_EQUITY,
        amount: 650000,
        source: 'Manual',
    },
    {
        id: 'ob-3101',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0006',
        narration: 'Opening Balance — Plant & Machinery',
        drAccountId: '3101',
        crAccountId: OPENING_BALANCE_EQUITY,
        amount: 3500000,
        source: 'Manual',
    },
    {
        id: 'ob-3190',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0007',
        narration: 'Opening Balance — Accumulated Depreciation',
        drAccountId: OPENING_BALANCE_EQUITY,
        crAccountId: '3190',
        amount: 200000,
        source: 'Manual',
    },
    {
        id: 'ob-3201',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0008',
        narration: 'Opening Balance — Prepaid Expenses',
        drAccountId: '3201',
        crAccountId: OPENING_BALANCE_EQUITY,
        amount: 40000,
        source: 'Manual',
    },
    {
        id: 'ob-4201',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0009',
        narration: 'Opening Balance — Bank Loan – HDFC Bank',
        drAccountId: OPENING_BALANCE_EQUITY,
        crAccountId: '4201',
        amount: 2800000,
        source: 'Manual',
    },
    {
        id: 'ob-4302',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0010',
        narration: 'Opening Balance — Accrued Expenses',
        drAccountId: OPENING_BALANCE_EQUITY,
        crAccountId: '4302',
        amount: 30000,
        source: 'Manual',
    },
    {
        id: 'ob-5001',
        date: OPENING_BALANCE_DATE,
        voucherType: 'Journal',
        voucherNo: 'OB-0011',
        narration: "Opening Balance — Proprietor's Capital A/c",
        drAccountId: OPENING_BALANCE_EQUITY,
        crAccountId: '5001',
        amount: 3530000,
        source: 'Manual',
    },
];
