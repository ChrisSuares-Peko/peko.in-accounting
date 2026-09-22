export interface CashBookEntry {
    id: string;
    // ISO date (YYYY-MM-DD) — for real date comparisons/sorting/range filtering.
    date: string;
    // Display string, e.g. "6 Sep".
    displayDate: string;
    // Counterparty name only — the "To"/"By" prefix is derived at render time
    // from `side`, not stored here.
    particulars: string;
    side: 'Dr' | 'Cr';
    account: 'cash' | 'bank';
    amount: number;
    // true only for the opening balance row.
    isOpeningBalance?: boolean;
}
