export const VOUCHER_TYPES = [
    'Payment',
    'Receipt',
    'Contra',
    'Journal',
    'Sales',
    'Purchase',
    'Credit Note',
    'Debit Note',
] as const;
export type VoucherType = (typeof VOUCHER_TYPES)[number];

export const POSTING_SOURCES = ['Invoicing', 'Purchase', 'Payroll', 'Corporate Card', 'Manual'] as const;
export type PostingSource = (typeof POSTING_SOURCES)[number];

// The ONE canonical, append-only double-entry log every accounting page derives
// its view from by filtering/aggregating — nothing downstream is hand-typed
// separately. drAccountId/crAccountId always reference an id from
// useChartOfAccounts(); never invent an id that isn't in that list.
export interface Posting {
    id: string;
    date: string;
    voucherType: VoucherType;
    voucherNo: string;
    narration: string;
    drAccountId: string;
    crAccountId: string;
    amount: number;
    source: PostingSource;
}
