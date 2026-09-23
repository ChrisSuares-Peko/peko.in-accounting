import { useMemo } from 'react';

import { useBooksAccounts } from './useBooksAccounts';
import { useLedgerData } from './useLedgerData';
import { usePurchasesEntries } from './usePurchasesEntries';
import { useSalesEntries } from './useSalesEntries';
import { BooksAccount, categoryFor } from '../types/booksAccount';
import { sumAccountsSigned, sumEntriesSigned } from '../utils/ledgerMath';

export interface NetProfitBreakdown {
    otherIncomeAccounts: BooksAccount[];
    otherIncomeTotal: number;
    salesTotal: number;
    incomeTotal: number;
    otherExpenseAccounts: BooksAccount[];
    otherExpenseTotal: number;
    purchasesTotal: number;
    expenseTotal: number;
    // Income total minus Expense total — negative means a net loss for the period.
    netProfit: number;
    // What useLedgerData()'s OWN otherIncome/sales/otherExpense/purchases heads
    // would imply as the period's profit, computed the identical way. Exposed so
    // callers can compare rather than silently trust two different numbers.
    ledgerDataImpliedNetProfit: number;
}

// SINGLE source of truth for the period's Net Profit — Trial Balance's balancing
// row (Step 1) and the P&L page (Step 3) both call this instead of each computing
// their own version, so they can never independently drift apart.
export const useNetProfit = (): NetProfitBreakdown => {
    const accounts = useBooksAccounts();
    const salesEntries = useSalesEntries();
    const purchasesEntries = usePurchasesEntries();
    const ledgerData = useLedgerData();

    return useMemo(() => {
        const otherIncomeAccounts = accounts.filter(account => categoryFor(account) === 'otherIncome');
        const otherIncomeTotal = sumAccountsSigned(otherIncomeAccounts, 'Cr');
        const salesTotal = sumEntriesSigned(salesEntries, 'Cr');
        const incomeTotal = otherIncomeTotal + salesTotal;

        const otherExpenseAccounts = accounts.filter(
            account => categoryFor(account) === 'otherExpense'
        );
        const otherExpenseTotal = sumAccountsSigned(otherExpenseAccounts, 'Dr');
        const purchasesTotal = sumEntriesSigned(purchasesEntries, 'Dr');
        const expenseTotal = otherExpenseTotal + purchasesTotal;

        const netProfit = incomeTotal - expenseTotal;

        // Each LedgerLineItem's closingBalance is signed toward ITS OWN
        // normalBalance, not the head's — a head can mix normal sides (Sales
        // Returns is Dr-normal inside the Cr-normal Sales head; Purchase
        // Returns is Cr-normal inside the Dr-normal Purchases head), so naively
        // summing raw closingBalance across a head would silently add a contra
        // account's balance instead of subtracting it. Re-sign each item
        // toward the head's target side first.
        const signedToward = (item: { normalBalance: 'Dr' | 'Cr'; closingBalance: number }, targetSide: 'Dr' | 'Cr') =>
            item.normalBalance === targetSide ? item.closingBalance : -item.closingBalance;

        const ledgerOtherIncome = ledgerData
            .filter(item => item.head === 'otherIncome')
            .reduce((sum, item) => sum + signedToward(item, 'Cr'), 0);
        const ledgerSales = ledgerData
            .filter(item => item.head === 'sales')
            .reduce((sum, item) => sum + signedToward(item, 'Cr'), 0);
        const ledgerOtherExpense = ledgerData
            .filter(item => item.head === 'otherExpense')
            .reduce((sum, item) => sum + signedToward(item, 'Dr'), 0);
        const ledgerPurchases = ledgerData
            .filter(item => item.head === 'purchases')
            .reduce((sum, item) => sum + signedToward(item, 'Dr'), 0);
        const ledgerDataImpliedNetProfit =
            ledgerOtherIncome + ledgerSales - (ledgerOtherExpense + ledgerPurchases);

        return {
            otherIncomeAccounts,
            otherIncomeTotal,
            salesTotal,
            incomeTotal,
            otherExpenseAccounts,
            otherExpenseTotal,
            purchasesTotal,
            expenseTotal,
            netProfit,
            ledgerDataImpliedNetProfit,
        };
    }, [accounts, salesEntries, purchasesEntries, ledgerData]);
};
