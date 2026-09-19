import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getEmployeeCtcApi } from '../../api/ctcCalculator';
import { getStatutoryComponent, updateStatutorystatus } from '../../api/employeeProfileApi/index';

export interface EpfCardData {
    isActive: boolean;
    uan: string | null;
    basicSalary: number;
    pfWage: number;
    isCapped: boolean;
    employerContribution: number;
    employeeContribution: number;
}

export interface EsiCardData {
    isActive: boolean;
    esiNumber: string | null;
    eligible: boolean;
    grossSalary: number;
    employerContribution: number;
    employeeContribution: number;
}

export interface TdsCardData {
    isActive: boolean;
    panNumber: string | null;
    taxRegime: string;
    standardDeduction: number;
}

export interface ProfessionalTaxCardData {
    isActive: boolean;
    monthlyDeduction: number;
    isEmployeeSpecific: boolean;
    hasComponent: boolean;
}

export interface LwfConfig {
    workState: string | null;
    scheduleOverride: string | null;
    employeeShareType: string | null;
    employeeShareValue: number | null;
    employerShareType: string | null;
    employerShareValue: number | null;
}

export interface LwfCardData extends LwfConfig {
    isActive: boolean;
    employeeAmount: number;
    employerAmount: number;
    schedule: string | null;
    scheduleLabel: string | null;
    fires: boolean | null;
    // Resolved display state (employee's own override, or the org default when unset) —
    // distinct from LwfConfig.workState above, which stays the RAW per-employee value the
    // edit modal needs (blank when nothing's been set, not a resolved fallback).
    resolvedWorkState: string | null;
    workStateIsOrgDefault: boolean;
    nextFireMonth: number | null;
    nextFireYear: number | null;
}

export interface StatutoryCardData {
    epf: EpfCardData;
    esi: EsiCardData;
    tds: TdsCardData;
    professionalTax: ProfessionalTaxCardData;
    lwf: LwfCardData;
}

const EMPTY_DATA: StatutoryCardData = {
    epf: {
        isActive: true,
        uan: null,
        basicSalary: 0,
        pfWage: 0,
        isCapped: false,
        employerContribution: 0,
        employeeContribution: 0,
    },
    esi: {
        isActive: true,
        esiNumber: null,
        eligible: false,
        grossSalary: 0,
        employerContribution: 0,
        employeeContribution: 0,
    },
    tds: {
        isActive: false,
        panNumber: null,
        taxRegime: 'New Tax Regime',
        standardDeduction: 75000,
    },
    professionalTax: {
        isActive: true,
        monthlyDeduction: 0,
        isEmployeeSpecific: false,
        hasComponent: false,
    },
    lwf: {
        isActive: true,
        workState: null,
        scheduleOverride: null,
        employeeShareType: null,
        employeeShareValue: null,
        employerShareType: null,
        employerShareValue: null,
        employeeAmount: 0,
        employerAmount: 0,
        schedule: null,
        scheduleLabel: null,
        fires: null,
        resolvedWorkState: null,
        workStateIsOrgDefault: false,
        nextFireMonth: null,
        nextFireYear: null,
    },
};

