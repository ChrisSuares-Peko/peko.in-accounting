import { useCallback, useEffect, useMemo, useState } from 'react';

import { UserRole } from '@customtypes/general';
import { loginSuccess } from '@src/domains/auth/slices/loginSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { ADMIN_ROLE, EMPLOYEE_ROLE } from '@utils/subCorporateRoles';

import {
    getSwitchRoleState,
    OwnerCardholderDetails,
    switchRole,
} from '../../api/user/switchRoleApi';

/**
 * The Admin/Employee mode switcher.
 *
 * NOT `useSwitchRole` (domains/auth) — that one switches which IDENTITY a person signs in as, corporate vs
 * ESS employee, and calls `POST user/switch-role`. This switches which authority MODE one identity acts in
 * and calls `POST user/active-role`. Both were once named useSwitchRole, and importing them into the same
 * module was a duplicate-identifier error that silently resolved usages to the wrong hook.
 *
 * `modes` is empty unless the caller actually has a second mode — the account owner, or a member whose
 * assigned role is Admin — so the header renders nothing rather than a one-option control.
 *
 * A switch changes real authority on the server, so the page is reloaded afterwards: every screen already
 * mounted was rendered for the previous mode, and re-fetching them piecemeal would leave the app in a mix of
 * the two.
 */
const SUB_USER_ROLE_NAME = 'corporate sub user';

export const useActiveRole = () => {
    const { role, roleName, subCorporateId, activeSubRole, subCorporateRole } = useAppSelector(
        state => state.reducer.auth
    );
    const isCorporate = role === UserRole.CORPORATE;
    const dispatch = useAppDispatch();

    /**
     * Who has a second mode, decided from what login already told us.
     *
     * This used to come only from the server, and the fetch is swallowed on failure — so ANY hiccup left
     * `modes` empty and the switcher silently vanished for a member who genuinely is an Admin. That is not
     * hypothetical: `/api/v1/user` is rate-limited to 25 requests per 15 minutes at the gateway and this
     * fires on every header mount, so ordinary navigation exhausts it.
     *
     * Safe to decide here because it is not an authority decision — it only chooses whether to OFFER the
     * menu. The server still clamps the active mode on the GET below and refuses an unauthorised switch with
     * a 403, so the worst a wrong guess can do is show an option that is then declined.
     *
     * Mirrors the server's `canSwitch`: the owner (a corporate session with no cardholder identity) always
     * has both; a member has both only when their ASSIGNED role is exactly 'Admin', failing closed like
     * resolveSubCorporateRole does.
     */
    const localModes = useMemo(() => {
        if (!isCorporate) return [];

        const isMember =
            roleName === SUB_USER_ROLE_NAME || !!subCorporateId || !!subCorporateRole?.trim();

        if (isMember) {
            return subCorporateRole?.trim() === ADMIN_ROLE ? [ADMIN_ROLE, EMPLOYEE_ROLE] : [];
        }

        return [ADMIN_ROLE, EMPLOYEE_ROLE];
    }, [isCorporate, roleName, subCorporateId, subCorporateRole]);

    const [modes, setModes] = useState<string[]>(localModes);
    const [needsProfile, setNeedsProfile] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    useEffect(() => {
        setModes(localModes);
    }, [localModes]);

    useEffect(() => {
        if (!isCorporate && !subCorporateId) return undefined;

        let cancelled = false;
        const run = async () => {
            const res = await getSwitchRoleState();
            if (cancelled || !res || !res.data) return;
            setModes(res.data.modes ?? []);
            setNeedsProfile(res.data.needsProfile === true);
            dispatch(
                loginSuccess({
                    subCorporateRole: res.data.assignedRole,
                    activeSubRole: res.data.activeRole,
                })
            );
        };
        run();
        return () => {
            cancelled = true;
        };
    }, [isCorporate, subCorporateId, dispatch]);

    const changeRole = useCallback(
        async (nextRole: string, details?: OwnerCardholderDetails) => {
            setIsSwitching(true);
            const res = await switchRole(nextRole, details);
            if (!res) {
                setIsSwitching(false);
                return false;
            }
            dispatch(loginSuccess({ activeSubRole: res.data.activeRole }));
            setNeedsProfile(false);
            window.location.reload();
            return true;
        },
        [dispatch]
    );

    return {
        modes,
        needsProfile,
        assignedRole: subCorporateRole ?? null,
        activeRole: activeSubRole ?? subCorporateRole ?? null,
        canSwitch: modes.length > 1,
        isSwitching,
        changeRole,
    };
};
