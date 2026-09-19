import { Flex, Tag, Typography } from 'antd';

export type JournalRecordStatus = {
    transaction?: boolean;
    refund?: boolean;
    adminRefund?: boolean;
    cashback?: boolean;
    cashbackReversal?: boolean;
};

export const JOURNAL_STATUS_TYPES: {
    label: string;
    key: keyof JournalRecordStatus;
    pendingOnUndefined?: boolean;
}[] = [
    { label: 'Transaction', key: 'transaction', pendingOnUndefined: true },
    { label: 'Refund', key: 'refund' },
    { label: 'Admin Refund', key: 'adminRefund' },
    { label: 'Cashback', key: 'cashback' },
    { label: 'Cashback Reversal', key: 'cashbackReversal' },
];

export const renderJournalStatus = (value?: boolean, opts?: { pendingOnUndefined?: boolean }) => {
    if (value === true) return <Tag color="green">Recorded</Tag>;
    if (value === false) return <Tag color="red">Failed</Tag>;
    return opts?.pendingOnUndefined ? (
        <Tag color="default">Pending</Tag>
    ) : (
        <Typography.Text type="secondary">—</Typography.Text>
    );
};

export const renderJournalStatusSummary = (status?: JournalRecordStatus | null) => {
    const present = JOURNAL_STATUS_TYPES.map(({ key }) => status?.[key]).filter(
        value => typeof value === 'boolean'
    );
    if (!present.length) return <Tag color="default">Pending</Tag>;
    const success = present.filter(Boolean).length;
    const failure = present.length - success;
    return (
        <Flex vertical>
            {success > 0 && <Tag color="green">Success: {success}</Tag>}
            {failure > 0 && <Tag color="red">Failed: {failure}</Tag>}
        </Flex>
    );
};
