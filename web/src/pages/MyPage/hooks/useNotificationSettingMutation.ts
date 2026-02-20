import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchNotificationSetting } from '@/apis/notification/notification.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseNotificationSettingMutationParams {
  memberId: number;
}

interface MutationFnParams {
  enabled: boolean;
  category: string;
}

const useNotificationSettingMutation = ({
  memberId,
}: UseNotificationSettingMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enabled, category }: MutationFnParams) =>
      patchNotificationSetting({ memberId, enabled, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.comments.all(memberId),
      });
    },
    onError: (_, { category }) => {
      toast.error(
        `${category} 알림 설정 변경에 실패했습니다. 다시 시도해주세요.`,
      );
    },
  });
};

export default useNotificationSettingMutation;
