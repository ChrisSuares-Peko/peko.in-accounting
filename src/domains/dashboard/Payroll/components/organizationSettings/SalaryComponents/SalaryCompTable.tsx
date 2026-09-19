import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Flex, Input, Pagination, Row, Typography } from 'antd';

import GenericTable from '@components/atomic/GenericTable';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import SalaryCompModal from './SalaryCompModal';
import { useGetSalaryComponent } from '../../../hooks/OrganizationSettings/useGetCurrentSalaryCompApi';
import { useGetAllSalaryComp } from '../../../hooks/OrganizationSettings/useGetSalaryComponentApi';
import { useSalaryCompActions } from '../../../hooks/OrganizationSettings/useSalaryComponentApi';
import { filterState } from '../../../types/organizationSettings';
import useFilter from '../../../utils/general/useFilter';
import { salaryCompColumn } from '../../../utils/orgSettings/data';

interface Props {
    setActiveTabKey?: (key: any) => void;
    isWelcomePage?: any;
}
const SalaryCompTable: React.FC<Props> = ({ setActiveTabKey, isWelcomePage }) => {
    const dispatch = useAppDispatch();
    const [openSalaryCompModal, setOpenSalaryCompModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [selectedRecordData, setSelectedRecordData] = useState<any | null>(null);
    const [reloadTable, setReloadTable] = useState(false);
    const initialValues = {
        searchText: '',
        page: 1,
        limit: 10,
    };
    const [filter, setFilter] = useState<filterState>(initialValues);
    const { handlePageChange, handleSearch } = useFilter({
        setFilter,
    });
    const { data, count, tableLoading } = useGetAllSalaryComp(
        filter.page,
        filter.limit,
        filter.searchText,
        reloadTable
    );
    const { data: data2 } = useGetSalaryComponent();
    

    const calculationBasedOnMap = data2?.reduce(
        (acc, comp) => {
            acc[comp.id] = comp.componentName;
            return acc;
        },
        {} as Record<string, string>
    );
    const { deleteSalaryCompAction, isLoading: deleteLoader } = useSalaryCompActions(() =>
        setOpenConfirmationModal(false)
    );
    const handleEdit = async (selectedRowData: any) => {
        setSelectedRecordData(selectedRowData);
        setOpenSalaryCompModal(true);
    };
    const handleDelete = (selectedRowData: any) => {
        setSelectedRecordData(selectedRowData);
        setOpenConfirmationModal(true);
    };

    const handleDeleteSalaryComp = async () => {
        await deleteSalaryCompAction(selectedRecordData?.id!);
        setSelectedRecordData(null);
        setReloadTable(p => !p);
    };

    // A Balancing component (e.g. Special Allowances) is what absorbs the remainder of
    // Gross after Basic/HRA/fixed allowances — without one, an employee's earnings can
    // never be guaranteed to add up to their actual salary. Checked against data2 (the
    // org's full, unpaginated component list) rather than the paginated `data`, since a
    // Balancing row could sit on a page the user isn't currently viewing.
    const hasBalancingComponent = data2?.some(component => component.calculationType === 'BALANCING');
    const handleNext = () => {
        if (!hasBalancingComponent) {
            dispatch(
                showToast({
                    description:
                        'Add a Balancing component (e.g. Special Allowances) before continuing — it absorbs whatever remains of Gross after the other components.',
                    variant: 'error',
                })
            );
            return;
        }
        setActiveTabKey?.('3');
    };

    const isEmployeeSpecific = false;
    return (
        <Row>
            <Col span={24} className="mb-5">
                <Alert
                    type="info"
                    showIcon
                    message="Let's set up your salary components here."
                    description="These components only decide how a salary is structured — the split between Basic, HRA and allowances. They don't set anyone's pay. When you add an employee, these components appear automatically and you enter their actual salary there. Changes here apply only to newly added employees — existing employees keep their structure, editable on their profile's Salary Structure (CTC) tab."
                />
            </Col>

            <Col
                span={24}
                className={` ${isWelcomePage ? 'xs:p-4 md:p-8 border rounded-2xl  border-[#EAEAEA]' : ''}`}
            >
                {isWelcomePage ? (
                    <Flex justify="space-between" align="center" className="mb-4">
                        <Flex align="center" justify="center">
                            <Typography.Text className="font-medium text-[1.25rem]">
                                Salary Components
                            </Typography.Text>
                        </Flex>
                        <Flex>
                            <Flex>
                                <Button
                                    className=""
                                    type="primary"
                                    danger
                                    onClick={() => {
                                        setOpenSalaryCompModal(true);
                                        setSelectedRecordData(null);
                                    }}
                                >
                                    Add New Component
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                ) : (
                    <Flex justify="space-between">
                        <Col md={20}>
                            <Input
                                placeholder="Search by name"
                                suffix={<SearchOutlined />}
                                allowClear
                                onChange={e => {
                                    const value = e.target.value.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
                                    handleSearch({ ...e, target: { ...e.target, value } });
                                }}
                            />
                        </Col>
                        <Col>
                            <Flex className="justify-end">
                                <Button
                                    className=""
                                    type="primary"
                                    danger
                                    onClick={() => {
                                        setOpenSalaryCompModal(true);
                                        setSelectedRecordData(null);
                                    }}
                                >
                                    Add New Component
                                </Button>
                            </Flex>
                        </Col>
                    </Flex>
                )}

                <GenericTable
                    rowKey={record => record.id}
                    columns={salaryCompColumn(handleEdit, handleDelete, calculationBasedOnMap)?.map((x)=>{
                        if(x.key==="action"){
                            x.width = ""
                        }
                        return x
                    })}
                    dataSource={data || []}
                    loading={tableLoading}
                    pagination={false}
                />
                {count && count > 0 && (
                    <Flex className="mt-4" justify="end">
                        <Pagination
                            current={filter.page}
                            onChange={handlePageChange}
                            size="default"
                            total={count}
                        />
                    </Flex>
                )}
                {openSalaryCompModal && (
                    <SalaryCompModal
                        isEmployeeSpecific={isEmployeeSpecific}
                        open={openSalaryCompModal}
                        handleCancel={() => setOpenSalaryCompModal(false)}
                        selectedRecordData={selectedRecordData}
                        reloadTable={setReloadTable}
                    />
                )}
                <ConfirmationModal
                    isOpen={openConfirmationModal}
                    handleCancel={() => setOpenConfirmationModal(false)}
                    title="Are you sure you want to delete this salary Component?"
                    handleSubmit={handleDeleteSalaryComp}
                    isLoading={deleteLoader}
                />
            </Col>
            {isWelcomePage && (
                <Flex justify="space-between" align="center" gap={10} className="w-full mt-6">
                    <Button
                        onClick={() => setActiveTabKey && setActiveTabKey('1')}
                        className="px-8"
                    >
                        <Typography.Text className="text-textRed">Back</Typography.Text>
                    </Button>
                    <Button className="px-12" type="primary" danger onClick={handleNext}>
                        Next
                    </Button>
                </Flex>
            )}
        </Row>
    );
};

export default SalaryCompTable;
