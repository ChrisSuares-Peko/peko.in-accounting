import dayjs, { Dayjs } from 'dayjs';

import { CHART_OF_ACCOUNTS } from './chartOfAccountsData';
import { Posting } from '../types/posting';
import { createSeededRandom } from '../utils/seededRandom';

// Deterministic — same seed every time, so the generated history is stable
// across reloads (see seededRandom.ts). `asOf` is the only thing that varies
// call to call, which is exactly what lets this data span "1 Jan 2026 through
// today" correctly no matter when the app is opened.
const SEED = 20260101;

// Account ids — see chartOfAccountsData.ts.
const HDFC = '1101';
const ICICI = '1102';
const BANKS = [HDFC, ICICI];
const PLANT_MACHINERY = '3101';
const ACCUM_DEPRECIATION = '3190';
// Single stand-in liability account for all "GST Payable" movement described
// in the spec — the chart also has SGST/IGST/GST-RC accounts, but modeling
// which portion of tax lands on which of those is real-GST-law detail the
// spec doesn't ask for; CGST Payable carries the whole net position instead.
const GST_PAYABLE = '4101';
const TDS_PAYABLE = '4104';
const RENT_EXPENSE = '9001';
const ELECTRICITY = '9002';
const BANK_CHARGES = '9005';
const SALARIES = '9010';
const DEPRECIATION_EXPENSE = '9011';
const INTEREST_ON_LOAN = '9006';
const DRAWINGS = '5002';
const INTEREST_RECEIVED = '8001';
const SALES_DOMESTIC = '6001';
const SALES_SERVICES = '6003';
const SALES_RETURNS = '6091';
const PURCHASES_DOMESTIC = '7001';
const PURCHASES_SERVICES = '7003';
const PURCHASE_RETURNS = '7091';

// Growing customer/vendor lists — introduced partway through the period
// rather than existing from day one (see chartOfAccountsData.ts's comments on
// the same accounts). Month index is 0-based from January 2026.
const CUSTOMERS = [
    { id: '3001', activeFromMonth: 0 }, // Rahul Enterprises
    { id: '3002', activeFromMonth: 0 }, // Kavya Textiles
    { id: '3003', activeFromMonth: 0 }, // Meridian Textiles
    { id: '3004', activeFromMonth: 2 }, // Verma & Sons — March
    { id: '3005', activeFromMonth: 4 }, // Aarav Distributors — May
    { id: '3006', activeFromMonth: 6 }, // Nisha Apparels — July
];
const VENDORS = [
    { id: '4002', activeFromMonth: 0 }, // Anand Traders
    { id: '4001', activeFromMonth: 0 }, // Shree Packaging Co.
    { id: '4003', activeFromMonth: 3 }, // Om Logistics — April
];

const nameOf = (accountId: string): string =>
    CHART_OF_ACCOUNTS.find(account => account.id === accountId)?.name ?? accountId;

const pad4 = (n: number): string => String(n).padStart(4, '0');
const roundToHundred = (n: number): number => Math.round(n / 100) * 100;

interface OpenInvoice {
    customerId: string;
    amount: number;
    date: Dayjs;
}
interface OpenBill {
    vendorId: string;
    amount: number;
    date: Dayjs;
}

