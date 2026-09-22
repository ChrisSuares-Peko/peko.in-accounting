export type NotificationCategory = 'payable' | 'receivable' | 'tax' | 'payroll';

export interface AccountingNotification {
    id: string;
    category: NotificationCategory;
    title: string;
    subtitle: string;
    daysUntilDue: number;
}
