import MobileInquiryRoomList from './MobileInquiryRoomList';
import PCInquiryRoomList from './PCInquiryRoomList';
import { useDevice } from '@/hooks/useDevice';
import type { InquiryCategory } from '@/types/inquiry';

interface InquiryRoomListProps {
  categories?: InquiryCategory[];
}

const InquiryRoomList = ({ categories }: InquiryRoomListProps) => {
  const device = useDevice();

  if (device === 'pc') {
    return <PCInquiryRoomList categories={categories} />;
  }

  return <MobileInquiryRoomList categories={categories} />;
};

export default InquiryRoomList;
