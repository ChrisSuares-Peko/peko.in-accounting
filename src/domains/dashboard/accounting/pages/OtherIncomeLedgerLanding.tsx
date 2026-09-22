import { PlusCircleOutlined } from '@ant-design/icons';

import { OTHER_INCOME_NORMAL_SIDE } from '../data/otherIncomeData';
import { useOtherIncomeEntries } from '../hooks/useOtherIncomeEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const OtherIncomeLedgerLanding = () => {
    const entries = useOtherIncomeEntries();

    return (
        <LedgerDetailPage
            headName="Other Income"
            headIcon={<PlusCircleOutlined />}
            subtitle="Income outside of core sales — interest, discounts received, and the like."
            entries={entries}
            normalSide={OTHER_INCOME_NORMAL_SIDE}
        />
    );
};

export default OtherIncomeLedgerLanding;
