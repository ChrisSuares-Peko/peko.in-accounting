import { FileSearchOutlined, InboxOutlined } from '@ant-design/icons';

import { STOCK_NORMAL_SIDE } from '../data/stockData';
import { useStockEntries } from '../hooks/useStockEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const StockLedgerLanding = () => {
    const entries = useStockEntries();

    return (
        <LedgerDetailPage
            headName="Stock"
            headIcon={<InboxOutlined />}
            subtitle="Inventory of finished goods and raw materials on hand."
            entries={entries}
            normalSide={STOCK_NORMAL_SIDE}
            extraActions={[{ label: 'Physical Stock Count', icon: <FileSearchOutlined /> }]}
        />
    );
};

export default StockLedgerLanding;
