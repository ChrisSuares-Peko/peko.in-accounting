import { useMemo, useState } from 'react';

import { Alert, Col, Flex, Row } from 'antd';

import { useNetProfit } from '../hooks/useNetProfit';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import DetailedPnlCard from '../sections/profitLoss/DetailedPnlCard';
import ExpenseBreakdownCard from '../sections/profitLoss/ExpenseBreakdownCard';
import PnlHeader from '../sections/profitLoss/PnlHeader';
import PnlSummaryCard from '../sections/profitLoss/PnlSummaryCard';
import { ExpenseSlice, StatementSection, SummaryRow } from '../utils/profitLossData';
import { FULL_YEAR, currentFyStart } from '../utils/reportFilters';
import { formatCompact, formatPct, formatRupee, pctOf, reportColor } from '../utils/reportFormat';

const PnlLanding = () => {
    const [fy, setFy] = useState(currentFyStart());
    const [period, setPeriod] = useState(FULL_YEAR);

    const {
        otherIncomeAccounts,
        otherIncomeTotal,
        salesTotal,
        otherExpenseAccounts,
        otherExpenseTotal,
        purchasesTotal,
        netProfit,
        ledgerDataImpliedNetProfit,
    } = useNetProfit();

    // Maps our existing categories onto the real P&L statement's shape: Total
    // Revenue = Sales, Cost of Goods Sold = Purchases, Operating Expenses =
    // Other Expense, Other Income = Other Income. There's no separate "Other
    // Expenses" bucket in this model, so that row is omitted rather than shown
    // as an always-zero line — Operating Profit + Other Income lands on
    // useNetProfit()'s netProfit exactly as a result.
    const totalRevenue = salesTotal;
    const costOfGoodsSold = purchasesTotal;
    const grossProfit = totalRevenue - costOfGoodsSold;
    const operatingExpenses = otherExpenseTotal;
    const operatingProfit = grossProfit - operatingExpenses;
    const otherIncome = otherIncomeTotal;

    const detailedSections = useMemo<StatementSection[]>(
        () => [
            {
                key: 'revenue',
                heading: 'REVENUE',
                rows: [{ label: 'Total Revenue', amount: totalRevenue, emphasis: 'warning' }],
            },
            {
                key: 'cogs',
                heading: 'COST OF GOODS SOLD',
                rows: [
                    { label: 'Purchases', amount: costOfGoodsSold },
                    { label: 'Gross Profit', amount: grossProfit, emphasis: 'subtotal' },
                ],
            },
            {
                key: 'operatingExpenses',
                heading: 'OPERATING EXPENSES',
                rows: [
                    ...otherExpenseAccounts.map(account => ({
                        label: account.name,
                        amount: account.balance,
                    })),
                    {
                        label: 'Total Operating Expenses',
                        amount: operatingExpenses,
                        emphasis: 'subtotal',
                    },
                    { label: 'Operating Profit', amount: operatingProfit, emphasis: 'subtotal' },
                ],
            },
            {
                key: 'otherIncome',
                heading: 'OTHER INCOME',
                rows: [
                    ...otherIncomeAccounts.map(account => ({
                        label: account.name,
                        amount: account.balance,
                    })),
                    {
                        label: 'Total Other Income',
                        amount: otherIncome,
                        emphasis: 'subtotal',
                    },
                ],
            },
            {
                key: 'net',
                rows: [{ label: 'Net Profit', amount: netProfit, emphasis: 'success' }],
            },
        ],
        [
            totalRevenue,
            costOfGoodsSold,
            grossProfit,
            operatingExpenses,
            operatingProfit,
            otherExpenseAccounts,
            otherIncomeAccounts,
            otherIncome,
            netProfit,
        ]
    );

    const pnlSummaryData = useMemo(() => {
        const rows: SummaryRow[] = [
            { label: 'Total Revenue', value: formatCompact(totalRevenue), emphasis: 'warning' },
            { label: 'Cost of Goods Sold', value: `-${formatCompact(costOfGoodsSold)}` },
            { label: 'Gross Profit', value: formatCompact(grossProfit), emphasis: 'subtotal' },
            { label: 'Operating Expenses', value: `-${formatCompact(operatingExpenses)}` },
            { label: 'Operating Profit', value: formatCompact(operatingProfit), emphasis: 'subtotal' },
            { label: 'Other Income', value: formatCompact(otherIncome) },
            { label: 'Net Profit', value: formatCompact(netProfit), emphasis: 'success' },
        ];
        const marginPct = (value: number) => (totalRevenue > 0 ? (value / totalRevenue) * 100 : 0);
        return {
            title: 'P&L Summary',
            rows,
            margins: [
                { label: 'Gross Margin', value: formatPct(marginPct(grossProfit)) },
                { label: 'Operating Margin', value: formatPct(marginPct(operatingProfit)) },
                { label: 'Net Margin', value: formatPct(marginPct(netProfit)) },
            ],
        };
    }, [totalRevenue, costOfGoodsSold, grossProfit, operatingExpenses, operatingProfit, otherIncome, netProfit]);

    const expenseSlices: ExpenseSlice[] = useMemo(
        () =>
            otherExpenseAccounts.map((account, index) => ({
                label: account.name,
                value: account.balance,
                color: reportColor(index),
                display: formatRupee(account.balance),
                pct: `${pctOf(account.balance, operatingExpenses)}%`,
            })),
        [otherExpenseAccounts, operatingExpenses]
    );

    const expenseBreakdownData = useMemo(
        () => ({
            title: 'Expense Breakdown',
            centerLabel: 'Total Operating Expenses',
            centerValue: formatCompact(operatingExpenses),
            slices: expenseSlices,
        }),
        [operatingExpenses, expenseSlices]
    );

    const ledgerDataMatches = ledgerDataImpliedNetProfit === netProfit;

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="pnl" />
            </Col>
            <Col span={24}>
                <Flex vertical gap={24} className="w-full">
                    <PnlHeader fy={fy} period={period} onFyChange={setFy} onPeriodChange={setPeriod} />

                    {!ledgerDataMatches && (
                        <Alert
                            type="warning"
                            showIcon
                            message="Net Profit doesn't match useLedgerData()'s aggregate figures"
                            description={
                                <>
                                    This page computes Net Profit as{' '}
                                    <strong>{formatRupee(netProfit)}</strong> from the Books of
                                    Accounts datasets. The older aggregate dataset behind
                                    useLedgerData() implies{' '}
                                    <strong>{formatRupee(ledgerDataImpliedNetProfit)}</strong> for
                                    the same period — these were built in separate passes and were
                                    never reconciled. This is a real, pre-existing data
                                    inconsistency, not a computation bug on this page.
                                </>
                            }
                        />
                    )}

                    <Row gutter={[24, 24]} className="w-full">
                        <Col xs={24} xl={15}>
                            <DetailedPnlCard sections={detailedSections} />
                        </Col>
                        <Col xs={24} xl={9}>
                            <Flex vertical gap={24} className="w-full">
                                <PnlSummaryCard data={pnlSummaryData} />
                                <ExpenseBreakdownCard data={expenseBreakdownData} />
                            </Flex>
                        </Col>
                    </Row>
                </Flex>
            </Col>
        </Row>
    );
};

export default PnlLanding;
