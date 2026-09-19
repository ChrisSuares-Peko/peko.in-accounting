import { Tag } from 'antd';

import { ENV } from '@src/config-global';

interface NonLccTagProps {
    lcc?: boolean;
    className?: string;
}

function NonLccTag({ lcc, className = '' }: NonLccTagProps) {
    if (lcc || ENV === 'production') {
        return null;
    }

    return (
        <Tag color="orange" bordered={false} className={`m-0 text-[10px] font-medium ${className}`}>
            NON-LCC
        </Tag>
    );
}

export default NonLccTag;
