export const DAY_BOOK_ENTRY_TYPES = [
    'Payment',
    'Receipt',
    'Contra',
    'Journal',
    'Sales',
    'Purchase',
    'Credit Note',
    'Debit Note',
    'Stock Journal',
] as const;
export type DayBookEntryType = (typeof DAY_BOOK_ENTRY_TYPES)[number];

export const DAY_BOOK_ENTRY_SOURCES = [
    'Invoicing',
    'Purchase',
    'Payroll',
    'Corporate Card',
    'Travel',
    'Manual',
] as const;
export type DayBookEntrySource = (typeof DAY_BOOK_ENTRY_SOURCES)[number];

export const DAY_BOOK_ENTRY_STATUSES = [
    'Posted',
    'Pending Review',
    'Pending Approval',
    'Rejected',
] as const;
export type DayBookEntryStatus = (typeof DAY_BOOK_ENTRY_STATUSES)[number];

export interface DayBookEntry {
    id: string;
    // ISO date (YYYY-MM-DD) — for real date comparisons (e.g. "is this posted today").
    date: string;
    // Display string, e.g. "19 Sep, 11:42 AM".
    when: string;
    voucher: string;
    type: DayBookEntryType;
    source: DayBookEntrySource;
    narration: string;
    amount: number;
    status: DayBookEntryStatus;
}
