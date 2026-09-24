import { useMemo } from 'react';

import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CreditCardOutlined,
    FileTextOutlined,
    PieChartOutlined,
    PlusOutlined,
    TeamOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Col, Empty, Flex, List, Row, Statistic, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { useLedgerData } from '../hooks/useLedgerData';
import { useNotifications } from '../hooks/useNotifications';
import { useRecentTransactions } from '../hooks/useRecentTransactions';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import SectionCard from '../sections/profitLoss/SectionCard';
import { LedgerHead } from '../types/ledger';
import { AccountingNotification, NotificationCategory } from '../types/notification';
import { RecentTransaction } from '../types/transaction';
import { formatCompact, formatRupee } from '../utils/reportFormat';

const { Title, Text } = Typography;

// Same static "today" the rest of the accounting section's dummy data is
// anchored to (see LedgerDateRangeFilter's MOCK_TODAY).
const MOCK_TODAY = '2026-09-19';

const ASSET_HEADS: LedgerHead[] = ['cashBank', 'stock', 'assets'];

interface DashboardStatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    chipClassName: string;
    accentClassName: string;
    caption: string;
}

// Every figure-card on this dashboard shares the same shape — icon chip
// (sized to match the Notifications panel's own Avatar chips below),
// colored left-border accent, compact value, and a live caption.
const DashboardStatCard = ({
    title,
    value,
    icon,
    chipClassName,
    accentClassName,
    caption,
}: DashboardStatCardProps) => (
    <SectionCard title={title} className={`border-l-4 ${accentClassName}`}>
        <Flex vertical gap={8}>
            <Avatar size={32} icon={icon} className={chipClassName} />
            <Statistic value={value} formatter={v => formatCompact(Number(v))} />
            <Text className="text-xs text-muted">{caption}</Text>
        </Flex>
    </SectionCard>
);

// <=2 days: error (red), 3-7 days: warning (amber), 8+ days: default (grey) — antd's
// own preset Tag colors, not custom hex.
const getDueTag = (daysUntilDue: number): { color: 'error' | 'warning' | 'default'; label: string } => {
    let label = `Due in ${daysUntilDue} days`;
    if (daysUntilDue === 0) label = 'Due today';
    else if (daysUntilDue === 1) label = 'Due tomorrow';

    if (daysUntilDue <= 2) return { color: 'error', label };
    if (daysUntilDue <= 7) return { color: 'warning', label };
    return { color: 'default', label };
};

// Maps each notification category to the domain's semantic tokens — payroll
// has no success/warning/danger equivalent, so it gets a neutral surface
// instead of an invented color.
const CATEGORY_META: Record<NotificationCategory, { icon: React.ReactNode; className: string }> = {
    payable: { icon: <ArrowUpOutlined />, className: 'bg-danger-surface text-danger' },
    receivable: { icon: <ArrowDownOutlined />, className: 'bg-success-surface text-success' },
    tax: { icon: <FileTextOutlined />, className: 'bg-warning-surface text-warning' },
    payroll: { icon: <TeamOutlined />, className: 'bg-surfaceGray text-bodyText' },
};

