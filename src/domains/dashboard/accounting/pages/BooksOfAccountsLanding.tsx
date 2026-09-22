import { useMemo, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Flex, Input, List, Row, Typography } from 'antd';
import type { CollapseProps } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { useBooksAccounts } from '../hooks/useBooksAccounts';
import { useLedgerData } from '../hooks/useLedgerData';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import { BooksAccount, BooksCategory, categoryFor } from '../types/booksAccount';

const { Title, Text } = Typography;

const formatAmount = (value: number) => formatNumberWithLocalString(value, 0, 0);

// Absolute amount + the side it actually sits on, e.g. "₹52,500 Dr" — used for
// individual account rows, where `side` is already known directly.
const formatSide = (balance: number, side: 'Dr' | 'Cr') => `₹${formatAmount(balance)} ${side}`;

// Same "amount + side" formatting, but for a SIGNED total (positive = normal
// side, negative = net balance has flipped to the other side) — used for the
// panel header totals in Step 2.
const formatSignedTotal = (signedTotal: number, normalSide: 'Dr' | 'Cr') => {
    const oppositeSide = normalSide === 'Dr' ? 'Cr' : 'Dr';
    const side = signedTotal >= 0 ? normalSide : oppositeSide;
    return formatSide(Math.abs(signedTotal), side);
};

const CATEGORY_CONFIG: { key: BooksCategory; label: string; normalSide: 'Dr' | 'Cr' }[] = [
    { key: 'assets', label: 'Assets', normalSide: 'Dr' },
    { key: 'liabilities', label: 'Liabilities', normalSide: 'Cr' },
    { key: 'equity', label: 'Capital / Equity', normalSide: 'Cr' },
    { key: 'otherIncome', label: 'Other Income', normalSide: 'Cr' },
    { key: 'otherExpense', label: 'Other Expense', normalSide: 'Dr' },
];

const BooksOfAccountsLanding = () => {
    const accounts = useBooksAccounts();
    const ledgerData = useLedgerData();
    const [search, setSearch] = useState('');

    const filteredAccounts = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return accounts;
        return accounts.filter(account => account.name.toLowerCase().includes(query));
    }, [accounts, search]);

    // Assets/Liabilities totals come from useLedgerData() — the true balance-sheet
    // figures — NOT from summing this page's (deliberately partial) account list.
    const ledgerHeadTotal = useMemo(() => {
        const sums: Partial<Record<'assets' | 'liabilities', number>> = {};
        ledgerData.forEach(item => {
            if (item.head === 'assets' || item.head === 'liabilities') {
                sums[item.head] = (sums[item.head] ?? 0) + item.closingBalance;
            }
        });
        return sums;
    }, [ledgerData]);

    // Capital/Equity, Other Income, and Other Expense ARE the complete set for
    // this dummy dataset, so their totals are summed directly from
    // categoryFor()-filtered accounts (signed per each category's normal side).
    const categorySum = (category: BooksCategory, normalSide: 'Dr' | 'Cr') =>
        accounts
            .filter(account => categoryFor(account) === category)
            .reduce(
                (sum, account) =>
                    sum + (account.side === normalSide ? account.balance : -account.balance),
                0
            );

    const categoryTotals: Record<BooksCategory, number> = {
        assets: ledgerHeadTotal.assets ?? 0,
        liabilities: ledgerHeadTotal.liabilities ?? 0,
        equity: categorySum('equity', 'Cr'),
        otherIncome: categorySum('otherIncome', 'Cr'),
        otherExpense: categorySum('otherExpense', 'Dr'),
    };

    const accountsByCategory = useMemo(() => {
        const grouped: Record<BooksCategory, BooksAccount[]> = {
            assets: [],
            liabilities: [],
            equity: [],
            otherIncome: [],
            otherExpense: [],
        };
        filteredAccounts.forEach(account => {
            grouped[categoryFor(account)].push(account);
        });
        return grouped;
    }, [filteredAccounts]);

    const collapseItems: CollapseProps['items'] = CATEGORY_CONFIG.map(config => ({
        key: config.key,
        label: (
            <Flex justify="space-between" className="w-full pr-2">
                <span>{config.label}</span>
                <span className="tabular-nums">
                    {formatSignedTotal(categoryTotals[config.key], config.normalSide)}
                </span>
            </Flex>
        ),
        children: (
            <List
                dataSource={accountsByCategory[config.key]}
                locale={{ emptyText: 'No accounts' }}
                renderItem={account => (
                    <List.Item>
                        <Flex justify="space-between" className="w-full">
                            {account.hasDetail && account.detailRoute ? (
                                <Link to={`${paths.dashboard.accounting}/${account.detailRoute}`}>
                                    {account.name}
                                </Link>
                            ) : (
                                <Text className="text-gray-400">{account.name}</Text>
                            )}
                            <span className="tabular-nums">
                                {formatSide(account.balance, account.side)}
                            </span>
                        </Flex>
                    </List.Item>
                )}
            />
        ),
    }));

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="books-of-accounts" />
            </Col>
            <Col span={24}>
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col>
                        <Title level={4} className="!mb-0">
                            Books of Accounts
                        </Title>
                        <Text type="secondary">
                            Every account, grouped by where its balance currently sits — a
                            party&apos;s own category follows its balance, not what kind of party
                            it is.
                        </Text>
                    </Col>
                    <Col>
                        <Flex gap={8} wrap="wrap">
                            <Button>Create Account Manually</Button>
                            <Button type="primary">Add Manual Transaction</Button>
                        </Flex>
                    </Col>
                </Row>
            </Col>
            <Col span={24}>
                <Input
                    placeholder="Search accounts"
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    allowClear
                    className="max-w-sm"
                />
            </Col>
            <Col span={24}>
                <Collapse items={collapseItems} defaultActiveKey={CATEGORY_CONFIG.map(c => c.key)} />
            </Col>
            <Col span={24}>
                <Text type="secondary" className="text-xs">
                    Head totals for Assets and Liabilities are the true balance-sheet figures; the
                    accounts listed are a representative sample, not an exhaustive query.
                    Capital/Equity, Other Income, and Other Expense are shown in full for this
                    dataset.
                </Text>
            </Col>
        </Row>
    );
};

export default BooksOfAccountsLanding;
