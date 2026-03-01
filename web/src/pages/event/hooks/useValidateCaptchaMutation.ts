import { useMutation } from '@tanstack/react-query';
import { postCaptcha } from '@/apis/event/event.api';
import { toast } from '@/components/Toast/utils/toastActions';

export const useValidateCaptchaMutation = () => {
  return useMutation({
    mutationFn: (token: string) => postCaptcha(token),
    onError: () => {
      toast.error('CAPTCHA 인증에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
