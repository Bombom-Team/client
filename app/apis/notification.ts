import { ENV } from '@/constants/env';

interface PutTokenParams {
  memberId: number;
  deviceUuid: string;
  token: string;
}

export const putFCMToken = async ({
  memberId,
  deviceUuid,
  token,
}: PutTokenParams) => {
  const response = await fetch(`${ENV.baseUrl}/notifications/tokens`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      memberId,
      deviceUuid,
      token,
    }),
  });

  if (!response.ok) {
    throw new Error(`FCM 토큰 등록 실패: ${response.status}`);
  }

  return response;
};
