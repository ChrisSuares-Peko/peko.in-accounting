import { QuestionCircleOutlined, UserOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { IoBusinessOutline, IoLogOutOutline, IoPersonOutline } from 'react-icons/io5';

import SettingIcon from '@assets/icons/Settings.svg';
import LogoutIcon from '@assets/svg/Logout.svg';
import { PARTNER_EXIT_LABEL } from '@src/config-global';
import { shouldReturnToPartner } from '@src/services/ssoEntry';

// `hasEmployeeAccess` is true only when this credential also has a linked
// employee identity (via self-as-employee linking) to switch into.
export const getCorporateDropdownItems = (
    hasEmployeeAccess: boolean,
    autoLogin?: boolean
): MenuProps['items'] => [
    ...(hasEmployeeAccess
        ? [
              { key: 'switch-employee', label: 'Employee Account', icon: <IoBusinessOutline /> },
              { type: 'divider' as const },
          ]
        : []),
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    {
        key: 'settings',
        label: 'Settings',
        icon: <img src={SettingIcon} alt="" style={{ width: 14, height: 14 }} />,
    },
    { key: 'help', label: 'Help center', icon: <QuestionCircleOutlined /> },
    { type: 'divider' as const },
    {
        key: 'logout',
        label: shouldReturnToPartner(autoLogin) ? PARTNER_EXIT_LABEL : 'Log out',
        icon: <img src={LogoutIcon} alt="" style={{ width: 14, height: 14 }} />,
    },
];

// `hasCorporateAccess` is true only when this credential also has a linked
// corporate identity to switch into.
export const getEmployeeDropdownItems = (hasCorporateAccess: boolean): MenuProps['items'] => [
    ...(hasCorporateAccess
        ? [
              { key: 'switch-corporate', label: 'Corporate Account', icon: <IoPersonOutline /> },
              { type: 'divider' as const },
          ]
        : []),
    { key: 'profile', label: 'Profile', icon: <IoBusinessOutline /> },
    { type: 'divider' as const },
    { key: 'signout', label: 'Sign out', danger: true, icon: <IoLogOutOutline /> },
];

export const systemDropdownItems: MenuProps['items'] = [
    { key: 'profile', label: 'Profile', icon: <UserOutlined /> },
    { type: 'divider' as const },
    {
        key: 'logout',
        label: 'Log out',
        icon: <img src={LogoutIcon} alt="" style={{ width: 14, height: 14 }} />,
    },
];
