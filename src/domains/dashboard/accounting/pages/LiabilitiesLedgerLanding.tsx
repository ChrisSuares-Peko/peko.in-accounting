import { CreditCardOutlined } from '@ant-design/icons';

import { LIABILITIES_NORMAL_SIDE } from '../data/liabilitiesData';
import { useLiabilitiesEntries } from '../hooks/useLiabilitiesEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const LiabilitiesLedgerLanding = () => {
    const entries = useLiabilitiesEntries();

    return (
        <LedgerDetailPage
            headName="Liabilities"
            headIcon={<CreditCardOutlined />}
            subtitle="Amounts owed to vendors, tax authorities, and other creditors."
            entries={entries}
            normalSide={LIABILITIES_NORMAL_SIDE}
        />
    );
};

export default LiabilitiesLedgerLanding;
