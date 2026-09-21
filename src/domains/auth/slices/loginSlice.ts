import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RoleName, UserRole } from '@customtypes/general';

interface LoginState {
    token: string;
    refreshToken: string;
    sessionId: string;
    isAuthenticated?: boolean;
    role: string;
    id: number;
    username: string;
    roleName: string;
    redirectUrl: string;
    packageName: string;
    acs_user_id: string;
    corporateId?: any;
    subCorporateId?: number | null;
    subCorporateRole?: string | null;
    activeSubRole?: string | null;
    subCorporateUsername?: string;
    showPrivacyPolicyModal: boolean;
    // Populated only for a switched-to (or logged-in) employee identity.
    employeeId?: string;
    userAccessService?: any;
    email?: string;
    redirectURI?: string;
    name?: string;
    contactPersonName?: string;
    mobileNo?: string;
    service?: string;
    oauth_refreshToken?: string;
    sessionUUID?: string;
    autoLogin?: boolean;
}

// Login flow removed for this prototype (see AuthGuard/CorporateAccessGuard/router
// changes) — the app always boots as an authenticated Corporate user instead of
// gating on a real session. There's deliberately no real token: useUserInfo and
// ApiClient's interceptors treat a missing token as "skip network auth" rather than
// a session-expiry, so this doesn't bounce through /session-expired either.
//
// This is the SINGLE source of truth for the mock identity — every other slice that
// needs display/identity fields (userSlice's `user`) imports and derives from this
// object instead of hardcoding its own. Don't add a second mock elsewhere.
//
// Role notes (see the Part 1 audit for the full picture — this codebase has three
// separate role vocabularies, not one):
//   - `role` MUST stay UserRole.CORPORATE ('corporate'). It's compared against
//     UserRole everywhere routing/sidebar decisions are made (CorporateUserGuard,
//     useRootPath, SidebarData's generateCorporateData/-System-/-EmployeeData
//     dispatch) — anything else (including RoleName.ADMIN, which is a DIFFERENT
//     portal: Peko's internal staff backoffice at /admin/*, not "more access" here)
//     leaves the sidebar-generation switch matching nothing and the sidebar empty.
//   - `roleName` only needs to NOT be the literal string 'corporate sub user' (the
//     one other tier this app actually checks, in ~20 places) to count as the
//     primary/full-access corporate user — RoleName.CORPORATE satisfies that and is
//     also the exact string the header displays as this user's role label.
//   - The Corporate Cards module's own Admin/Employee vocabulary (subCorporateRoles.ts)
//     is derived from subCorporateId/subCorporateRole being unset, which we already
//     satisfy below — it resolves to "account owner" (full access) from these same
//     fields, no separate mock needed there.
//
// Exported (not just used as this slice's initialState) because `auth` is a
// persisted key (see store.ts's persistConfig.whitelist): a browser that already
// has an old `auth` value sitting in localStorage — e.g. from testing before this
// change, with isAuthenticated: false or some other role — would have that stale
// value rehydrated straight over this initialState on load, silently undoing it.
// store.ts's persistConfig.migrate imports this same object and forces `auth` to
// it on every rehydration so that can't happen.
export const MOCK_AUTHENTICATED_USER: LoginState = {
    token: '',
    refreshToken: '',
    sessionId: '',
    isAuthenticated: true,
    role: UserRole.CORPORATE,
    id: 1,
    username: 'chris.suares',
    name: 'Chris Suares',
    contactPersonName: 'Chris Suares',
    email: 'chris.suares@example.com',
    roleName: RoleName.CORPORATE,
    redirectUrl: '',
    packageName: '',
    acs_user_id: '',
    corporateId: 1,
    subCorporateId: 0,
    subCorporateRole: null,
    activeSubRole: null,
    showPrivacyPolicyModal: false,
};

const initialState: LoginState = MOCK_AUTHENTICATED_USER;

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<Partial<LoginState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
        setRedirectUrl: (state, action: PayloadAction<string>) => {
            state.redirectUrl = action.payload;
            return state;
        },
        setPrivacyModalVisible: (state, action: PayloadAction<boolean>) => {
            state.showPrivacyPolicyModal = action.payload;
        },
        setLogout: state => {
            state = initialState;
            return state;
        },
    },
});

export const { loginSuccess, setLogout, setRedirectUrl, setPrivacyModalVisible } =
    loginSlice.actions;

export default loginSlice.reducer;
