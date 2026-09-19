import React from 'react';

import { Card, Col, Flex, Typography } from 'antd';

interface PassengerProps {
    passenger: any;
    index: number;
}

const GuestCard = ({ passenger, index }: PassengerProps) => (
    <Col key={index} xs={24} sm={24} md={12}>
        <Card bordered style={{ background: '#F9F9F9', borderRadius: '0.75rem' }}>
            <Flex>
                <Typography.Text strong>{`Guest ${index + 1}`}</Typography.Text>
            </Flex>
            <Flex justify="space-between" className="mt-2">
                <Flex vertical gap={7}>
                    <Typography.Text className="text-textGreyColor xs:text-xs md:text-sm">
                        Name{' '}
                    </Typography.Text>
                    <Typography.Text strong className="line-clamp-1 xs:text-xs md:text-sm">
                        {passenger.FirstName} {passenger.LastName}
                    </Typography.Text>
                </Flex>
                <Flex vertical gap={7}>
                    <Typography.Text className="text-textGreyColor xs:text-xs md:text-sm">
                        Date of Birth{' '}
                    </Typography.Text>
                    <Typography.Text strong className="xs:line-clamp-1 xs:text-xs md:text-sm">
                        {passenger.dob || 'N/A'}
                    </Typography.Text>
                </Flex>
            </Flex>
            <Flex justify="space-between" className="mt-3">
                <Flex vertical gap={7}>
                    <Typography.Text className="text-textGreyColor xs:text-xs md:text-sm">
                        Mobile Number{' '}
                    </Typography.Text>
                    <Typography.Text strong className="xs:text-xs md:text-sm">
                        {passenger.Phoneno || 'N/A'}
                    </Typography.Text>
                </Flex>
                <Flex vertical gap={7}>
                    <Typography.Text className="text-textGreyColor xs:text-xs md:text-sm">
                        Email ID{' '}
                    </Typography.Text>
                    <Typography.Text strong className="line-clamp-1 xs:text-xs md:text-sm">
                        {passenger.Email || 'N/A'}
                    </Typography.Text>
                </Flex>
            </Flex>
        </Card>
    </Col>
);

export default GuestCard;
