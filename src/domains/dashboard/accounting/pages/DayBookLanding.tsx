import { useMemo, useState } from 'react';

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Flex,
    Row,
    Select,
    Statistic,
    Table,
    Tag,
    Typography,
    theme,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import { useDayBookEntries } from '../hooks/useDayBookEntries';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import {
    DAY_BOOK_ENTRY_SOURCES,
    DAY_BOOK_ENTRY_STATUSES,
    DAY_BOOK_ENTRY_TYPES,
    DayBookEntry,
    DayBookEntryStatus,
} from '../types/dayBook';

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
    const { token } = theme.useToken();
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
            render: (value: number) => `₹${formatNumberWithLocalString(value, 2, 2)}`,
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
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col>
                        <Title level={4} className="!mb-0">
                            Day Book
                        </Title>
                        <Text type="secondary">
                            Every transaction on Peko, in one place — automated postings and
                            manual entries alike.
                        </Text>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusOutlined />}>
                            Add New Entry
                        </Button>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Pending Review"
                                value={stats.pendingReview}
                                prefix={<ClockCircleOutlined style={{ color: token.colorInfo }} />}
                                valueStyle={{ color: token.colorInfo }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Pending Approval"
                                value={stats.pendingApproval}
                                prefix={
                                    <ExclamationCircleOutlined style={{ color: token.colorWarning }} />
                                }
                                valueStyle={{ color: token.colorWarning }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={8}>
                        <Card>
                            <Statistic
                                title="Posted Today"
                                value={stats.postedToday}
                                prefix={<CheckCircleOutlined style={{ color: token.colorSuccess }} />}
                                valueStyle={{ color: token.colorSuccess }}
                            />
                        </Card>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Card>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <Flex vertical gap={4}>
                                <Text type="secondary" className="text-xs">
                                    Date Range
                                </Text>
                                <RangePicker
                                    className="w-full"
                                    value={dateRange}
                                    onChange={setDateRange}
                                />
                            </Flex>
                        </Col>
                        <Col xs={24} sm={8} md={5}>
                            <Flex vertical gap={4}>
                                <Text type="secondary" className="text-xs">
                                    Voucher Type
                                </Text>
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
                                <Text type="secondary" className="text-xs">
                                    Status
                                </Text>
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
                                <Text type="secondary" className="text-xs">
                                    Source
                                </Text>
                                <Select
                                    className="w-full"
                                    value={sourceFilter}
                                    onChange={setSourceFilter}
                                    options={toFilterOptions(DAY_BOOK_ENTRY_SOURCES)}
                                />
                            </Flex>
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col span={24}>
                <Card>
                    <Table columns={columns} dataSource={entries} rowKey="id" pagination={false} />
                </Card>
            </Col>
        </Row>
    );
};

export default DayBookLanding;
