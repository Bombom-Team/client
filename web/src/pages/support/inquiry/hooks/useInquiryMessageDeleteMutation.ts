import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteInquiryMessage } from '@/apis/inquiry/inquiry.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';

interface UseInquiryMessageDeleteMutationParams {
  roomId: number;
}

export const useInquiryMessageDeleteMutation = ({
  roomId,
}: UseInquiryMessageDeleteMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) => deleteInquiryMessage(roomId, messageId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: queries.inquiryMessages(roomId).queryKey,
        }),
        queryClient.invalidateQueries({
          queryKey: queries.inquiryRooms().queryKey,
        }),
      ]),
    onError: () => {
      toast.error('메시지 삭제에 실패했습니다.');
    },
  });
};
