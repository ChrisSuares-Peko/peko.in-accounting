import { MinusCircleOutlined } from '@ant-design/icons';

import { OTHER_EXPENSE_NORMAL_SIDE } from '../data/otherExpenseData';
import { useOtherExpenseEntries } from '../hooks/useOtherExpenseEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const OtherExpenseLedgerLanding = () => {
    const entries = useOtherExpenseEntries();

    return (
        <LedgerDetailPage
            headName="Other Expense"
            headIcon={<MinusCircleOutlined />}
            subtitle="Operating expenses outside of cost of goods — rent, salaries, utilities, and the like."
            entries={entries}
            normalSide={OTHER_EXPENSE_NORMAL_SIDE}
        />
    );
};

export default OtherExpenseLedgerLanding;
