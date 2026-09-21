import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { ServicesListResponse } from '@customtypes/general';
import { staticCorporateServiceAccess } from '@utils/staticCorporateServiceAccess';

interface ApiState {
    services: ServicesListResponse | null;
}

// Login flow removed for this prototype: `services.data` is normally populated by
// the real getUserServices() API call after login, which never fires without a
// real session (see useUserInfo). Guards like CorporateAccessGuard and RoleGuard key
// their access checks off this exact shape (ServicesListResponse['data']), so start
// with every service already marked hasAccess: true instead of null — the existing
// staticCorporateServiceAccess mock (previously unused) is already built for this.
// This slice isn't persisted, so this initialState applies on every load.
const initialState: ApiState = {
    services: { data: staticCorporateServiceAccess },
};

export const userSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        setServices: (state, action: PayloadAction<Partial<ApiState>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
    },
});

export const { setServices } = userSlice.actions;

export default userSlice.reducer;
