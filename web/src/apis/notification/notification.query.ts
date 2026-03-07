import { queryOptions } from '@tanstack/react-query';
import {
  getNotificationSettings,
  type GetNotificationSettingsParams,
  type GetNotificationSettingParams,
  getNotificationSetting,
} from './notification.api';

export const notificationQueries = {
  notificationSettings: {
    all: (memberId: number) => ['notifications', memberId, 'settings'] as const,
    global: (params: GetNotificationSettingsParams) =>
      queryOptions({
        queryKey: [
          ...notificationQueries.notificationSettings.all(params.memberId),
          'tokens',
          'status',
          params,
        ],
        queryFn: () => getNotificationSettings(params),
      }),
    category: (params: GetNotificationSettingParams) =>
      queryOptions({
        queryKey: [
          ...notificationQueries.notificationSettings.all(params.memberId),
          params,
        ],
        queryFn: () => getNotificationSetting(params),
      }),
  },
};
