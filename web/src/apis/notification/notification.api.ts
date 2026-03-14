import { fetcher } from '@bombom/shared/apis';

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
type GetNotificationSettingResponse = {
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
