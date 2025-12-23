import { useMutation } from '@tanstack/react-query';
import { patchGuideArticleRead } from '@/apis/guide/guide.api';

interface UseGuideAsReadMutationParams {
  onSuccess: () => void;
}

export const useGuideAsReadMutation = ({
  onSuccess,
}: UseGuideAsReadMutationParams) => {
  return useMutation({
    mutationFn: patchGuideArticleRead,
    onSuccess,
  });
};
