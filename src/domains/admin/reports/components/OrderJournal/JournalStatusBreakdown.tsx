import { useState } from 'react';

import { EyeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Flex, Tooltip, Typography } from 'antd';

import { JOURNAL_STATUS_TYPES, renderJournalStatus } from './journalStatus';
import JournalViewModal from './JournalViewModal';
import { JournalKey } from '../../types/orderJournal';

type SelectedType = { label: string; key: JournalKey };

type Props = {
    status?: Record<string, boolean | undefined> | null;
    journalData?: Record<string, any> | null;
    corporateTxnId: string | number;
    resolveAccounts: (accountIds: string[]) => Promise<Record<string, string>>;
    onRetried?: () => void;
};

const JournalStatusBreakdown = ({
    status,
    journalData,
    corporateTxnId,
    resolveAccounts,
    onRetried,
}: Props) => {
    const [selected, setSelected] = useState<SelectedType | null>(null);

    return (
        <Flex vertical gap={16}>
            <Typography.Title level={5} style={{ margin: 0 }}>
                Journal Status
            </Typography.Title>
            <Descriptions bordered column={1} size="small">
                {JOURNAL_STATUS_TYPES.map(({ label, key, pendingOnUndefined }) => {
                    const hasJournal = (journalData?.[key]?.lineItems ?? []).length > 0;
                    const isFailed = status?.[key] === false;
                    return (
                        <Descriptions.Item key={key} label={label}>
                            <Flex align="center" justify="space-between" gap={8}>
                                {renderJournalStatus(status?.[key], { pendingOnUndefined })}
                                <Tooltip title={hasJournal || isFailed ? 'View journal' : 'No journal recorded'}>
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<EyeOutlined />}
                                        disabled={!hasJournal && !isFailed}
                                        onClick={() => setSelected({ label, key })}
                                    />
                                </Tooltip>
                            </Flex>
                        </Descriptions.Item>
                    );
                })}
            </Descriptions>

            <JournalViewModal
                open={!!selected}
                onClose={() => setSelected(null)}
                label={selected?.label ?? ''}
                journalKey={selected?.key ?? 'transaction'}
                journal={selected ? journalData?.[selected.key] : null}
                failed={selected ? status?.[selected.key] === false : false}
                corporateTxnId={corporateTxnId}
                resolveAccounts={resolveAccounts}
                onRetried={onRetried}
            />
        </Flex>
    );
};

export default JournalStatusBreakdown;
