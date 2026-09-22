import { useMemo } from 'react';

import { useBooksAccounts } from './useBooksAccounts';
import { useLedgerData } from './useLedgerData';
import { categoryFor } from '../types/booksAccount';
import { sumAccountsSigned } from '../utils/ledgerMath';

export interface BalanceSheetLineItem {
    id: string;
    name: string;
    amount: number;
}

export interface BalanceSheetGroup {
    key: string;
    label: string;
    total: number;
    items: BalanceSheetLineItem[];
}

export interface BalanceSheetData {
    capitalAccount: BalanceSheetGroup;
    loans: BalanceSheetGroup;
    currentLiabilities: BalanceSheetGroup;
    liabilitiesTotal: number;
    fixedAssets: BalanceSheetGroup;
    currentAssets: BalanceSheetGroup;
    assetsTotal: number;
}

// The dataset has no "long-term borrowing" flag, so loans are identified by name —
// the only such account is "Bank Loan – HDFC Bank".
const isLoanAccount = (name: string) => name.startsWith('Bank Loan');

// Sourced from useBooksAccounts() (Assets/Liabilities/Equity — see verification
// notes below) plus useLedgerData() (Cash & Bank / Stock, for their named
// sub-accounts). useLedgerData() is NOT used for Assets/Liabilities/Equity
// themselves: its own Equity figures are stale relative to useBooksAccounts() (see
// useNetProfit()'s ledgerDataImpliedNetProfit) and mixing the two would break the
// runtime balance check below.
export const useBalanceSheetData = (): BalanceSheetData => {
    const accounts = useBooksAccounts();
    const ledgerData = useLedgerData();

    return useMemo(() => {
        const equityAccounts = accounts.filter(account => categoryFor(account) === 'equity');
        const capitalAccount: BalanceSheetGroup = {
            key: 'capital-account',
            label: 'Capital Account',
            total: sumAccountsSigned(equityAccounts, 'Cr'),
            items: equityAccounts.map(account => ({
                id: account.id,
                name: account.name,
                amount: account.side === 'Cr' ? account.balance : -account.balance,
            })),
        };

        const liabilityAccounts = accounts.filter(account => categoryFor(account) === 'liabilities');
        const loanAccounts = liabilityAccounts.filter(account => isLoanAccount(account.name));
        const loans: BalanceSheetGroup = {
            key: 'loans',
            label: 'Loans (Liability)',
            total: sumAccountsSigned(loanAccounts, 'Cr'),
            items: loanAccounts.map(account => ({ id: account.id, name: account.name, amount: account.balance })),
        };

        const currentLiabilityAccounts = liabilityAccounts.filter(
            account => !isLoanAccount(account.name)
        );
        const currentLiabilities: BalanceSheetGroup = {
            key: 'current-liabilities',
            label: 'Current Liabilities',
            total: sumAccountsSigned(currentLiabilityAccounts, 'Cr'),
            items: currentLiabilityAccounts.map(account => ({
                id: account.id,
                name: account.name,
                amount: account.balance,
            })),
        };

        const liabilitiesTotal = capitalAccount.total + loans.total + currentLiabilities.total;

        // Fixed Assets: every fixedCategory:'assets' account without isParty. Read
        // literally, this also catches "Prepaid Expenses" alongside "Plant &
        // Machinery" — the data model has no separate current/fixed flag for
        // non-party asset accounts to split them further, so every such account
        // ends up here and none is left over for "remaining non-party current
        // assets" below.
        const fixedAssetAccounts = accounts.filter(
            account => !account.isParty && categoryFor(account) === 'assets'
        );
        const fixedAssets: BalanceSheetGroup = {
            key: 'fixed-assets',
            label: 'Fixed Assets',
            total: sumAccountsSigned(fixedAssetAccounts, 'Dr'),
            items: fixedAssetAccounts.map(account => ({
                id: account.id,
                name: account.name,
                amount: account.balance,
            })),
        };

        const cashBankItems = ledgerData.filter(item => item.head === 'cashBank');
        const stockItems = ledgerData.filter(item => item.head === 'stock');
        const cashBankTotal = cashBankItems.reduce((sum, item) => sum + item.closingBalance, 0);
        const stockTotal = stockItems.reduce((sum, item) => sum + item.closingBalance, 0);

        // Every Dr-position party account (Accounts Receivable) belongs in Current
        // Assets — a party account never lands in Fixed Assets since Fixed Assets
        // above is restricted to non-party accounts.
        const drPartyAccounts = accounts.filter(account => account.isParty && categoryFor(account) === 'assets');

        const currentAssets: BalanceSheetGroup = {
            key: 'current-assets',
            label: 'Current Assets',
            total: cashBankTotal + stockTotal + sumAccountsSigned(drPartyAccounts, 'Dr'),
            items: [
                ...cashBankItems.map(item => ({ id: item.id, name: item.name, amount: item.closingBalance })),
                ...stockItems.map(item => ({ id: item.id, name: item.name, amount: item.closingBalance })),
                ...drPartyAccounts.map(account => ({
                    id: account.id,
                    name: account.name,
                    amount: account.balance,
                })),
            ],
        };

        const assetsTotal = fixedAssets.total + currentAssets.total;

        // This should always hold given the data above — Liabilities+Equity and
        // Assets are two views of the same books. If it doesn't, that's a real
        // inconsistency in the underlying dummy data, not something to round away.
        if (assetsTotal !== liabilitiesTotal) {
            // eslint-disable-next-line no-console
            console.error(
                `Balance Sheet does not balance: Assets total (₹${assetsTotal}) !== ` +
                    `Liabilities + Equity total (₹${liabilitiesTotal}). See useBalanceSheetData.ts.`
            );
        }

        return {
            capitalAccount,
            loans,
            currentLiabilities,
            liabilitiesTotal,
            fixedAssets,
            currentAssets,
            assetsTotal,
        };
    }, [accounts, ledgerData]);
};
