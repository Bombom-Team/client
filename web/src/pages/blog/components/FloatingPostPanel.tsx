import FloatingActionPanel from '@/components/FloatingActionPanel/FloatingActionPanel';
import ChevronIcon from '@/components/icons/ChevronIcon';
import { useDevice } from '@/hooks/useDevice';
import { copyToClipboard } from '@/utils/copy';
import ShareIcon from '#/assets/svg/share.svg';

const FloatingPostPanel = () => {
  const device = useDevice();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareClick = () => {
    copyToClipboard(window.location.href);
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
          onClick: handleScrollToTop,
          ariaLabel: '페이지 최상단 이동',
        },
        {
          icon: <ShareIcon width={24} height={24} />,
          onClick: handleShareClick,
          ariaLabel: '공유하기',
        },
      ]}
    />
  );
};

export default FloatingPostPanel;
