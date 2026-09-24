import { useMemo, useState } from 'react';

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { Button, Col, DatePicker, Flex, Row, Select, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

import { useDayBookEntries } from '../hooks/useDayBookEntries';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import DashboardStatCard from '../sections/DashboardStatCard';
import SectionCard from '../sections/profitLoss/SectionCard';
import {
    DAY_BOOK_ENTRY_SOURCES,
    DAY_BOOK_ENTRY_STATUSES,
    DAY_BOOK_ENTRY_TYPES,
    DayBookEntry,
    DayBookEntryStatus,
} from '../types/dayBook';
import { formatRupee } from '../utils/reportFormat';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// antd's own preset Tag colors, not custom hex.
const STATUS_TAG_COLOR: Record<DayBookEntryStatus, string> = {
    Posted: 'success',
    'Pending Review': 'processing',
    'Pending Approval': 'warning',
    Rejected: 'error',
};

const ALL_VALUE = 'all';

// Builds a Select's options from a DayBookEntry enum array (the single source of
// truth in types/dayBook.ts) plus a leading "All" — so these can never drift from
// what DayBookEntry actually allows.
const toFilterOptions = (values: readonly string[]) => [
    { label: 'All', value: ALL_VALUE },
    ...values.map(value => ({ label: value, value })),
];

const DayBookLanding = () => {
    const entries = useDayBookEntries();

    // Real, controlled filter state — not wired up to actually filter the table yet.
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [typeFilter, setTypeFilter] = useState(ALL_VALUE);
    const [statusFilter, setStatusFilter] = useState(ALL_VALUE);
    const [sourceFilter, setSourceFilter] = useState(ALL_VALUE);

    // Computed live from the entries themselves so these can never drift from the
    // table below.
    const stats = useMemo(() => {
        const today = dayjs().format('YYYY-MM-DD');
        return {
            pendingReview: entries.filter(entry => entry.status === 'Pending Review').length,
            pendingApproval: entries.filter(entry => entry.status === 'Pending Approval').length,
            postedToday: entries.filter(entry => entry.status === 'Posted' && entry.date === today)
                .length,
        };
    }, [entries]);

    const columns: ColumnsType<DayBookEntry> = [
        { title: 'Date/Time', dataIndex: 'when', key: 'when' },
        { title: 'Voucher No.', dataIndex: 'voucher', key: 'voucher' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Source', dataIndex: 'source', key: 'source' },
        { title: 'Narration', dataIndex: 'narration', key: 'narration' },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (value: number) => formatRupee(value),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: DayBookEntryStatus) => (
                <Tag color={STATUS_TAG_COLOR[status]}>{status}</Tag>
            ),
        },
    ];

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="day-book" />
            </Col>
            <Col span={24}>
                <Flex gap={16} className="w-full flex-col md:flex-row md:items-center md:justify-between">
                    <Flex vertical gap={2}>
                        <Title level={4} className="!mb-0 !text-lg !font-semibold !text-ink md:!text-xl">
                            Day Book
                        </Title>
                        <Text className="text-sm text-bodyText">
                            Every transaction on Peko, in one place — automated postings and
                            manual entries alike.
                        </Text>
                    </Flex>
                    <Button type="primary" icon={<PlusOutlined />} className="w-full sm:w-auto">
                        Add New Entry
                    </Button>
                </Flex>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} xl={8}>
                        <DashboardStatCard
                            title="Pending Review"
                            value={stats.pendingReview}
                            icon={<ClockCircleOutlined />}
                            chipClassName="border border-borderStrong bg-surfaceGray text-muted"
                            accentClassName="border-l-muted"
                            caption="Awaiting confirmation before posting"
                        />
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                        <DashboardStatCard
                            title="Pending Approval"
                            value={stats.pendingApproval}
                            icon={<ExclamationCircleOutlined />}
                            chipClassName="border border-warning-border bg-warning-surface text-warning"
                            accentClassName="border-l-warning"
                            caption="Requires sign-off before posting"
                        />
                    </Col>
                    <Col xs={24} sm={12} xl={8}>
                        <DashboardStatCard
                            title="Posted Today"
                            value={stats.postedToday}
                            icon={<CheckCircleOutlined />}
                            chipClassName="border border-success-border bg-success-surface text-success"
                            accentClassName="border-l-success"
                            caption={`as of ${dayjs().format('h:mm A')}`}
                        />
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <SectionCard title="Filter" className="!py-2 md:!py-3">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Flex vertical gap={4}>
                                <Text className="text-xs text-muted">Date Range</Text>
                                <RangePicker
                                    className="w-full"
                                    value={dateRange}
                                    onChange={setDateRange}
                                />
                            </Flex>
                        </Col>
                        <Col xs={24} sm={8} md={5}>
                            <Flex vertical gap={4}>
                                <Text className="text-xs text-muted">Voucher Type</Text>
                                <Select
                                    className="w-full"
                                    value={typeFilter}
                                    onChange={setTypeFilter}
                                    options={toFilterOptions(DAY_BOOK_ENTRY_TYPES)}
                                />
                            </Flex>
                        </Col>
                        <Col xs={24} sm={8} md={5}>
                            <Flex vertical gap={4}>
                                <Text className="text-xs text-muted">Status</Text>
                                <Select
                                    className="w-full"
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    options={toFilterOptions(DAY_BOOK_ENTRY_STATUSES)}
                                />
                            </Flex>
                        </Col>
                        <Col xs={24} sm={8} md={5}>
                            <Flex vertical gap={4}>
                                <Text className="text-xs text-muted">Source</Text>
                                <Select
                                    className="w-full"
                                    value={sourceFilter}
                                    onChange={setSourceFilter}
                                    options={toFilterOptions(DAY_BOOK_ENTRY_SOURCES)}
                                />
                            </Flex>
                        </Col>
                    </Row>
                </SectionCard>
            </Col>
            <Col span={24}>
                <SectionCard title="Transactions">
                    <div className="overflow-x-auto">
                        <Table
                            columns={columns}
                            dataSource={entries}
                            rowKey="id"
                            pagination={false}
                            className="min-w-[900px]"
                        />
                    </div>
                </SectionCard>
            </Col>
        </Row>
    );
};

export default DayBookLanding;
