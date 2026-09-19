import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';

import { getSwitchRoleState } from '../../api/user/switchRoleApi';
import { useActiveRole } from '../../hooks/user/useActiveRole';

vi.mock('../../api/user/switchRoleApi', () => ({
    getSwitchRoleState: vi.fn(),
    switchRole: vi.fn(),
}));

const mockDispatch = vi.fn();
let authState: Record<string, unknown> = {};

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: () => mockDispatch,
    useAppSelector: (fn: (s: unknown) => unknown) => fn({ reducer: { auth: authState } }),
}));

const owner = {
    role: 'corporate',
    roleName: 'corporate',
    subCorporateId: 0,
    subCorporateRole: null,
    activeSubRole: null,
};
const adminMember = {
    role: 'corporate',
    roleName: 'corporate sub user',
    subCorporateId: 99,
    subCorporateRole: 'Admin',
    activeSubRole: null,
};
const employeeMember = { ...adminMember, subCorporateRole: 'Employee' };

beforeEach(() => {
    vi.clearAllMocks();
    // Every case below asserts what the UI offers BEFORE (or without) a server answer.
    (getSwitchRoleState as unknown as Mock).mockResolvedValue(false);
});

describe('useActiveRole — who is offered a second mode', () => {
    it('offers both modes to a member invited as Admin, without waiting for the server', () => {
        authState = adminMember;

        const { result } = renderHook(() => useActiveRole());

        expect(result.current.modes).toEqual(['Admin', 'Employee']);
        expect(result.current.canSwitch).toBe(true);
    });

    it('offers nothing to a member whose role is Employee', () => {
        authState = employeeMember;

        const { result } = renderHook(() => useActiveRole());

        expect(result.current.modes).toEqual([]);
        expect(result.current.canSwitch).toBe(false);
    });

    it('offers both modes to the account owner', () => {
        authState = owner;

        const { result } = renderHook(() => useActiveRole());

        expect(result.current.modes).toEqual(['Admin', 'Employee']);
    });

    it('offers nothing to a system user', () => {
        authState = {
            role: 'system_user',
            roleName: 'system user',
            subCorporateId: 0,
            subCorporateRole: null,
        };

        const { result } = renderHook(() => useActiveRole());

        expect(result.current.modes).toEqual([]);
    });

    // Fails closed exactly as the server's resolveSubCorporateRole does — only an exact 'Admin' counts.
    it.each([['admin'], ['ADMIN'], ['Accountant'], ['']])(
        'treats the legacy role %s as Employee',
        subCorporateRole => {
            authState = { ...adminMember, subCorporateRole };

            const { result } = renderHook(() => useActiveRole());

            expect(result.current.modes).toEqual([]);
        }
    );

    // THE regression: /api/v1/user is rate-limited to 25 requests per 15 minutes and this fires on every
    // header mount, so a 429 used to blank `modes` and silently remove the switcher from a real Admin.
    it('keeps the switcher when the server call fails', async () => {
        authState = adminMember;
        (getSwitchRoleState as unknown as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useActiveRole());

        await waitFor(() => expect(getSwitchRoleState).toHaveBeenCalled());
        expect(result.current.modes).toEqual(['Admin', 'Employee']);
    });

    // The server remains authoritative: if it says the member no longer has a second mode, that wins.
    it('lets a successful server answer override the local guess', async () => {
        authState = adminMember;
        (getSwitchRoleState as unknown as Mock).mockResolvedValue({
            data: {
                modes: [],
                assignedRole: 'Employee',
                activeRole: 'Employee',
                needsProfile: false,
            },
        });

        const { result } = renderHook(() => useActiveRole());

        await waitFor(() => expect(result.current.modes).toEqual([]));
    });
});

// Offering Admin to an Employee is the one mistake this must never make. `role` is 'corporate' for members
// as well as the owner, so identifying the owner by "corporate with no subCorporateId" mistook any Employee
// whose id had not been restored into Redux for the account holder, and handed them the Admin option.
describe('useActiveRole — an Employee is never offered Admin', () => {
    it.each([
        ['no subCorporateId', { roleName: 'corporate sub user', subCorporateId: 0 }],
        ['a null subCorporateId', { roleName: 'corporate sub user', subCorporateId: null }],
        ['no roleName either, only the role itself', { roleName: '', subCorporateId: 0 }],
    ])('offers nothing to an Employee with %s', (_label, over) => {
        authState = { ...employeeMember, ...over };

        const { result } = renderHook(() => useActiveRole());

        expect(result.current.modes).toEqual([]);
        expect(result.current.canSwitch).toBe(false);
    });

    // The member signal must not swing the other way either: a sub-user marked Admin still gets both.
    it('still offers both to an Admin member whose subCorporateId is missing', () => {
        authState = { ...adminMember, subCorporateId: 0 };

        const { result } = renderHook(() => useActiveRole());

        expect(result.current.modes).toEqual(['Admin', 'Employee']);
    });
});
