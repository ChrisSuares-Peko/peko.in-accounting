import { Alert, Card, Col, Row, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import { useNetProfit } from '../hooks/useNetProfit';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';

const { Title, Text } = Typography;

const MOCK_TODAY = '2026-09-19';

const formatAmount = (value: number) => formatNumberWithLocalString(value, 2, 2);

interface PnlRow {
    key: string;
    name: string;
    amount: number;
    emphasis?: boolean;
}

const columns: ColumnsType<PnlRow> = [
    {
        title: 'Account',
        dataIndex: 'name',
        key: 'name',
        render: (name: string, row) => (row.emphasis ? <strong>{name}</strong> : name),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: (value: number, row) => (
            <span className="tabular-nums">
                {row.emphasis ? <strong>{formatAmount(value)}</strong> : formatAmount(value)}
            </span>
        ),
    },
];

const PnlLanding = () => {
    const {
        otherIncomeAccounts,
        salesTotal,
        incomeTotal,
        otherExpenseAccounts,
        purchasesTotal,
        expenseTotal,
        netProfit,
        ledgerDataImpliedNetProfit,
    } = useNetProfit();

    // Expenditure = every otherExpense account + Purchases, with Net Profit
    // appended as the final balancing line so both columns' totals match — never
    // hardcoded, this is incomeTotal - expenseTotal from useNetProfit().
    const expenditureRows: PnlRow[] = [
        ...otherExpenseAccounts.map(account => ({
            key: account.id,
            name: account.name,
            amount: account.balance,
        })),
        { key: 'purchases', name: 'Purchases', amount: purchasesTotal },
    ];
    if (netProfit > 0) {
        expenditureRows.push({ key: 'net-profit', name: 'Net Profit', amount: netProfit, emphasis: true });
    }
    const expenditureTotal = expenseTotal + Math.max(netProfit, 0);

    const incomeRows: PnlRow[] = [
        ...otherIncomeAccounts.map(account => ({
            key: account.id,
            name: account.name,
            amount: account.balance,
        })),
        { key: 'sales', name: 'Sales', amount: salesTotal },
    ];
    if (netProfit < 0) {
        incomeRows.push({ key: 'net-loss', name: 'Net Loss', amount: -netProfit, emphasis: true });
    }
    const incomeTotalWithBalancing = incomeTotal + Math.max(-netProfit, 0);

    const ledgerDataMatches = ledgerDataImpliedNetProfit === netProfit;

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="pnl" />
            </Col>
            <Col span={24}>
                <Title level={4} className="!mb-0">
                    Profit &amp; Loss
                </Title>
                <Text type="secondary">for the period as of {dayjs(MOCK_TODAY).format('D MMMM YYYY')}</Text>
            </Col>
            {!ledgerDataMatches && (
                <Col span={24}>
                    <Alert
                        type="warning"
                        showIcon
                        message="Net Profit doesn't match useLedgerData()'s aggregate figures"
                        description={
                            <>
                                This page computes Net Profit as{' '}
                                <strong>₹{formatAmount(netProfit)}</strong> from the newer
                                per-head/Books of Accounts datasets. The older aggregate dataset
                                behind useLedgerData() (also used by the Dashboard and Ledgers
                                summary page) implies{' '}
                                <strong>₹{formatAmount(ledgerDataImpliedNetProfit)}</strong> for the
                                same period from its own Sales/Purchases/Other Income/Other Expense
                                figures. These datasets were built in separate, earlier passes and
                                were never reconciled — this is a real, pre-existing data
                                inconsistency, not a computation bug on this page.
                            </>
                        }
                    />
                </Col>
            )}
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card title="Expenditure">
                            <Table
                                columns={columns}
                                dataSource={expenditureRows}
                                pagination={false}
                                rowKey="key"
                                summary={() => (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0}>
                                            <strong>Total</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right">
                                            <strong className="tabular-nums">
                                                {formatAmount(expenditureTotal)}
                                            </strong>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Income">
                            <Table
                                columns={columns}
                                dataSource={incomeRows}
                                pagination={false}
                                rowKey="key"
                                summary={() => (
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0}>
                                            <strong>Total</strong>
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={1} align="right">
                                            <strong className="tabular-nums">
                                                {formatAmount(incomeTotalWithBalancing)}
                                            </strong>
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default PnlLanding;
