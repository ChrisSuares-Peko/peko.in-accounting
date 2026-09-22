import { DatePicker, Flex, Radio } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

// Static "today" for this prototype, so every ledger-style page's numbers stay
// coherent with the FY 2026-27 dummy dataset regardless of when it's actually
// opened. Swap for the real current date once this isn't a static prototype.
export const MOCK_TODAY = '2026-09-19';

export type DateRangePreset = 'this-month' | 'last-month' | 'qtd' | 'ytd' | 'custom';

const PRESET_OPTIONS: { label: string; value: DateRangePreset }[] = [
    { label: 'This Month', value: 'this-month' },
    { label: 'Last Month', value: 'last-month' },
    { label: 'Quarter to Date', value: 'qtd' },
    { label: 'Year to Date', value: 'ytd' },
    { label: 'Custom Range', value: 'custom' },
];

// Fiscal quarters follow the same 1 April FY start as "Year to Date" below (not
// specified explicitly, but kept consistent rather than mixing calendar and fiscal
// framing on the same toolbar): Q1 Apr-Jun, Q2 Jul-Sep, Q3 Oct-Dec, Q4 Jan-Mar.
const getFiscalQuarterStart = (date: Dayjs): Dayjs => {
    const month = date.month(); // 0-indexed, Jan = 0
    if (month >= 3 && month <= 5) return date.month(3).startOf('month');
    if (month >= 6 && month <= 8) return date.month(6).startOf('month');
    if (month >= 9 && month <= 11) return date.month(9).startOf('month');
    return date.month(0).startOf('month');
};

// 1 April start, not 1 January.
const getFiscalYearStart = (date: Dayjs): Dayjs => {
    const fyStartYear = date.month() >= 3 ? date.year() : date.year() - 1;
    return dayjs(`${fyStartYear}-04-01`);
};

export const getPresetRange = (preset: DateRangePreset, today: Dayjs): [Dayjs, Dayjs] | null => {
    if (preset === 'this-month') return [today.startOf('month'), today.endOf('month')];
    if (preset === 'last-month') {
        const lastMonth = today.subtract(1, 'month');
        return [lastMonth.startOf('month'), lastMonth.endOf('month')];
    }
    if (preset === 'qtd') return [getFiscalQuarterStart(today), today];
    if (preset === 'ytd') return [getFiscalYearStart(today), today];
    return null; // 'custom' — driven by the RangePicker instead
};

interface LedgerDateRangeFilterProps {
    preset: DateRangePreset;
    onPresetChange: (preset: DateRangePreset) => void;
    customRange: [Dayjs | null, Dayjs | null] | null;
    onCustomRangeChange: (range: [Dayjs | null, Dayjs | null] | null) => void;
}

// Shared date-range preset toolbar — originally built for Cash & Bank, now reused
// by every ledger-style page (LedgerDetailPage) instead of being duplicated per
// page. Purely presentational/controlled: each page owns its own preset/customRange
// state and filters its own entries with the exported getPresetRange() above.
const LedgerDateRangeFilter = ({
    preset,
    onPresetChange,
    customRange,
    onCustomRangeChange,
}: LedgerDateRangeFilterProps) => (
    <Flex align="center" gap={12} wrap="wrap">
        <Radio.Group
            value={preset}
            onChange={e => onPresetChange(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            options={PRESET_OPTIONS}
        />
        {preset === 'custom' && <RangePicker value={customRange} onChange={onCustomRangeChange} />}
    </Flex>
);

export default LedgerDateRangeFilter;
