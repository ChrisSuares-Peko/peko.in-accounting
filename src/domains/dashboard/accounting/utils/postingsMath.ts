import dayjs from 'dayjs';

import { OPENING_BALANCES, OPENING_BALANCE_DATE } from '../data/openingBalances';
import { BooksAccount, BooksCategory } from '../types/booksAccount';
import { ChartOfAccountsEntry, ChartOfAccountsHead } from '../types/chartOfAccounts';
import { GeneralLedgerEntry } from '../types/generalLedger';
import { LedgerLineItem } from '../types/ledger';
import { Posting } from '../types/posting';

// Chart account id -> the ledger detail route it has a dedicated page for.
// Only these three accounts get one; every other Books of Accounts row is
// plain, non-clickable text.
const DETAIL_ROUTES: Record<string, string> = {
    '4002': 'books/anand-traders', // Accounts Payable – Anand Traders
    '9001': 'books/rent-expense', // Rent Expense
    '8001': 'books/interest-received', // Interest Received
};

// Books of Accounts covers Assets, Liabilities, Capital/Equity, Other Income
// and Other Expense — Cash & Bank and Stock are deliberately out of scope
// (their own Ledgers pages cover those), matching the original hand-written
// dataset's own convention.
const BOOKS_ACCOUNT_HEADS: ChartOfAccountsHead[] = [
    'assets',
    'liabilities',
    'equity',
    'otherIncome',
    'otherExpense',
];

const OPENING_IDS = new Set(OPENING_BALANCES.map(posting => posting.id));

// Splits a combined (opening + activity) Posting list back into its two parts
// — by id, not by date: January's generated activity can legitimately land on
// 1 Jan 2026 too (the same calendar date OPENING_BALANCES uses), so date alone
// can't tell the two apart. Works even when the list is empty (Empty data
// mode) — both halves come back empty, no special-casing needed by callers.
export const splitOpeningAndActivity = (postings: Posting[]): { opening: Posting[]; activity: Posting[] } => {
    const opening: Posting[] = [];
    const activity: Posting[] = [];
    postings.forEach(posting => {
        (OPENING_IDS.has(posting.id) ? opening : activity).push(posting);
    });
    return { opening, activity };
};

const sumForAccount = (postings: Posting[], accountId: string): { drTotal: number; crTotal: number } => {
    let drTotal = 0;
    let crTotal = 0;
    postings.forEach(posting => {
        if (posting.drAccountId === accountId) drTotal += posting.amount;
        if (posting.crAccountId === accountId) crTotal += posting.amount;
    });
    return { drTotal, crTotal };
};

const signedBalance = (drTotal: number, crTotal: number, normalSide: 'Dr' | 'Cr'): number =>
    normalSide === 'Dr' ? drTotal - crTotal : crTotal - drTotal;

// An account's actual current side/balance, purely from its net Dr/Cr
// position — never from a stored field. Used by useBooksAccounts() so
// categoryFor() keeps working exactly as designed (a party account's category
// flips the moment its balance flips side).
export const accountBalance = (postings: Posting[], accountId: string): { side: 'Dr' | 'Cr'; balance: number } => {
    const { drTotal, crTotal } = sumForAccount(postings, accountId);
    const net = drTotal - crTotal;
    return net >= 0 ? { side: 'Dr', balance: net } : { side: 'Cr', balance: -net };
};

// "Accounts Receivable – Rahul Enterprises" / "Accounts Payable – Anand
// Traders" — reconstructs the fuller label the rest of the app already
// expects for party accounts from Chart of Accounts' separate code/name/group
// fields; every other account's chart name is used as-is.
export const displayNameFor = (account: ChartOfAccountsEntry): string => {
    if (account.group === 'Accounts Receivable') return `Accounts Receivable – ${account.name}`;
    if (account.group === 'Accounts Payable') return `Accounts Payable – ${account.name}`;
    return account.name;
};

