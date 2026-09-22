import {
    ApartmentOutlined,
    AuditOutlined,
    BarChartOutlined,
    BookOutlined,
    CalendarOutlined,
    DashboardOutlined,
    FundOutlined,
    LineChartOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import { Tabs, TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

export type AccountingSectionTabKey =
    | 'dashboard'
    | 'day-book'
    | 'ledgers'
    | 'books-of-accounts'
    | 'trial-balance'
    | 'pnl'
    | 'balance-sheet'
    | 'chart-of-accounts';

interface AccountingSectionTabsProps {
    activeKey: AccountingSectionTabKey;
}

// Shared nav chrome for every page under /accounting — renders once per page, below
// the existing app shell/sidebar (that part is untouched). This is plain antd Tabs
// acting as a router: clicking a tab navigates via useNavigate() like the rest of
// the app does, it doesn't let Tabs swap content itself, so each enabled item's
// `key` below must line up with the paths.accounting.* route it targets.
//
// Active-tab accent color: intentionally not styled here. antd's Tabs already
// derives its ink bar / selected-item color from the ConfigProvider theme token
// (`inkBarColor`/`itemSelectedColor` both default to `token.colorPrimary` — see
// antd's own tabs style source), and this app's ConfigProvider (antd.config.tsx)
// already sets colorPrimary. A plain <Tabs> under it picks that up automatically,
// so hardcoding a color here would only risk drifting from the real theme.
const ACCOUNTING_TABS: TabsProps['items'] = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        icon: <DashboardOutlined />,
    },
    {
        key: 'day-book',
        label: 'Day Book',
        icon: <CalendarOutlined />,
    },
    {
        key: 'ledgers',
        label: 'Ledgers',
        icon: <BookOutlined />,
    },
    {
        key: 'books-of-accounts',
        label: 'Books of Accounts',
        icon: <UnorderedListOutlined />,
    },
    {
        key: 'trial-balance',
        label: 'Trial Balance',
        icon: <FundOutlined />,
    },
    {
        key: 'pnl',
        label: 'P&L',
        icon: <LineChartOutlined />,
    },
    {
        key: 'balance-sheet',
        label: 'Balance Sheet',
        icon: <AuditOutlined />,
    },
    {
        key: 'chart-of-accounts',
        label: 'Chart of Accounts',
        icon: <ApartmentOutlined />,
    },
    {
        key: 'reports-analysis',
        label: 'Reports/Analysis',
        icon: <BarChartOutlined />,
        disabled: true,
    },
];

// Maps each navigable tab key to the full route it targets, mirroring the
// `${paths.dashboard.accounting}/${paths.accounting.x}` pattern already used
// elsewhere for accounting sub-routes (e.g. featureCards in utils/data.ts).
const TAB_ROUTES: Record<AccountingSectionTabKey, string> = {
    dashboard: paths.dashboard.accounting,
    'day-book': `${paths.dashboard.accounting}/${paths.accounting.dayBook}`,
    ledgers: `${paths.dashboard.accounting}/${paths.accounting.ledgers}`,
    'books-of-accounts': `${paths.dashboard.accounting}/${paths.accounting.books}`,
    'trial-balance': `${paths.dashboard.accounting}/${paths.accounting.trialBalance}`,
    pnl: `${paths.dashboard.accounting}/${paths.accounting.pnl}`,
    'balance-sheet': `${paths.dashboard.accounting}/${paths.accounting.balanceSheetReport}`,
    'chart-of-accounts': `${paths.dashboard.accounting}/${paths.accounting.chartOfAccounts}`,
};

const AccountingSectionTabs = ({ activeKey }: AccountingSectionTabsProps) => {
    const navigate = useNavigate();

    const handleChange = (key: string) => {
        const route = TAB_ROUTES[key as AccountingSectionTabKey];
        if (route) {
            navigate(route);
        }
    };

    return <Tabs activeKey={activeKey} onChange={handleChange} items={ACCOUNTING_TABS} />;
};

export default AccountingSectionTabs;
