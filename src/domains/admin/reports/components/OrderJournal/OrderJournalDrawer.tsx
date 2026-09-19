import { useEffect, useState } from 'react';

import { Button, Descriptions, Drawer, Flex, InputNumber, Typography } from 'antd';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { getFinancialFields } from './journalFields';
import JournalStatusBreakdown from './JournalStatusBreakdown';
import { retryJournal } from '../../api/orderJournal';
import { JournalKey } from '../../types/orderJournal';

type Props = {
    open: boolean;
    onClose: () => void;
    record: any | null;
    resolveAccounts: (accountIds: string[]) => Promise<Record<string, string>>;
    onRetried?: () => void;
};

// Which failed journal type the Financial Breakdown's inline "Edit" targets — prefers
// "transaction" (the main journal) when more than one type is failed at once.
const resolvePrimaryFailedKey = (status: Record<string, boolean | undefined>): JournalKey | null => {
    const failedKeys = Object.keys(status).filter(
        key => status[key] === false
    ) as JournalKey[];
    if (!failedKeys.length) return null;
    return failedKeys.includes('transaction') ? 'transaction' : failedKeys[0];
};

const OrderJournalDrawer = ({ open, onClose, record, resolveAccounts, onRetried }: Props) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const status = record?.journalRecordStatus ?? {};
    const journalData: Record<string, any> = record?.journalData ?? {};
    const financialFields = getFinancialFields(journalData);
    const primaryFailedKey = resolvePrimaryFailedKey(status);

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [values, setValues] = useState<Record<string, number>>({});

    useEffect(() => {
        setIsEditing(false);
        setValues(Object.fromEntries(financialFields.map(({ key }) => [key, journalData[key] ?? 0])));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [record?.corporateTxnId]);

    const handleSave = async () => {
        if (!primaryFailedKey || !record?.corporateTxnId) return;
        setIsSubmitting(true);
        const result = await retryJournal({
            userId: id,
            userType: role,
            corporateTxnId: record.corporateTxnId,
            journalKey: primaryFailedKey,
            journalData: values,
        });
        setIsSubmitting(false);

        if (result && result.success) {
            dispatch(showToast({ description: 'Journal retried successfully', variant: 'success' }));
            setIsEditing(false);
            onRetried?.();
        } else {
            dispatch(
                showToast({
                    description: (result && (result.error || result.reason)) || 'Retry failed',
                    variant: 'error',
                })
            );
        }
    };

    return (
        <Drawer
            title={<Typography.Text strong>Journal Entry</Typography.Text>}
            open={open}
            onClose={onClose}
            width={600}
            destroyOnClose
        >
            <Flex vertical gap={16}>
                <JournalStatusBreakdown
                    status={status}
                    journalData={journalData}
                    corporateTxnId={record?.corporateTxnId}
                    resolveAccounts={resolveAccounts}
                    onRetried={onRetried}
                />

                <Flex justify="space-between" align="center">
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        Financial Breakdown
                    </Typography.Title>
                    {primaryFailedKey && !isEditing && (
                        <Button size="small" danger onClick={() => setIsEditing(true)}>
                            Edit
                        </Button>
                    )}
                </Flex>

                {!isEditing ? (
                    <Descriptions bordered column={1} size="small">
                        {financialFields.map(({ key, label, isPercent }) => (
                            <Descriptions.Item key={key} label={label}>
                                {isPercent
                                    ? `${formatNumberWithLocalString(journalData[key] ?? 0)}%`
                                    : `₹ ${formatNumberWithLocalString(journalData[key] ?? 0)}`}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                ) : (
                    <Flex vertical gap={16}>
                        <div className="grid grid-cols-2 gap-4">
                            {financialFields.map(({ key, label }) => (
                                <Flex vertical gap={4} key={key}>
                                    <Typography.Text>{label}</Typography.Text>
                                    <InputNumber
                                        className="w-full"
                                        value={values[key] ?? 0}
                                        onChange={value =>
                                            setValues(prev => ({ ...prev, [key]: value ?? 0 }))
                                        }
                                    />
                                </Flex>
                            ))}
                        </div>
                        <Flex justify="end" gap={10}>
                            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button type="primary" danger loading={isSubmitting} onClick={handleSave}>
                                Save
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Drawer>
    );
};

export default OrderJournalDrawer;
