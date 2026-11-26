import { useMutation } from '@tanstack/react-query';
import { postNotificationOpen } from '@/apis/notification/notification.api';

// 알림 열림 기록은 사용자가 결과를 기다리지 않으므로 실패해도 피드백을 띄우지 않는다.
export const usePostNotificationOpenMutation = () => {
  return useMutation({
    mutationFn: postNotificationOpen,
  });
};
