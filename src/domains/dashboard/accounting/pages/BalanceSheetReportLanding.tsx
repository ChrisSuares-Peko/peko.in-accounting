import { useState } from 'react';

import { Card, Col, Row, Segmented, Typography } from 'antd';
import dayjs from 'dayjs';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import { BalanceSheetGroup, useBalanceSheetData } from '../hooks/useBalanceSheetData';
import AccountingSectionTabs from '../sections/AccountingSectionTabs';

const { Title, Text } = Typography;

const MOCK_TODAY = '2026-09-19';

const formatAmount = (value: number) => formatNumberWithLocalString(value, 2, 2);

type DetailMode = 'condensed' | 'detailed';
type LayoutMode = 'horizontal' | 'vertical';

interface GroupBlockProps {
    group: BalanceSheetGroup;
    label?: string;
    detailed: boolean;
}

// Condensed: one bold row (group label + total). Detailed: same row, plus every
// underlying account indented beneath it — e.g. Sundry Debtors breaks out into
// each individual customer.
const GroupBlock = ({ group, label, detailed }: GroupBlockProps) => (
    <div className="mb-3">
        <div className="flex justify-between font-medium">
            <span>{label ?? group.label}</span>
            <span className="tabular-nums">{formatAmount(group.total)}</span>
        </div>
        {detailed &&
            group.items.map(item => (
                <div key={item.id} className="flex justify-between pl-4 text-gray-500">
                    <span>{item.name}</span>
                    <span className="tabular-nums">{formatAmount(item.amount)}</span>
                </div>
            ))}
    </div>
);

const TotalRow = ({ label, value }: { label: string; value: number }) => (
    <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
        <span>{label}</span>
        <span className="tabular-nums">{formatAmount(value)}</span>
    </div>
);

const BalanceSheetReportLanding = () => {
    const [detailMode, setDetailMode] = useState<DetailMode>('condensed');
    const [layoutMode, setLayoutMode] = useState<LayoutMode>('horizontal');
    const data = useBalanceSheetData();
    const detailed = detailMode === 'detailed';

    return (
        <Row gutter={[0, 16]}>
            <Col span={24}>
                <AccountingSectionTabs activeKey="balance-sheet" />
            </Col>
            <Col span={24}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <Title level={4} className="!mb-0">
                            Balance Sheet
                        </Title>
                        <Text type="secondary">as of {dayjs(MOCK_TODAY).format('D MMMM YYYY')}</Text>
                    </div>
                    <div className="flex gap-3">
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
                    </div>
                </div>
            </Col>
            <Col span={24}>
                {layoutMode === 'horizontal' ? (
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Card title="Liabilities">
                                <GroupBlock group={data.capitalAccount} detailed={detailed} />
                                <GroupBlock group={data.loans} detailed={detailed} />
                                <GroupBlock group={data.currentLiabilities} detailed={detailed} />
                                <TotalRow label="Total" value={data.liabilitiesTotal} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title="Assets">
                                <GroupBlock group={data.fixedAssets} detailed={detailed} />
                                <GroupBlock group={data.currentAssets} detailed={detailed} />
                                <TotalRow label="Total" value={data.assetsTotal} />
                            </Card>
                        </Col>
                    </Row>
                ) : (
                    <Row gutter={[0, 16]}>
                        <Col span={24}>
                            <Card title="I. Equity and Liabilities">
                                <GroupBlock
                                    group={data.capitalAccount}
                                    label="Shareholders' Funds"
                                    detailed={detailed}
                                />
                                <GroupBlock
                                    group={data.loans}
                                    label="Non-Current Liabilities"
                                    detailed={detailed}
                                />
                                <GroupBlock group={data.currentLiabilities} detailed={detailed} />
                                <TotalRow label="Total (I)" value={data.liabilitiesTotal} />
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Card title="II. Assets">
                                <GroupBlock
                                    group={data.fixedAssets}
                                    label="Non-Current Assets"
                                    detailed={detailed}
                                />
                                <GroupBlock group={data.currentAssets} detailed={detailed} />
                                <TotalRow label="Total (II)" value={data.assetsTotal} />
                            </Card>
                        </Col>
                    </Row>
                )}
            </Col>
        </Row>
    );
};

export default BalanceSheetReportLanding;
