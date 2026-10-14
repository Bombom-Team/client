import { useMutation, useQueryClient } from '@tanstack/react-query';
import { sendInquiryMessage } from '@/apis/inquiry/inquiry.api';
import { INQUIRY_ROOMS_QUERY_KEY } from '@/apis/inquiry/inquiry.query';
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
        queryKey: INQUIRY_ROOMS_QUERY_KEY,
      });
    },
    onError: () => {
      toast.error('메시지 전송에 실패했습니다.');
    },
  });
};
