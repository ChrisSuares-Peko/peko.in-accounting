import { ChartOfAccountsEntry } from '../types/chartOfAccounts';

// The structural reference behind the books — every head, group, and account,
// with its code and normal balance side. Unlike the rest of this section's
// data, this is NOT dataMode-dependent: the chart of accounts exists whether
// or not the business has any transactions yet, so there's no DUMMY_/EMPTY_
// pair here, just this one static list.
export const CHART_OF_ACCOUNTS: ChartOfAccountsEntry[] = [
    // Cash & Bank
    { id: '1001', code: '1001', name: 'Petty Cash', head: 'cashBank', group: 'Cash-in-Hand', normalBalance: 'Dr', classification: 'Current' },
    { id: '1101', code: '1101', name: 'HDFC Bank – Current A/c', head: 'cashBank', group: 'Bank Accounts', normalBalance: 'Dr', classification: 'Current' },
    { id: '1102', code: '1102', name: 'ICICI Bank – Current A/c', head: 'cashBank', group: 'Bank Accounts', normalBalance: 'Dr', classification: 'Current' },
    { id: '1103', code: '1103', name: 'ICICI Bank – Overdraft Facility', head: 'cashBank', group: 'Bank Accounts', normalBalance: 'Dr', classification: 'Current' },

    // Stock
    { id: '2001', code: '2001', name: 'Raw Materials', head: 'stock', group: 'Stock-in-Hand', normalBalance: 'Dr', classification: 'Current' },
    { id: '2002', code: '2002', name: 'Finished Goods – Trading Stock', head: 'stock', group: 'Stock-in-Hand', normalBalance: 'Dr', classification: 'Current' },

    // Assets
    { id: '3001', code: '3001', name: 'Rahul Enterprises', head: 'assets', group: 'Accounts Receivable', normalBalance: 'Dr', classification: 'Current' },
    { id: '3002', code: '3002', name: 'Kavya Textiles', head: 'assets', group: 'Accounts Receivable', normalBalance: 'Dr', classification: 'Current' },
    { id: '3003', code: '3003', name: 'Meridian Textiles', head: 'assets', group: 'Accounts Receivable', normalBalance: 'Dr', classification: 'Current' },
    // Introduced partway through the generated posting history (see
    // postingsGenerator.ts) rather than existing from day one — a growing
    // customer list, not a fixed one.
    { id: '3004', code: '3004', name: 'Verma & Sons', head: 'assets', group: 'Accounts Receivable', normalBalance: 'Dr', classification: 'Current' },
    { id: '3005', code: '3005', name: 'Aarav Distributors', head: 'assets', group: 'Accounts Receivable', normalBalance: 'Dr', classification: 'Current' },
    { id: '3006', code: '3006', name: 'Nisha Apparels', head: 'assets', group: 'Accounts Receivable', normalBalance: 'Dr', classification: 'Current' },
    { id: '3101', code: '3101', name: 'Plant & Machinery', head: 'assets', group: 'Fixed Assets', normalBalance: 'Dr', classification: 'Non-Current' },
    { id: '3190', code: '3190', name: 'Accumulated Depreciation', head: 'assets', group: 'Fixed Assets', normalBalance: 'Cr', classification: 'Non-Current' },
    { id: '3201', code: '3201', name: 'Prepaid Expenses', head: 'assets', group: 'Other Current Assets', normalBalance: 'Dr', classification: 'Current' },
    { id: '3205', code: '3205', name: 'TDS Receivable', head: 'assets', group: 'Other Current Assets', normalBalance: 'Dr', classification: 'Current' },

    // Liabilities
    { id: '4001', code: '4001', name: 'Shree Packaging Co.', head: 'liabilities', group: 'Accounts Payable', normalBalance: 'Cr', classification: 'Current' },
    { id: '4002', code: '4002', name: 'Anand Traders', head: 'liabilities', group: 'Accounts Payable', normalBalance: 'Cr', classification: 'Current' },
    // Introduced partway through the generated posting history, same as the new
    // customers above.
    { id: '4003', code: '4003', name: 'Om Logistics', head: 'liabilities', group: 'Accounts Payable', normalBalance: 'Cr', classification: 'Current' },
    { id: '4101', code: '4101', name: 'CGST Payable', head: 'liabilities', group: 'Duties & Taxes', normalBalance: 'Cr', classification: 'Current' },
    { id: '4102', code: '4102', name: 'SGST Payable', head: 'liabilities', group: 'Duties & Taxes', normalBalance: 'Cr', classification: 'Current' },
    { id: '4103', code: '4103', name: 'IGST Payable', head: 'liabilities', group: 'Duties & Taxes', normalBalance: 'Cr', classification: 'Current' },
    { id: '4104', code: '4104', name: 'TDS Payable', head: 'liabilities', group: 'Duties & Taxes', normalBalance: 'Cr', classification: 'Current' },
    { id: '4109', code: '4109', name: 'GST Payable – Reverse Charge', head: 'liabilities', group: 'Duties & Taxes', normalBalance: 'Cr', classification: 'Current' },
    { id: '4201', code: '4201', name: 'Bank Loan – HDFC Bank', head: 'liabilities', group: 'Loans & Borrowings', normalBalance: 'Cr', classification: 'Non-Current' },
    { id: '4204', code: '4204', name: 'Corporate Credit Card Payable', head: 'liabilities', group: 'Loans & Borrowings', normalBalance: 'Cr', classification: 'Current' },
    { id: '4301', code: '4301', name: 'Advance from Customers', head: 'liabilities', group: 'Other Current Liabilities', normalBalance: 'Cr', classification: 'Current' },
    { id: '4302', code: '4302', name: 'Accrued Expenses', head: 'liabilities', group: 'Other Current Liabilities', normalBalance: 'Cr', classification: 'Current' },

    // Capital / Equity
    { id: '5001', code: '5001', name: "Proprietor's Capital A/c", head: 'equity', group: 'Capital Account', normalBalance: 'Cr' },
    { id: '5101', code: '5101', name: 'Reserves & Surplus', head: 'equity', group: 'Reserves & Surplus', normalBalance: 'Cr' },
    { id: '5103', code: '5103', name: 'Current Year Earnings', head: 'equity', group: 'Reserves & Surplus', normalBalance: 'Cr' },
    { id: '5002', code: '5002', name: 'Drawings', head: 'equity', group: 'Drawings', normalBalance: 'Dr' },
    // Suspense-style clearing account used only to seed the 1 Jan 2026 opening
    // balances as structurally normal double-entry Postings (see
    // openingBalances.ts) — not a real account a user would post to. Nets to
    // exactly zero once every opening balance posting is in.
    { id: '5099', code: '5099', name: 'Opening Balance Equity', head: 'equity', group: 'Opening Balance Equity', normalBalance: 'Cr' },

    // Sales
    { id: '6001', code: '6001', name: 'Sales – Domestic', head: 'sales', group: 'Sales', normalBalance: 'Cr' },
    { id: '6002', code: '6002', name: 'Sales – Export', head: 'sales', group: 'Sales', normalBalance: 'Cr' },
    { id: '6003', code: '6003', name: 'Sales – Services Rendered', head: 'sales', group: 'Sales', normalBalance: 'Cr' },
    { id: '6091', code: '6091', name: 'Sales Returns / Credit Notes', head: 'sales', group: 'Sales Adjustments', normalBalance: 'Dr' },

    // Purchases
    { id: '7001', code: '7001', name: 'Purchases – Domestic', head: 'purchases', group: 'Purchases', normalBalance: 'Dr' },
    { id: '7002', code: '7002', name: 'Purchases – Import', head: 'purchases', group: 'Purchases', normalBalance: 'Dr' },
    { id: '7003', code: '7003', name: 'Purchases – Services', head: 'purchases', group: 'Purchases', normalBalance: 'Dr' },
    { id: '7091', code: '7091', name: 'Purchase Returns / Debit Notes', head: 'purchases', group: 'Purchase Adjustments', normalBalance: 'Cr' },

    // Other Income
    { id: '8001', code: '8001', name: 'Interest Received', head: 'otherIncome', group: 'Other Income', normalBalance: 'Cr' },
    { id: '8002', code: '8002', name: 'Commission Received', head: 'otherIncome', group: 'Other Income', normalBalance: 'Cr' },
    { id: '8003', code: '8003', name: 'Discount Received', head: 'otherIncome', group: 'Other Income', normalBalance: 'Cr' },

    // Other Expense
    { id: '9001', code: '9001', name: 'Rent Expense', head: 'otherExpense', group: 'Other Expense', normalBalance: 'Dr' },
    { id: '9002', code: '9002', name: 'Electricity & Utilities', head: 'otherExpense', group: 'Other Expense', normalBalance: 'Dr' },
    { id: '9005', code: '9005', name: 'Bank Charges', head: 'otherExpense', group: 'Other Expense', normalBalance: 'Dr' },
    { id: '9010', code: '9010', name: 'Salaries & Wages', head: 'otherExpense', group: 'Other Expense', normalBalance: 'Dr' },
    { id: '9011', code: '9011', name: 'Depreciation Expense', head: 'otherExpense', group: 'Other Expense', normalBalance: 'Dr' },
    { id: '9006', code: '9006', name: 'Interest on Loan', head: 'otherExpense', group: 'Other Expense', normalBalance: 'Dr' },
];
