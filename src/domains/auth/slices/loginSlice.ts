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
const initialState: LoginState = {
    token: '',
    refreshToken: '',
    sessionId: '',
    isAuthenticated: true,
    role: UserRole.CORPORATE,
    id: 0,
    username: 'prototype-user',
    name: 'Prototype User',
    email: 'prototype@peko.in',
    roleName: RoleName.CORPORATE,
    redirectUrl: '',
    packageName: '',
    acs_user_id: '',
    corporateId: 0,
    subCorporateId: 0,
    subCorporateRole: null,
    activeSubRole: null,
    showPrivacyPolicyModal: false,
};

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
