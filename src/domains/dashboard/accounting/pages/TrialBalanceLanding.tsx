import { useMemo } from 'react';

import { Col, Row, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { useTrialBalanceRows } from '../hooks/useTrialBalanceRows';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import SectionCard from '../sections/profitLoss/SectionCard';
import { TrialBalanceRow } from '../types/trialBalance';
import { formatRupee } from '../utils/reportFormat';

const { Title, Text } = Typography;

// Same static "today" the rest of the accounting section's dummy data is
// anchored to (see LedgerDateRangeFilter's MOCK_TODAY).
const MOCK_TODAY = '2026-09-19';

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
                    <Text className="text-muted">{name}</Text>
                ),
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            align: 'right',
            render: (value: number | null) => (
                <span className="tabular-nums">{value === null ? '—' : formatRupee(value)}</span>
            ),
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            align: 'right',
            render: (value: number | null) => (
                <span className="tabular-nums">{value === null ? '—' : formatRupee(value)}</span>
            ),
        },
    ];

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="trial-balance" />
            </Col>
            <Col span={24}>
                <Title level={4} className="!mb-0 !text-lg !font-semibold !text-ink md:!text-xl">
                    Trial Balance
                </Title>
                <Text className="text-sm text-bodyText">
                    as of {dayjs(MOCK_TODAY).format('D MMMM YYYY')}
                </Text>
            </Col>
            <Col span={24}>
                <SectionCard title="Trial Balance">
                    <div className="overflow-x-auto">
                        <Table
                            columns={columns}
                            dataSource={rows}
                            rowKey="id"
                            pagination={false}
                            className="min-w-[480px]"
                            summary={() => (
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0}>
                                        <strong>Total</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="right">
                                        <strong className="tabular-nums">{formatRupee(debitTotal)}</strong>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align="right">
                                        <strong className="tabular-nums">{formatRupee(creditTotal)}</strong>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </div>
                </SectionCard>
            </Col>
        </Row>
    );
};

export default TrialBalanceLanding;
