import { useEffect } from 'react';

import { Button, Result, Row, Typography } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const PaymentFailure = () => {
    const location = useLocation();

    useEffect(() => {
        // Seeded during checkout (same sessionStorage key the success page reads) — it's left
        // untouched on failure since the success page only clears it inside its own
        // status === 'success' branch, so it's still here to read.
        const paymentResultRaw = sessionStorage.getItem('paymentResult');
        if (paymentResultRaw && typeof Moengage?.track_event === 'function') {
            try {
                const paymentResult = JSON.parse(paymentResultRaw);
                if (paymentResult.serviceName) {
                    Moengage.track_event(`${paymentResult.serviceName}_payment_result`, {
                        status: 'failed',
                        total_amount: paymentResult.total_amount,
                        coupon_code_used: paymentResult.coupon_code_used,
                    });
                }
            } catch (_) { /* ignore parse errors */ }
        }
        sessionStorage.removeItem('paymentResult');
    }, []);

    return (
        <Row className="flex justify-center items-center h-full">
            <Result
                className="md:w-3/6 p-0"
                status="error"
                title="Your transaction has failed"
                subTitle={
                    <Typography.Text className="text-sm">
                        We regret to inform you that your attempt to payment was unsuccessful. If
                        any funds are deducted from your account, please be assured that the refund
                        will be processed within seven working days.
                    </Typography.Text>
                }
                extra={
                    <Link to="/payments" state={{ from: location }}>
                        <Button type="primary" danger className="px-6">
                            Try Again
                        </Button>
                    </Link>
                }
            />
        </Row>
    );
};

export default PaymentFailure;
