import { useMemo } from 'react';

import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    FileTextOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Avatar, Card, Col, Empty, List, Row, Statistic, Table, Tag, Typography, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import { useLedgerData } from '../hooks/useLedgerData';
import { useNotifications } from '../hooks/useNotifications';
import { useRecentTransactions } from '../hooks/useRecentTransactions';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import { LedgerHead } from '../types/ledger';
import { AccountingNotification, NotificationCategory } from '../types/notification';
import { RecentTransaction } from '../types/transaction';

const { Title, Text } = Typography;

const ASSET_HEADS: LedgerHead[] = ['cashBank', 'stock', 'assets'];

const formatRupees = (value: number) => `₹${formatNumberWithLocalString(value, 0, 0)}`;

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

const AccountingDashboardLanding = () => {
    const { token } = theme.useToken();
    const ledgerData = useLedgerData();
    const recentTransactions = useRecentTransactions();
    const notifications = useNotifications();

    const totals = useMemo(() => {
        const sumWhere = (predicate: (head: LedgerHead) => boolean) =>
            ledgerData
                .filter(item => predicate(item.head))
                .reduce((sum, item) => sum + item.closingBalance, 0);

        const receivables = ledgerData
            .filter(item => item.category === 'receivable')
            .reduce((sum, item) => sum + item.closingBalance, 0);
        const payables = ledgerData
            .filter(item => item.category === 'payable')
            .reduce((sum, item) => sum + Math.abs(item.closingBalance), 0);

        return {
            assets: sumWhere(head => ASSET_HEADS.includes(head)),
            liabilities: sumWhere(head => head === 'liabilities'),
            capitalEquity: sumWhere(head => head === 'equity'),
            receivables,
            payables,
        };
    }, [ledgerData]);

    const categoryMeta: Record<NotificationCategory, { icon: React.ReactNode; bg: string; color: string }> = {
        payable: { icon: <ArrowUpOutlined />, bg: token.colorErrorBg, color: token.colorError },
        receivable: { icon: <ArrowDownOutlined />, bg: token.colorSuccessBg, color: token.colorSuccess },
        tax: { icon: <FileTextOutlined />, bg: token.colorWarningBg, color: token.colorWarning },
        payroll: { icon: <TeamOutlined />, bg: token.colorInfoBg, color: token.colorInfo },
    };

    const renderAmount = (value: number) =>
        value === 0 ? '—' : formatNumberWithLocalString(value, 2, 2);

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
                <Title level={4} className="!mb-0">
                    Dashboard
                </Title>
                <Text type="secondary">
                    A snapshot of your books — balances, recent activity, and what needs your
                    attention.
                </Text>
            </Col>
            <Col span={24}>
                <Row gutter={16}>
                    <Col xs={24} lg={16}>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} sm={8}>
                                <Card>
                                    <Statistic
                                        title="Assets"
                                        value={totals.assets}
                                        formatter={value => formatRupees(Number(value))}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Card>
                                    <Statistic
                                        title="Liabilities"
                                        value={totals.liabilities}
                                        formatter={value => formatRupees(Number(value))}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={8}>
                                <Card>
                                    <Statistic
                                        title="Capital & Equity"
                                        value={totals.capitalEquity}
                                        formatter={value => formatRupees(Number(value))}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Card>
                                    <Statistic
                                        title="Total Receivables"
                                        value={totals.receivables}
                                        formatter={value => formatRupees(Number(value))}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Card>
                                    <Statistic
                                        title="Total Payables"
                                        value={totals.payables}
                                        formatter={value => formatRupees(Number(value))}
                                    />
                                </Card>
                            </Col>
                            <Col span={24}>
                                <Card title="Recent Transactions">
                                    <Table
                                        columns={transactionColumns}
                                        dataSource={recentTransactions}
                                        rowKey="id"
                                        pagination={false}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card
                            title="Notifications & Reminders"
                            style={{ position: 'sticky', top: 16 }}
                        >
                            {notifications.length === 0 ? (
                                <Empty description="Nothing due right now" />
                            ) : (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={notifications}
                                    renderItem={(item: AccountingNotification) => {
                                        const meta = categoryMeta[item.category];
                                        const dueTag = getDueTag(item.daysUntilDue);
                                        return (
                                            <List.Item
                                                extra={<Tag color={dueTag.color}>{dueTag.label}</Tag>}
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        <Avatar
                                                            icon={meta.icon}
                                                            style={{
                                                                backgroundColor: meta.bg,
                                                                color: meta.color,
                                                            }}
                                                        />
                                                    }
                                                    title={item.title}
                                                    description={item.subtitle}
                                                />
                                            </List.Item>
                                        );
                                    }}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default AccountingDashboardLanding;
