import { useMemo, useState } from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Flex, Radio, Row, Statistic, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { useCashBookEntries } from '../hooks/useCashBookEntries';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import { CashBookEntry } from '../types/cashBook';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Static "today" for this prototype, so the page's numbers stay coherent with the
// FY 2026-27 dummy dataset regardless of when it's actually opened. Swap for the
// real current date once this isn't a static prototype.
const MOCK_TODAY = '2026-09-19';

const formatRupees = (value: number) => `₹${formatNumberWithLocalString(value, 0, 0)}`;
const formatAmount = (value: number) => formatNumberWithLocalString(value, 2, 2);

type RangePreset = 'this-month' | 'last-month' | 'qtd' | 'ytd' | 'custom';

const PRESET_OPTIONS: { label: string; value: RangePreset }[] = [
    { label: 'This Month', value: 'this-month' },
    { label: 'Last Month', value: 'last-month' },
    { label: 'Quarter to Date', value: 'qtd' },
    { label: 'Year to Date', value: 'ytd' },
    { label: 'Custom Range', value: 'custom' },
];

// Fiscal quarters follow the same 1 April FY start as "Year to Date" below (not
// specified explicitly, but kept consistent rather than mixing calendar and fiscal
// framing on the same toolbar): Q1 Apr-Jun, Q2 Jul-Sep, Q3 Oct-Dec, Q4 Jan-Mar.
const getFiscalQuarterStart = (date: Dayjs): Dayjs => {
    const month = date.month(); // 0-indexed, Jan = 0
    if (month >= 3 && month <= 5) return date.month(3).startOf('month');
    if (month >= 6 && month <= 8) return date.month(6).startOf('month');
    if (month >= 9 && month <= 11) return date.month(9).startOf('month');
    return date.month(0).startOf('month');
};

// 1 April start, not 1 January.
const getFiscalYearStart = (date: Dayjs): Dayjs => {
    const fyStartYear = date.month() >= 3 ? date.year() : date.year() - 1;
    return dayjs(`${fyStartYear}-04-01`);
};

const getPresetRange = (preset: RangePreset, today: Dayjs): [Dayjs, Dayjs] | null => {
    if (preset === 'this-month') return [today.startOf('month'), today.endOf('month')];
    if (preset === 'last-month') {
        const lastMonth = today.subtract(1, 'month');
        return [lastMonth.startOf('month'), lastMonth.endOf('month')];
    }
    if (preset === 'qtd') return [getFiscalQuarterStart(today), today];
    if (preset === 'ytd') return [getFiscalYearStart(today), today];
    return null; // 'custom' — driven by the RangePicker instead
};

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

    const [preset, setPreset] = useState<RangePreset>('this-month');
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
                        <Flex align="center" gap={12} wrap="wrap">
                            <Radio.Group
                                value={preset}
                                onChange={e => setPreset(e.target.value)}
                                optionType="button"
                                buttonStyle="solid"
                                options={PRESET_OPTIONS}
                            />
                            {preset === 'custom' && (
                                <RangePicker value={customRange} onChange={setCustomRange} />
                            )}
                        </Flex>
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
