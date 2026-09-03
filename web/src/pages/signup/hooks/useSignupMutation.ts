import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { postSignup } from '@/apis/auth/auth.api';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { markSignUpPending } from '@/libs/googleAnalytics/retentionEvents';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { GUIDE_MAIL_STORAGE_KEY } from '@/pages/guide-detail/constants/guideMail';
import { formatDate } from '@/utils/date';
import { createStorage } from '@/utils/localStorage';
import type { Gender } from '../components/SignupCard.types';

type UseSignupMutationParams = {
  nickname: string;
  email: string;
  gender: Gender;
  birthDate: string;
  onSignupSuccess?: () => void;
};

export const useSignupMutation = ({
  nickname,
  email,
  gender,
  birthDate,
  onSignupSuccess,
}: UseSignupMutationParams) => {
  const navigate = useNavigate();

  const initializeGuideMailStorage = () => {
    createStorage(GUIDE_MAIL_STORAGE_KEY).set({
      createdAt: formatDate(new Date()),
      readMailIds: [],
    });
  };

  return useMutation({
    mutationFn: () =>
      postSignup({
        nickname: nickname.trim(),
        email,
        gender,
        birthDate,
      }),
    onSuccess: () => {
      onSignupSuccess?.();
      initializeGuideMailStorage();

      sendMessageToRN({
        type: 'LOGIN_SUCCESS',
      });
      markSignUpPending();
      navigate({ to: '/today' });
    },
    onError: () => {
      trackEvent({
        category: 'Authentication',
        action: '회원가입 실패',
        label: '회원가입 요청 실패',
      });
    },
  });
};
