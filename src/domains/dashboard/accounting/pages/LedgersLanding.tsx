import { ReactNode, useMemo } from 'react';

import {
    BankOutlined,
    CreditCardOutlined,
    CrownOutlined,
    GoldOutlined,
    InboxOutlined,
    MinusCircleOutlined,
    PlusCircleOutlined,
    RiseOutlined,
    ShoppingOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Flex, Row, Statistic, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { useLedgerData } from '../hooks/useLedgerData';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import { LedgerHead } from '../types/ledger';

const { Title, Text } = Typography;

const formatRupees = (value: number) => `₹${formatNumberWithLocalString(value, 0, 0)}`;

// One card per chart-of-accounts head — closing balances are read live from
// useLedgerData() below, never hardcoded here. `path` is the relative segment
// under /accounting (see paths.ts's accounting object).
const HEAD_CARDS: { head: LedgerHead; label: string; icon: ReactNode; path: string }[] = [
    { head: 'cashBank', label: 'Cash & Bank', icon: <BankOutlined />, path: paths.accounting.cashBank },
    { head: 'stock', label: 'Stock', icon: <InboxOutlined />, path: paths.accounting.stock },
    { head: 'assets', label: 'Assets', icon: <GoldOutlined />, path: paths.accounting.assets },
    {
        head: 'liabilities',
        label: 'Liabilities',
        icon: <CreditCardOutlined />,
        path: paths.accounting.liabilities,
    },
    { head: 'equity', label: 'Capital & Equity', icon: <CrownOutlined />, path: paths.accounting.equity },
    { head: 'sales', label: 'Sales', icon: <RiseOutlined />, path: paths.accounting.sales },
    {
        head: 'purchases',
        label: 'Purchases',
        icon: <ShoppingOutlined />,
        path: paths.accounting.purchases,
    },
    {
        head: 'otherIncome',
        label: 'Other Income',
        icon: <PlusCircleOutlined />,
        path: paths.accounting.otherIncome,
    },
    {
        head: 'otherExpense',
        label: 'Other Expense',
        icon: <MinusCircleOutlined />,
        path: paths.accounting.otherExpense,
    },
];

const LedgersLanding = () => {
    const { token } = theme.useToken();
    const ledgerData = useLedgerData();

    // Never hardcoded — summed live from the aggregate ledger data, one total per
    // head. (Transaction-level detail per head lives in its own dataset/hook —
    // e.g. useStockEntries() — that's for the head's own detail page, not this
    // summary's closing-balance figures.)
    const closingByHead = useMemo(() => {
        const totals: Partial<Record<LedgerHead, number>> = {};
        ledgerData.forEach(item => {
            totals[item.head] = (totals[item.head] ?? 0) + item.closingBalance;
        });
        return totals;
    }, [ledgerData]);

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="ledgers" />
            </Col>
            <Col span={24}>
                <Title level={4} className="!mb-0">
                    Ledgers
                </Title>
                <Text type="secondary">Every account in your chart of accounts, grouped by head.</Text>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    {HEAD_CARDS.map(card => (
                        <Col xs={24} sm={12} lg={8} key={card.head}>
                            <Link to={`${paths.dashboard.accounting}/${card.path}`} className="block">
                                <Card hoverable>
                                    <Flex align="center" gap={12}>
                                        <Avatar
                                            size={40}
                                            icon={card.icon}
                                            style={{
                                                backgroundColor: token.colorPrimaryBg,
                                                color: token.colorPrimary,
                                            }}
                                        />
                                        <Statistic
                                            title={card.label}
                                            value={closingByHead[card.head] ?? 0}
                                            formatter={value => formatRupees(Number(value))}
                                        />
                                    </Flex>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
    );
};

export default LedgersLanding;
