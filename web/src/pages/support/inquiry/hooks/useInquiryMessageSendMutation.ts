import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendInquiryMessage } from '@/apis/inquiry/inquiry.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type { SendInquiryMessageBody } from '@/apis/inquiry/inquiry.api';

interface UseInquiryMessageSendMutationParams {
  roomId: number;
}

export const useInquiryMessageSendMutation = ({
  roomId,
}: UseInquiryMessageSendMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SendInquiryMessageBody) =>
      sendInquiryMessage(roomId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.inquiryMessages(roomId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.inquiryRooms().queryKey,
      });
    },
    onError: () => {
      toast.error('메시지 전송에 실패했습니다.');
    },
  });
};
