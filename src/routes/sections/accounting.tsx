import { lazy } from 'react';

import { paths } from '../paths';

// -----------------------------------------------------------------------

// AccountingLanding (the old index-route content) is left in place but unrouted —
// AccountingDashboardLanding is the new index route.
const AccountingDashboardLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/AccountingDashboardLanding')
);
const LedgersLanding = lazy(() => import('@domains/dashboard/accounting/pages/LedgersLanding'));
const CashBankLanding = lazy(() => import('@domains/dashboard/accounting/pages/CashBankLanding'));
const StockLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/StockLedgerLanding')
);
const AssetsLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/AssetsLedgerLanding')
);
const LiabilitiesLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/LiabilitiesLedgerLanding')
);
const EquityLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/EquityLedgerLanding')
);
const SalesLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/SalesLedgerLanding')
);
const PurchasesLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/PurchasesLedgerLanding')
);
const OtherIncomeLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/OtherIncomeLedgerLanding')
);
const OtherExpenseLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/OtherExpenseLedgerLanding')
);
const BooksOfAccountsLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/BooksOfAccountsLanding')
);
const AnandTradersLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/AnandTradersLedgerLanding')
);
const RentExpenseLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/RentExpenseLedgerLanding')
);
const InterestReceivedLedgerLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/InterestReceivedLedgerLanding')
);
const TrialBalanceLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/TrialBalanceLanding')
);
const PnlLanding = lazy(() => import('@domains/dashboard/accounting/pages/PnlLanding'));
const BalanceSheetReportLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/BalanceSheetReportLanding')
);
const ChartOfAccountsLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/ChartOfAccountsLanding')
);
const DayBookLanding = lazy(() => import('@domains/dashboard/accounting/pages/DayBookLanding'));
const TransactionsLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/TransactionsLanding')
);
const FinancialStatementsLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/FinancialStatementsLanding')
);
const ProfitLossLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/ProfitLossLanding')
);
const BalanceSheetLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/BalanceSheetLanding')
);
const CashFlowLanding = lazy(() => import('@domains/dashboard/accounting/pages/CashFlowLanding'));
const ExpenseStatementLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/ExpenseStatementLanding')
);
const RevenueStatementLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/RevenueStatementLanding')
);
const GstSummaryLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/GstSummaryLanding')
);
const AccountsReceivableLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/AccountsReceivableLanding')
);
const AccountsPayableLanding = lazy(
    () => import('@domains/dashboard/accounting/pages/AccountsPayableLanding')
);
const InsightsLanding = lazy(() => import('@domains/dashboard/accounting/pages/InsightsLanding'));

// -----------------------------------------------------------------------

export const accountingRoutes = [
    { element: <AccountingDashboardLanding />, index: true },
    { element: <LedgersLanding />, path: paths.accounting.ledgers },
    { element: <CashBankLanding />, path: paths.accounting.cashBank },
    { element: <StockLedgerLanding />, path: paths.accounting.stock },
    { element: <AssetsLedgerLanding />, path: paths.accounting.assets },
    { element: <LiabilitiesLedgerLanding />, path: paths.accounting.liabilities },
    { element: <EquityLedgerLanding />, path: paths.accounting.equity },
    { element: <SalesLedgerLanding />, path: paths.accounting.sales },
    { element: <PurchasesLedgerLanding />, path: paths.accounting.purchases },
    { element: <OtherIncomeLedgerLanding />, path: paths.accounting.otherIncome },
    { element: <OtherExpenseLedgerLanding />, path: paths.accounting.otherExpense },
    { element: <BooksOfAccountsLanding />, path: paths.accounting.books },
    { element: <AnandTradersLedgerLanding />, path: paths.accounting.anandTraders },
    { element: <RentExpenseLedgerLanding />, path: paths.accounting.rentExpense },
    { element: <InterestReceivedLedgerLanding />, path: paths.accounting.interestReceived },
    { element: <TrialBalanceLanding />, path: paths.accounting.trialBalance },
    { element: <PnlLanding />, path: paths.accounting.pnl },
    { element: <BalanceSheetReportLanding />, path: paths.accounting.balanceSheetReport },
    { element: <ChartOfAccountsLanding />, path: paths.accounting.chartOfAccounts },
    { element: <DayBookLanding />, path: paths.accounting.dayBook },
    { element: <TransactionsLanding />, path: paths.accounting.transactions },
    { element: <FinancialStatementsLanding />, path: paths.accounting.financialStatements },
    { element: <ProfitLossLanding />, path: paths.accounting.profitLoss },
    { element: <BalanceSheetLanding />, path: paths.accounting.balanceSheet },
    { element: <CashFlowLanding />, path: paths.accounting.cashFlow },
    { element: <ExpenseStatementLanding />, path: paths.accounting.expenseStatement },
    { element: <RevenueStatementLanding />, path: paths.accounting.revenueStatement },
    { element: <GstSummaryLanding />, path: paths.accounting.gstSummary },
    { element: <AccountsReceivableLanding />, path: paths.accounting.accountsReceivable },
    { element: <AccountsPayableLanding />, path: paths.accounting.accountsPayable },
    { element: <InsightsLanding />, path: paths.accounting.insights },
];
