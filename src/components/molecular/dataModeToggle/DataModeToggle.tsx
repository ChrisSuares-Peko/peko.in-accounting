import { Flex, Switch, Typography } from 'antd';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { selectDataMode, toggleDataMode } from '@src/slices/dataModeSlice';

const { Text } = Typography;

// Prototype-only pill switch, fixed to the bottom-right corner above all page content.
// Mounted once at the app-shell level (see App.tsx) so it persists across every route,
// letting any page swap between DUMMY_LEDGER_DATA and EMPTY_LEDGER_DATA via useLedgerData().
const DataModeToggle = () => {
    const dispatch = useAppDispatch();
    const mode = useAppSelector(selectDataMode);
    const isDummy = mode === 'dummy';

    return (
        <Flex
            align="center"
            gap={8}
            className="fixed bottom-5 right-5 z-[1000] rounded-full border border-solid border-gray-200 bg-white px-3 py-2 shadow-lg"
        >
            <Text className="text-xs font-medium text-gray-600 select-none">
                {isDummy ? 'Dummy Data' : 'Empty'}
            </Text>
            <Switch
                size="small"
                checked={isDummy}
                onChange={() => dispatch(toggleDataMode())}
                aria-label="Toggle ledger data mode"
            />
        </Flex>
    );
};

export default DataModeToggle;
