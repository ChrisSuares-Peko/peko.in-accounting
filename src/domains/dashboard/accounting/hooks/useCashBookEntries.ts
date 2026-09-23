import dayjs from 'dayjs';

import { usePostings } from './usePostings';
import { OPENING_BALANCE_DATE } from '../data/openingBalances';
import { CashBookEntry } from '../types/cashBook';
import { splitOpeningAndActivity } from '../utils/postingsMath';

// Cash & Bank, split by which specific account each Posting touches — Petty
// Cash is "cash", every bank current/overdraft account is "bank" (mirrors the
// binary split CashBookEntry has always used).
const CASH_ACCOUNT_IDS = new Set(['1001']);
const BANK_ACCOUNT_IDS = new Set(['1101', '1102', '1103']);

export const useCashBookEntries = (): CashBookEntry[] => {
    const postings = usePostings();

    const { opening, activity } = splitOpeningAndActivity(postings);

    const openingRow = (ids: Set<string>, account: 'cash' | 'bank', id: string): CashBookEntry => {
        let openDr = 0;
        let openCr = 0;
        opening.forEach(p => {
            if (ids.has(p.drAccountId)) openDr += p.amount;
            if (ids.has(p.crAccountId)) openCr += p.amount;
        });
        return {
            id,
            date: OPENING_BALANCE_DATE,
            displayDate: dayjs(OPENING_BALANCE_DATE).format('D MMM'),
            particulars: 'Balance b/d',
            side: 'Dr',
            account,
            amount: openDr - openCr,
            isOpeningBalance: true,
        };
    };

    const entries: CashBookEntry[] = [
        openingRow(CASH_ACCOUNT_IDS, 'cash', 'opening-cash'),
        openingRow(BANK_ACCOUNT_IDS, 'bank', 'opening-bank'),
    ];

    activity.forEach(posting => {
        const push = (account: 'cash' | 'bank', side: 'Dr' | 'Cr') => {
            entries.push({
                id: `${posting.id}-${side.toLowerCase()}`,
                date: posting.date,
                displayDate: dayjs(posting.date).format('D MMM'),
                particulars: posting.narration,
                side,
                account,
                amount: posting.amount,
            });
        };
        if (CASH_ACCOUNT_IDS.has(posting.drAccountId)) push('cash', 'Dr');
        if (CASH_ACCOUNT_IDS.has(posting.crAccountId)) push('cash', 'Cr');
        if (BANK_ACCOUNT_IDS.has(posting.drAccountId)) push('bank', 'Dr');
        if (BANK_ACCOUNT_IDS.has(posting.crAccountId)) push('bank', 'Cr');
    });

    return entries.sort((a, b) => a.date.localeCompare(b.date));
};
