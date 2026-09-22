import { MinusCircleOutlined } from '@ant-design/icons';

import { useRentExpenseEntries } from '../hooks/useRentExpenseEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const RentExpenseLedgerLanding = () => {
    const entries = useRentExpenseEntries();

    return (
        <LedgerDetailPage
            headName="Rent Expense"
            headIcon={<MinusCircleOutlined />}
            subtitle="Monthly office rent."
            entries={entries}
            normalSide="Dr"
        />
    );
};

export default RentExpenseLedgerLanding;
