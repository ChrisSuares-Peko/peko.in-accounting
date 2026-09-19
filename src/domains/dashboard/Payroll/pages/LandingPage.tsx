
import React, { Suspense, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import ActivitySkeleton from '../components/Dashboard/ActivitySkeleton';
import { fetchDashboardData } from '../hooks/dashboardHooks/useDashboardApi';
import { useProgressApi } from '../hooks/dashboardHooks/useProgressApi';
import { setPayrollProgress } from '../slices/payrollAuth';

const WelcomePage = React.lazy(() => import('./WelcomePage'));
const Dashboard = React.lazy(() => import('./Dash'));

const LandingPage = () => {
    const { isLoading, setRefresh } = useProgressApi();
    const { progress, isSkippedDasboard, hasSalaryRolloutSetup } = useAppSelector(
        state => state.reducer.payrollAuth
    );
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();

    // Fire /dashBoard and preload the Dash chunk immediately — in parallel with /progress.
    // By the time /progress resolves and Dash mounts, data is already cached or in-flight.
    useEffect(() => {
        fetchDashboardData(id, role);
        import('./Dash');
    }, [id, role]);

    useEffect(() => {
        if (!isLoading && progress !== '100%') {
            dispatch(setPayrollProgress({ showDashboard: false }));
        }
    }, [dispatch, progress, isLoading]);

    // hasSalaryRolloutSetup reflects the NUPAY vendor's status, which can become true/false
    // independently of anything the user has done in this wizard — it must never bypass the
    // wizard on its own. Only an explicit action sets isSkippedDasboard (Continue/Skip/Activate
    // inside the wizard), or the account is a pre-existing one exempt entirely (null = this
    // account predates the field, so it never went through the wizard's own step tracking).
    const isLegacyExemptAccount = hasSalaryRolloutSetup === null;

    // Core onboarding (progress) can hit 100% before the Salary Rollout Setup step is
    // done — that step isn't tracked by /progress, so it must gate the dashboard too.
    const showDashboard = isSkippedDasboard || (progress === '100%' && isLegacyExemptAccount);

    // Inside the wizard, "already done" (true) and "legacy/exempt" (null) both mean: don't
    // make the user fill the Salary Rollout Setup form again — only an explicit `false`
    // (still pending) should show it.
    const isSalaryRolloutActive = hasSalaryRolloutSetup !== false;

    useEffect(() => {
        if (!showDashboard) {
            import('./WelcomePage');
        }
    }, [showDashboard]);

    if (isLoading && progress === '0%') {
        return <ActivitySkeleton />;
    }

    return (
        <Suspense fallback={<ActivitySkeleton />}>
            {showDashboard ? (
                <Dashboard />
            ) : (
                <WelcomePage setRefresh={setRefresh} isSalaryRolloutActive={isSalaryRolloutActive} />
            )}
        </Suspense>
    );
};

export default LandingPage;
