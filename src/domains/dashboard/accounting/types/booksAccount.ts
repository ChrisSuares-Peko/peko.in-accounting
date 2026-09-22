export type BooksCategory = 'assets' | 'liabilities' | 'equity' | 'otherIncome' | 'otherExpense';

export interface BooksAccount {
    id: string;
    name: string;
    // Current balance side — single source of truth. A party's category is
    // DERIVED from this (see categoryFor below), never stored separately, so it
    // can't drift out of sync with the actual balance.
    side: 'Dr' | 'Cr';
    // Absolute value — sign/side is carried by `side`, not by this being negative.
    balance: number;
    // true = customer/vendor-style account whose category can flip with its
    // balance; false = fixed category regardless of which side it's currently on.
    isParty: boolean;
    // Required when isParty is false.
    fixedCategory?: BooksCategory;
    hasDetail: boolean;
    // Route path, only when hasDetail is true.
    detailRoute?: string;
}

// An account's Books of Accounts category is NOT fixed by what kind of party it
// is — it's determined by which side its balance currently sits on. A customer
// who has overpaid becomes a liability the moment their balance flips Cr; a
// vendor who's been overpaid becomes an asset the moment theirs flips Dr. This is
// why category is always computed here, never read off a stored field.
export function categoryFor(account: BooksAccount): BooksCategory {
    if (!account.isParty) return account.fixedCategory!;
    return account.side === 'Dr' ? 'assets' : 'liabilities';
}
