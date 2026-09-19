import { beforeEach, describe, expect, it, vi } from 'vitest';

import { setPrivacyModalVisible } from '@src/domains/auth/slices/loginSlice';
import { showToast } from '@src/slices/apiSlice';

const dispatch = vi.fn();
const mockHandleLogout = vi.fn();

vi.mock('@store/store', () => ({
    store: { dispatch: (action: unknown) => dispatch(action), getState: () => ({}) },
}));
vi.mock('../handleLogout', () => ({ handleLogout: () => mockHandleLogout() }));
vi.mock('../refreshToken', () => ({ updateRefreshToken: vi.fn() }));

// eslint-disable-next-line import/first
import { ApiClient } from '../config';
// eslint-disable-next-line import/first
import { PERMISSION_DENIED_MESSAGE, RESPONSE_CODE } from '../responseCodes';

/**
 * The response interceptor is a single app-wide branch on `responseCode`. Every screen inherits it, so the
 * mapping is asserted here rather than being re-tested per feature.
 */
const onRejected = (
    ApiClient.interceptors.response as unknown as {
        handlers: { rejected: (error: unknown) => Promise<unknown> }[];
    }
).handlers[0].rejected;

const reject = async (data: unknown) => {
    const error = { response: { data } };
    await expect(onRejected(error)).rejects.toBe(error);
    return error;
};

beforeEach(() => {
    vi.clearAllMocks();
});

describe('ApiClient response interceptor', () => {
    it('logs out on an invalid token', async () => {
        await reject({ responseCode: RESPONSE_CODE.INVALID_TOKEN, message: 'nope' });

        expect(mockHandleLogout).toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
    });

    it('opens the privacy modal for the privacy-policy code', async () => {
        await reject({ responseCode: RESPONSE_CODE.PRIVACY_POLICY, message: 'accept it' });

        expect(dispatch).toHaveBeenCalledWith(setPrivacyModalVisible(true));
    });

    it('stays silent for the caller-handled code', async () => {
        await reject({ responseCode: RESPONSE_CODE.SILENT, message: 'handled upstream' });

        expect(dispatch).not.toHaveBeenCalled();
        expect(mockHandleLogout).not.toHaveBeenCalled();
    });

    // A permission refusal is not a fault: it gets its own code so the user is told they lack rights instead of
    // reading "Something went wrong" and retrying an action that can never succeed.
    describe('permission refusals (007)', () => {
        it('surfaces the server reason as a warning, not an error', async () => {
            await reject({
                responseCode: RESPONSE_CODE.FORBIDDEN,
                message: 'Your own requests are decided by your corporate admin.',
            });

            expect(dispatch).toHaveBeenCalledWith(
                showToast({
                    description: 'Your own requests are decided by your corporate admin.',
                    variant: 'warning',
                })
            );
        });

        it('falls back to the generic permission line when the server sent no message', async () => {
            await reject({ responseCode: RESPONSE_CODE.FORBIDDEN, message: '' });

            expect(dispatch).toHaveBeenCalledWith(
                showToast({ description: PERMISSION_DENIED_MESSAGE, variant: 'warning' })
            );
        });

        it('does not log the user out or redirect', async () => {
            await reject({ responseCode: RESPONSE_CODE.FORBIDDEN, message: 'no' });

            expect(mockHandleLogout).not.toHaveBeenCalled();
        });
    });

    it('toasts the server message as an error for any other code', async () => {
        await reject({ responseCode: '001', message: 'Card limit exceeded.' });

        expect(dispatch).toHaveBeenCalledWith(
            showToast({ description: 'Card limit exceeded.', variant: 'error' })
        );
    });

    // A network failure or a cancelled request carries no payload. Reading `data.message` used to throw here,
    // replacing the caller's error with a TypeError; it must pass the original error straight through.
    it('passes an error with no response payload through untouched', async () => {
        const error = { message: 'Network Error' };

        await expect(onRejected(error)).rejects.toBe(error);
        expect(dispatch).not.toHaveBeenCalled();
        expect(mockHandleLogout).not.toHaveBeenCalled();
    });
});
