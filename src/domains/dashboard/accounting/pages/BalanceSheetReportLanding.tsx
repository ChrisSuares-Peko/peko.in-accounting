import { useMemo, useState } from 'react';

import { Col, Flex, Row, Segmented, Typography } from 'antd';
import dayjs from 'dayjs';

import { BalanceSheetGroup, useBalanceSheetData } from '../hooks/useBalanceSheetData';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';
import AssetCompositionCard from '../sections/balanceSheet/AssetCompositionCard';
import BalanceSheetSummaryCards from '../sections/balanceSheet/BalanceSheetSummaryCards';
import BsHeader from '../sections/balanceSheet/BsHeader';
import LiabilityCompositionCard from '../sections/balanceSheet/LiabilityCompositionCard';
import SectionCard from '../sections/profitLoss/SectionCard';
import { BalanceStat, BsColumn, BsRow, CompositionSlice } from '../utils/balanceSheetData';
import { FULL_YEAR, currentFyStart } from '../utils/reportFilters';
import { formatCompact, formatRupee, pctOf, reportColor } from '../utils/reportFormat';

const { Text } = Typography;

const MOCK_TODAY = '2026-09-19';

type DetailMode = 'condensed' | 'detailed';
type LayoutMode = 'horizontal' | 'vertical';

const BsStatementRow = ({ row }: { row: BsRow }) => {
    const amount = Number.isFinite(row.amount) ? row.amount : 0;
    const isNegative = amount < 0;
    const amountText = formatRupee(Math.abs(amount));
    const displayAmount = isNegative ? `(${amountText})` : amountText;

    if (row.kind === 'total') {
        return (
            <Flex
                justify="space-between"
                align="center"
                gap={8}
                className="w-full rounded-lg border border-success-border bg-success-surface px-3 py-2"
            >
                <Text className="min-w-0 break-words text-sm font-semibold text-ink">{row.label}</Text>
                <Text className="shrink-0 whitespace-nowrap pl-2 text-sm font-semibold text-success">
                    {displayAmount}
                </Text>
            </Flex>
        );
    }

    if (row.kind === 'subtotal') {
        const toneClass = row.tone === 'error' ? 'text-danger' : 'text-success';
        return (
            <Flex
                justify="space-between"
                align="center"
                gap={8}
                className="w-full rounded-lg bg-surfaceGray px-3 py-2"
            >
                <Text className="min-w-0 break-words text-sm font-medium text-ink">{row.label}</Text>
                <Text className={`shrink-0 whitespace-nowrap pl-2 text-sm font-medium ${toneClass}`}>
                    {displayAmount}
                </Text>
            </Flex>
        );
    }

    return (
        <Flex justify="space-between" align="center" gap={8} className="w-full border-b border-slate-100 px-3 py-2">
            <Text className="min-w-0 break-words text-sm text-slate-500">{row.label}</Text>
            <Text className={`shrink-0 whitespace-nowrap pl-2 text-sm ${isNegative ? 'text-danger' : ''}`}>
                {displayAmount}
            </Text>
        </Flex>
    );
};

const renderBsColumn = (column: BsColumn) => (
    <Flex vertical gap={12} className="w-full">
        <Text className="mb-1 text-sm font-semibold text-ink">{column.title}</Text>
        {column.sections.map(section => (
            <Flex vertical gap={6} key={section.heading} className="w-full">
                <Text className="mt-3 text-xs font-medium tracking-wide text-slate-400">
                    {section.heading}
                </Text>
                {section.rows.map((row, index) => (
                    <BsStatementRow key={`${section.heading}-${index}`} row={row} />
                ))}
            </Flex>
        ))}
        <BsStatementRow row={column.total} />
    </Flex>
);

