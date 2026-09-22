import { CreditCardOutlined } from '@ant-design/icons';

import { useAnandTradersEntries } from '../hooks/useAnandTradersEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const AnandTradersLedgerLanding = () => {
    const entries = useAnandTradersEntries();

    return (
        <LedgerDetailPage
            headName="Accounts Payable – Anand Traders"
            headIcon={<CreditCardOutlined />}
            subtitle="Vendor account — purchases, payments, and returns."
            entries={entries}
            normalSide="Cr"
        />
    );
};

export default AnandTradersLedgerLanding;
