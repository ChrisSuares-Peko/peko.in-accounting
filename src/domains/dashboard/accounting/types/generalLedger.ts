// Shared shape for the 8 non-Cash&Bank heads' transaction-level ledgers — a single
// Amount column, unlike CashBookEntry's Cash/Bank split (that split is specific to
// the Cash & Bank ledger).
export interface GeneralLedgerEntry {
    id: string;
    // ISO date (YYYY-MM-DD) — for real date comparisons/sorting/range filtering.
    date: string;
    // Display string, e.g. "6 Sep".
    displayDate: string;
    // Counterparty/description only — the "To"/"By" prefix is derived at render
    // time from `side`, never stored here.
    particulars: string;
    side: 'Dr' | 'Cr';
    amount: number;
    // true only for the opening balance row.
    isOpeningBalance?: boolean;
}

// Which side a head's opening balance sits on. A Dr-normal head shows its opening
// balance on the Dr side and a computed "Balance c/d" plug on the Cr side; a
// Cr-normal head does the reverse.
export type LedgerNormalSide = 'Dr' | 'Cr';
