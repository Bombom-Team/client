import FloatingActionPanel from '@/components/FloatingActionPanel/FloatingActionPanel';
import { useDevice } from '@/hooks/useDevice';
import { copyToClipboard } from '@/utils/copy';
import ShareIcon from '#/assets/svg/share.svg';

const FloatingPostPanel = () => {
  const device = useDevice();

  if (device === 'mobile' || device === 'tablet') {
    return null;
  }

  const handleShareClick = () => {
    copyToClipboard(window.location.href);
  };

  return (
    <FloatingActionPanel
      top="50%"
      left="max(12px, 4%)"
      actions={[
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
