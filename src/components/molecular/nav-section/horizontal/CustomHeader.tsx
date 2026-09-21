import { useEffect, useState } from 'react';

import { DownOutlined, UserOutlined } from '@ant-design/icons';
import {
    Avatar,
    Badge,
    Divider,
    Dropdown,
    Flex,
    MenuProps,
    Popover,
    Typography,
    theme,
} from 'antd';
import { IoIosClose } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';

import NotificationIcon from '@assets/icons/Notification.svg';
import pekoConnect from '@assets/svg/pekoConnect.svg';
import ClaimPekoCreditsButton from '@components/molecular/claimPekoCreditsButton';
import ChatService from '@components/molecular/freshChat/service/ChatService';
import SearchTree from '@components/molecular/searchTree/SearchTree';
import ServiceSearch from '@components/molecular/searchTree/ServiceSearch';
import UpgradePlanButton from '@components/molecular/upgradePlanButton';
import { UserRole } from '@customtypes/general';
import { getAvailableRoles } from '@domains/auth/api/index';
import useSwitchRole from '@domains/auth/hooks/useSwitchRole';
import { useCompanyNameFallback } from '@domains/dashboard/profile/hooks/useCompanyNameFallback';
import OwnerCardholderProfileModal from '@src/domains/dashboard/corporateCards/components/landingPage/modals/OwnerCardholderProfileModal';
import { useActiveRole } from '@src/domains/dashboard/corporateCards/hooks/user/useActiveRole';
import { ADMIN_ROLE, EMPLOYEE_ROLE } from '@src/domains/dashboard/corporateCards/utils/activeRole';
import { useAppSelector } from '@src/hooks/store';
import useNotificationApi from '@src/hooks/useNotificationApi';
import useSubUserLogout from '@src/hooks/useSubUserLogout';
import useUserInfo from '@src/hooks/useUserInfo';
import { paths } from '@src/routes/paths';
import { handleLogout } from '@src/services/handleLogout';
import { getCorporateDropdownItems, systemDropdownItems } from '@utils/navbarData';
import { formatNumberWithLocalString } from '@utils/priceFormat';
import formatString from '@utils/wordFormat';

import NotificationsList from '../NotificationsList';

const { Text } = Typography;

