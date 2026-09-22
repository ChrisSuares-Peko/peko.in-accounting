import { AccountingNotification } from '../types/notification';

// Sample dues/reminders spanning all 4 categories and all 3 urgency tiers
// (<=2 days, 3-7 days, 8+ days — see AccountingSectionTabs-adjacent urgency rule
// used on the dashboard page).
export const DUMMY_NOTIFICATIONS: AccountingNotification[] = [
    {
        id: 'notif-1',
        category: 'payable',
        title: 'Shree Packaging Co. invoice due',
        subtitle: '₹76,500 outstanding',
        daysUntilDue: 0,
    },
    {
        id: 'notif-2',
        category: 'tax',
        title: 'GSTR-3B filing due',
        subtitle: 'August return',
        daysUntilDue: 2,
    },
    {
        id: 'notif-3',
        category: 'receivable',
        title: 'Rahul Enterprises payment expected',
        subtitle: '₹2,45,000 invoice',
        daysUntilDue: 5,
    },
    {
        id: 'notif-4',
        category: 'payroll',
        title: 'Salary disbursement',
        subtitle: 'September payroll',
        daysUntilDue: 12,
    },
];

export const EMPTY_NOTIFICATIONS: AccountingNotification[] = [];
