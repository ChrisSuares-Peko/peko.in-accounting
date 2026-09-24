import { ReactNode } from 'react';

import { Flex, Typography } from 'antd';

const { Text } = Typography;

export interface DashboardStatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    // Now colors the WHOLE card surface (bg + border + a text-color the icon
    // inherits) — the same role stat.bg/stat.border play in
    // BalanceSheetSummaryCards.tsx, just expressed as our own semantic-token
    // classes (e.g. "border border-success-border bg-success-surface
    // text-success") instead of inline hex, consistent with the rest of this
    // app's design-system usage.
    chipClassName: string;
    // Merged in alongside chipClassName — every call site already uses the
    // same semantic color for both (e.g. "border-l-success" next to a
    // success chipClassName), so this just reinforces the same border color;
    // kept as its own prop so neither caller needs to change its call shape.
    accentClassName: string;
    caption: string;
    // Omit for a plain count (Day Book's stat cards); pass formatCompact for a
    // currency figure (the Dashboard's stat cards).
    formatter?: (value: number) => ReactNode;
}

// Shared figure-card shape used by both AccountingDashboardLanding and
// DayBookLanding's stat rows. Rebuilt to match BalanceSheetSummaryCards.tsx's
// own compact card exactly — rounded-[22px], border, px-7 py-5, a tight
// three-line vertical stack — rather than a SectionCard wrapper, which was
// significantly taller for the same amount of information.
const DashboardStatCard = ({
    title,
    value,
    icon,
    chipClassName,
    accentClassName,
    caption,
    formatter,
}: DashboardStatCardProps) => (
    <Flex
        vertical
        gap={4}
        justify="center"
        className={`relative h-full w-full overflow-hidden rounded-[22px] px-7 py-5 ${chipClassName} ${accentClassName}`}
    >
        {/* Light gradient toward white — generic (doesn't need to know the
        card's specific tint color), so it works uniformly under any
        chipClassName. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent to-white/70" />
        <Flex align="center" gap={8} className="relative z-10">
            <span className="flex shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5">
                {icon}
            </span>
            <Text className="text-sm text-bodyText">{title}</Text>
        </Flex>
        <Text className="relative z-10 text-xl font-semibold text-ink">
            {formatter ? formatter(value) : value}
        </Text>
        <Text className="relative z-10 text-sm text-bodyText opacity-50">{caption}</Text>
    </Flex>
);

export default DashboardStatCard;
