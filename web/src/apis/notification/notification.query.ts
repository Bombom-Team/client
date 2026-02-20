import { queryOptions } from '@tanstack/react-query';
import {
  getNotificationSettings,
  type GetNotificationSettingsParams,
  type GetNotificationSettingParams,
  getNotificationSetting,
} from './notification.api';

export const notificationQueries = {
  notificationSettings: (params: GetNotificationSettingsParams) =>
    queryOptions({
      queryKey: ['notifications', 'tokens', 'settings', 'status', params],
      queryFn: () => getNotificationSettings(params),
    }),

  notificationSetting: (params: GetNotificationSettingParams) =>
    queryOptions({
      queryKey: ['notifications', 'settings', params],
      queryFn: () => getNotificationSetting(params),
    }),
};
