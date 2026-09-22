// Chart-of-accounts head a ledger line item rolls up under. Cash & Bank, Stock, Assets,
// Liabilities and Equity carry a running BALANCE (opening carries forward year to year);
// Sales, Purchases, Other Income and Other Expense are period FLOWs that always reset to
// a zero opening balance at the start of a financial year.
export type LedgerHead =
    | 'cashBank'
    | 'stock'
    | 'assets'
    | 'liabilities'
    | 'equity'
    | 'sales'
    | 'purchases'
    | 'otherIncome'
    | 'otherExpense';

export interface LedgerLineItem {
    id: string;
    head: LedgerHead;
    name: string;
    // Which side (Dr/Cr) increases this account. Closing balance = opening + debit -
    // credit for a Dr-normal account, or opening + credit - debit for a Cr-normal one.
    normalBalance: 'Dr' | 'Cr';
    openingBalance: number;
    debit: number;
    credit: number;
    closingBalance: number;
    // Finer-grained tag within a head, for rollups that need to isolate trade
    // receivables/payables from other assets/liabilities (fixed assets, GST/TDS
    // payable, etc.) — only set on the line items it actually applies to.
    category?: 'receivable' | 'payable';
}
