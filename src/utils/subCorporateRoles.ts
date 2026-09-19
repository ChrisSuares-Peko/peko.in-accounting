/**
 * The role vocabulary for sub-corporate members — the single frontend copy.
 *
 * `subCorporateUsers.role` is an authorization input, not a job title: the backend resolves it to a permission
 * preset and 'Admin' grants corporate-wide card authority. It therefore belongs to a fixed list everywhere it
 * is offered (invite, edit) rather than being typed freehand.
 *
 * Mirrors `Peko-IN/users/utils/subCorporateRoleNames.js`. Lives in shared utils rather than a domain because
 * both Settings → User Management and Corporate Cards assign it.
 */
export const ADMIN_ROLE = 'Admin';
export const EMPLOYEE_ROLE = 'Employee';

export const SUB_CORPORATE_ROLE_NAMES = [ADMIN_ROLE, EMPLOYEE_ROLE];

export const DEFAULT_SUB_CORPORATE_ROLE = EMPLOYEE_ROLE;

/** Options for a role Select, in the order they should be offered. */
export const SUB_CORPORATE_ROLE_OPTIONS = SUB_CORPORATE_ROLE_NAMES.map(name => ({
    label: name,
    value: name,
}));
