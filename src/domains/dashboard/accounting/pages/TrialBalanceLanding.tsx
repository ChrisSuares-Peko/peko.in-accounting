import { useMemo } from 'react';

import { Col, Row, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { useTrialBalanceRows } from '../hooks/useTrialBalanceRows';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import { TrialBalanceRow } from '../types/trialBalance';

const { Title, Text } = Typography;

// Same static "today" the rest of the accounting section's dummy data is
// anchored to (see LedgerDateRangeFilter's MOCK_TODAY).
const MOCK_TODAY = '2026-09-19';

const formatAmount = (value: number) => formatNumberWithLocalString(value, 2, 2);

const TrialBalanceLanding = () => {
    const rows = useTrialBalanceRows();

    const { debitTotal, creditTotal } = useMemo(
        () => ({
            debitTotal: rows.reduce((sum, row) => sum + (row.debit ?? 0), 0),
            creditTotal: rows.reduce((sum, row) => sum + (row.credit ?? 0), 0),
        }),
        [rows]
    );

    const columns: ColumnsType<TrialBalanceRow> = [
        {
            title: 'Account',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, row) =>
                row.hasDetail && row.detailRoute ? (
                    <Link to={`${paths.dashboard.accounting}/${row.detailRoute}`}>{name}</Link>
                ) : (
                    <Text className="text-gray-400">{name}</Text>
                ),
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            align: 'right',
            render: (value: number | null) => (
                <span className="tabular-nums">{value === null ? '—' : formatAmount(value)}</span>
            ),
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            align: 'right',
            render: (value: number | null) => (
                <span className="tabular-nums">{value === null ? '—' : formatAmount(value)}</span>
            ),
        },
    ];

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="trial-balance" />
            </Col>
            <Col span={24}>
                <Title level={4} className="!mb-0">
                    Trial Balance
                </Title>
                <Text type="secondary">as of {dayjs(MOCK_TODAY).format('D MMMM YYYY')}</Text>
            </Col>
            <Col span={24}>
                <Table
                    columns={columns}
                    dataSource={rows}
                    rowKey="id"
                    pagination={false}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0}>
                                <strong>Total</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">
                                <strong className="tabular-nums">{formatAmount(debitTotal)}</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align="right">
                                <strong className="tabular-nums">{formatAmount(creditTotal)}</strong>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Col>
        </Row>
    );
};

export default TrialBalanceLanding;
