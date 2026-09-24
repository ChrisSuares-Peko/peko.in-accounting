import { ReactNode } from 'react';

import { Avatar, Flex, Statistic, Typography } from 'antd';

import SectionCard from './profitLoss/SectionCard';

const { Text } = Typography;

export interface DashboardStatCardProps {
    title: string;
    value: number;
    icon: ReactNode;
    // Icon chip tint — surface background + matching border (e.g.
    // "border border-success-border bg-success-surface text-success").
    chipClassName: string;
    // 3-4px left-border accent in the same tint color (e.g. "border-l-success").
    accentClassName: string;
    caption: string;
    // Omit for a plain count (Day Book's stat cards); pass formatCompact for a
    // currency figure (the Dashboard's stat cards).
    formatter?: (value: number) => ReactNode;
}

// Shared figure-card shape used by both AccountingDashboardLanding and
// DayBookLanding's stat rows — icon chip (sized to match the Notifications
// panel's own Avatar chips), colored left-border accent, value, and a live
// caption. Kept here rather than duplicated per page so the two can't drift.
const DashboardStatCard = ({
    title,
    value,
    icon,
    chipClassName,
    accentClassName,
    caption,
    formatter,
}: DashboardStatCardProps) => (
    <SectionCard title={title} className={`border-l-4 ${accentClassName}`}>
        <Flex vertical gap={8}>
            <Avatar size={32} icon={icon} className={chipClassName} />
            <Statistic value={value} formatter={formatter ? v => formatter(Number(v)) : undefined} />
            <Text className="text-xs text-muted">{caption}</Text>
        </Flex>
    </SectionCard>
);

export default DashboardStatCard;
