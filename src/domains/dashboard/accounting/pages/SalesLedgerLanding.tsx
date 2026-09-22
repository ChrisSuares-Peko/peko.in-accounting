import { RiseOutlined } from '@ant-design/icons';

import { SALES_NORMAL_SIDE } from '../data/salesData';
import { useSalesEntries } from '../hooks/useSalesEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const SalesLedgerLanding = () => {
    const entries = useSalesEntries();

    return (
        <LedgerDetailPage
            headName="Sales"
            headIcon={<RiseOutlined />}
            subtitle="Revenue from goods and services sold."
            entries={entries}
            normalSide={SALES_NORMAL_SIDE}
            footnoteExtra="Auto-populated from Invoicing in practice — manual entry is the exception path."
        />
    );
};

export default SalesLedgerLanding;
