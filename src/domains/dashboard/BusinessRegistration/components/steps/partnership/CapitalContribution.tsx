import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { getIn, useFormikContext } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

const { Title, Paragraph, Text } = Typography;

interface Partner {
    firstName?: string;
    lastName?: string;
}

const COLS = 'grid grid-cols-[1.4fr_1fr_1fr] gap-3 items-center';
const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

// Capital Contribution & Profit Sharing step for the Partnership flow (doc §C4).
// Per-partner contribution (₹) + profit-share %; the schema blocks "Next" until
// contributions sum to the total and profit shares sum to 100%.
const CapitalContribution = () => {
    const { values } = useFormikContext<Record<string, unknown>>();
    const partners = (values.partners as Partner[]) || [];
    const total = Number(getIn(values, 'totalContribution')) || 0;
    const sumAmount = partners.reduce<number>(
        (s, _, i) => s + (Number(getIn(values, `contribution.${i}.amount`)) || 0),
        0
    );
    const sumPct = partners.reduce<number>(
        (s, _, i) => s + (Number(getIn(values, `contribution.${i}.profitShare`)) || 0),
        0
    );
    const amountOk = total > 0 && Math.round(sumAmount) === Math.round(total);
    const pctOk = Math.round(sumPct) === 100;

    return (
        <div className="flex flex-col gap-4">
            <div>
                <Title level={3} className="!text-[24px] !font-semibold !text-[#1e293b] !mb-1 !leading-[32px]">
                    Capital Contribution & Profit Sharing
                </Title>
                <Paragraph className="!mb-0 text-[16px] text-[#6a7282] !leading-[24px]">
                    Each partner&apos;s capital contribution and profit-sharing percentage.
                </Paragraph>
            </div>

            <div className="border border-[#e4e4e7] rounded-[24px] p-4 sm:p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <Text className="!text-[16px] !font-semibold !text-[#1e293b]">Total Capital Contribution</Text>
                    <div className="border border-[#e4e4e7] rounded-[24px] p-6 [&_.ant-form-item]:!mb-0">
                        <TextInput
                            label="Total Capital Contribution (₹)"
                            name="totalContribution"
                            type="text"
                            placeholder="₹0"
                            allowNumbersOnly
                            size="large"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Text className="!text-[16px] !font-semibold !text-[#1e293b]">Per-Partner Split</Text>
                    <div className="border border-[#e4e4e7] rounded-[16px] overflow-x-auto">
                        <div className="min-w-[560px]">
                            <div className={`${COLS} bg-[#fafafa] px-4 py-3 text-[13px] font-medium text-[#64748b]`}>
                                <span>Partner Name</span>
                                <span>Contribution (₹)</span>
                                <span>Profit Share (%)</span>
                            </div>
                            {partners.map((p, i) => {
                                const name =
                                    [p?.firstName, p?.lastName].filter(Boolean).join(' ') || `Partner ${i + 1}`;
                                return (
                                    <div key={i} className={`${COLS} px-4 py-3 border-t border-[#ebebeb]`}>
                                        <Text className="!text-[14px] !text-[#1e293b]">{name}</Text>
                                        <div className="pr-2 [&_.ant-form-item]:!mb-0">
                                            <TextInput name={`contribution.${i}.amount`} type="text" placeholder="₹ 0" allowNumbersOnly />
                                        </div>
                                        <div className="pr-2 [&_.ant-form-item]:!mb-0">
                                            <TextInput name={`contribution.${i}.profitShare`} type="text" placeholder="0" allowNumbersOnly />
                                        </div>
                                    </div>
                                );
                            })}
                            <div className={`${COLS} px-4 py-3 border-t border-[#ebebeb] bg-[#fafafa]`}>
                                <Text className="!text-[14px] !font-semibold !text-[#1e293b]">Total</Text>
                                <Text className={`!text-[14px] ${amountOk ? '!text-[#16a34a]' : '!text-[#ef4444]'}`}>
                                    {formatINR(sumAmount)}
                                    {total ? ` / ${formatINR(total)}` : ''}
                                </Text>
                                <Text className={`!text-[14px] ${pctOk ? '!text-[#16a34a]' : '!text-[#ef4444]'}`}>
                                    {sumPct}% / 100%
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[12px] flex gap-2 items-start px-4 py-3">
                    <ExclamationCircleOutlined className="text-[#f59e0b] mt-[3px]" style={{ fontSize: 16 }} />
                    <div>
                        <Text className="!block !text-[14px] !font-medium !text-[#1e293b] !mb-1">Please note:</Text>
                        <ul className="list-disc pl-4 flex flex-col gap-1">
                            <li className="text-[13px] text-[#475569]">
                                Partner contributions must add up to the total capital contribution.
                            </li>
                            <li className="text-[13px] text-[#475569]">
                                Profit-sharing percentages must add up to 100%.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CapitalContribution;
