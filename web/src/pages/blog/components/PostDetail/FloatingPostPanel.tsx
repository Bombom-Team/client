import FloatingActionPanel from '@/components/FloatingActionPanel/FloatingActionPanel';
import ChevronIcon from '@/components/icons/ChevronIcon';
import { useDevice } from '@/hooks/useDevice';
import { useSharePost } from '@/pages/blog/hooks/useSharePost';
import ShareIcon from '#/assets/svg/share.svg';

const FloatingPostPanel = () => {
  const device = useDevice();
  const { copyShareLink } = useSharePost();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (device !== 'pc') {
    return null;
  }

  return (
    <FloatingActionPanel
      top="50%"
      left="max(0.75rem, 4%)"
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
