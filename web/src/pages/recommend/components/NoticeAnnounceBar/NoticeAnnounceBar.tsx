import { useState } from 'react';
import { useAnnounceBar } from '../../hooks/useAnnounceBar';
import AnnounceBar from '@/components/AnnounceBar/AnnounceBar';
import { useDevice } from '@/hooks/useDevice';

interface NoticeAnnounceBarProps {
  noticeId: number;
  categoryName: string;
  title: string;
  content: string;
  createdAt: string;
}

const NoticeAnnounceBar = ({ notice }: { notice: NoticeAnnounceBarProps }) => {
  const device = useDevice();
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(true);
  const { isVisible, hide } = useAnnounceBar(notice.noticeId);
  const [announceChecked, setAnnounceChecked] = useState(false);

  const handleCloseAnnounce = () => {
    if (announceChecked || device === 'mobile') {
      hide();
    }
    setIsAnnounceOpen(false);
  };

  if (!isAnnounceOpen || !isVisible) {
    return null;
  }

  return (
    <AnnounceBar
      announceText={[notice.title]}
      checked={announceChecked}
      onChangeChecked={setAnnounceChecked}
      onClose={handleCloseAnnounce}
    />
  );
};
export default NoticeAnnounceBar;
