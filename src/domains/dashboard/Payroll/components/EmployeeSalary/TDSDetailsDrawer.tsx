import React from 'react';

import { Card, Col, Row, Skeleton, Space, Typography } from 'antd';

import DrawerModal from '@components/atomic/DrawerModal';
import { formatNumberWithLocalStringWithoutDecimalPoint, roundMoney } from '@utils/priceFormat';

import { SalaryProfileTdsDetails } from '../../types/salaryProfileTypes/employeeSalaryTable';

const { Title, Text } = Typography;

const fmt = (amount: number) => `₹${formatNumberWithLocalStringWithoutDecimalPoint(roundMoney(amount || 0))}`;

// "400000 -> 4L", "969000 -> 9.7L" — matches how the tax engine's own slab labels read
// elsewhere (e.g. "up to ₹12L").
const formatLakh = (amount: number) => {
    if (amount < 100000) return fmt(amount);
    const lakh = Math.round((amount / 100000) * 10) / 10;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)}L`;
};

interface DetailRowProps {
    label: React.ReactNode;
    value: React.ReactNode;
    strong?: boolean;
    muted?: boolean;
}

const DetailRow = ({ label, value, strong, muted }: DetailRowProps) => (
    <Row justify="space-between" wrap={false}>
        <Col flex="auto" style={{ minWidth: 0 }}>
            <Text style={muted ? { color: '#94A3B8' } : undefined} strong={strong}>
                {label}
            </Text>
        </Col>
        <Col>
            <Text style={{ whiteSpace: 'nowrap', ...(muted ? { color: '#94A3B8' } : {}) }} strong={strong}>
                {value}
            </Text>
        </Col>
    </Row>
);

const StepCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card size="small" bordered className="rounded-2xl">
        <Space direction="vertical" className="w-full" size={8}>
            <Text strong>{title}</Text>
            {children}
        </Space>
    </Card>
);

interface TDSDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    details: SalaryProfileTdsDetails | null;
    loading?: boolean;
}

const TDSDetailsDrawer = ({ open, onClose, details, loading }: TDSDetailsDrawerProps) => {
    const surcharge = 0; // Not yet computed by the tax engine — always nil below the ₹50L surcharge threshold for the salaries this covers.

    return (
        <DrawerModal
            open={open}
            handleCancel={onClose}
            modalTitle="TDS Details"
            closeIcon
        >
            {loading || !details ? (
                <Skeleton active paragraph={{ rows: 10 }} />
            ) : (
                <Space direction="vertical" className="w-full" size={20}>
                    <Space direction="vertical" className="w-full" size={12}>
                        <Title level={5}>Employee Details</Title>
                        <DetailRow label="Name" value={details.employeeName} />
                        <DetailRow label="Email" value={details.employeeEmail} />
                        <DetailRow label="Tax Regime" value={details.taxRegime} />
                        <DetailRow label="TDS Frequency" value={details.tdsFrequency} />
                    </Space>

                    <StepCard title="Step 1 — This month's earnings">
                        <DetailRow label="Monthly salary (from the salary structure)" value={fmt(details.monthlySalary)} />
                        <DetailRow label="Gross paid this month" value={fmt(details.grossThisMonth)} strong />
                    </StepCard>

                    <StepCard title="Step 2 — Yearly exemptions">
                        <DetailRow label="Standard deduction" value={fmt(details.standardDeduction)} />
                        <DetailRow
                            label={`Total exemptions (${fmt(details.exemptions / 12)} per month)`}
                            value={fmt(details.exemptions)}
                            strong
                        />
                    </StepCard>

                    <StepCard title="Step 3 — Taxable income">
                        <DetailRow label={`Annual salary: ${fmt(details.monthlySalary)} × 12`} value={fmt(details.grossAnnual)} />
                        <DetailRow label="Less: yearly exemptions" value={`− ${fmt(details.exemptions)}`} />
                        <DetailRow label="Annual taxable income" value={fmt(details.taxableIncome)} strong />
                    </StepCard>

                    <StepCard title="Step 4 — Tax on that income (slab by slab)">
                        <Card size="small" bordered className="rounded-xl bg-[#F8FAFC]">
                            <Space direction="vertical" className="w-full" size={6}>
                                {details.slabBreakdown.map(slab => (
                                    <DetailRow
                                        key={`${slab.from}-${slab.to}-${slab.rate}`}
                                        label={`${formatLakh(slab.from)}–${slab.to != null ? formatLakh(slab.to) : '∞'} @${slab.rate}%`}
                                        value={`= ${fmt(slab.tax)}`}
                                    />
                                ))}
                            </Space>
                        </Card>
                        <DetailRow label="Total slab tax (before rebate and cess)" value={`= ${fmt(details.taxBeforeRebate)}`} />
                        <DetailRow label="Less: Section 87A rebate / marginal relief" value={`− ${fmt(details.rebate)}`} />
                        <DetailRow
                            label="Add: Surcharge (high incomes above ₹50L taxable)"
                            value={`+ ${fmt(surcharge)}`}
                            muted
                        />
                        <DetailRow label={`Add: Health & Education Cess — 4% of ${fmt(details.taxBeforeRebate - details.rebate)}`} value={`+ ${fmt(details.cess)}`} />
                        <DetailRow
                            label="Total Tax Payable (Annual, incl. this month's one-time payments)"
                            value={fmt(details.totalTax)}
                            strong
                        />
                    </StepCard>

                    <StepCard title="Step 5 — This month's TDS">
                        <DetailRow
                            label={`Regular monthly TDS: annual tax on salary ${fmt(details.totalTax)} ÷ 12`}
                            value={fmt(details.tdsMonthly)}
                        />
                        <DetailRow label="Monthly TDS Deduction" value={fmt(details.tdsMonthly)} strong />
                    </StepCard>
                </Space>
            )}
        </DrawerModal>
    );
};

export default TDSDetailsDrawer;
