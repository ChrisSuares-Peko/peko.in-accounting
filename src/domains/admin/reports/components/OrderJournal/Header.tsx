import { SearchOutlined, SwapRightOutlined } from '@ant-design/icons';
import { DatePicker, Flex, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';

import useScreenSize from '@src/hooks/useScreenSize';

type Props = {
    handleSearch: (e: any) => void;
    searchText: string;
    setSearchText: (e: any) => void;
    handleCategoryFilters: (e: any) => void;
    handleDateChange: (dates: any, dateStrings: any) => void;
    handleFromChange: (dates: any, dateStrings: any) => void;
    handleToChange: (dates: any, dateStrings: any) => void;
    from: string;
    to: string;
};

const disabledDate = (current: any) => current && current > dayjs().endOf('day');
const dateFormat = 'YYYY-MM-DD';

const journalStatusOptions = [
    { label: 'All', value: '' },
    { label: 'Success', value: 'success' },
    { label: 'Failed', value: 'failed' },
    { label: 'Pending', value: 'pending' },
];

const Header = ({
    searchText,
    setSearchText,
    handleSearch,
    from,
    to,
    handleCategoryFilters,
    handleDateChange,
    handleFromChange,
    handleToChange,
}: Props) => {
    const { xs } = useScreenSize();
    return (
        <Row justify="end" className="w-full gap-5">
            <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto">
                {xs ? (
                    <Flex className="w-full sm:w-fit" justify="space-between" align="center">
                        <DatePicker
                            onChange={handleFromChange}
                            format={dateFormat}
                            defaultValue={dayjs(from, dateFormat)}
                            disabledDate={disabledDate}
                        />
                        <SwapRightOutlined />
                        <DatePicker
                            onChange={handleToChange}
                            format={dateFormat}
                            defaultValue={dayjs(to, dateFormat)}
                            disabledDate={disabledDate}
                        />
                    </Flex>
                ) : (
                    <DatePicker.RangePicker
                        onChange={handleDateChange}
                        format={dateFormat}
                        value={[dayjs(from, dateFormat), dayjs(to, dateFormat)]}
                        className="w-fit"
                        disabledDate={disabledDate}
                    />
                )}

                <Select
                    defaultValue=""
                    className="min-w-32"
                    options={journalStatusOptions}
                    onChange={e => handleCategoryFilters(e)}
                />
                <Input
                    value={searchText}
                    placeholder="Search"
                    suffix={<SearchOutlined />}
                    onChange={handleSearch}
                    allowClear
                    type="text"
                    className="w-fit"
                    variant="outlined"
                    maxLength={100}
                />
            </Flex>
        </Row>
    );
};
export default Header;
