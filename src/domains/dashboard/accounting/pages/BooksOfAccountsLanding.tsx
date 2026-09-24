import { useMemo, useState } from 'react';

import { CaretDownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Input, List, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { useBooksAccounts } from '../hooks/useBooksAccounts';
import { useLedgerData } from '../hooks/useLedgerData';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import SectionCard from '../sections/profitLoss/SectionCard';
import { BooksAccount, BooksCategory, categoryFor } from '../types/booksAccount';
import { formatRupee } from '../utils/reportFormat';

const { Title, Text } = Typography;

// Literal Dr=success(green)/Cr=danger(red) — not a "good vs bad" indicator. A
// Liabilities or Equity account sitting in Cr is its normal, expected state.
const sideColorClass = (side: 'Dr' | 'Cr') => (side === 'Dr' ? 'text-success' : 'text-danger');

// Absolute amount + the side it actually sits on, e.g. "₹52,500 Dr" — used for
// individual account rows, where `side` is already known directly.
const formatSide = (balance: number, side: 'Dr' | 'Cr') => (
    <span className={`tabular-nums ${sideColorClass(side)}`}>
        {formatRupee(balance)} {side}
    </span>
);

// Same "amount + side" formatting, but for a SIGNED total (positive = normal
// side, negative = net balance has flipped to the other side) — used for the
// card header totals in Step 3.
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

    // Defaults to all-expanded, matching the old Collapse's defaultActiveKey
    // covering every category.
    const [expanded, setExpanded] = useState<Record<BooksCategory, boolean>>({
        assets: true,
        liabilities: true,
        equity: true,
        otherIncome: true,
        otherExpense: true,
    });
    const toggleExpanded = (category: BooksCategory) =>
        setExpanded(prev => ({ ...prev, [category]: !prev[category] }));

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

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="books-of-accounts" />
            </Col>
            <Col span={24}>
                <Row>
                    <Col xs={24} xl={{ span: 14, offset: 5 }}>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <Flex
                                    gap={16}
                                    className="w-full flex-col md:flex-row md:items-center md:justify-between"
                                >
                                    <Flex vertical gap={2}>
                                        <Title
                                            level={4}
                                            className="!mb-0 !text-lg !font-semibold !text-ink md:!text-xl"
                                        >
                                            Books of Accounts
                                        </Title>
                                        <Text className="text-sm text-bodyText">
                                            Every account, grouped by where its balance currently
                                            sits — a party&apos;s own category follows its balance,
                                            not what kind of party it is.
                                        </Text>
                                    </Flex>
                                    <Flex gap={8} wrap="wrap" className="flex-col sm:flex-row">
                                        <Button className="w-full sm:w-auto">
                                            Create Account Manually
                                        </Button>
                                        <Button type="primary" className="w-full sm:w-auto">
                                            Add Manual Transaction
                                        </Button>
                                    </Flex>
                                </Flex>
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
                                <Flex vertical gap={16} className="w-full">
                                    {CATEGORY_CONFIG.map(config => {
                                        const isExpanded = expanded[config.key];
                                        const accentClassName =
                                            config.normalSide === 'Dr'
                                                ? 'border-l-success'
                                                : 'border-l-danger';
                                        return (
                                            <SectionCard
                                                key={config.key}
                                                title={config.label}
                                                className={`border-l-4 ${accentClassName}`}
                                                action={
                                                    <Flex align="center" gap={8}>
                                                        {formatSignedTotal(
                                                            categoryTotals[config.key],
                                                            config.normalSide
                                                        )}
                                                        <Button
                                                            type="text"
                                                            size="small"
                                                            aria-label={
                                                                isExpanded ? 'Collapse' : 'Expand'
                                                            }
                                                            icon={
                                                                <CaretDownOutlined
                                                                    className={`transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}
                                                                />
                                                            }
                                                            onClick={() => toggleExpanded(config.key)}
                                                        />
                                                    </Flex>
                                                }
                                            >
                                                {isExpanded && (
                                                    <List
                                                        dataSource={accountsByCategory[config.key]}
                                                        locale={{ emptyText: 'No accounts' }}
                                                        renderItem={account => (
                                                            <List.Item>
                                                                <Flex
                                                                    justify="space-between"
                                                                    className="w-full"
                                                                >
                                                                    {account.hasDetail &&
                                                                    account.detailRoute ? (
                                                                        <Link
                                                                            to={`${paths.dashboard.accounting}/${account.detailRoute}`}
                                                                        >
                                                                            {account.name}
                                                                        </Link>
                                                                    ) : (
                                                                        <Text className="text-muted">
                                                                            {account.name}
                                                                        </Text>
                                                                    )}
                                                                    {formatSide(
                                                                        account.balance,
                                                                        account.side
                                                                    )}
                                                                </Flex>
                                                            </List.Item>
                                                        )}
                                                    />
                                                )}
                                            </SectionCard>
                                        );
                                    })}
                                </Flex>
                            </Col>
                            <Col span={24}>
                                <Text className="text-xs text-muted">
                                    Head totals for Assets and Liabilities are the true
                                    balance-sheet figures; the accounts listed are a representative
                                    sample, not an exhaustive query. Capital/Equity, Other Income,
                                    and Other Expense are shown in full for this dataset.
                                </Text>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default BooksOfAccountsLanding;
