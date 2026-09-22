export type ChartOfAccountsHead =
    | 'cashBank'
    | 'stock'
    | 'assets'
    | 'liabilities'
    | 'equity'
    | 'sales'
    | 'purchases'
    | 'otherIncome'
    | 'otherExpense';

export interface ChartOfAccountsEntry {
    id: string;
    code: string;
    name: string;
    head: ChartOfAccountsHead;
    // Sub-heading within the head, e.g. "Accounts Payable".
    group: string;
    normalBalance: 'Dr' | 'Cr';
    // Omitted for Sales/Purchases/Other Income/Other Expense — these are flow
    // accounts, not balance-sheet items, so Current/Non-Current doesn't apply.
    classification?: 'Current' | 'Non-Current';
}