// Every recurring/growing/occasional item from the spec, generated
// deterministically month by month from January 2026 through `asOf`. Returns
// ACTIVITY postings only — OPENING_BALANCES is a separate, hand-written list
// merged in by postingsData.ts.
export const generateActivityPostings = (asOf: Date): Posting[] => {
    const rng = createSeededRandom(SEED);
    const postings: Posting[] = [];
    let idSeq = 0;
    const push = (partial: Omit<Posting, 'id'>) => {
        postings.push({ id: `p-${pad4((idSeq += 1))}`, ...partial });
    };

    let salesSeq = 0;
    let purchaseSeq = 0;
    let receiptSeq = 0;
    let paymentSeq = 0;
    let journalSeq = 0;
    let cnSeq = 0;
    let dnSeq = 0;

    const today = dayjs(asOf);
    const start = dayjs('2026-01-01');
    const totalMonths = Math.max(0, today.diff(start, 'month') + 1);

    let plantMachineryGross = 3500000;
    const outstandingLoan = 2800000; // constant — no principal repayment modeled
    let gstPayableBalance = 0;
    let tdsPayableBalance = 0;

    const openInvoices: OpenInvoice[] = [];
    const openBills: OpenBill[] = [];

    for (let m = 0; m < totalMonths; m += 1) {
        const monthDate = start.add(m, 'month');
        const daysInMonth = monthDate.daysInMonth();
        const mkDate = (day: number) => monthDate.date(Math.min(day, daysInMonth));

        const eligibleCustomers = CUSTOMERS.filter(c => c.activeFromMonth <= m);
        const eligibleVendors = VENDORS.filter(v => v.activeFromMonth <= m);

        // --- Clear prior month's TDS/GST Payable balances first (this month's
        // own accruals, below, are what NEXT month's payment will clear). ---
        if (tdsPayableBalance > 0) {
            const tdsPayment = roundToHundred(tdsPayableBalance * 0.9);
            push({
                date: mkDate(7).format('YYYY-MM-DD'),
                voucherType: 'Payment',
                voucherNo: `PYMT-${pad4((paymentSeq += 1))}`,
                narration: 'TDS Payable — Deposited',
                drAccountId: TDS_PAYABLE,
                crAccountId: HDFC,
                amount: tdsPayment,
                source: 'Manual',
            });
            tdsPayableBalance -= tdsPayment;
        }
        if (gstPayableBalance > 0) {
            const gstPayment = roundToHundred(gstPayableBalance * 0.9);
            push({
                date: mkDate(20).format('YYYY-MM-DD'),
                voucherType: 'Payment',
                voucherNo: `PYMT-${pad4((paymentSeq += 1))}`,
                narration: 'GST Payable — Net Tax Deposited',
                drAccountId: GST_PAYABLE,
                crAccountId: HDFC,
                amount: gstPayment,
                source: 'Manual',
            });
            gstPayableBalance -= gstPayment;
        }

        // --- Recurring, every month ---
        push({
            date: mkDate(16).format('YYYY-MM-DD'),
            voucherType: 'Payment',
            voucherNo: `PYMT-${pad4((paymentSeq += 1))}`,
            narration: 'Rent Expense — Office Premises',
            drAccountId: RENT_EXPENSE,
            crAccountId: HDFC,
            amount: 85000,
            source: 'Manual',
        });

        const quarterIdx = Math.floor(m / 3);
        const salaryAmount = roundToHundred(800000 * 1.025 ** quarterIdx);
        push({
            date: mkDate(1).format('YYYY-MM-DD'),
            voucherType: 'Payment',
            voucherNo: `PYMT-${pad4((paymentSeq += 1))}`,
            narration: 'Salaries & Wages — Monthly Payroll',
            drAccountId: SALARIES,
            crAccountId: HDFC,
            amount: salaryAmount,
            source: 'Payroll',
        });
        const tdsOnSalary = roundToHundred(salaryAmount * 0.02);
        push({
            date: mkDate(1).format('YYYY-MM-DD'),
            voucherType: 'Journal',
            voucherNo: `JRNL-${pad4((journalSeq += 1))}`,
            narration: 'TDS Withheld on Salaries',
            drAccountId: HDFC,
            crAccountId: TDS_PAYABLE,
            amount: tdsOnSalary,
            source: 'Payroll',
        });
        tdsPayableBalance += tdsOnSalary;

        push({
            date: mkDate(10).format('YYYY-MM-DD'),
            voucherType: 'Payment',
            voucherNo: `PYMT-${pad4((paymentSeq += 1))}`,
            narration: 'Electricity & Utilities',
            drAccountId: ELECTRICITY,
            crAccountId: HDFC,
            amount: rng.amount(15000, 22000),
            source: 'Manual',
        });

        push({
            date: mkDate(5).format('YYYY-MM-DD'),
            voucherType: 'Payment',
            voucherNo: `PYMT-${pad4((paymentSeq += 1))}`,
            narration: 'Bank Charges',
            drAccountId: BANK_CHARGES,
            crAccountId: HDFC,
            amount: rng.amount(1500, 3500),
            source: 'Manual',
        });

        push({
            date: mkDate(28).format('YYYY-MM-DD'),
            voucherType: 'Payment',
            voucherNo: `PYMT-${pad4((paymentSeq += 1))}`,
            narration: 'Interest on Bank Loan – HDFC Bank',
            drAccountId: INTEREST_ON_LOAN,
            crAccountId: HDFC,
            amount: roundToHundred(outstandingLoan * 0.009),
            source: 'Manual',
        });

        // --- Occasional (fires once, on the month it's scheduled for) ---
        if (m === 2) {
            const additionAmount = rng.amount(200000, 500000);
            push({
                date: mkDate(9).format('YYYY-MM-DD'),
                voucherType: 'Journal',
                voucherNo: `JRNL-${pad4((journalSeq += 1))}`,
                narration: 'Fixed Asset Addition — Plant & Machinery',
                drAccountId: PLANT_MACHINERY,
                crAccountId: HDFC,
                amount: additionAmount,
                source: 'Manual',
            });
            plantMachineryGross += additionAmount;
        }
        if (m === 2 || m === 6) {
            push({
                date: mkDate(24).format('YYYY-MM-DD'),
                voucherType: 'Receipt',
                voucherNo: `RCPT-${pad4((receiptSeq += 1))}`,
                narration: 'Interest Received — Fixed Deposit',
                drAccountId: HDFC,
                crAccountId: INTEREST_RECEIVED,
                amount: rng.amount(15000, 30000),
                source: 'Manual',
            });
        }
        if (m === 3) {
            const customer = rng.pick(eligibleCustomers);
            push({
                date: mkDate(22).format('YYYY-MM-DD'),
                voucherType: 'Credit Note',
                voucherNo: `CN-${pad4((cnSeq += 1))}`,
                narration: `${nameOf(customer.id)} — Sales Return, Credit Note`,
                drAccountId: SALES_RETURNS,
                crAccountId: customer.id,
                amount: rng.amount(20000, 60000),
                source: 'Invoicing',
            });
        }
        if (m === 4) {
            const vendor = rng.pick(eligibleVendors);
            push({
                date: mkDate(19).format('YYYY-MM-DD'),
                voucherType: 'Debit Note',
                voucherNo: `DN-${pad4((dnSeq += 1))}`,
                narration: `${nameOf(vendor.id)} — Purchase Return, Debit Note`,
                drAccountId: vendor.id,
                crAccountId: PURCHASE_RETURNS,
                amount: rng.amount(20000, 60000),
                source: 'Purchase',
            });
        }
        if (m === 5) {
            push({
                date: mkDate(11).format('YYYY-MM-DD'),
                voucherType: 'Payment',
                voucherNo: `PYMT-${pad4((paymentSeq += 1))}`,
                narration: 'Drawings — Owner',
                drAccountId: DRAWINGS,
                crAccountId: HDFC,
                amount: rng.amount(40000, 60000),
                source: 'Manual',
            });
        }

        // Depreciation — after this month's possible Fixed Asset Addition, so a
        // month-3 addition depreciates from month 3 onward, not before.
        push({
            date: mkDate(daysInMonth).format('YYYY-MM-DD'),
            voucherType: 'Journal',
            voucherNo: `JRNL-${pad4((journalSeq += 1))}`,
            narration: 'Depreciation — Plant & Machinery',
            drAccountId: DEPRECIATION_EXPENSE,
            crAccountId: ACCUM_DEPRECIATION,
            amount: roundToHundred(plantMachineryGross * 0.005),
            source: 'Manual',
        });

        // --- Growing transactional activity ---
        let monthSalesTotal = 0;
        const salesCount = rng.int(3, 6);
        for (let i = 0; i < salesCount; i += 1) {
            const customer = rng.pick(eligibleCustomers);
            const salesAccount = rng.pick([SALES_DOMESTIC, SALES_SERVICES]);
            const amount = rng.amount(80000, 400000);
            const date = mkDate(rng.int(1, 28));
            salesSeq += 1;
            push({
                date: date.format('YYYY-MM-DD'),
                voucherType: 'Sales',
                voucherNo: `SALE-${pad4(salesSeq)}`,
                narration: `${nameOf(customer.id)} — Invoice SALE-${pad4(salesSeq)}`,
                drAccountId: customer.id,
                crAccountId: salesAccount,
                amount,
                source: 'Invoicing',
            });
            monthSalesTotal += amount;
            openInvoices.push({ customerId: customer.id, amount, date });
        }

        let monthPurchasesTotal = 0;
        const purchaseCount = rng.int(2, 4);
        for (let i = 0; i < purchaseCount; i += 1) {
            const vendor = rng.pick(eligibleVendors);
            const purchaseAccount = rng.pick([PURCHASES_DOMESTIC, PURCHASES_SERVICES]);
            const amount = rng.amount(40000, 250000);
            const date = mkDate(rng.int(1, 28));
            purchaseSeq += 1;
            push({
                date: date.format('YYYY-MM-DD'),
                voucherType: 'Purchase',
                voucherNo: `PUR-${pad4(purchaseSeq)}`,
                narration: `${nameOf(vendor.id)} — Bill PUR-${pad4(purchaseSeq)}`,
                drAccountId: purchaseAccount,
                crAccountId: vendor.id,
                amount,
                source: 'Purchase',
            });
            monthPurchasesTotal += amount;
            openBills.push({ vendorId: vendor.id, amount, date });
        }

        // GST — output tax on this month's sales, input credit on this month's
        // purchases, both "rough" 18% (see GST_PAYABLE's comment above).
        const outputTax = roundToHundred(monthSalesTotal * 0.18);
        if (outputTax > 0) {
            push({
                date: mkDate(daysInMonth).format('YYYY-MM-DD'),
                voucherType: 'Journal',
                voucherNo: `JRNL-${pad4((journalSeq += 1))}`,
                narration: 'GST Output Tax — Sales',
                drAccountId: SALES_DOMESTIC,
                crAccountId: GST_PAYABLE,
                amount: outputTax,
                source: 'Invoicing',
            });
            gstPayableBalance += outputTax;
        }
        const inputCredit = roundToHundred(monthPurchasesTotal * 0.18);
        if (inputCredit > 0) {
            push({
                date: mkDate(daysInMonth).format('YYYY-MM-DD'),
                voucherType: 'Journal',
                voucherNo: `JRNL-${pad4((journalSeq += 1))}`,
                narration: 'GST Input Credit — Purchases',
                drAccountId: GST_PAYABLE,
                crAccountId: PURCHASES_DOMESTIC,
                amount: inputCredit,
                source: 'Purchase',
            });
            gstPayableBalance -= inputCredit;
        }
    }

    // Receipts/Payments against open invoices/bills — most (not all) get
    // settled 15-45 days later; anything whose settlement date would fall
    // after `today`, or that loses an explicit ~80% coin flip, is left
    // outstanding — which is what naturally ages the most recent invoices as
    // "still open" without any special-casing for "the tail of the period".
    openInvoices.forEach(invoice => {
        if (!rng.chance(0.8)) return;
        const receiptDate = invoice.date.add(rng.int(15, 45), 'day');
        if (receiptDate.isAfter(today)) return;
        push({
            date: receiptDate.format('YYYY-MM-DD'),
            voucherType: 'Receipt',
            voucherNo: `RCPT-${pad4((receiptSeq += 1))}`,
            narration: `${nameOf(invoice.customerId)} — Receipt Against Invoice`,
            drAccountId: rng.pick(BANKS),
            crAccountId: invoice.customerId,
            amount: invoice.amount,
            source: 'Invoicing',
        });
    });
    openBills.forEach(bill => {
        if (!rng.chance(0.8)) return;
        const paymentDate = bill.date.add(rng.int(15, 45), 'day');
        if (paymentDate.isAfter(today)) return;
        push({
            date: paymentDate.format('YYYY-MM-DD'),
            voucherType: 'Payment',
            voucherNo: `PYMT-${pad4((paymentSeq += 1))}`,
            narration: `${nameOf(bill.vendorId)} — Payment Against Bill`,
            drAccountId: bill.vendorId,
            crAccountId: rng.pick(BANKS),
            amount: bill.amount,
            source: 'Purchase',
        });
    });

    return postings.sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
};
