import {
    ApartmentOutlined,
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

export type AccountingSectionTabKey = 'dashboard' | 'day-book' | 'ledgers';

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
        disabled: true,
    },
    {
        key: 'trial-balance',
        label: 'Trial Balance',
        icon: <FundOutlined />,
        disabled: true,
    },
    {
        key: 'pnl-balance-sheet',
        label: 'P&L and Balance Sheet',
        icon: <LineChartOutlined />,
        disabled: true,
    },
    {
        key: 'chart-of-accounts',
        label: 'Chart of Accounts',
        icon: <ApartmentOutlined />,
        disabled: true,
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
// 'day-book' targets a route that doesn't exist yet (added in a later prompt) —
// harmless until then, since Tabs only navigates on a click and nothing points at
// this component with activeKey="day-book" yet either.
const TAB_ROUTES: Record<AccountingSectionTabKey, string> = {
    dashboard: paths.dashboard.accounting,
    'day-book': `${paths.dashboard.accounting}/${paths.accounting.dayBook}`,
    ledgers: `${paths.dashboard.accounting}/${paths.accounting.ledgers}`,
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