const AccountingDashboardLanding = () => {
    const ledgerData = useLedgerData();
    const recentTransactions = useRecentTransactions();
    const notifications = useNotifications();

    const totals = useMemo(() => {
        const sumWhere = (predicate: (head: LedgerHead) => boolean) =>
            ledgerData
                .filter(item => predicate(item.head))
                .reduce((sum, item) => sum + item.closingBalance, 0);

        // Only accounts actually contributing to the total — a fully-settled
        // (zero-balance) customer/vendor account shouldn't count as "outstanding".
        const receivableAccounts = ledgerData.filter(
            item => item.category === 'receivable' && item.closingBalance !== 0
        );
        const payableAccounts = ledgerData.filter(
            item => item.category === 'payable' && item.closingBalance !== 0
        );

        return {
            assets: sumWhere(head => ASSET_HEADS.includes(head)),
            liabilities: sumWhere(head => head === 'liabilities'),
            capitalEquity: sumWhere(head => head === 'equity'),
            receivables: receivableAccounts.reduce((sum, item) => sum + item.closingBalance, 0),
            payables: payableAccounts.reduce((sum, item) => sum + Math.abs(item.closingBalance), 0),
            receivableCount: receivableAccounts.length,
            payableCount: payableAccounts.length,
        };
    }, [ledgerData]);

    const renderAmount = (value: number) => (value === 0 ? '—' : formatRupee(value));

    const transactionColumns: ColumnsType<RecentTransaction> = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Ledger',
            dataIndex: 'ledger',
            key: 'ledger',
        },
        {
            title: 'Narration',
            dataIndex: 'narration',
            key: 'narration',
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            align: 'right',
            render: renderAmount,
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            align: 'right',
            render: renderAmount,
        },
    ];

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="dashboard" />
            </Col>
            <Col span={24}>
                <Flex gap={16} className="w-full flex-col md:flex-row md:items-center md:justify-between">
                    <Flex vertical gap={2}>
                        <Title level={4} className="!mb-0 !text-lg !font-semibold !text-ink md:!text-xl">
                            Dashboard
                        </Title>
                        <Text className="text-sm text-bodyText">
                            A snapshot of your books — balances, recent activity, and what needs
                            your attention.
                        </Text>
                    </Flex>
                    <Button type="primary" icon={<PlusOutlined />} className="w-full sm:w-auto">
                        Add New Entry
                    </Button>
                </Flex>
            </Col>
            <Col span={24}>
                <Row gutter={16}>
                    <Col xs={24} lg={16}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} xl={8}>
                                <DashboardStatCard
                                    title="Assets"
                                    value={totals.assets}
                                    icon={<WalletOutlined />}
                                    chipClassName="border border-success-border bg-success-surface text-success"
                                    accentClassName="border-l-success"
                                    caption={`as of ${dayjs(MOCK_TODAY).format('D MMMM YYYY')}`}
                                />
                            </Col>
                            <Col xs={24} sm={12} xl={8}>
                                <DashboardStatCard
                                    title="Liabilities"
                                    value={totals.liabilities}
                                    icon={<CreditCardOutlined />}
                                    chipClassName="border border-danger-border bg-danger-surface text-danger"
                                    accentClassName="border-l-danger"
                                    caption={`as of ${dayjs(MOCK_TODAY).format('D MMMM YYYY')}`}
                                />
                            </Col>
                            <Col xs={24} sm={12} xl={8}>
                                <DashboardStatCard
                                    title="Capital & Equity"
                                    value={totals.capitalEquity}
                                    icon={<PieChartOutlined />}
                                    chipClassName="border border-borderStrong bg-surfaceGray text-ink"
                                    accentClassName="border-l-ink"
                                    caption={`as of ${dayjs(MOCK_TODAY).format('D MMMM YYYY')}`}
                                />
                            </Col>
                            <Col xs={24} sm={12}>
                                <DashboardStatCard
                                    title="Total Receivables"
                                    value={totals.receivables}
                                    icon={<ArrowDownOutlined />}
                                    chipClassName="border border-success-border bg-success-surface text-success"
                                    accentClassName="border-l-success"
                                    caption={`${totals.receivableCount} invoice${totals.receivableCount === 1 ? '' : 's'} outstanding`}
                                />
                            </Col>
                            <Col xs={24} sm={12}>
                                <DashboardStatCard
                                    title="Total Payables"
                                    value={totals.payables}
                                    icon={<ArrowUpOutlined />}
                                    chipClassName="border border-danger-border bg-danger-surface text-danger"
                                    accentClassName="border-l-danger"
                                    caption={`${totals.payableCount} bill${totals.payableCount === 1 ? '' : 's'} outstanding`}
                                />
                            </Col>
                            <Col span={24}>
                                <SectionCard title="Recent Transactions">
                                    <div className="overflow-x-auto">
                                        <Table
                                            columns={transactionColumns}
                                            dataSource={recentTransactions}
                                            rowKey="id"
                                            pagination={false}
                                            className="min-w-[640px]"
                                        />
                                    </div>
                                </SectionCard>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} lg={8}>
                        <SectionCard title="Notifications & Reminders" className="sticky top-4">
                            {notifications.length === 0 ? (
                                <Empty description="Nothing due right now" />
                            ) : (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={notifications}
                                    renderItem={(item: AccountingNotification) => {
                                        const meta = CATEGORY_META[item.category];
                                        const dueTag = getDueTag(item.daysUntilDue);
                                        return (
                                            <List.Item
                                                extra={<Tag color={dueTag.color}>{dueTag.label}</Tag>}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar icon={meta.icon} className={meta.className} />}
                                                    title={item.title}
                                                    description={item.subtitle}
                                                />
                                            </List.Item>
                                        );
                                    }}
                                />
                            )}
                        </SectionCard>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default AccountingDashboardLanding;
