import dayjs from 'dayjs';

import { usePostings } from './usePostings';
import { DayBookEntry } from '../types/dayBook';

// Every Posting IS a Day Book entry — mapped directly, most recent first. All
// of this generated history is settled ('Posted'); the Pending Review/Pending
// Approval statuses stay available in DayBookEntryStatus for anything created
// interactively after this data loads.
export const useDayBookEntries = (): DayBookEntry[] => {
    const postings = usePostings();

    return [...postings]
        .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
        .map(posting => ({
            id: posting.id,
            date: posting.date,
            when: dayjs(posting.date).format('D MMM'),
            voucher: posting.voucherNo,
            type: posting.voucherType,
            source: posting.source,
            narration: posting.narration,
            amount: posting.amount,
            status: 'Posted',
        }));
};
