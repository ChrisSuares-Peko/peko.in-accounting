import { useEffect, useMemo, useState } from 'react';

import { Alert, Button, Descriptions, Flex, InputNumber, Modal, Table, Tag, Typography } from 'antd';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { retryJournalLineItems } from '../../api/orderJournal';
import { JournalKey, RetryLineItem } from '../../types/orderJournal';

type LineItem = {
    accountId: string;
    direction: 'debit' | 'credit';
    amount: number | string;
    description?: string;
};

type Journal = {
    lineItems?: LineItem[];
    journalDate?: string;
    referenceNumber?: string;
    notes?: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    label: string;
    journalKey: JournalKey;
    journal?: Journal | null;
    failed?: boolean;
    corporateTxnId: string | number;
    resolveAccounts: (accountIds: string[]) => Promise<Record<string, string>>;
    onRetried?: () => void;
};

type EditableRow = LineItem & { key: number };

const round2 = (n: number) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const JournalViewModal = ({
    open,
    onClose,
    label,
    journalKey,
    journal,
    failed,
    corporateTxnId,
    resolveAccounts,
    onRetried,
}: Props) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const [names, setNames] = useState<Record<string, string>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editableLines, setEditableLines] = useState<EditableRow[]>([]);

    const lines = useMemo(() => journal?.lineItems ?? [], [journal]);

    useEffect(() => {
        if (!open) return;
        setIsEditing(false);
        const ids = [...new Set(lines.map(l => String(l.accountId)))];
        if (ids.length) resolveAccounts(ids).then(setNames);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, journal]);

    const totals = useMemo(() => {
        const debit = lines.reduce(
            (s, l) => s + (l.direction === 'debit' ? Number(l.amount) || 0 : 0),
            0
        );
        const credit = lines.reduce(
            (s, l) => s + (l.direction === 'credit' ? Number(l.amount) || 0 : 0),
            0
        );
        return { debit: round2(debit), credit: round2(credit) };
    }, [lines]);

    const editTotals = useMemo(() => {
        const debit = editableLines.reduce(
            (s, l) => s + (l.direction === 'debit' ? Number(l.amount) || 0 : 0),
            0
        );
        const credit = editableLines.reduce(
            (s, l) => s + (l.direction === 'credit' ? Number(l.amount) || 0 : 0),
            0
        );
        return { debit: round2(debit), credit: round2(credit) };
    }, [editableLines]);
    const isBalanced = Math.abs(editTotals.debit - editTotals.credit) < 0.01;

    const startEditing = () => {
        setEditableLines(lines.map((item, index) => ({ ...item, amount: Number(item.amount), key: index })));
        setIsEditing(true);
    };

    const updateLineAmount = (key: number, amount: number) => {
        setEditableLines(prev => prev.map(item => (item.key === key ? { ...item, amount } : item)));
    };

    const handleSave = async () => {
        if (!isBalanced) {
            dispatch(
                showToast({ description: 'Debits and credits must balance before retrying', variant: 'error' })
            );
            return;
        }
        setIsSubmitting(true);
        const result = await retryJournalLineItems({
            userId: id,
            userType: role,
            corporateTxnId: String(corporateTxnId),
            journalKey,
            lineItems: editableLines.map(({ key, ...item }) => item) as RetryLineItem[],
        });
        setIsSubmitting(false);

        if (result && result.success) {
            dispatch(showToast({ description: 'Journal re-posted successfully', variant: 'success' }));
            setIsEditing(false);
            onRetried?.();
            onClose();
        } else {
            dispatch(
                showToast({
                    description: (result && (result.error || result.reason)) || 'Retry failed',
                    variant: 'error',
                })
            );
        }
    };

    const amountCell = (row: LineItem, direction: 'debit' | 'credit') => {
        if (row.direction !== direction)
            return <Typography.Text type="secondary">—</Typography.Text>;
        return (
            <Typography.Text>₹ {formatNumberWithLocalString(Number(row.amount))}</Typography.Text>
        );
    };

    const editableAmountCell = (row: EditableRow, direction: 'debit' | 'credit') => {
        if (row.direction !== direction)
            return <Typography.Text type="secondary">—</Typography.Text>;
        return (
            <InputNumber
                min={0}
                className="w-full"
                value={Number(row.amount)}
                onChange={value => updateLineAmount(row.key, value ?? 0)}
            />
        );
    };

    const columns = [
        {
            title: 'Account',
            dataIndex: 'accountId',
            render: (accountId: string) => <Typography.Text>{names[accountId] || accountId}</Typography.Text>,
        },
        {
            title: 'Debit',
            key: 'debit',
            width: 160,
            render: (_: any, r: LineItem) => amountCell(r, 'debit'),
        },
        {
            title: 'Credit',
            key: 'credit',
            width: 160,
            render: (_: any, r: LineItem) => amountCell(r, 'credit'),
        },
    ];

    const editColumns = [
        {
            title: 'Account',
            dataIndex: 'accountId',
            render: (accountId: string) => <Typography.Text>{names[accountId] || accountId}</Typography.Text>,
        },
        {
            title: 'Debit',
            key: 'debit',
            width: 160,
            render: (_: any, r: EditableRow) => editableAmountCell(r, 'debit'),
        },
        {
            title: 'Credit',
            key: 'credit',
            width: 160,
            render: (_: any, r: EditableRow) => editableAmountCell(r, 'credit'),
        },
    ];

    const editBody = (
        <Flex vertical gap={16}>
            <Descriptions column={1} size="small">
                <Descriptions.Item label="Reference">
                    {journal?.referenceNumber || corporateTxnId}
                </Descriptions.Item>
                <Descriptions.Item label="Date">{journal?.journalDate || '-'}</Descriptions.Item>
                <Descriptions.Item label="Notes">{journal?.notes || '-'}</Descriptions.Item>
            </Descriptions>

            <Table
                rowKey={(row: EditableRow) => String(row.key)}
                columns={editColumns}
                dataSource={editableLines}
                pagination={false}
                size="small"
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>
                            <Typography.Text strong>Total</Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                            <Typography.Text strong>
                                ₹ {formatNumberWithLocalString(editTotals.debit)}
                            </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                            <Typography.Text strong>
                                ₹ {formatNumberWithLocalString(editTotals.credit)}
                            </Typography.Text>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />

            {!isBalanced && (
                <Typography.Text type="danger">
                    Debit and credit totals must match before retrying.
                </Typography.Text>
            )}

            <Flex justify="end" gap={10}>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button
                    type="primary"
                    danger
                    loading={isSubmitting}
                    disabled={!isBalanced || editableLines.length === 0}
                    onClick={handleSave}
                >
                    Save & Retry
                </Button>
            </Flex>
        </Flex>
    );

    const emptyBody = (
        <Flex vertical gap={16}>
            <Alert
                type="info"
                showIcon
                message="This journal has not been recorded yet."
                description="Once the journal is posted to the accounting provider, its exact entry will appear here."
            />
            {failed && (
                <Flex justify="end">
                    <Button type="primary" danger onClick={startEditing}>
                        Edit amounts
                    </Button>
                </Flex>
            )}
        </Flex>
    );

    const readBody = (
        <Flex vertical gap={16}>
            <Descriptions column={1} size="small">
                <Descriptions.Item label="Reference">
                    {journal?.referenceNumber || corporateTxnId}
                </Descriptions.Item>
                <Descriptions.Item label="Date">{journal?.journalDate || '-'}</Descriptions.Item>
                <Descriptions.Item label="Notes">{journal?.notes || '-'}</Descriptions.Item>
            </Descriptions>

            <Table
                rowKey={(_: any, i?: number) => String(i)}
                columns={columns}
                dataSource={lines}
                pagination={false}
                size="small"
                summary={() => (
                    <Table.Summary.Row>
                        <Table.Summary.Cell index={0}>
                            <Typography.Text strong>Total</Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                            <Typography.Text strong>
                                ₹ {formatNumberWithLocalString(totals.debit)}
                            </Typography.Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                            <Typography.Text strong>
                                ₹ {formatNumberWithLocalString(totals.credit)}
                            </Typography.Text>
                        </Table.Summary.Cell>
                    </Table.Summary.Row>
                )}
            />
            {failed && (
                <Flex justify="end">
                    <Button type="primary" danger onClick={startEditing}>
                        Edit amounts
                    </Button>
                </Flex>
            )}
        </Flex>
    );

    let body = readBody;
    if (isEditing) {
        body = editBody;
    } else if (lines.length === 0) {
        body = emptyBody;
    }

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            destroyOnClose
            title={
                <Flex align="center" gap={8}>
                    <Typography.Text strong>{label} — Journal</Typography.Text>
                    {failed && <Tag color="red">Failed</Tag>}
                </Flex>
            }
        >
            {body}
        </Modal>
    );
};

export default JournalViewModal;
