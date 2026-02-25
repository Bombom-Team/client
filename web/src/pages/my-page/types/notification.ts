import type { CATEGORY } from '../constants/notification';
import type { GetNotificationSettingResponse } from '@/apis/notification/notification.api';

export type Category = keyof typeof CATEGORY;

export type NotificationSetting = GetNotificationSettingResponse;