// One GeneralLedgerEntry per posting-leg that touches any of `accountIds`
// (there are two independent checks, not else-if, so a hypothetical posting
// with both legs in the same head's account set — none exist in the current
// generator — would still produce both entries), plus a single opening
// balance row summed across every account in the set.
export const generalLedgerEntriesFor = (
    postings: Posting[],
    accountIds: string[],
    normalSide: 'Dr' | 'Cr'
): GeneralLedgerEntry[] => {
    const { opening, activity } = splitOpeningAndActivity(postings);
    const accountIdSet = new Set(accountIds);

    let openDr = 0;
    let openCr = 0;
    accountIds.forEach(id => {
        const { drTotal, crTotal } = sumForAccount(opening, id);
        openDr += drTotal;
        openCr += crTotal;
    });
    const openingSigned = signedBalance(openDr, openCr, normalSide);
    const oppositeSide: 'Dr' | 'Cr' = normalSide === 'Dr' ? 'Cr' : 'Dr';
    const openingSide: 'Dr' | 'Cr' = openingSigned >= 0 ? normalSide : oppositeSide;

    const entries: GeneralLedgerEntry[] = [
        {
            id: 'opening',
            date: OPENING_BALANCE_DATE,
            displayDate: dayjs(OPENING_BALANCE_DATE).format('D MMM'),
            particulars: 'Balance b/d',
            side: openingSide,
            amount: Math.abs(openingSigned),
            isOpeningBalance: true,
        },
    ];

    activity.forEach(posting => {
        if (accountIdSet.has(posting.drAccountId)) {
            entries.push({
                id: `${posting.id}-dr`,
                date: posting.date,
                displayDate: dayjs(posting.date).format('D MMM'),
                particulars: posting.narration,
                side: 'Dr',
                amount: posting.amount,
            });
        }
        if (accountIdSet.has(posting.crAccountId)) {
            entries.push({
                id: `${posting.id}-cr`,
                date: posting.date,
                displayDate: dayjs(posting.date).format('D MMM'),
                particulars: posting.narration,
                side: 'Cr',
                amount: posting.amount,
            });
        }
    });

    return entries.sort((a, b) => a.date.localeCompare(b.date));
};

export const generalLedgerEntriesForHead = (
    postings: Posting[],
    chart: ChartOfAccountsEntry[],
    head: ChartOfAccountsHead,
    normalSide: 'Dr' | 'Cr'
): GeneralLedgerEntry[] =>
    generalLedgerEntriesFor(
        postings,
        chart.filter(account => account.head === head).map(account => account.id),
        normalSide
    );

// Every account's current balance and side, summed from Postings (including
// opening) — never a separately maintained stored balance, so categoryFor()
// keeps deriving category correctly however a party account's balance moves.
export const booksAccountsFromPostings = (postings: Posting[], chart: ChartOfAccountsEntry[]): BooksAccount[] =>
    chart
        .filter(account => BOOKS_ACCOUNT_HEADS.includes(account.head))
        .map(account => {
            const isParty = account.group === 'Accounts Receivable' || account.group === 'Accounts Payable';
            const { side, balance } = accountBalance(postings, account.id);
            return {
                id: account.id,
                name: displayNameFor(account),
                side,
                balance,
                isParty,
                fixedCategory: isParty ? undefined : (account.head as BooksCategory),
                hasDetail: account.id in DETAIL_ROUTES,
                detailRoute: DETAIL_ROUTES[account.id],
            };
        });

// One LedgerLineItem per Chart of Accounts entry across every head — the
// aggregate view useLedgerData() has always presented, now computed instead
// of hand-typed.
export const ledgerLineItemsFromPostings = (postings: Posting[], chart: ChartOfAccountsEntry[]): LedgerLineItem[] => {
    const { opening, activity } = splitOpeningAndActivity(postings);

    return chart.map(account => {
        const openingTotals = sumForAccount(opening, account.id);
        const openingBalance = signedBalance(openingTotals.drTotal, openingTotals.crTotal, account.normalBalance);

        const { drTotal, crTotal } = sumForAccount(activity, account.id);
        const closingBalance =
            account.normalBalance === 'Dr' ? openingBalance + drTotal - crTotal : openingBalance + crTotal - drTotal;

        let category: 'receivable' | 'payable' | undefined;
        if (account.group === 'Accounts Receivable') category = 'receivable';
        else if (account.group === 'Accounts Payable') category = 'payable';

        return {
            id: account.id,
            head: account.head,
            name: displayNameFor(account),
            normalBalance: account.normalBalance,
            openingBalance,
            debit: drTotal,
            credit: crTotal,
            closingBalance,
            category,
        };
    });
};
