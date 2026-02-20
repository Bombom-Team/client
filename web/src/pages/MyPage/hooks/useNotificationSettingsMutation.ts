import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putNotificationSettings } from '@/apis/notification/notification.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseNotificationSettingsMutationParams {
  memberId: number;
  deviceUuid: string;
}

const useNotificationSettingsMutation = ({
  memberId,
  deviceUuid,
}: UseNotificationSettingsMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enabled: boolean) =>
      putNotificationSettings({ memberId, deviceUuid, enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.all(memberId),
      });
    },
    onError: () => {
      toast.error('전체 알림 설정 변경에 실패했습니다. 다시 시도해주세요.');
    },
  });
};

export default useNotificationSettingsMutation;
