import { ApiError } from '@bombom/shared/apis';
import { toast } from '@bombom/shared/ui-web';
import { useMutation } from '@tanstack/react-query';
import { uploadInquiryImages } from '@/apis/inquiry/inquiry.api';

interface UseInquiryImagesUploadMutationParams {
  roomId: number;
}

export const useInquiryImagesUploadMutation = ({
  roomId,
}: UseInquiryImagesUploadMutationParams) =>
  useMutation({
    mutationFn: (images: File[]) => uploadInquiryImages(roomId, images),
    onError: (error) => {
      toast.error(
        error instanceof ApiError && error.message
          ? error.message
          : '이미지 업로드에 실패했습니다.',
      );
    },
  });
