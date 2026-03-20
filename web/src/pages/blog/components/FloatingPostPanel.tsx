import FloatingActionPanel from '@/components/FloatingActionPanel/FloatingActionPanel';
import ChevronIcon from '@/components/icons/ChevronIcon';
import { toast } from '@/components/Toast/utils/toastActions';
import { useDevice } from '@/hooks/useDevice';
import { copyToClipboard } from '@/utils/copy';
import ShareIcon from '#/assets/svg/share.svg';

const FloatingPostPanel = () => {
  const device = useDevice();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyShareLink = async () => {
    try {
      await copyToClipboard(window.location.href);
      toast.success('공유 링크가 복사되었습니다.');
    } catch {
      toast.error('링크 복사에 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  if (device === 'mobile' || device === 'tablet') {
    return null;
  }

  return (
    <FloatingActionPanel
      top="50%"
      left="max(12px, 4%)"
      actions={[
        {
          icon: <ChevronIcon direction="up" width={28} height={28} />,
          onClick: scrollToTop,
          ariaLabel: '페이지 최상단 이동',
        },
        {
          icon: <ShareIcon width={24} height={24} />,
          onClick: copyShareLink,
          ariaLabel: '공유하기',
        },
      ]}
    />
  );
};

export default FloatingPostPanel;
