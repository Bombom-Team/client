import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleVacation } from '@/apis/reviewers/reviewers.api';
import { reviewersQueries } from '@/apis/reviewers/reviewers.query';

export const useToggleVacationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewerId, currentValue }: { reviewerId: number; currentValue: boolean }) =>
      toggleVacation(reviewerId, currentValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewersQueries.all });
    },
  });
};
