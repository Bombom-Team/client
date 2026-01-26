import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postNewsletterUnsubscribe } from '@/apis/members/members.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import type {
  GetMySubscriptionsResponse,
  PostNewsletterUnsubscribeParams,
} from '@/apis/members/members.api';

export const useUnsubscribeNewsletterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: PostNewsletterUnsubscribeParams) =>
      postNewsletterUnsubscribe(params),
    onMutate: async ({ subscriptionId }) => {
      await queryClient.cancelQueries({
        queryKey: queries.mySubscriptions().queryKey,
      });

      const previousSubscriptions =
        queryClient.getQueryData<GetMySubscriptionsResponse>(
          queries.mySubscriptions().queryKey,
        );

      queryClient.setQueryData<GetMySubscriptionsResponse>(
        queries.mySubscriptions().queryKey,
        (old) =>
          old?.map((item) =>
            item.subscriptionId === subscriptionId
              ? { ...item, status: 'UNSUBSCRIBING' }
              : item,
          ) ?? [],
      );

      return { previousSubscriptions };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(
        queries.mySubscriptions().queryKey,
        context?.previousSubscriptions,
      );
      toast.error('구독 해지에 실패했습니다. 다시 시도해주세요.');
    },
    onSuccess: () => {
      toast.success('뉴스레터 구독을 해지했습니다.');
      // NOTE: Optimistic Update로 이미 UI가 변경되었으므로 invalidateQueries를 하지 않음
      // (목록에서 사라지는 것이 아니라 '성공' 상태를 유지하거나 추후 새로고침 시 반영)
    },
  });
};
