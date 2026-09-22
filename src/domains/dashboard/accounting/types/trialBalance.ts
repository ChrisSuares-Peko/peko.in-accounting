export interface TrialBalanceRow {
    id: string;
    name: string;
    debit: number | null;
    credit: number | null;
    hasDetail: boolean;
    detailRoute?: string;
}
