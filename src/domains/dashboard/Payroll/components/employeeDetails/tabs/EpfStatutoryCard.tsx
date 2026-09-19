import React, { useState } from 'react';

import { formatNumberWithLocalStringWithoutDecimalPoint } from '@utils/priceFormat';

import StatutoryCardShell from './StatutoryCardShell';
import { EPF_INFO } from './statutoryInfoContent';
import { EpfCardData } from '../../../hooks/employeeProfileHooks/useEmployeeStatutoryDetails';
import UpdateStatutoryTextModal from '../modals/UpdateStatutoryTextModal';

interface EpfStatutoryCardProps {
    data: EpfCardData;
    toggleLoading?: boolean;
    onToggle: (checked: boolean) => void;
    onUpdateUan: (value: string) => Promise<any>;
}

const EpfStatutoryCard = ({ data, toggleLoading, onToggle, onUpdateUan }: EpfStatutoryCardProps) => {
    const [modalOpen, setModalOpen] = useState(false);

    const employerBadge = data.isCapped
        ? `12% + 1% admin/EDLI (PF wages capped ₹${formatNumberWithLocalStringWithoutDecimalPoint(data.pfWage)})`
        : '12% + 1% admin/EDLI of Basic Salary';
    const employeeBadge = data.isCapped
        ? `12% of Basic (PF wages capped ₹${formatNumberWithLocalStringWithoutDecimalPoint(data.pfWage)})`
        : '12% of Basic';

    return (
        <>
            <StatutoryCardShell
                title="EPF"
                statusText={data.isActive ? 'Active' : 'Inactive'}
                statusPositive={data.isActive}
                actionLabel="Update UAN"
                onAction={() => setModalOpen(true)}
                showToggle
                toggleChecked={data.isActive}
                toggleLoading={toggleLoading}
                onToggle={onToggle}
                infoContent={EPF_INFO}
                fields={[
                    { label: 'UAN Number', value: data.uan || '—' },
                    { label: 'Employer Contribution', value: employerBadge },
                    { label: 'Employee Contribution', value: employeeBadge },
                    { label: 'Included in EPF (ECR) Filing', value: data.isActive ? 'Yes' : 'No' },
                ]}
            />
            {modalOpen && (
                <UpdateStatutoryTextModal
                    open={modalOpen}
                    title="Update UAN"
                    label="UAN Number"
                    fieldKey="epfUAN"
                    initialValue={data.uan}
                    handleCancel={() => setModalOpen(false)}
                    onSave={(_fieldKey, value) => onUpdateUan(value)}
                />
            )}
        </>
    );
};

export default EpfStatutoryCard;
