import { queryOptions } from '@tanstack/react-query';
import {
  getNotificationSettings,
  type GetNotificationSettingsParams,
} from './notification.api';

export const notificationQueries = {
  notificationStatus: (params: GetNotificationSettingsParams) =>
    queryOptions({
      queryKey: ['notifications', 'tokens', 'settings', 'status', params],
      queryFn: () => getNotificationSettings(params),
    }),
};
