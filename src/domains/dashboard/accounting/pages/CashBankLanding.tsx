import { useMemo, useState } from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Row, Statistic, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { useCashBookEntries } from '../hooks/useCashBookEntries';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import LedgerDateRangeFilter, {
    DateRangePreset,
    MOCK_TODAY,
    getPresetRange,
} from '../sections/LedgerDateRangeFilter';
import { CashBookEntry } from '../types/cashBook';

const { Title, Text } = Typography;

const formatRupees = (value: number) => `₹${formatNumberWithLocalString(value, 0, 0)}`;
const formatAmount = (value: number) => formatNumberWithLocalString(value, 2, 2);

interface CashBookTableRow {
    key: string;
    displayDate: string;
    label: string;
    muted: boolean;
    cashAmount: number | null;
    bankAmount: number | null;
}

const toRow = (entry: CashBookEntry, prefix: 'To' | 'By'): CashBookTableRow => ({
    key: entry.id,
    displayDate: entry.displayDate,
    label: `${prefix} ${entry.particulars}`,
    muted: !!entry.isOpeningBalance,
    cashAmount: entry.account === 'cash' ? entry.amount : null,
    bankAmount: entry.account === 'bank' ? entry.amount : null,
});

const columns: ColumnsType<CashBookTableRow> = [
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
        title: 'Cash',
        dataIndex: 'cashAmount',
        key: 'cashAmount',
        align: 'right',
        render: (value: number | null) => (
            <span className="tabular-nums">{value === null ? '—' : formatAmount(value)}</span>
        ),
    },
    {
        title: 'Bank',
        dataIndex: 'bankAmount',
        key: 'bankAmount',
        align: 'right',
        render: (value: number | null) => (
            <span className="tabular-nums">{value === null ? '—' : formatAmount(value)}</span>
        ),
    },
];

const CashBankLanding = () => {
    const entries = useCashBookEntries();
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

    // Step 2's derived values, recomputed from whatever's currently filtered — never
    // hardcoded, so they can never drift from the entries actually shown below.
    const totals = useMemo(() => {
        const sumSideAccount = (side: CashBookEntry['side'], account: CashBookEntry['account']) =>
            filteredEntries
                .filter(entry => entry.side === side && entry.account === account)
                .reduce((sum, entry) => sum + entry.amount, 0);

        const closingCash = sumSideAccount('Dr', 'cash') - sumSideAccount('Cr', 'cash');
        const closingBank = sumSideAccount('Dr', 'bank') - sumSideAccount('Cr', 'bank');
        return { closingCash, closingBank, closingTotal: closingCash + closingBank };
    }, [filteredEntries]);

    const drTableRows = useMemo(() => {
        const drRows = filteredEntries
            .filter(entry => entry.side === 'Dr')
            .sort((a, b) => {
                if (a.isOpeningBalance && !b.isOpeningBalance) return -1;
                if (!a.isOpeningBalance && b.isOpeningBalance) return 1;
                return a.date.localeCompare(b.date);
            });
        return drRows.map(entry => toRow(entry, 'To'));
    }, [filteredEntries]);

    const crTableRows = useMemo(() => {
        const crRows = filteredEntries
            .filter(entry => entry.side === 'Cr')
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(entry => toRow(entry, 'By'));
        // Synthetic "By Balance c/d" row — computed from totals above, never stored,
        // so it can't drift from the entries it's balancing against.
        const closingRow: CashBookTableRow = {
            key: 'balance-c-d',
            displayDate: today.format('D MMM'),
            label: 'By Balance c/d',
            muted: true,
            cashAmount: totals.closingCash,
            bankAmount: totals.closingBank,
        };
        return [...crRows, closingRow];
    }, [filteredEntries, totals, today]);

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
                        <Title level={4} className="!mb-0">
                            Cash & Bank
                        </Title>
                        <Text type="secondary">
                            Double-column cash book — FY 2026-27, as of{' '}
                            {today.format('D MMMM YYYY')}
                        </Text>
                    </Col>
                    <Col>
                        <Statistic
                            title="Closing Balance"
                            value={totals.closingTotal}
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
                            <Button>Reconcile Bank</Button>
                            <Button>Physical Cash Count</Button>
                            <Button>Upload Cheques</Button>
                            <Button type="primary">Add Manual Transaction</Button>
                        </Flex>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Card title="Dr. (Receipts)">
                            <Table
                                columns={columns}
                                dataSource={drTableRows}
                                pagination={false}
                                rowKey="key"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={12}>
                        <Card title="Cr. (Payments)">
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
        </Row>
    );
};

export default CashBankLanding;
