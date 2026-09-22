import { CHART_OF_ACCOUNTS } from '../data/chartOfAccountsData';
import { ChartOfAccountsEntry } from '../types/chartOfAccounts';

// Not dataMode-dependent — the chart of accounts is the same structural
// reference regardless of whether the business has any transactions yet, so
// this doesn't read selectDataMode like the app's other accounting hooks.
export const useChartOfAccounts = (): ChartOfAccountsEntry[] => CHART_OF_ACCOUNTS;
