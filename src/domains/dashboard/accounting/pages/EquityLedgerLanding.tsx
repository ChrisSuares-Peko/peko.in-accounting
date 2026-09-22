import { CrownOutlined } from '@ant-design/icons';

import { EQUITY_NORMAL_SIDE } from '../data/equityData';
import { useEquityEntries } from '../hooks/useEquityEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const EquityLedgerLanding = () => {
    const entries = useEquityEntries();

    return (
        <LedgerDetailPage
            headName="Capital & Equity"
            headIcon={<CrownOutlined />}
            subtitle="Owner's capital, reserves, and retained earnings."
            entries={entries}
            normalSide={EQUITY_NORMAL_SIDE}
        />
    );
};

export default EquityLedgerLanding;
