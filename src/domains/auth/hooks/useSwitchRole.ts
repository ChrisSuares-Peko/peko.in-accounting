import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { switchRole as switchRoleApi } from '../api/index';
import { loginSuccess } from '../slices/loginSlice';

// Switches the current session into another identity owned by the same
// credential (corporate <-> self-linked employee), without re-entering a password.
export default function useSwitchRole() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isSwitching, setIsSwitching] = useState(false);

    const switchRole = async (role: 'corporate' | 'user') => {
        setIsSwitching(true);
        const response = await switchRoleApi(role);
        setIsSwitching(false);
        if (!response) return false;

        dispatch(loginSuccess({ ...response, isAuthenticated: true }));
        navigate(role === 'user' ? paths.employee.home : paths.dashboard.home, { replace: true });
        return true;
    };

    return { switchRole, isSwitching };
}
