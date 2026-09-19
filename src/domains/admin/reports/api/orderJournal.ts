import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { getData } from '../types/index';
import {
    JournalKey,
    JournalRetryResult,
    orderJournalResponse,
    RetryJournalPayload,
    RetryLineItem,
} from '../types/orderJournal';

export const getAllData = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<orderJournalResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/order-journals`,
            {
                params: {
                    sort: payload.sort,
                    page: payload.page,
                    searchText: payload.searchText,
                    itemsPerPage: payload.itemsPerPage,
                    to: payload.to,
                    from: payload.from,
                    sortField: payload.sortField,
                    journalStatus: payload.status,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

// Resolve provider (Zoho) account IDs -> current COA account names.
export const resolveAccountNames = async (payload: UserPayload, accountIds: string[]) => {
    try {
        const resp: SuccessGenericResponse<Record<string, string>> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/order-journals/resolve-accounts`,
            { accountIds }
        );
        return resp.data;
    } catch (err) {
        return false;
    }
};

export const retryJournal = async (
    payload: UserPayload & { corporateTxnId: string; journalKey: JournalKey } & RetryJournalPayload
) => {
    try {
        const { userId, userType, corporateTxnId, journalKey, ...body } = payload;
        const resp: SuccessGenericResponse<JournalRetryResult> = await ApiClient.put(
            `${userType}/${userId}/others/order-journals/${corporateTxnId}/journal/${journalKey}/retry`,
            body
        );
        return resp.data;
    } catch (error) {
        return (error as any)?.response?.data ?? false;
    }
};

export const retryJournalLineItems = async (
    payload: UserPayload & {
        corporateTxnId: string;
        journalKey: JournalKey;
        lineItems: RetryLineItem[];
    }
) => {
    try {
        const { userId, userType, corporateTxnId, journalKey, lineItems } = payload;
        const resp: SuccessGenericResponse<JournalRetryResult> = await ApiClient.put(
            `${userType}/${userId}/others/order-journals/${corporateTxnId}/journal/${journalKey}/retry-line-items`,
            { lineItems }
        );
        return resp.data;
    } catch (error) {
        return (error as any)?.response?.data ?? false;
    }
};
