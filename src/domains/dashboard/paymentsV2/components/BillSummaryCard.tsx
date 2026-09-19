import type { Dispatch, SetStateAction } from 'react';

import { CheckCircleFilled } from '@ant-design/icons';

import type { summaryTexts } from '@customtypes/general';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import BillSummaryRow from './BillSummaryRow';

interface BillSummaryCardProps {
    title: string;
    billSummary: summaryTexts[];
    minimumAmount?: number | null;
    maximumAmount?: number | null;
    paymentNote?: { includes?: string[]; description?: string };
    setIsCashbackChecked: Dispatch<SetStateAction<boolean>>;
    isLoading: boolean;
    removeCoupon: () => void;
}

const SkeletonRow = ({ wide = false }: { wide?: boolean }) => (
    <div className="flex w-full items-center justify-between" aria-hidden="true">
        <div className="h-3.5 w-24 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div
            className={`h-3.5 animate-pulse rounded bg-slate-200 motion-reduce:animate-none ${wide ? 'w-32' : 'w-20'}`}
        />
    </div>
);

export const BillSummaryCardSkeleton = () => (
    <div className="w-full rounded-2xl bg-white p-6 shadow-[0_1.5px_8.25px_rgba(0,0,0,0.06)]">
        <div className="mb-5 h-5 w-32 animate-pulse rounded bg-slate-200 motion-reduce:animate-none" />
        <div className="flex flex-col gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonRow key={index} wide={index % 2 === 0} />
            ))}
        </div>
    </div>
);

const BillSummaryCard = ({
    title,
    billSummary,
    minimumAmount,
    maximumAmount,
    paymentNote,
    setIsCashbackChecked,
    isLoading,
    removeCoupon,
}: BillSummaryCardProps) => (
    <div className="w-full animate-fade-in rounded-2xl bg-white p-6 shadow-[0_1.5px_8.25px_rgba(0,0,0,0.06)] motion-reduce:animate-none">
        <h2 className="mb-5 text-lg font-bold text-slate-900">{title || 'Bill Summary'}</h2>
        <div className="flex flex-col gap-5">
            {billSummary.map((item, index) => (
                <BillSummaryRow
                    key={`${item.key}-${index}`}
                    headName={item.key}
                    value={item.value}
                    isInput={item.isInput}
                    subText={item.subText}
                    setIsCashbackChecked={setIsCashbackChecked}
                    isLoading={isLoading}
                    removeCoupon={removeCoupon}
                />
            ))}
        </div>
        {minimumAmount && maximumAmount ? (
            <p className="mt-3 text-left text-xs text-slate-400">
                Min: ₹ {formatNumberWithLocalString(minimumAmount)} and Max: ₹{' '}
                {formatNumberWithLocalString(maximumAmount)}
            </p>
        ) : null}
        {paymentNote && (!!paymentNote.includes?.length || !!paymentNote.description) && (
            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-[#FBFBFB] p-4">
                <span className="text-sm font-semibold text-slate-900">Please note</span>
                {!!paymentNote.includes?.length && (
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-medium text-slate-500">
                            What&apos;s included
                        </span>
                        {paymentNote.includes.map(item => (
                            <div key={item} className="flex items-start gap-2">
                                <CheckCircleFilled
                                    style={{ fontSize: 14, color: '#22c55e', marginTop: 3 }}
                                />
                                <span className="text-xs text-slate-600 sm:text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                )}
                {!!paymentNote.description && (
                    <p className="mb-0 text-xs text-slate-500 sm:text-sm">
                        {paymentNote.description}
                    </p>
                )}
            </div>
        )}
    </div>
);

export default BillSummaryCard;
