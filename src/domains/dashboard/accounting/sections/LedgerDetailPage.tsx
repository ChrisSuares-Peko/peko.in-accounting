import { ReactNode, useMemo, useState } from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Flex, Row, Statistic, Table, Typography, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import AccountingSectionTabs from './AccountingSectionTabs';
import LedgerDateRangeFilter, { DateRangePreset, MOCK_TODAY, getPresetRange } from './LedgerDateRangeFilter';
import { GeneralLedgerEntry } from '../types/generalLedger';

const { Title, Text } = Typography;

const formatRupees = (value: number) => `₹${formatNumberWithLocalString(value, 0, 0)}`;
const formatAmount = (value: number) => formatNumberWithLocalString(value, 2, 2);

export interface LedgerDetailPageProps {
    headName: string;
    headIcon: ReactNode;
    subtitle: string;
    entries: GeneralLedgerEntry[];
    normalSide: 'Dr' | 'Cr';
    // e.g. Stock's "Physical Stock Count" — rendered as additional outlined Buttons
    // alongside "Add Manual Transaction". No working destination yet.
    extraActions?: { label: string; icon: ReactNode }[];
    // e.g. Sales/Purchases' note about auto-population from Invoicing/Purchase.
    footnoteExtra?: string;
}

interface LedgerTableRow {
    key: string;
    displayDate: string;
    label: string;
    muted: boolean;
    amount: number;
}

const toRow = (entry: GeneralLedgerEntry, prefix: 'To' | 'By'): LedgerTableRow => ({
    key: entry.id,
    displayDate: entry.displayDate,
    label: `${prefix} ${entry.particulars}`,
    muted: !!entry.isOpeningBalance,
    amount: entry.amount,
});

const sortWithOpeningFirst = (rows: GeneralLedgerEntry[]) =>
    [...rows].sort((a, b) => {
        if (a.isOpeningBalance && !b.isOpeningBalance) return -1;
        if (!a.isOpeningBalance && b.isOpeningBalance) return 1;
        return a.date.localeCompare(b.date);
    });

const columns: ColumnsType<LedgerTableRow> = [
    { title: 'Date', dataIndex: 'displayDate', key: 'displayDate', width: 90 },
    {
        title: 'Particulars',
        dataIndex: 'label',
        key: 'label',
        render: (label: string, row) => (
            <span className={row.muted ? 'italic text-gray-400' : undefined}>{label}</span>
        ),
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: (value: number) => <span className="tabular-nums">{formatAmount(value)}</span>,
    },
];

// The single reusable page every one of the 8 general-ledger heads (Stock, Assets,
// Liabilities, Equity, Sales, Purchases, Other Income, Other Expense) renders
// through — same chrome and visual language as the Cash & Bank page, just a single
// Amount column instead of a Cash/Bank split.
const LedgerDetailPage = ({
    headName,
    headIcon,
    subtitle,
    entries,
    normalSide,
    extraActions,
    footnoteExtra,
}: LedgerDetailPageProps) => {
    const { token } = theme.useToken();
    const today = useMemo(() => dayjs(MOCK_TODAY), []);

    const [preset, setPreset] = useState<DateRangePreset>('this-month');
    const [customRange, setCustomRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const activeRange = preset === 'custom' ? customRange : getPresetRange(preset, today);

    const filteredEntries = useMemo(() => {
        if (!activeRange || !activeRange[0] || !activeRange[1]) return entries;
        const start = activeRange[0].format('YYYY-MM-DD');
        const end = activeRange[1].format('YYYY-MM-DD');
        return entries.filter(entry => entry.date >= start && entry.date <= end);
    }, [entries, activeRange]);

    // Never hardcoded — recomputed from whatever's currently filtered. Sign follows
    // normalSide: a Dr-normal head's balance is its Dr total minus Cr total, a
    // Cr-normal head's is the reverse.
    const closingBalance = useMemo(() => {
        const sumDr = filteredEntries
            .filter(entry => entry.side === 'Dr')
            .reduce((sum, entry) => sum + entry.amount, 0);
        const sumCr = filteredEntries
            .filter(entry => entry.side === 'Cr')
            .reduce((sum, entry) => sum + entry.amount, 0);
        return normalSide === 'Dr' ? sumDr - sumCr : sumCr - sumDr;
    }, [filteredEntries, normalSide]);

    // Which panel holds the real opening balance (already encoded in the entries
    // themselves) vs. the computed "Balance c/d" plug is determined by normalSide:
    // a Dr-normal head's opening sits on the Dr panel and the plug goes on Cr; a
    // Cr-normal head does the reverse.
    const drTableRows = useMemo(() => {
        const rows = sortWithOpeningFirst(filteredEntries.filter(entry => entry.side === 'Dr')).map(
            entry => toRow(entry, 'To')
        );
        if (normalSide === 'Cr') {
            rows.push({
                key: 'balance-c-d',
                displayDate: today.format('D MMM'),
                label: 'To Balance c/d',
                muted: true,
                amount: closingBalance,
            });
        }
        return rows;
    }, [filteredEntries, normalSide, closingBalance, today]);

    const crTableRows = useMemo(() => {
        const rows = sortWithOpeningFirst(filteredEntries.filter(entry => entry.side === 'Cr')).map(
            entry => toRow(entry, 'By')
        );
        if (normalSide === 'Dr') {
            rows.push({
                key: 'balance-c-d',
                displayDate: today.format('D MMM'),
                label: 'By Balance c/d',
                muted: true,
                amount: closingBalance,
            });
        }
        return rows;
    }, [filteredEntries, normalSide, closingBalance, today]);

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="ledgers" />
            </Col>
            <Col span={24}>
                <Link to={`${paths.dashboard.accounting}/${paths.accounting.ledgers}`}>
                    <Flex align="center" gap={4}>
                        <ArrowLeftOutlined style={{ fontSize: 12 }} />
                        <Text type="secondary">Ledgers</Text>
                    </Flex>
                </Link>
            </Col>
            <Col span={24}>
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col>
                        <Flex align="center" gap={12}>
                            <Avatar
                                size={40}
                                icon={headIcon}
                                style={{
                                    backgroundColor: token.colorPrimaryBg,
                                    color: token.colorPrimary,
                                }}
                            />
                            <Flex vertical>
                                <Title level={4} className="!mb-0">
                                    {headName}
                                </Title>
                                <Text type="secondary">{subtitle}</Text>
                            </Flex>
                        </Flex>
                    </Col>
                    <Col>
                        <Statistic
                            title="Closing Balance"
                            value={closingBalance}
                            formatter={value => formatRupees(Number(value))}
                        />
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col>
                        <LedgerDateRangeFilter
                            preset={preset}
                            onPresetChange={setPreset}
                            customRange={customRange}
                            onCustomRangeChange={setCustomRange}
                        />
                    </Col>
                    <Col>
                        <Flex gap={8} wrap="wrap">
                            {extraActions?.map(action => (
                                <Button key={action.label} icon={action.icon}>
                                    {action.label}
                                </Button>
                            ))}
                            <Button type="primary">Add Manual Transaction</Button>
                        </Flex>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card title="Dr.">
                            <Table
                                columns={columns}
                                dataSource={drTableRows}
                                pagination={false}
                                rowKey="key"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Cr.">
                            <Table
                                columns={columns}
                                dataSource={crTableRows}
                                pagination={false}
                                rowKey="key"
                            />
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Text type="secondary" className="text-xs">
                    Showing posted transactions only.
                    {footnoteExtra ? ` ${footnoteExtra}` : ''}
                </Text>
            </Col>
        </Row>
    );
};

export default LedgerDetailPage;
