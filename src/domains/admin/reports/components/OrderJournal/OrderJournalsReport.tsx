import { useState } from 'react';

import { Button, Flex, Pagination, Tag, Typography } from 'antd';
import { TableProps } from 'antd/lib';
import dayjs from 'dayjs';

import GenericTable from '@components/atomic/GenericTable';
import useDebounceSearch from '@src/hooks/useDebounceSearch';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import Header from './Header';
import { renderJournalStatusSummary } from './journalStatus';
import OrderJournalDrawer from './OrderJournalDrawer';
import useFilter from '../../hooks/useFilter';
import useOrderJournalData from '../../hooks/useOrderJournalData';

const OrderJournalsReport = () => {
    const today = dayjs();
    const todayFormatted = today.format('YYYY-MM-DD');
    const oneMonthAgoFormatted = today.subtract(1, 'month').format('YYYY-MM-DD');
    const initialValues = {
        searchText: '',
        status: '',
        sort: 'DESC',
        sortField: 'transactionDate',
        page: 1,
        itemsPerPage: 10,
        from: oneMonthAgoFormatted,
        to: todayFormatted,
    };

    const [filters, setFilters] = useState(initialValues);
    const [drawerRecord, setDrawerRecord] = useState<any | null>(null);

    const {
        handlePageChange,
        handleDateChange,
        handleFromChange,
        handleToChange,
        handleCategoryFilters,
    } = useFilter({
        setFilters,
        initalStartDate: initialValues.from,
        initalEndDate: initialValues.to,
    });

    const { searchText, setSearchText, updateSearchText } = useDebounceSearch(setFilters);
    const { isLoading, tableData, count, resolveAccounts, refresh } = useOrderJournalData(filters);

    const handleRetried = async () => {
        const freshRows = await refresh();
        if (drawerRecord) {
            const updated = freshRows.find(row => row.corporateTxnId === drawerRecord.corporateTxnId);
            setDrawerRecord(updated ? updated.order : null);
        }
    };

    const columns = [
        {
            title: 'Transaction Date',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            sorter: true,
            render: (date: string) => (
                <Flex vertical>
                    <Typography.Text>{formattedDateOnly(new Date(date))}</Typography.Text>
                    <Typography.Text>{formattedTime(new Date(date))}</Typography.Text>
                </Flex>
            ),
        },
        {
            title: 'Transaction ID',
            dataIndex: 'corporateTxnId',
            key: 'corporateTxnId',
            render: (_: any, data: any) => (
                <Typography.Text copyable>{data.corporateTxnId}</Typography.Text>
            ),
        },
        {
            title: 'Customer',
            dataIndex: 'credential',
            key: 'credential',
            render: (_: any, data: any) => (
                <Typography.Text>{data?.credential?.username || '-'}</Typography.Text>
            ),
        },
        {
            title: 'Service',
            dataIndex: 'serviceOperator',
            key: 'serviceOperator',
            render: (_: any, data: any) => (
                <Typography.Text>{data?.serviceOperator?.serviceProvider || '-'}</Typography.Text>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'order',
            key: 'amount',
            render: (_: any, data: any) => (
                <Typography.Text>
                    ₹ {formatNumberWithLocalString(data?.order?.amountInINR || 0)}
                </Typography.Text>
            ),
        },
        {
            title: 'Payment Mode',
            dataIndex: 'order',
            key: 'paymentMode',
            render: (_: any, data: any) => (
                <Typography.Text>{data?.order?.paymentMode || '-'}</Typography.Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'order',
            key: 'status',
            render: (_: any, data: any) => {
                const statusColors: Record<string, string> = {
                    SUCCESS: 'green',
                    FAILURE: 'red',
                    REFUNDED: 'default',
                    PENDING: 'gold',
                };
                const status = data?.order?.status;
                return <Tag color={statusColors[status] || 'default'}>{status || '-'}</Tag>;
            },
        },
        {
            title: 'Journal Status',
            dataIndex: 'order',
            key: 'journalStatus',
            render: (_: any, data: any) =>
                renderJournalStatusSummary(data?.order?.journalRecordStatus),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, data: any) => (
                <Button size="small" onClick={() => setDrawerRecord(data?.order)}>
                    View
                </Button>
            ),
        },
    ];

    const handleTableChange: TableProps<any>['onChange'] = (pagination, filter, sorter) => {
        let sort: string = 'DESC';
        let field;

        if (Array.isArray(sorter)) {
            if (sorter.length > 0) {
                ({ field } = sorter[0]);
                sort = sorter[0].order === 'ascend' ? 'ASC' : 'DESC';
            }
        } else {
            ({ field } = sorter);
            sort = sorter.order === 'ascend' ? 'ASC' : 'DESC';
        }

        if (field) {
            setFilters(prev => ({ ...prev, sortField: field.toString(), sort, page: 1 }));
        }
    };

    return (
        <Flex vertical gap={20}>
            <Header
                handleSearch={updateSearchText}
                setSearchText={setSearchText}
                searchText={searchText}
                handleDateChange={handleDateChange}
                handleFromChange={handleFromChange}
                handleToChange={handleToChange}
                handleCategoryFilters={handleCategoryFilters}
                from={filters.from}
                to={filters.to}
            />
            <GenericTable
                rowKey={(record: any) => record.id}
                columns={columns}
                dataSource={tableData}
                pagination={false}
                loading={isLoading}
                onChange={handleTableChange}
            />
            <Pagination
                current={filters.page}
                size="default"
                className="text-end pt-7 justify-end"
                onChange={handlePageChange}
                total={count}
                showSizeChanger={false}
            />
            <OrderJournalDrawer
                open={!!drawerRecord}
                onClose={() => setDrawerRecord(null)}
                record={drawerRecord}
                resolveAccounts={resolveAccounts}
                onRetried={handleRetried}
            />
        </Flex>
    );
};

export default OrderJournalsReport;