const CustomHeader = () => {
    const { resetNotificationCount } = useNotificationApi();
    useUserInfo();
    useSubUserLogout();
    const navigate = useNavigate();
    const { user, notifications } = useAppSelector(state => state.reducer.user);
    const { roleName, role, sessionId, autoLogin } = useAppSelector(state => state.reducer.auth);
    const freshChatDetails = useAppSelector(state => state.reducer.freshChat);
    const [open, setOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [hasEmployeeAccess, setHasEmployeeAccess] = useState(false);
    const { switchRole } = useSwitchRole();

    const email: string | undefined =
        roleName === 'corporate sub user' ? user?.subCorporateEmail : user?.email;
    const mobile: string | undefined =
        roleName === 'corporate sub user' ? user?.subCorporateMobile : user?.mobileNo;
    const credentialId: number | undefined =
        roleName === 'corporate sub user' ? user?.subCorporateCredential : user?.credentialId;

    // const restoreId: string | undefined = user?.chatId;
    const restoreId: string | undefined = freshChatDetails?.chatId;
    let userRole: string | undefined;
    let companyName: string | undefined;

    if (user) {
        userRole = user.role;
        // eslint-disable-next-line prefer-destructuring
        companyName = user.companyName;
    }

    const { applicationId, name: resolvedName } = useCompanyNameFallback();
    const isFreelancer = user?.accountType === 'freelancer';
    const displayName = resolvedName || applicationId || 'Registration Pending';

    const isSubCorporate = roleName === 'corporate sub user';
    const currentPlanName = user?.activeGroupPackageName || 'Free';
    const showUpgrade = !user?.isTopPlan;

    const isPekoCreditClaimPending = user?.isPekoCreditActive === false;
    const showPekoCredits = !isSubCorporate && !!user?.isPekoCreditAvailable;

    const {
        token: { colorPrimary },
    } = theme.useToken();

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    useEffect(() => {
        if (role !== UserRole.CORPORATE || isSubCorporate) return;
        getAvailableRoles().then(roles => {
            setHasEmployeeAccess(roles.some(r => r.role === 'user'));
        });
    }, [role, isSubCorporate]);

    // Only a member assigned Admin gets a choice; `modes` is empty for everyone else, so nothing is added.
    const { modes, needsProfile, activeRole, isSwitching, changeRole } = useActiveRole();
    // Driven only by the menu click below — never by an effect on `needsProfile`. The switcher is desktop
    // only, so auto-opening would portal this onto mobile screens that had no way to trigger it.
    const [profilePromptOpen, setProfilePromptOpen] = useState(false);

    const roleSwitchItems: MenuProps['items'] =
        modes.length > 1
            ? [
                  {
                      key: 'role-switch-group',
                      type: 'group',
                      label: 'Acting as',
                      children: modes.map(mode => ({
                          key: `switch-role:${mode}`,
                          label: mode === activeRole ? `${mode} (current)` : mode,
                          disabled: isSwitching || mode === activeRole,
                      })),
                  },
                  { type: 'divider', key: 'role-switch-divider' },
              ]
            : [];

    const baseAccountMenuItems =
        role === UserRole.CORPORATE
            ? getCorporateDropdownItems(hasEmployeeAccess, autoLogin)
            : systemDropdownItems;
    const accountMenuItems = [...(roleSwitchItems ?? []), ...(baseAccountMenuItems ?? [])];

    const handleMenuClick: MenuProps['onClick'] = async ({ key }) => {
        if (key.startsWith('switch-role:')) {
            const target = key.slice('switch-role:'.length);
            // The owner's first switch to Employee needs a cardholder identity, and the details must be
            // captured BEFORE the switch: changeRole reloads the page, so a prompt shown after it is gone.
            if (target === EMPLOYEE_ROLE && needsProfile) {
                setProfilePromptOpen(true);
            } else if (target === ADMIN_ROLE || target === EMPLOYEE_ROLE) {
                await changeRole(target);
            }
        } else if (key === 'profile') {
            navigate(
                role === UserRole.CORPORATE ? paths.dashboard.profile : paths.systemUser.profile
            );
        } else if (key === 'settings') {
            navigate(paths.dashboard.settings);
        } else if (key === 'help') {
            navigate(paths.dashboard.needHelp);
        } else if (key === 'switch-employee') {
            await switchRole('user');
        } else if (key === 'logout') {
            if (!isLoggingOut) {
                setIsLoggingOut(true);
                await handleLogout().finally(() => {
                    setIsLoggingOut(false);
                });
            }
        }
    };
    return (
        <>
            {userRole === 'CORPORATE' && (
                <ChatService
                    name={companyName}
                    email={email}
                    mobile={mobile}
                    credentialId={credentialId}
                    restoreId={restoreId}
                    role={role}
                    sessionId={sessionId}
                />
            )}
            <Flex
                className="hidden w-full lg:flex justify-between gap-8 min-[1402px]:gap-3"
                align="center"
            >
                {role === UserRole.SYSTEM && (
                    <Flex align="center" className="w-4/12">
                        <SearchTree />
                    </Flex>
                )}
                <>
                    {role === UserRole.CORPORATE && (
                        <Flex align="center" className="xl:w-[30%] xxl:w-4/12 mySearchClass">
                            <Flex align="center" className="relative w-full mySearchClass">
                                <ServiceSearch classes="-mt-3" variant="borderless" />
                                <Flex justify="end" align="end">
                                    <Divider type="vertical" className="h-10 mx-0" />
                                </Flex>
                            </Flex>
                        </Flex>
                    )}
                </>
                <Flex justify="flex-end" align="center" className="gap-2 xxl:gap-4 w-full">
                    {role === UserRole.CORPORATE && !isSubCorporate && (
                        <>
                            <Flex align="center" gap={12} className="whitespace-nowrap">
                                <Link to={paths.dashboard.plans}>
                                    <Text className="text-sm cursor-pointer whitespace-nowrap">
                                        Current Plan:{' '}
                                        <span className="font-medium">{currentPlanName}</span>
                                    </Text>
                                </Link>
                                {showUpgrade && (
                                    <>
                                        <Divider type="vertical" className="flex-shrink-0 h-10" />
                                        <UpgradePlanButton />
                                    </>
                                )}
                            </Flex>
                            <Divider type="vertical" className="flex-shrink-0 h-10" />
                        </>
                    )}

                    {/* WALLET TEMPORARILY HIDDEN
                    {!isSubCorporate && (
                        <>
                            <Link to={paths.pekoWallet.index}>
                                <Flex
                                    vertical
                                    align="center"
                                    justify="center"
                                    className="whitespace-nowrap"
                                >
                                    <Typography.Text className="text-xs">Wallet</Typography.Text>
                                    <Typography.Text className="text-sm font-semibold">
                                        {`₹ ${formatNumberWithLocalString(user?.balance ?? 0)}`}
                                    </Typography.Text>
                                </Flex>
                            </Link>
                            <Divider type="vertical" className="h-12" />
                        </>
                    )}
                    */}

                    {role === UserRole.CORPORATE && (
                        <>
                            {/* Peko Connect hidden until chat is wired up */}
                            <>
                                <Link
                                    className="hidden"
                                    to={`${paths.dashboard.moreServices}/${paths.pekoConnect.index}`}
                                >
                                    <Flex className="cursor-pointer">
                                        <Badge count={0} offset={[-5, 5]}>
                                            <Avatar
                                                size={32}
                                                shape="square"
                                                src={pekoConnect}
                                                className="cursor-pointer"
                                            />
                                        </Badge>
                                    </Flex>
                                </Link>
                                <Divider rootClassName="hidden" type="vertical" className="h-10" />
                            </>

                            <Popover
                                content={
                                    <div className="px-4">
                                        {NotificationsList()}
                                        <Flex className="w-full py-4" justify="end">
                                            {(notifications?.data?.length ?? 0) > 0 && (
                                                <Link to={paths.dashboard.notifications}>
                                                    <Text
                                                        className="text-sm"
                                                        style={{ color: colorPrimary }}
                                                        onClick={() => {
                                                            resetNotificationCount();
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        See More
                                                    </Text>
                                                </Link>
                                            )}
                                        </Flex>
                                    </div>
                                }
                                trigger="hover"
                                styles={{ body: { padding: 0, minWidth: 260 } }}
                                open={open}
                                title={() => (
                                    <Flex className="px-8 py-4 border-b" justify="space-between">
                                        <Text className="text-lg font-semibold">Notifications</Text>
                                        <IoIosClose
                                            className="text-2xl cursor-pointer text-black/45"
                                            onClick={() => setOpen(false)}
                                        />
                                    </Flex>
                                )}
                                placement="bottomRight"
                                onOpenChange={handleOpenChange}
                            >
                                <Badge count={notifications?.count || 0} offset={[-5, 5]}>
                                    <Avatar
                                        onClick={resetNotificationCount}
                                        shape="circle"
                                        src={NotificationIcon}
                                        className="cursor-pointer"
                                    />
                                </Badge>
                            </Popover>
                            <Divider type="vertical" className="h-10" />

                            {showPekoCredits && (
                                <>
                                    {isPekoCreditClaimPending ? (
                                        <ClaimPekoCreditsButton amount={user?.pekoCredits} />
                                    ) : (
                                        <Link to={paths.dashboard.pekoCredit}>
                                            <Flex
                                                vertical
                                                align="center"
                                                justify="center"
                                                className="whitespace-nowrap"
                                            >
                                                <Text className="text-xs">Peko Credits</Text>
                                                <Text className="text-sm font-semibold">
                                                    ₹{' '}
                                                    {formatNumberWithLocalString(
                                                        user?.pekoCredits ?? 0
                                                    )}
                                                </Text>
                                            </Flex>
                                        </Link>
                                    )}
                                    <Divider type="vertical" className="h-10" />
                                </>
                            )}
                        </>
                    )}

                    <Dropdown
                        menu={{ items: accountMenuItems, onClick: handleMenuClick }}
                        trigger={['hover']}
                        placement="bottomRight"
                        overlayClassName="nav-user-dropdown"
                        overlayStyle={{ minWidth: '280px' }}
                    >
                        <Flex
                            gap={10}
                            align="center"
                            className="h-12 px-3 py-2 border cursor-pointer rounded-xl"
                        >
                            <Avatar
                                src={user?.logo}
                                size="large"
                                draggable={false}
                                className="bg-[#ffeeee]"
                            >
                                {resolvedName ? (
                                    <Text
                                        style={{ color: colorPrimary }}
                                        className="text-2xl font-bold"
                                    >
                                        {resolvedName.slice(0, 1).toUpperCase()}
                                    </Text>
                                ) : (
                                    <UserOutlined style={{ color: colorPrimary, fontSize: 20 }} />
                                )}
                            </Avatar>
                            <Flex vertical>
                                <Text className="text-xs font-semibold text-black myNavClass">
                                    {displayName}
                                </Text>
                                <Text className="text-xs text-gray-400 myNavClass">
                                    {isFreelancer
                                        ? 'Freelancer / Influencer'
                                        : formatString(user?.roleName)}
                                </Text>
                            </Flex>
                            <DownOutlined className="text-xs text-gray-500" />
                        </Flex>
                    </Dropdown>
                </Flex>
            </Flex>

            <OwnerCardholderProfileModal
                open={profilePromptOpen}
                isSubmitting={isSwitching}
                onCancel={() => setProfilePromptOpen(false)}
                onSubmit={async values => {
                    const switched = await changeRole(EMPLOYEE_ROLE, values);
                    // Left open on refusal — the server's reason (a mobile already in use, an invalid name)
                    // is already toasted, and closing would discard what they typed.
                    if (switched) setProfilePromptOpen(false);
                }}
            />
        </>
    );
};

export default CustomHeader;