const BalanceSheetReportLanding = () => {
    const [fy, setFy] = useState(currentFyStart());
    const [period, setPeriod] = useState(FULL_YEAR);
    const [detailMode, setDetailMode] = useState<DetailMode>('condensed');
    const [layoutMode, setLayoutMode] = useState<LayoutMode>('horizontal');

    const data = useBalanceSheetData();
    const detailed = detailMode === 'detailed';

    const totalLiabilitiesExclEquity = data.loans.total + data.currentLiabilities.total;
    const netWorkingCapital = data.currentAssets.total - data.currentLiabilities.total;

    const summaryStats: BalanceStat[] = useMemo(
        () => [
            {
                key: 'assets',
                label: 'Total Assets',
                value: formatCompact(data.assetsTotal),
                caption: `As of ${dayjs(MOCK_TODAY).format('D MMM YYYY')}`,
                bg: '#F8FAFC',
                border: '#CBD5E1',
            },
            {
                key: 'liabilities',
                label: 'Total Liabilities',
                value: formatCompact(totalLiabilitiesExclEquity),
                caption: `${pctOf(totalLiabilitiesExclEquity, data.assetsTotal)}% of assets`,
                bg: '#FEF2F2',
                border: '#FF4F4F',
                valueColor: '#FF4F4F',
            },
            {
                key: 'equity',
                label: 'Capital / Equity',
                value: formatCompact(data.capitalAccount.total),
                caption: `${pctOf(data.capitalAccount.total, data.assetsTotal)}% of assets`,
                bg: '#FFFBEB',
                border: '#FCD34D',
            },
            {
                key: 'working-capital',
                label: 'Net Working Capital',
                value: formatCompact(netWorkingCapital),
                caption: netWorkingCapital >= 0 ? 'Healthy buffer' : 'Working capital deficit',
                bg: netWorkingCapital >= 0 ? '#ECFDF5' : '#FEF2F2',
                border: netWorkingCapital >= 0 ? '#81CF92' : '#FF4F4F',
                valueColor: netWorkingCapital >= 0 ? '#43B75D' : '#FF4F4F',
            },
        ],
        [data.assetsTotal, data.capitalAccount.total, netWorkingCapital, totalLiabilitiesExclEquity]
    );

    // Horizontal (Tally-style: Liabilities left, Assets right) vs Vertical
    // (Schedule III: Equity & Liabilities stacked above Assets) relabel the
    // same three/two groups differently — the underlying totals never change.
    const buildColumn = (
        title: string,
        groups: { heading: string; group: BalanceSheetGroup; tone: 'success' | 'error' }[],
        total: BsRow
    ): BsColumn => ({
        title,
        sections: groups.map(({ heading, group, tone }) => ({
            heading,
            rows: [
                ...(detailed
                    ? group.items.map(item => ({ label: item.name, amount: item.amount, kind: 'item' as const }))
                    : []),
                { label: `Total ${group.label}`, amount: group.total, kind: 'subtotal' as const, tone },
            ],
        })),
        total,
    });

    const liabilitiesTotalRow: BsRow = {
        label: 'TOTAL LIABILITIES + EQUITY',
        amount: data.liabilitiesTotal,
        kind: 'total',
        tone: 'success',
    };
    const assetsTotalRow: BsRow = { label: 'TOTAL ASSETS', amount: data.assetsTotal, kind: 'total', tone: 'success' };

    const horizontalLiabilities = buildColumn(
        'Liabilities',
        [
            { heading: 'CAPITAL ACCOUNT', group: data.capitalAccount, tone: 'success' },
            { heading: 'LOANS (LIABILITY)', group: data.loans, tone: 'error' },
            { heading: 'CURRENT LIABILITIES', group: data.currentLiabilities, tone: 'error' },
        ],
        liabilitiesTotalRow
    );
    const horizontalAssets = buildColumn(
        'Assets',
        [
            { heading: 'FIXED ASSETS', group: data.fixedAssets, tone: 'success' },
            { heading: 'CURRENT ASSETS', group: data.currentAssets, tone: 'success' },
        ],
        assetsTotalRow
    );

    const verticalEquityAndLiabilities = buildColumn(
        'I. Equity and Liabilities',
        [
            { heading: "SHAREHOLDERS' FUNDS", group: data.capitalAccount, tone: 'success' },
            { heading: 'NON-CURRENT LIABILITIES', group: data.loans, tone: 'error' },
            { heading: 'CURRENT LIABILITIES', group: data.currentLiabilities, tone: 'error' },
        ],
        { ...liabilitiesTotalRow, label: 'TOTAL (I)' }
    );
    const verticalAssets = buildColumn(
        'II. Assets',
        [
            { heading: 'NON-CURRENT ASSETS', group: data.fixedAssets, tone: 'success' },
            { heading: 'CURRENT ASSETS', group: data.currentAssets, tone: 'success' },
        ],
        { ...assetsTotalRow, label: 'TOTAL (II)' }
    );

    const assetSlices: CompositionSlice[] = [
        {
            label: 'Fixed Assets',
            value: data.fixedAssets.total,
            display: formatCompact(data.fixedAssets.total),
            pct: `${pctOf(data.fixedAssets.total, data.assetsTotal)}%`,
            color: reportColor(0),
        },
        {
            label: 'Current Assets',
            value: data.currentAssets.total,
            display: formatCompact(data.currentAssets.total),
            pct: `${pctOf(data.currentAssets.total, data.assetsTotal)}%`,
            color: reportColor(1),
        },
    ];
    const liabilitySlices: CompositionSlice[] = [
        {
            label: 'Loans',
            value: data.loans.total,
            display: formatCompact(data.loans.total),
            pct: `${pctOf(data.loans.total, totalLiabilitiesExclEquity)}%`,
            color: reportColor(0),
        },
        {
            label: 'Current Liabilities',
            value: data.currentLiabilities.total,
            display: formatCompact(data.currentLiabilities.total),
            pct: `${pctOf(data.currentLiabilities.total, totalLiabilitiesExclEquity)}%`,
            color: reportColor(1),
        },
    ];

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="balance-sheet" />
            </Col>
            <Col span={24}>
                <Flex vertical gap={24} className="w-full">
                    <BsHeader fy={fy} period={period} onFyChange={setFy} onPeriodChange={setPeriod} />

                    <BalanceSheetSummaryCards stats={summaryStats} />

                    <SectionCard
                        title="Balance Sheet Statement"
                        action={
                            <Flex gap={8} wrap="wrap" className="flex-col sm:flex-row">
                                <Segmented
                                    value={detailMode}
                                    onChange={value => setDetailMode(value as DetailMode)}
                                    options={[
                                        { label: 'Condensed', value: 'condensed' },
                                        { label: 'Detailed', value: 'detailed' },
                                    ]}
                                />
                                <Segmented
                                    value={layoutMode}
                                    onChange={value => setLayoutMode(value as LayoutMode)}
                                    options={[
                                        { label: 'Horizontal', value: 'horizontal' },
                                        { label: 'Vertical', value: 'vertical' },
                                    ]}
                                />
                            </Flex>
                        }
                    >
                        {layoutMode === 'horizontal' ? (
                            <Row gutter={[24, 24]} className="w-full">
                                <Col xs={24} xl={12}>
                                    {renderBsColumn(horizontalLiabilities)}
                                </Col>
                                <Col xs={24} xl={12}>
                                    {renderBsColumn(horizontalAssets)}
                                </Col>
                            </Row>
                        ) : (
                            <Flex vertical gap={24} className="w-full">
                                {renderBsColumn(verticalEquityAndLiabilities)}
                                {renderBsColumn(verticalAssets)}
                            </Flex>
                        )}
                    </SectionCard>

                    <Row gutter={[24, 24]} className="w-full">
                        <Col xs={24} lg={12}>
                            <AssetCompositionCard centerValue={formatCompact(data.assetsTotal)} slices={assetSlices} />
                        </Col>
                        <Col xs={24} lg={12}>
                            <LiabilityCompositionCard
                                centerValue={formatCompact(totalLiabilitiesExclEquity)}
                                slices={liabilitySlices}
                            />
                        </Col>
                    </Row>
                </Flex>
            </Col>
        </Row>
    );
};

export default BalanceSheetReportLanding;
