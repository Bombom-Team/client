import type { CATEGORY } from '../constants/notification';
import type { GetNotificationSettingResponse } from '@/apis/notification/notification.api';

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY];

export type NotificationSetting = GetNotificationSettingResponse;
