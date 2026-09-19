import { SuccessGenericResponse } from '@customtypes/general';
import { FRONTEND_BASE_URL } from '@src/config-global';
import { ApiClient } from '@src/services/config';

import {
    allSubCorporatesResponse,
    FormValues,
    serviceType,
    SubCorporateQueryParams,
    updateAccessPayload,
} from '../types/userManagement';

export const getSubCorporates = async ({
    itemsPerPage,
    page,
    status,
    searchText,
}: SubCorporateQueryParams) => {
    try {
        const resp: SuccessGenericResponse<allSubCorporatesResponse> = await ApiClient.get(
            `user/sub-corporate/list`,
            {
                params: {
                    page,
                    itemsPerPage,
                    status,
                    searchText,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const validateCreateSubCorporate = async (payload: FormValues) => {
    try {
        const res: SuccessGenericResponse<{}> = await ApiClient.post(
            `user/sub-corporate/validate`,
            payload
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const createSubCorporate = async (payload: FormValues & { services: serviceType[] }) => {
    try {
        const payloadWithURL = {
            ...payload,
            baseUrl: FRONTEND_BASE_URL,
        };
        const res: SuccessGenericResponse<{}> = await ApiClient.post(
            `user/sub-corporate`,
            payloadWithURL
        );
        return res;
    } catch (error) {
        return false;
    }
};

export const updateSubCorporate = async (payload: updateAccessPayload) => {
    try {
        const { services, subUserId } = payload;
        const res: SuccessGenericResponse<{}> = await ApiClient.put(
            `user/sub-corporate/${subUserId}`,
            { services }
        );
        return res;
    } catch (error) {
        return false;
    }
};

/**
 * Change a member's assigned role. Separate from updateSubCorporate — that one owns the service-access grid
 * and is shared with Settings → User Management; sending both from one function would let a role change
 * silently overwrite a member's services.
 *
 * The server validates the role against its presets and refuses a self-role-change, so a 403 here is a real
 * answer rather than a bug.
 */
export interface SubCorporateMemberEdit {
    name?: string;
    mobileNo?: string;
    role?: string;
}

/**
 * Deliberately does NOT accept `email`, even though the server's allow-list permits it: a sub-user's email is
 * their LOGIN username (`createSubCorporate` sets `username: req.body.email`), and this update writes only the
 * subCorporateUsers row — never the credential. Sending it would change the address shown everywhere while
 * leaving the account still signing in with the old one.
 */
export const updateSubCorporateRole = async (
    subUserId: number,
    changes: SubCorporateMemberEdit
) => {
    try {
        const res: SuccessGenericResponse<{}> = await ApiClient.put(
            `user/sub-corporate/${subUserId}`,
            changes
        );
        return res;
    } catch (error) {
        return false;
    }
};

export const deleteSubCorporate = async (subUserId: number) => {
    try {
        const res: SuccessGenericResponse<{}> = await ApiClient.delete(
            `user/sub-corporate/${subUserId}`
        );
        return res;
    } catch (error) {
        return false;
    }
};

export const chagneStatusSubCorporate = async (payload: { subUserId: number; status: string }) => {
    try {
        const { status, subUserId } = payload;

        const res: SuccessGenericResponse<{}> = await ApiClient.patch(
            `user/sub-corporate/${subUserId}`,
            { status }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const resendInvitation = async (subUserId: number) => {
    try {
        // Encode the FRONTEND_BASE_URL using Base64 encoding
        const encodedUrl = btoa(FRONTEND_BASE_URL);

        const res: SuccessGenericResponse<{}> = await ApiClient.get(
            `user/sub-corporate/resend/${subUserId}?baseUrl=${encodedUrl}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
