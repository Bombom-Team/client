import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createInquiryRoom } from '@/apis/inquiry/inquiry.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type { InquiryRoom } from '@/types/inquiry';

interface UseInquiryRoomCreateMutationParams {
  onSuccess: (room: InquiryRoom) => void;
}

export const useInquiryRoomCreateMutation = ({
  onSuccess,
}: UseInquiryRoomCreateMutationParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInquiryRoom,
    onSuccess: (room) => {
      queryClient.invalidateQueries({
        queryKey: queries.inquiryRooms().queryKey,
      });
      onSuccess(room);
    },
    onError: () => {
      toast.error('문의 생성에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
