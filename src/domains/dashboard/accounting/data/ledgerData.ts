import { LedgerLineItem } from '../types/ledger';

// Sample chart of accounts for an Indian SME — 20 ledger line items across the 9
// top-level heads. Sales/Purchases/Other Income/Other Expense are FLOW accounts, so
// their openingBalance is always 0 (a fresh financial year starts them at zero).
export const DUMMY_LEDGER_DATA: LedgerLineItem[] = [
    // Cash & Bank
    {
        id: 'petty-cash',
        head: 'cashBank',
        name: 'Petty Cash',
        normalBalance: 'Dr',
        openingBalance: 25000,
        debit: 185000,
        credit: 177500,
        closingBalance: 32500,
    },
    {
        id: 'hdfc-bank-current-ac',
        head: 'cashBank',
        name: 'HDFC Bank – Current A/c',
        normalBalance: 'Dr',
        openingBalance: 1240000,
        debit: 8420000,
        credit: 7615000,
        closingBalance: 2045000,
    },
    {
        id: 'icici-bank-current-ac',
        head: 'cashBank',
        name: 'ICICI Bank – Current A/c',
        normalBalance: 'Dr',
        openingBalance: 560000,
        debit: 2230000,
        credit: 1985000,
        closingBalance: 805000,
    },
    {
        id: 'icici-bank-overdraft-facility',
        head: 'cashBank',
        name: 'ICICI Bank – Overdraft Facility',
        normalBalance: 'Dr',
        openingBalance: 0,
        debit: 320000,
        credit: 395000,
        closingBalance: -75000,
    },

    // Stock
    {
        id: 'finished-goods-trading-stock',
        head: 'stock',
        name: 'Finished Goods – Trading Stock',
        normalBalance: 'Dr',
        openingBalance: 840000,
        debit: 1850000,
        credit: 1570000,
        closingBalance: 1120000,
    },
    {
        id: 'raw-materials',
        head: 'stock',
        name: 'Raw Materials',
        normalBalance: 'Dr',
        openingBalance: 210000,
        debit: 625000,
        credit: 670000,
        closingBalance: 165000,
    },

    // Assets
    {
        id: 'accounts-receivable-rahul-enterprises',
        head: 'assets',
        name: 'Accounts Receivable – Rahul Enterprises',
        normalBalance: 'Dr',
        openingBalance: 180000,
        debit: 640000,
        credit: 575000,
        closingBalance: 245000,
        category: 'receivable',
    },
    {
        id: 'office-equipment-fixed-asset',
        head: 'assets',
        name: 'Office Equipment (Fixed Asset)',
        normalBalance: 'Dr',
        openingBalance: 450000,
        debit: 70000,
        credit: 0,
        closingBalance: 520000,
    },

    // Liabilities
    {
        id: 'accounts-payable-shree-packaging-co',
        head: 'liabilities',
        name: 'Accounts Payable – Shree Packaging Co.',
        normalBalance: 'Cr',
        openingBalance: 95000,
        debit: 118500,
        credit: 100000,
        closingBalance: 76500,
        category: 'payable',
    },
    {
        id: 'gst-payable',
        head: 'liabilities',
        name: 'GST Payable',
        normalBalance: 'Cr',
        openingBalance: 142000,
        debit: 385000,
        credit: 448000,
        closingBalance: 205000,
    },
    {
        id: 'tds-payable',
        head: 'liabilities',
        name: 'TDS Payable',
        normalBalance: 'Cr',
        openingBalance: 38000,
        debit: 110000,
        credit: 124000,
        closingBalance: 52000,
    },

    // Capital / Equity
    {
        id: 'proprietors-capital-ac',
        head: 'equity',
        name: "Proprietor's Capital A/c",
        normalBalance: 'Cr',
        openingBalance: 2500000,
        debit: 0,
        credit: 0,
        closingBalance: 2500000,
    },
    {
        id: 'reserves-and-surplus',
        head: 'equity',
        name: 'Reserves & Surplus',
        normalBalance: 'Cr',
        openingBalance: 680000,
        debit: 0,
        credit: 0,
        closingBalance: 680000,
    },

    // Sales (flow account — opening always 0)
    {
        id: 'sales-domestic',
        head: 'sales',
        name: 'Sales – Domestic',
        normalBalance: 'Cr',
        openingBalance: 0,
        debit: 0,
        credit: 4260000,
        closingBalance: 4260000,
    },
    {
        id: 'sales-services-rendered',
        head: 'sales',
        name: 'Sales – Services Rendered',
        normalBalance: 'Cr',
        openingBalance: 0,
        debit: 0,
        credit: 815000,
        closingBalance: 815000,
    },

    // Purchases (flow account — opening always 0)
    {
        id: 'purchases-domestic',
        head: 'purchases',
        name: 'Purchases – Domestic',
        normalBalance: 'Dr',
        openingBalance: 0,
        debit: 2430000,
        credit: 0,
        closingBalance: 2430000,
    },
    {
        id: 'purchases-services',
        head: 'purchases',
        name: 'Purchases – Services',
        normalBalance: 'Dr',
        openingBalance: 0,
        debit: 345000,
        credit: 0,
        closingBalance: 345000,
    },

    // Other Income (flow account — opening always 0)
    {
        id: 'interest-received',
        head: 'otherIncome',
        name: 'Interest Received',
        normalBalance: 'Cr',
        openingBalance: 0,
        debit: 0,
        credit: 62000,
        closingBalance: 62000,
    },

    // Other Expense (flow account — opening always 0)
    {
        id: 'rent-expense',
        head: 'otherExpense',
        name: 'Rent Expense',
        normalBalance: 'Dr',
        openingBalance: 0,
        debit: 720000,
        credit: 0,
        closingBalance: 720000,
    },
    {
        id: 'salaries-and-wages',
        head: 'otherExpense',
        name: 'Salaries & Wages',
        normalBalance: 'Dr',
        openingBalance: 0,
        debit: 1840000,
        credit: 0,
        closingBalance: 1840000,
    },
];

// Same 20 accounts, zeroed out — used when the "Empty" data mode is selected so pages
// can be exercised against a brand-new-books state instead of the dummy figures above.
export const EMPTY_LEDGER_DATA: LedgerLineItem[] = DUMMY_LEDGER_DATA.map(item => ({
    ...item,
    openingBalance: 0,
    debit: 0,
    credit: 0,
    closingBalance: 0,
}));
