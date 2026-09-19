import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

export interface SwitchRoleState {
    /** The member's assigned role; null for the corporate owner. */
    assignedRole: string | null;
    /** The mode they are currently acting in. */
    activeRole: string | null;
    /** Modes this session may switch between — empty when there is no choice to offer. */
    modes: string[];
    /**
     * True when the corporate owner has no cardholder row yet, so the first switch to Employee must collect
     * their personal name and mobile. Always false for a member — their own row IS their identity.
     */
    needsProfile: boolean;
}

/**
 * The users service is proxied at `/api/v1/user` (api-gateway routes.js) — it takes NO :userType/:userId
 * segments, unlike the per-service `/api/v1/:userType/:userId/<service>` routes. The controller reads the
 * caller from `req.user` and the `sessionid` header, so there is nothing to put in the path anyway.
 *
 * NOT `user/switch-role`: that path is already taken by the corporate <-> ESS-employee IDENTITY switch in the
 * users service (login.js), which is mounted earlier and would answer the POST instead — with "You do not have
 * access to this identity", because it expects role 'corporate'|'user'. This endpoint switches the authority
 * MODE of one identity, which is a different thing.
 */
const BASE = 'user/active-role';

export const getSwitchRoleState = async () => {
    try {
        const res: SuccessGenericResponse<SwitchRoleState> = await ApiClient.get(BASE);
        return res;
    } catch {
        return false;
    }
};

export interface OwnerCardholderDetails {
    name: string;
    mobileNo: string;
}

/**
 * `details` is sent only on the owner's FIRST switch to Employee, where the server creates their cardholder
 * row from it. Ignored once the row exists. It is their PERSONAL name and mobile — the corporate record holds
 * the company name and the registered business number, and this feeds Pine Labs KYC.
 */
/**
 * Creates the account owner's cardholder row WITHOUT switching mode, so the People screen can list them and
 * they can start KYC while staying in Admin mode.
 *
 * Idempotent, and it needs no input: the server builds the row from the personal name and OTP-verified
 * mobile captured at registration. Sending `details` only matters when registration left nothing usable.
 */
export const createOwnerCardholderProfile = async (details?: OwnerCardholderDetails) => {
    try {
        const res: SuccessGenericResponse<{
            id: string;
            name: string;
            mobileNo: string;
            role: string;
            created: boolean;
        }> = await ApiClient.post(`${BASE}/cardholder-profile`, details ?? {});
        return res;
    } catch {
        return false;
    }
};

export const switchRole = async (role: string, details?: OwnerCardholderDetails) => {
    try {
        const res: SuccessGenericResponse<{ assignedRole: string; activeRole: string }> =
            await ApiClient.post(BASE, { role, ...(details ?? {}) });
        return res;
    } catch {
        return false;
    }
};
