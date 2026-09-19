import { Flex, Typography } from 'antd';

import VariablesPanel from './VariablesPanel';
import { useEmailTemplateKeyVariables } from '../../../hooks/useEmailTemplateMetadata';

type SidePanelProps = {
    service: string;
    templateKey: string;
    sampleDataRaw: string;
    onSampleDataChange: (value: string) => void;
    onInsertIntoHtml: (text: string) => void;
};

const SidePanel = ({
    service,
    templateKey,
    sampleDataRaw,
    onSampleDataChange,
    onInsertIntoHtml,
}: SidePanelProps) => {
    const { variables, loading } = useEmailTemplateKeyVariables(
        service || undefined,
        templateKey || undefined
    );

    return (
        <Flex vertical gap={12} className="h-full min-h-0 overflow-y-auto">
            <Typography.Text className="font-medium">Variables</Typography.Text>
            <VariablesPanel
                variables={variables}
                loading={loading}
                sampleDataRaw={sampleDataRaw}
                onSampleDataChange={onSampleDataChange}
                onInsert={onInsertIntoHtml}
            />
        </Flex>
    );
};

export default SidePanel;
