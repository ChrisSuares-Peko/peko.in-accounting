import { useMemo } from 'react';

import { useBooksAccounts } from './useBooksAccounts';
import { useCashBookEntries } from './useCashBookEntries';
import { useNetProfit } from './useNetProfit';
import { usePurchasesEntries } from './usePurchasesEntries';
import { useSalesEntries } from './useSalesEntries';
import { useStockEntries } from './useStockEntries';
import { TrialBalanceRow } from '../types/trialBalance';
import { sumEntriesSigned } from '../utils/ledgerMath';

// Broader than Books of Accounts: every individual ledger with a balance,
// including Cash & Bank and Stock (which Books of Accounts deliberately
// excludes), plus single aggregate rows for Sales and Purchases (neither of
// which is a Books of Accounts category at all — see categoryFor()).
export const useTrialBalanceRows = (): TrialBalanceRow[] => {
    const booksAccounts = useBooksAccounts();
    const cashBookEntries = useCashBookEntries();
    const stockEntries = useStockEntries();
    const salesEntries = useSalesEntries();
    const purchasesEntries = usePurchasesEntries();
    const { netProfit } = useNetProfit();

    return useMemo(() => {
        const rows: TrialBalanceRow[] = booksAccounts.map(account => ({
            id: account.id,
            name: account.name,
            debit: account.side === 'Dr' ? account.balance : null,
            credit: account.side === 'Cr' ? account.balance : null,
            hasDetail: account.hasDetail,
            detailRoute: account.detailRoute,
        }));

        // Cash & Bank and Stock — Dr-normal, one row each (cashBookEntries only
        // distinguishes cash vs. bank, not individual named accounts).
        const cashEntries = cashBookEntries.filter(entry => entry.account === 'cash');
        const bankEntries = cashBookEntries.filter(entry => entry.account === 'bank');
        const cashClosing = sumEntriesSigned(cashEntries, 'Dr');
        const bankClosing = sumEntriesSigned(bankEntries, 'Dr');
        const stockClosing = sumEntriesSigned(stockEntries, 'Dr');
        rows.push({ id: 'trial-cash', name: 'Cash', debit: cashClosing, credit: null, hasDetail: false });
        rows.push({ id: 'trial-bank', name: 'Bank', debit: bankClosing, credit: null, hasDetail: false });
        rows.push({
            id: 'trial-stock',
            name: 'Stock',
            debit: stockClosing,
            credit: null,
            hasDetail: false,
        });

        // Sales (Cr-normal) and Purchases (Dr-normal) — single aggregate rows.
        const salesTotal = sumEntriesSigned(salesEntries, 'Cr');
        const purchasesTotal = sumEntriesSigned(purchasesEntries, 'Dr');
        rows.push({
            id: 'trial-sales',
            name: 'Sales',
            debit: null,
            credit: salesTotal,
            hasDetail: false,
        });
        rows.push({
            id: 'trial-purchases',
            name: 'Purchases',
            debit: purchasesTotal,
            credit: null,
            hasDetail: false,
        });

        // Balancing row — computed from the assembled rows above, NEVER hardcoded.
        // Credits exceed debits → net profit, added to the debit column (and vice
        // versa for a net loss), matching how a P&L account's own balance would
        // sit before being closed into Reserves.
        const debitTotal = rows.reduce((sum, row) => sum + (row.debit ?? 0), 0);
        const creditTotal = rows.reduce((sum, row) => sum + (row.credit ?? 0), 0);
        const plug = creditTotal - debitTotal;

        // This should always hold: the plug that balances the trial balance is, by
        // definition, this period's Income minus Expenses — the same value the P&L
        // page (Step 3) computes via the shared useNetProfit() hook. If these ever
        // disagree, something in how a head's rows were assembled here doesn't
        // agree with how useNetProfit() computes Income/Expense — a real bug, not
        // a rounding matter (everything here is whole rupees).
        if (plug !== netProfit) {
            // eslint-disable-next-line no-console
            console.error(
                `Trial Balance: mechanical balancing plug (₹${plug}) does not match ` +
                    `useNetProfit()'s independently computed Net Profit (₹${netProfit}). ` +
                    'These are supposed to be mathematically identical — see useTrialBalanceRows.ts.'
            );
        }

        if (plug !== 0) {
            rows.push({
                id: 'trial-net-profit',
                name:
                    plug > 0
                        ? 'Profit & Loss A/c — Net Profit for the period (pending transfer to Reserves)'
                        : 'Profit & Loss A/c — Net Loss for the period (pending transfer to Reserves)',
                debit: plug > 0 ? plug : null,
                credit: plug < 0 ? -plug : null,
                hasDetail: false,
            });
        }

        return rows;
    }, [booksAccounts, cashBookEntries, stockEntries, salesEntries, purchasesEntries, netProfit]);
};
