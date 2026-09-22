import { PlusCircleOutlined } from '@ant-design/icons';

import { useInterestReceivedEntries } from '../hooks/useInterestReceivedEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const InterestReceivedLedgerLanding = () => {
    const entries = useInterestReceivedEntries();

    return (
        <LedgerDetailPage
            headName="Interest Received"
            headIcon={<PlusCircleOutlined />}
            subtitle="Interest earned on fixed deposits."
            entries={entries}
            normalSide="Cr"
        />
    );
};

export default InterestReceivedLedgerLanding;
