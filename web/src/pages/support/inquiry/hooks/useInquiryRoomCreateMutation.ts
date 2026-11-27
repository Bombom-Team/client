import { toast } from '@bombom/shared/ui-web';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInquiryRoom } from '@/apis/inquiry/inquiry.api';
import { INQUIRY_ROOMS_QUERY_KEY } from '@/apis/inquiry/inquiry.query';

export const useInquiryRoomCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInquiryRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: INQUIRY_ROOMS_QUERY_KEY,
      });
    },
    onError: () => {
      toast.error('문의 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
