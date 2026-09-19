import React, { useState } from 'react';

import { Col, Flex, Form, Row, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

import indianFlag from '@assets/svg/indianFlag.svg';
import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { DEFAULT_SUB_CORPORATE_ROLE, SUB_CORPORATE_ROLE_OPTIONS } from '@utils/subCorporateRoles';

import useCrud from '../../hooks/user_management/useCrud';
import { subCorporateSchema } from '../../schema';

interface modalProps {
    open: boolean;
    handleCancel: () => void;
    reloadTable: () => void;
}

const UserModal = ({ open, handleCancel, reloadTable }: modalProps) => {
    const {
        validateBeforeCreateSubUser,
        createSubUser,
        corporateServices,
        isInitialSubmit,
        isLoading,
        setIsInitialSubmit,
    } = useCrud({
        reloadTable,
        handleCancel,
    });

    const [allServicesChecked, setAllServicesChecked] = useState(false);

    const handleAllServicesChange = (e: CheckboxChangeEvent, setFieldValue: any) => {
        const isChecked = e.target.checked;
        setAllServicesChecked(isChecked);
        corporateServices.forEach(service => {
            setFieldValue(`services.${service}`, isChecked);
        });
    };

    return (
        <CustomModalWithForm
            modalTitle="Invite User"
            open={open}
            handleCancel={isInitialSubmit ? handleCancel : () => setIsInitialSubmit(true)}
            initialValues={{
                name: '',
                email: '',
                confirmemail: '',
                mobileNo: '',
                // Least privilege by default — granting admin authority must be a deliberate selection.
                role: DEFAULT_SUB_CORPORATE_ROLE,
                services: {},
            }}
            handleFormSubmit={isInitialSubmit ? validateBeforeCreateSubUser : createSubUser}
            validationSchema={subCorporateSchema}
            isLoading={isLoading}
            firstBtnTxt={isInitialSubmit ? 'Next' : 'Submit'}
            secondBtnTxt={isInitialSubmit ? 'Cancel' : 'Go back'}
            resetFormWhenClose={false}
        >
            {({ setFieldValue, values }) => (
                <Flex vertical className=" w-full">
                    <Form layout="vertical">
                        {isInitialSubmit ? (
                            <>
                                <TextInput
                                    name="name"
                                    label="Name"
                                    type="text"
                                    placeholder="Enter employee name"
                                    classes="rounded-sm"
                                    isRequired
                                    maxLength={50}
                                    allowAlphabetsAndSpaceOnly
                                />
                                <SelectInput
                                    name="role"
                                    label="Role"
                                    placeholder="Select a role"
                                    classes="rounded-sm"
                                    isRequired
                                    options={SUB_CORPORATE_ROLE_OPTIONS}
                                    showToolTip
                                    tooltipText="Admin can manage the company's cards, members and wallet. Employee can manage only their own card."
                                />
                                <TextInput
                                    name="mobileNo"
                                    label="Mobile Number"
                                    type="text"
                                    placeholder="Enter mobile number"
                                    classes="rounded-sm"
                                    maxLength={10}
                                    allowNumbersOnly
                                    isRequired
                                    prefix={
                                        <Flex
                                            align="center"
                                            gap={6}
                                            className="h-full border-e me-2 cursor-not-allowed"
                                        >
                                            <img src={indianFlag} alt="" />
                                            <p>+91</p>
                                        </Flex>
                                    }
                                />
                                <TextInput
                                    name="email"
                                    label="Email ID"
                                    type="text"
                                    placeholder="Enter email ID"
                                    classes="rounded-sm"
                                    isRequired
                                    maxLength={60}
                                />
                                <TextInput
                                    name="confirmemail"
                                    label="Confirm Email"
                                    type="text"
                                    placeholder="Confirm your email ID"
                                    classes="rounded-sm"
                                    isRequired
                                    maxLength={60}
                                    disablePaste
                                />
                            </>
                        ) : (
                            <Flex vertical>
                                <Typography.Text className="text-base font-medium mb-8">
                                    Select Services
                                </Typography.Text>
                                <Row className="mt-3">
                                    <Col span={24}>
                                        <CheckboxInput
                                            name="all"
                                            checked={allServicesChecked}
                                            onChange={e =>
                                                handleAllServicesChange(e, setFieldValue)
                                            }
                                        >
                                            Enable All Services
                                        </CheckboxInput>
                                    </Col>

                                    {corporateServices.map((item, i) => (
                                        <Col span={12} key={i}>
                                            <CheckboxInput
                                                name={item}
                                                onChange={e =>
                                                    setFieldValue(
                                                        `services.${item}`,
                                                        e.target.checked
                                                    )
                                                }
                                                checked={values.services[item]}
                                            >
                                                {item}
                                            </CheckboxInput>
                                        </Col>
                                    ))}
                                </Row>
                            </Flex>
                        )}
                    </Form>
                </Flex>
            )}
        </CustomModalWithForm>
    );
};

export default UserModal;
