import React from 'react';

import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Typography } from 'antd';

const LicenseDetails = ({ item }: any) => {
    const capitalizeFirstLetter = (text: any): string => {
    if (typeof text === 'string') {
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return text; 
};
    // preserveCase skips title-casing for identifiers like the DL number ("JK03..." must not become "Jk03...");
    // justify-end keeps every value aligned with the last line of wrapping neighbours (e.g. Address).
    const displayValue = item?.preserveCase ? item.value : capitalizeFirstLetter(item.value);
    return (
        <Col xs={12} xl={6}>
            <Flex vertical gap={5} className='justify-end h-full'>
                {item?.isUpload ? (
                    <Button icon={<UploadOutlined />} type="default" size="small" className="w-32">
                        {displayValue}
                    </Button>
                ) : (
                    <Typography.Text className="text-base font-medium">
                        {displayValue}
                    </Typography.Text>
                )}
                <Typography.Text type="secondary" className="mt-1 text-xs">
                    {item.label}
                </Typography.Text>
            </Flex>
        </Col>
    );
};

export default LicenseDetails;
