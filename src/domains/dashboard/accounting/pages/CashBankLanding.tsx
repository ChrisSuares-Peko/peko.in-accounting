import { useMemo, useState } from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Statistic, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { useCashBookEntries } from '../hooks/useCashBookEntries';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import LedgerDateRangeFilter, {
    DateRangePreset,
    MOCK_TODAY,
    getPresetRange,
} from '../sections/LedgerDateRangeFilter';
import SectionCard from '../sections/profitLoss/SectionCard';
import { CashBookEntry } from '../types/cashBook';
import { formatCompact, formatRupee } from '../utils/reportFormat';

const { Title, Text } = Typography;

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
            <span className={row.muted ? 'italic text-muted' : undefined}>{label}</span>
        ),
    },
    {
        title: 'Cash',
        dataIndex: 'cashAmount',
        key: 'cashAmount',
        align: 'right',
        render: (value: number | null) => (
            <span className="tabular-nums">{value === null ? '—' : formatRupee(value)}</span>
        ),
    },
    {
        title: 'Bank',
        dataIndex: 'bankAmount',
        key: 'bankAmount',
        align: 'right',
        render: (value: number | null) => (
            <span className="tabular-nums">{value === null ? '—' : formatRupee(value)}</span>
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
                        <Text className="text-bodyText">Ledgers</Text>
                    </Flex>
                </Link>
            </Col>
            <Col span={24}>
                <Flex gap={16} className="w-full flex-col md:flex-row md:items-center md:justify-between">
                    <Flex vertical gap={2}>
                        <Title level={4} className="!mb-0 !text-lg !font-semibold !text-ink md:!text-xl">
                            Cash & Bank
                        </Title>
                        <Text className="text-sm text-bodyText">
                            Double-column cash book — FY 2026-27, as of{' '}
                            {today.format('D MMMM YYYY')}
                        </Text>
                    </Flex>
                    <Statistic
                        title="Closing Balance"
                        value={totals.closingTotal}
                        formatter={value => formatCompact(Number(value))}
                    />
                </Flex>
            </Col>
            <Col span={24}>
                <Flex gap={16} className="w-full flex-col md:flex-row md:items-center md:justify-between">
                    <LedgerDateRangeFilter
                        preset={preset}
                        onPresetChange={setPreset}
                        customRange={customRange}
                        onCustomRangeChange={setCustomRange}
                    />
                    <Flex gap={8} wrap="wrap" className="flex-col sm:flex-row">
                        <Button className="w-full sm:w-auto">Reconcile Bank</Button>
                        <Button className="w-full sm:w-auto">Physical Cash Count</Button>
                        <Button className="w-full sm:w-auto">Upload Cheques</Button>
                        <Button type="primary" className="w-full sm:w-auto">
                            Add Manual Transaction
                        </Button>
                    </Flex>
                </Flex>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <SectionCard title="Dr. (Receipts)">
                            <div className="overflow-x-auto">
                                <Table
                                    columns={columns}
                                    dataSource={drTableRows}
                                    pagination={false}
                                    rowKey="key"
                                    className="min-w-[480px]"
                                />
                            </div>
                        </SectionCard>
                    </Col>
                    <Col xs={24} md={12}>
                        <SectionCard title="Cr. (Payments)">
                            <div className="overflow-x-auto">
                                <Table
                                    columns={columns}
                                    dataSource={crTableRows}
                                    pagination={false}
                                    rowKey="key"
                                    className="min-w-[480px]"
                                />
                            </div>
                        </SectionCard>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default CashBankLanding;
