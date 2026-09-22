import { BooksAccount } from '../types/booksAccount';
import { GeneralLedgerEntry } from '../types/generalLedger';

// Signed sum of a GeneralLedgerEntry[] against its head's normal side — positive
// means the head is in its normal position, negative means it's flipped. Mirrors
// the same formula LedgerDetailPage uses for its own Closing Balance stat, so any
// total computed here always agrees with what that head's own ledger page shows.
export const sumEntriesSigned = (
    entries: GeneralLedgerEntry[],
    normalSide: 'Dr' | 'Cr'
): number => {
    const sumDr = entries.filter(e => e.side === 'Dr').reduce((sum, e) => sum + e.amount, 0);
    const sumCr = entries.filter(e => e.side === 'Cr').reduce((sum, e) => sum + e.amount, 0);
    return normalSide === 'Dr' ? sumDr - sumCr : sumCr - sumDr;
};

// Same idea for a BooksAccount[] — each account already carries an absolute
// `balance` + which `side` it's on, rather than separate debit/credit fields.
export const sumAccountsSigned = (accounts: BooksAccount[], normalSide: 'Dr' | 'Cr'): number =>
    accounts.reduce(
        (sum, account) => sum + (account.side === normalSide ? account.balance : -account.balance),
        0
    );
