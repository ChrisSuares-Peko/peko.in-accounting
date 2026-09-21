import { Component, ErrorInfo, ReactNode } from 'react';

import { Flex, Typography } from 'antd';

const { Title, Text } = Typography;

interface AppErrorBoundaryProps {
    children: ReactNode;
}

interface AppErrorBoundaryState {
    error: Error | null;
}

// Top-level error boundary — wraps the router in App.tsx, at the same level for
// every route, so a render-time throw from ANY page shows a visible message
// instead of the whole app going blank. Has to be a class component:
// getDerivedStateFromError/componentDidCatch are still the only way to catch
// render errors in React 18 — there's no hook equivalent.
class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
    constructor(props: AppErrorBoundaryProps) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('AppErrorBoundary caught an error:', error, errorInfo.componentStack);
    }

    render() {
        const { error } = this.state;
        const { children } = this.props;

        if (error) {
            return (
                <Flex
                    vertical
                    align="center"
                    justify="center"
                    gap={8}
                    className="min-h-svh px-5 text-center"
                >
                    <Title level={4}>Something went wrong loading this page</Title>
                    <Text type="secondary">{error.message}</Text>
                </Flex>
            );
        }

        return children;
    }
}

export default AppErrorBoundary;
