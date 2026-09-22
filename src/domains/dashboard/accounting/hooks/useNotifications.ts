import { useAppSelector } from '@src/hooks/store';
import { selectDataMode } from '@src/slices/dataModeSlice';

import { DUMMY_NOTIFICATIONS, EMPTY_NOTIFICATIONS } from '../data/notificationData';
import { AccountingNotification } from '../types/notification';

// Mirrors useLedgerData()'s pattern — reads the same app-wide data mode toggle.
export const useNotifications = (): AccountingNotification[] => {
    const mode = useAppSelector(selectDataMode);
    return mode === 'dummy' ? DUMMY_NOTIFICATIONS : EMPTY_NOTIFICATIONS;
};
