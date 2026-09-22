import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ProductTour, UserInfoResponse, notificationListResponse } from '@customtypes/general';
import { MOCK_AUTHENTICATED_USER } from '@domains/auth/slices/loginSlice';

interface ApiState {
    user: UserInfoResponse | null;
    notifications: notificationListResponse | null;
}

// Login flow removed for this prototype: `user` is normally populated by the real
// getUserInfo() API call after login, which never fires without a real session (see
// useUserInfo). The top-bar profile/avatar (CustomHeader.tsx, MobileHeader.tsx) reads
// name/role/avatar from THIS slice, not from `auth` — so leaving this `null` (as it
// was) meant the header fell back to "Registration Pending" regardless of how
// complete the auth mock was. Derived from loginSlice's MOCK_AUTHENTICATED_USER (the
// single source of truth for the mock identity) rather than hardcoding a second,
// separate name/role here.
const initialState: ApiState = {
    user: {
        balance: '0',
        credentialId: MOCK_AUTHENTICATED_USER.id,
        role: MOCK_AUTHENTICATED_USER.role,
        // Nominally a business/company name field, but it's what CustomHeader
        // actually renders as the top-bar display name.
        companyName: MOCK_AUTHENTICATED_USER.name!,
        roleName: MOCK_AUTHENTICATED_USER.roleName,
        username: MOCK_AUTHENTICATED_USER.username,
        logo: '', // no mock image — header falls back to a first-letter avatar
        // false = "no tour pending" on both the dashboard (Home.tsx) and payroll
        // (Payroll/Dash.tsx) product tours — antd's own <Tour> component, gated by
        // this field. Previously set to `true` here on the (wrong) assumption that
        // meant "already seen"; both trigger sites actually treat any non-false
        // value as "show it", which is why the tour appeared on every load. This
        // isn't a CSS hide — {condition && <Tour .../>} means the component never
        // mounts at all when this is false.
        productTour: { dashboard: false, payroll: false } satisfies ProductTour,
        gstVerified: true,
        panVerified: true,
        contactPersonName: MOCK_AUTHENTICATED_USER.contactPersonName!,
        email: MOCK_AUTHENTICATED_USER.email!,
        mobileNo: '',
        chatId: '',
        isPekoCreditActive: true,
        isPekoCreditAvailable: true,
        pekoCredits: '0',
        accountType: 'corporate',
        isTopPlan: true,
        activeGroupPackageName: 'Enterprise',
    },
    notifications: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<Partial<ApiState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
        setNotifications: (state, action: PayloadAction<Partial<ApiState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
        resetNotificationCounter: state => {
            if (state.notifications) {
                state.notifications.count = 0;
            }
        },
        alterProductTour: (state, action: PayloadAction<Partial<ProductTour>>) => {
            if (state.user) {
                state.user.productTour = { ...state.user.productTour, ...action.payload };
            }
        },
        setGstandPanInfo: (state, action: PayloadAction<Partial<boolean>>) => {
            if (state.user) {
                state.user.gstVerified = action.payload;
                state.user.panVerified = action.payload;
            }
        },
        resetUser: state => {
            state = initialState;
            return state;
        },
        updatePekoCreditState: (
            state,
            action: PayloadAction<{ isPekoCreditActive: boolean; pekoCredits: string }>
        ) => {
            if (state.user) {
                state.user.isPekoCreditActive = action.payload.isPekoCreditActive;
                state.user.pekoCredits = action.payload.pekoCredits;
            }
        },
    },
});

export const {
    setUserInfo,
    setNotifications,
    resetUser,
    alterProductTour,
    setGstandPanInfo,
    resetNotificationCounter,
    updatePekoCreditState,
} = userSlice.actions;

export default userSlice.reducer;
