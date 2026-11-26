import { fetcher } from '@bombom/shared/apis';
import { ENV } from '@bombom/shared/env';

export type GetNotificationSettingsParams = {
  memberId: number;
  deviceUuid: string;
};

export const getNotificationSettings = ({
  memberId,
  deviceUuid,
}: GetNotificationSettingsParams) => {
  return fetcher.get<boolean>({
    path: `/notifications/tokens/${memberId}/${deviceUuid}/settings/status`,
  });
};

type PutNotificationSettingsParams = {
  memberId: number;
  deviceUuid: string;
  enabled: boolean;
};

export const putNotificationSettings = ({
  memberId,
  deviceUuid,
  enabled,
}: PutNotificationSettingsParams) => {
  return fetcher.put({
    path: `/notifications/tokens/${memberId}/${deviceUuid}/settings`,
    body: { enabled },
  });
};

export type GetNotificationSettingParams = {
  memberId: number;
  category: string;
};
export type GetNotificationSettingResponse = {
  category: string;
  enabled: boolean;
};

export const getNotificationSetting = ({
  memberId,
  category,
}: GetNotificationSettingParams) => {
  return fetcher.get<GetNotificationSettingResponse>({
    path: `/notifications/${memberId}/settings/${category}`,
  });
};

type PatchNotificationSettingParams = {
  memberId: number;
  category: string;
  enabled: boolean;
};

export const patchNotificationSetting = ({
  memberId,
  category,
  enabled,
}: PatchNotificationSettingParams) => {
  return fetcher.patch({
    path: `/notifications/${memberId}/settings/${category}`,
    body: { enabled },
  });
};

export type PostNotificationOpenParams = {
  category: string | null;
  notificationId: number | null;
  scheduleId: number | null;
  memberId: number | null;
  deviceUuid: string | null;
  platform: 'IOS' | 'ANDROID';
  appVersion: string | null;
};

export const postNotificationOpen = async (
  params: PostNotificationOpenParams,
) => {
  return fetcher.post<PostNotificationOpenParams, void>({
    path: '/notifications/opens',
    body: params,
    baseUrl: ENV.notificationBaseUrl,
  });
};
