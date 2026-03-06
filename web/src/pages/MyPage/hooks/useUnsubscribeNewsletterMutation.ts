import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postNewsletterUnsubscribe } from '@/apis/members/members.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type { PostNewsletterUnsubscribeParams } from '@/apis/members/members.api';

export const useUnsubscribeNewsletterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PostNewsletterUnsubscribeParams) =>
      postNewsletterUnsubscribe(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.mySubscriptions().queryKey,
      });
    },
    onError: () => {
      toast.error('구독 취소에 실패했습니다. 다시 시도해주세요.');
    },
  });
};
