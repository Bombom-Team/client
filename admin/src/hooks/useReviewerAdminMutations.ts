import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addReviewer,
  deleteReviewer,
  updateReviewerName,
  updateSetting,
} from '@/apis/reviewers/reviewers.api';
import { reviewersQueries } from '@/apis/reviewers/reviewers.query';

const useInvalidateReviewers = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: reviewersQueries.all });
};

export const useAddReviewerMutation = () => {
  const invalidate = useInvalidateReviewers();
  return useMutation({
    mutationFn: addReviewer,
    onSuccess: invalidate,
  });
};

export const useDeleteReviewerMutation = () => {
  const invalidate = useInvalidateReviewers();
  return useMutation({
    mutationFn: deleteReviewer,
    onSuccess: invalidate,
  });
};

export const useUpdateReviewerNameMutation = () => {
  const invalidate = useInvalidateReviewers();
  return useMutation({
    mutationFn: updateReviewerName,
    onSuccess: invalidate,
  });
};

export const useUpdateSettingMutation = () => {
  const invalidate = useInvalidateReviewers();
  return useMutation({
    mutationFn: updateSetting,
    onSuccess: invalidate,
  });
};
