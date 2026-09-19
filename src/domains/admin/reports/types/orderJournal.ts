export type JournalRecordStatus = Record<string, boolean> | null;

export type OrderJournalInfo = {
    id: number;
    transactionDate: string;
    corporateTxnId: string;
    transactionCategory: string | null;
    credentialId: number | null;
    serviceOperator: {
        id: number | null;
        serviceProvider: string;
        serviceCategory: string;
    } | null;
    credential: {
        id: number;
        name: string;
        username: string;
        email: string;
    } | null;
    order: {
        id: number;
        corporateTxnId: string;
        amountInINR: string | null;
        surcharge: string | null;
        paymentMode: string | null;
        paymentModeResponse: string | null;
        status: string | null;
        journalRecordStatus: JournalRecordStatus;
        journalData: Record<string, any> | null;
    };
};

export interface orderJournalResponse {
    result: OrderJournalInfo[];
    totalData: number;
}

export type JournalKey = 'transaction' | 'refund' | 'adminRefund' | 'cashback' | 'cashbackReversal';

export type RetryJournalPayload = {
    journalData?: Record<string, number>;
    amount?: number;
    refundAmount?: number;
    totalOrderAmount?: number;
};

export type RetryLineItem = {
    accountId: string;
    direction: 'debit' | 'credit';
    amount: number;
    description?: string;
};

export type JournalRetryResult = {
    success: boolean;
    providerJournalId?: string | null;
    skipped?: boolean;
    reason?: string;
    error?: string;
};
