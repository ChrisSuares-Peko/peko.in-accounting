import { CtcEmployerPf, PfWagePolicy } from './types';

// Statutory EPF wage ceiling used when an org's policy caps PF wages (₹15,000/month).
export const PF_WAGE_CEILING = 15000;
export const EPF_EMPLOYER_RATE = 0.12;
export const EPF_ADMIN_EDLI_RATE = 0.01;
export const EPF_EMPLOYEE_RATE = 0.12;

export const resolvePfWage = (basicSalary: number, policy: PfWagePolicy) =>
    policy === 'FULL_BASIC' ? basicSalary : Math.min(basicSalary, PF_WAGE_CEILING);

export const calculateEmployerPfContribution = (
    basicSalary: number,
    policy: PfWagePolicy
): CtcEmployerPf => {
    const pfWage = resolvePfWage(basicSalary, policy);
    const employerEpf = pfWage * EPF_EMPLOYER_RATE;
    const adminEdli = pfWage * EPF_ADMIN_EDLI_RATE;
    return { pfWage, employerEpf, adminEdli, total: employerEpf + adminEdli };
};

// Mirrors the backend's resolveEpfPolicyFromComplianceSettings (services/calculateEmployerPf.js).
// pfWagesPolicy is the canonical signal; orgs saved before that field existed only have the
// free-text employerContributionRate string (e.g. '12% of Basic Salary' or 'Restrict
// Contribution to ₹15000 of PF Wage') — fall back to parsing that instead of a migration.
export const resolveEpfPolicyFromComplianceSettings = (complianceData: any): PfWagePolicy => {
    const policy = complianceData?.epf?.pfWagesPolicy;
    if (policy === 'CAPPED_15000' || policy === 'FULL_BASIC') return policy;

    const rate: string = complianceData?.epf?.employerContributionRate || '';
    return rate.includes('Basic Salary') ? 'FULL_BASIC' : 'CAPPED_15000';
};
