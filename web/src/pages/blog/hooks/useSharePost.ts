import { toast } from '@bombom/shared/ui-web';
import { useCallback } from 'react';
import { copyToClipboard } from '@/utils/copy';

export const useSharePost = () => {
  const copyShareLink = useCallback(async () => {
    try {
      await copyToClipboard(window.location.href);
      toast.success('공유 링크가 복사되었습니다.');
    } catch {
      toast.error('링크 복사에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  }, []);

  return { copyShareLink };
};
