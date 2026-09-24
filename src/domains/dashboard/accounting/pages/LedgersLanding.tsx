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
import { Avatar, Col, Flex, Row, Statistic, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { useLedgerData } from '../hooks/useLedgerData';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import SectionCard from '../sections/profitLoss/SectionCard';
import { LedgerHead } from '../types/ledger';
import { signedCompact } from '../utils/reportFormat';

const { Title, Text } = Typography;

// Soft (index 0) + primary (index 5) shade per named color from antd's own
// preset palette (@ant-design/colors' presetPalettes) — not arbitrary hex.
// "Other Expense" uses antd's neutral gray scale (gray-2 / gray-8) instead,
// since the chromatic `grey` preset itself has no pale "surface" shade.
const HEAD_TINTS: Record<LedgerHead, { bg: string; fg: string }> = {
    cashBank: { bg: '#e6f4ff', fg: '#1677ff' }, // blue
    stock: { bg: '#f9f0ff', fg: '#722ed1' }, // purple
    assets: { bg: '#e6fffb', fg: '#13c2c2' }, // cyan
    liabilities: { bg: '#f0f5ff', fg: '#2f54eb' }, // geekblue
    equity: { bg: '#fff0f6', fg: '#eb2f96' }, // magenta
    sales: { bg: '#fff2e8', fg: '#fa541c' }, // volcano
    purchases: { bg: '#fffbe6', fg: '#faad14' }, // gold
    otherIncome: { bg: '#f6ffed', fg: '#52c41a' }, // green
    otherExpense: { bg: '#fafafa', fg: '#595959' }, // gray
};

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
                <Title level={4} className="!mb-0 !text-lg !font-semibold !text-ink md:!text-xl">
                    Ledgers
                </Title>
                <Text className="text-sm text-bodyText">
                    Every account in your chart of accounts, grouped by head.
                </Text>
            </Col>
            <Col span={24}>
                <Row>
                    <Col xs={24} md={{ span: 14, offset: 5 }}>
                        <Row gutter={[16, 16]}>
                            {HEAD_CARDS.map(card => {
                                const tint = HEAD_TINTS[card.head];
                                return (
                                    <Col xs={24} sm={12} md={8} xl={8} key={card.head} className="flex">
                                        <Link
                                            to={`${paths.dashboard.accounting}/${card.path}`}
                                            className="block w-full"
                                        >
                                            <SectionCard
                                                title={card.label}
                                                className="cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-danger hover:shadow-lg"
                                            >
                                                <Flex align="center" gap={12}>
                                                    <Avatar
                                                        size={40}
                                                        icon={card.icon}
                                                        style={{
                                                            backgroundColor: tint.bg,
                                                            color: tint.fg,
                                                        }}
                                                    />
                                                    <Statistic
                                                        value={closingByHead[card.head] ?? 0}
                                                        formatter={value => signedCompact(Number(value))}
                                                    />
                                                </Flex>
                                            </SectionCard>
                                        </Link>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default LedgersLanding;
