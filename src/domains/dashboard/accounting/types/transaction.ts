export interface RecentTransaction {
    id: string;
    // ISO date (YYYY-MM-DD) — formatted for display where it's rendered.
    date: string;
    ledger: string;
    narration: string;
    debit: number;
    credit: number;
}
