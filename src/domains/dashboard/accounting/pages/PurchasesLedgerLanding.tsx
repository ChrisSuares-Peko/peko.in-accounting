import { ShoppingOutlined } from '@ant-design/icons';

import { PURCHASES_NORMAL_SIDE } from '../data/purchasesData';
import { usePurchasesEntries } from '../hooks/usePurchasesEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const PurchasesLedgerLanding = () => {
    const entries = usePurchasesEntries();

    return (
        <LedgerDetailPage
            headName="Purchases"
            headIcon={<ShoppingOutlined />}
            subtitle="Cost of goods and services bought for resale or production."
            entries={entries}
            normalSide={PURCHASES_NORMAL_SIDE}
            footnoteExtra="Auto-populated from the Purchase module in practice — manual entry is the exception path."
        />
    );
};

export default PurchasesLedgerLanding;
