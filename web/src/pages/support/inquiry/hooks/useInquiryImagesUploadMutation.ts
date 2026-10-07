import { ApiError } from '@bombom/shared/apis';
import { useMutation } from '@tanstack/react-query';
import { uploadInquiryImages } from '@/apis/inquiry/inquiry.api';
import { toast } from '@/components/Toast/utils/toastActions';

export const useInquiryImagesUploadMutation = () =>
  useMutation({
    mutationFn: uploadInquiryImages,
    onError: (error) => {
      toast.error(
        error instanceof ApiError && error.message
          ? error.message
          : '이미지 업로드에 실패했습니다.',
      );
    },
  });
