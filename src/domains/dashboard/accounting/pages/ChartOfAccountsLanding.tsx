import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Flex, Input, Row, Tag, Typography } from 'antd';

import { useChartOfAccounts } from '../hooks/useChartOfAccounts';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import { ChartOfAccountsEntry, ChartOfAccountsHead } from '../types/chartOfAccounts';

const { Title, Text } = Typography;

const HEAD_ORDER: { key: ChartOfAccountsHead; label: string }[] = [
    { key: 'cashBank', label: 'Cash & Bank' },
    { key: 'stock', label: 'Stock' },
    { key: 'assets', label: 'Assets' },
    { key: 'liabilities', label: 'Liabilities' },
    { key: 'equity', label: 'Capital / Equity' },
    { key: 'sales', label: 'Sales' },
    { key: 'purchases', label: 'Purchases' },
    { key: 'otherIncome', label: 'Other Income' },
    { key: 'otherExpense', label: 'Other Expense' },
];

// Groups entries by their `group` field while preserving first-seen order
// (the order they appear in CHART_OF_ACCOUNTS), not alphabetical order.
const groupEntries = (entries: ChartOfAccountsEntry[]): { group: string; entries: ChartOfAccountsEntry[] }[] => {
    const groups: { group: string; entries: ChartOfAccountsEntry[] }[] = [];
    entries.forEach(entry => {
        const existing = groups.find(g => g.group === entry.group);
        if (existing) {
            existing.entries.push(entry);
        } else {
            groups.push({ group: entry.group, entries: [entry] });
        }
    });
    return groups;
};

const AccountRow = ({ entry }: { entry: ChartOfAccountsEntry }) => (
    <div className="flex items-center justify-between py-1.5">
        <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted w-12 inline-block">{entry.code}</span>
            <span>{entry.name}</span>
        </div>
        <div className="flex items-center gap-2">
            <Tag color={entry.normalBalance === 'Dr' ? 'blue' : 'red'}>{entry.normalBalance}</Tag>
            {entry.classification && <Tag color="default">{entry.classification}</Tag>}
        </div>
    </div>
);

const ChartOfAccountsLanding = () => {
    const entries = useChartOfAccounts();

    const items = HEAD_ORDER.map(({ key, label }) => {
        const headEntries = entries.filter(entry => entry.head === key);
        const groups = groupEntries(headEntries);

        return {
            key,
            label: `${label} (${headEntries.length})`,
            children: groups.map(({ group, entries: groupAccounts }) => (
                <div key={group}>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted mt-3 mb-1 first:mt-0">
                        {group}
                    </div>
                    {groupAccounts.map(entry => (
                        <AccountRow key={entry.id} entry={entry} />
                    ))}
                </div>
            )),
        };
    });

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="chart-of-accounts" />
            </Col>
            <Col span={24}>
                <Flex gap={16} className="w-full flex-col md:flex-row md:items-center md:justify-between">
                    <Flex vertical gap={2}>
                        <Title level={4} className="!mb-0 !text-lg !font-semibold !text-ink md:!text-xl">
                            Chart of Accounts
                        </Title>
                        <Text className="text-sm text-bodyText">
                            The full structure behind your books — every head, group, and account,
                            with its normal balance side. Books of Accounts and Ledgers are live
                            views built on top of this.
                        </Text>
                    </Flex>
                    <Button type="primary" className="w-full sm:w-auto">
                        Create Account Manually
                    </Button>
                </Flex>
            </Col>
            <Col span={24}>
                <Input placeholder="Search by name or code" prefix={<SearchOutlined />} allowClear />
            </Col>
            <Col span={24}>
                <Collapse items={items} />
            </Col>
            <Col span={24}>
                <Text className="text-xs text-muted">
                    This is the structural reference — normal balance side and Current/Non-Current
                    classification for every account, not live balances. For actual figures, see
                    Ledgers or Books of Accounts.
                </Text>
            </Col>
        </Row>
    );
};

export default ChartOfAccountsLanding;
