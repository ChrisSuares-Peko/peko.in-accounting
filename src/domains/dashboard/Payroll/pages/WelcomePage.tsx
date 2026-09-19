import React, { useEffect, useState } from 'react';

import { Steps, Flex, Typography } from 'antd';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import WelcomeAddEmployee from '../components/WelcomePage/WelcomeAddEmployee';
import WelcomeCompanyDetailsForm from '../components/WelcomePage/WelcomeCompanyDetailsForm';
import WelcomeDeductionComponents from '../components/WelcomePage/WelcomeDeductionComponents';
import WelcomePayrollCycleForm from '../components/WelcomePage/WelcomePayrollCycleForm';
import WelcomeSalaryComponents from '../components/WelcomePage/WelcomeSalaryComponents';
import WelcomeSalaryRolloutSetup from '../components/WelcomePage/WelcomeSalaryRolloutSetup';
import { setPayrollProgress } from '../slices/payrollAuth';

interface WelcomePageProps {
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    isSalaryRolloutActive: boolean;
}

const WelcomePage = ({ setRefresh, isSalaryRolloutActive }: WelcomePageProps) => {
    const dispatch = useAppDispatch();
    const { onBoardStatus } = useAppSelector(state => state.reducer.payrollAuth);
    const [current, setCurrent] = useState(Number(onBoardStatus ?? 0));

    // The /progress fetch that populates onBoardStatus resolves after this component's
    // first render, so a mount can start on stale (lower) data. Adopt the fetched value
    // once it lands, but never regress past a step the user already reached locally.
    useEffect(() => {
        setCurrent(prev => Math.max(prev, Number(onBoardStatus ?? 0)));
    }, [onBoardStatus]);

    // Mirror the local step back to redux immediately so a remount (e.g. returning from
    // the standalone Add Employee page) has the right value even before the next
    // /progress fetch resolves.
    useEffect(() => {
        dispatch(setPayrollProgress({ onBoardStatus: current }));
    }, [current, dispatch]);

    const steps = [
        {
            title: 'Company Profile',
            content: (
                <WelcomeCompanyDetailsForm setActiveTabKey={setCurrent} setRefresh={setRefresh} />
            ),
            subtitleText:
                'By default, we have configured your HR and leave settings in compliance with Indian labor laws. You can retain these settings or customize them to align with your company policies.',
        },
        {
            title: 'Payroll Cycle',
            content: <WelcomePayrollCycleForm setActiveTabKey={setCurrent} />,
            subtitleText: "Select your payroll cycle to align with your company's schedule",
        },
        {
            title: 'Salary Components',
            content: <WelcomeSalaryComponents setActiveTabKey={setCurrent} />,
            subtitleText:
                'Configure salary components that will be included in payroll processing. You can edit the defaults or add new components specific to your company.',
        },
        {
            title: 'Deduction Components',
            content: <WelcomeDeductionComponents setActiveTabKey={setCurrent} />,
            subtitleText:
                'Add and manage deductions such as Provident Fund, ESI, Professional Tax, or company-specific deductions.',
        },
        {
            title: 'Add Employees',
            content: (
                <WelcomeAddEmployee
                    setActiveTabKey={setCurrent}
                    setRefresh={setRefresh}
                    isSalaryRolloutActive={isSalaryRolloutActive}
                />
            ),
            subtitleText:
                'By default, we have configured your HR and leave settings in compliance with Indian labor laws. You can retain these settings or customize them to align with your company policies.',
        },
        ...(isSalaryRolloutActive
            ? []
            : [
                  {
                      title: 'Salary Rollout Setup',
                      content: (
                          <WelcomeSalaryRolloutSetup
                              setActiveTabKey={setCurrent}
                              setRefresh={setRefresh}
                          />
                      ),
                      subtitleText:
                          'Set up your salary rollout account to start disbursing employee salaries securely.',
                  },
              ]),
    ];
    const safeCurrent = Math.min(Number(current), steps.length - 1);
    const CurrentComponent = steps[safeCurrent].content;

    return (
        <>
            <Flex vertical justify="center" align="center" gap={25}>
                <Typography.Text className="text-[#000000] text-[1.75rem] font-medium text-center">
                    Let’s help you to setup your HR Dashboard
                </Typography.Text>
                <Typography.Text className="text-[#595959] text-[1rem] text-center w-2/3">
                    {steps[safeCurrent].subtitleText}
                </Typography.Text>
            </Flex>
            <Flex justify="center">
                <Steps current={safeCurrent} className="my-6 w-[90%] ">
                    {steps.map(item => (
                        <Steps.Step key={item.title} title={item.title} />
                    ))}
                </Steps>
            </Flex>
            <div className="step-content">{CurrentComponent}</div>
        </>
    );
};

export default WelcomePage;