const useEmployeeStatutoryDetails = (employeeId: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();

    const [data, setData] = useState<StatutoryCardData>(EMPTY_DATA);
    const [isLoading, setIsLoading] = useState(true);
    const [buttonLoader, setButtonLoader] = useState<Record<string, boolean>>({});

    const fetchStatutoryDetails = useCallback(async () => {
        setIsLoading(true);
        const [statutoryRes, ctcRes] = await Promise.all([
            getStatutoryComponent(employeeId, id, role),
            getEmployeeCtcApi({ userId: id, userType: role, employeeId }),
        ]);

        if (statutoryRes) {
            const deductions = ctcRes?.deductions || [];
            const pfDeduction = deductions.find((d: any) => d.deductionName === 'Provident Fund (PF)');
            const ptDeduction = deductions.find((d: any) => d.deductionName === 'Professional Tax');

            setData({
                epf: {
                    // Opt-OUT, same convention as ESI below — only an explicit `false`
                    // means off; untouched (undefined) or `true` both mean Active.
                    isActive: statutoryRes.enableEPF !== false,
                    uan: statutoryRes.epfUAN ?? null,
                    basicSalary: ctcRes?.basicSalary || 0,
                    pfWage: ctcRes?.employerPf?.pfWage || 0,
                    isCapped: (ctcRes?.employerPf?.pfWage || 0) < (ctcRes?.basicSalary || 0),
                    employerContribution: ctcRes?.employerPf?.total || 0,
                    employeeContribution: pfDeduction?.calculatedAmount || 0,
                },
                esi: {
                    // Opt-OUT semantics: only an explicit `false` means the toggle is off —
                    // untouched (undefined) or `true` both mean "ceiling rule decides"
                    // (see resolveEsi in ctcCalculator.js).
                    isActive: statutoryRes.enableESI !== false,
                    esiNumber: statutoryRes.esiNumber ?? null,
                    eligible: !!ctcRes?.esi?.eligible,
                    grossSalary: ctcRes?.grossSalary || 0,
                    employerContribution: ctcRes?.esi?.employerContribution || 0,
                    employeeContribution: ctcRes?.esi?.employeeContribution || 0,
                },
                tds: {
                    isActive: !!statutoryRes.tds,
                    panNumber: statutoryRes.panNumber ?? null,
                    taxRegime: statutoryRes.taxRegime || 'New Tax Regime',
                    standardDeduction: statutoryRes.standardDeduction ?? 75000,
                },
                professionalTax: {
                    // Opt-OUT, same convention as ESI/EPF above.
                    isActive: statutoryRes.professionalTax !== false,
                    monthlyDeduction: ptDeduction?.calculatedAmount || 0,
                    isEmployeeSpecific: !!ptDeduction?.isEmployeeSpecific,
                    hasComponent: !!ptDeduction,
                },
                lwf: {
                    // Opt-OUT, same convention as ESI/EPF/PT above.
                    isActive: statutoryRes.laborWelfareFund !== false,
                    workState: statutoryRes.lwf?.workState ?? null,
                    scheduleOverride: statutoryRes.lwf?.scheduleOverride ?? null,
                    employeeShareType: statutoryRes.lwf?.employeeShareType ?? null,
                    employeeShareValue: statutoryRes.lwf?.employeeShareValue ?? null,
                    employerShareType: statutoryRes.lwf?.employerShareType ?? null,
                    employerShareValue: statutoryRes.lwf?.employerShareValue ?? null,
                    employeeAmount: ctcRes?.lwf?.employeeAmount || 0,
                    employerAmount: ctcRes?.lwf?.employerAmount || 0,
                    schedule: ctcRes?.lwf?.schedule ?? null,
                    scheduleLabel: ctcRes?.lwf?.scheduleLabel ?? null,
                    fires: ctcRes?.lwf?.fires ?? null,
                    resolvedWorkState: ctcRes?.lwf?.workState ?? null,
                    workStateIsOrgDefault: !!ctcRes?.lwf?.workStateIsOrgDefault,
                    nextFireMonth: ctcRes?.lwf?.nextFireMonth ?? null,
                    nextFireYear: ctcRes?.lwf?.nextFireYear ?? null,
                },
            });
        }

        setIsLoading(false);
    }, [employeeId, id, role]);

    useEffect(() => {
        fetchStatutoryDetails();
    }, [fetchStatutoryDetails]);

    const updateEmployeeStatutoryData = async (
        fieldKey: string,
        value: boolean | string | object,
        loaderKey: string
    ) => {
        setButtonLoader(prev => ({ ...prev, [loaderKey]: true }));

        const result: any | false = await updateStatutorystatus(employeeId, id, role, { [fieldKey]: value });

        if (result) {
            dispatch(
                showToast({
                    description: 'Statutory details updated successfully',
                    variant: 'success',
                })
            );
            await fetchStatutoryDetails();
        } else {
            dispatch(
                showToast({
                    description: 'Something went wrong. Please try again later.',
                    variant: 'error',
                })
            );
        }

        setButtonLoader(prev => ({ ...prev, [loaderKey]: false }));
        return result;
    };

    return { isLoading, buttonLoader, data, updateEmployeeStatutoryData, refetch: fetchStatutoryDetails };
};

export default useEmployeeStatutoryDetails;
