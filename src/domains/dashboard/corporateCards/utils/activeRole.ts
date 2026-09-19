/**
 * Which mode a session is acting in, mirroring corporateCard/utils/cardHelpers.js#activeRoleName.
 *
 * CLAMPED to the assigned role: the active mode may only ever REDUCE authority, so a stale or tampered
 * `activeSubRole` can never present the admin UI to someone not assigned Admin. The server enforces the same
 * rule — this exists so the UI does not disagree with it.
 */
import { UserRole } from '@customtypes/general';
import { ADMIN_ROLE, EMPLOYEE_ROLE } from '@utils/subCorporateRoles';

export { ADMIN_ROLE, EMPLOYEE_ROLE };

/**
 * True for the account owner's own session, mirroring corporateCard/utils/cardHelpers.js#isCorporateOwner.
 *
 * A sub-corporate session keeps role CORPORATE, so `subCorporateId` is the only marker separating an
 * assigned Admin from the owner — the same test `useEnsureOwnerCardholder` relies on. Says nothing about
 * which mode they are acting in; pair it with `actsAsAdminUi` where that matters.
 */
export const isAccountOwner = (
    role?: string | null,
    subCorporateId?: number | string | null
): boolean => role === UserRole.CORPORATE && !subCorporateId;

const canonical = (raw?: string | null) =>
    raw?.trim() === ADMIN_ROLE ? ADMIN_ROLE : EMPLOYEE_ROLE;

export const resolveActiveRole = (
    assignedRole?: string | null,
    activeSubRole?: string | null
): string => {
    const assigned = canonical(assignedRole);
    if (assigned !== ADMIN_ROLE) return EMPLOYEE_ROLE;
    return canonical(activeSubRole ?? assigned);
};

/**
 * True when this session should see the corporate-admin UI.
 *
 * Driven by the ACTIVE mode, because the account owner can switch to Employee too — so "has no cardholder
 * identity" no longer implies "is an admin". It is only the fallback for a session that carries no role
 * information at all (a system user, or the owner before the switcher has synced from the server).
 */
export const actsAsAdminUi = (
    subCorporateId?: number | string | null,
    assignedRole?: string | null,
    activeSubRole?: string | null
): boolean => {
    if (!assignedRole && !activeSubRole) return !subCorporateId;
    const assumed = assignedRole ?? (subCorporateId ? EMPLOYEE_ROLE : ADMIN_ROLE);
    return resolveActiveRole(assumed, activeSubRole) === ADMIN_ROLE;
};
