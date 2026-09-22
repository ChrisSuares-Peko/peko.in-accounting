import { GoldOutlined } from '@ant-design/icons';

import { ASSETS_NORMAL_SIDE } from '../data/assetsData';
import { useAssetsEntries } from '../hooks/useAssetsEntries';
import LedgerDetailPage from '../sections/LedgerDetailPage';

const AssetsLedgerLanding = () => {
    const entries = useAssetsEntries();

    return (
        <LedgerDetailPage
            headName="Assets"
            headIcon={<GoldOutlined />}
            subtitle="Receivables, fixed assets, and other resources the business owns."
            entries={entries}
            normalSide={ASSETS_NORMAL_SIDE}
        />
    );
};

export default AssetsLedgerLanding;
