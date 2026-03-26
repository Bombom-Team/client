import Button from '@/components/Button/Button';
import { toast } from '@/components/Toast/utils/toastActions';
import { copyToClipboard } from '@/utils/copy';
import ShareIcon from '#/assets/svg/share.svg';

const ShareButton = () => {
  const copyShareLink = async () => {
    try {
      await copyToClipboard(window.location.href);
      toast.success('공유 링크가 복사되었습니다.');
    } catch {
      toast.error('링크 복사에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <Button variant="outlined" onClick={copyShareLink}>
      <ShareIcon width={16} height={16} />글 공유하기
    </Button>
  );
};

export default ShareButton;
