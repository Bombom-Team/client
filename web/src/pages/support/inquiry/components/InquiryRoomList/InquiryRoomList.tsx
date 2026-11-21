import { useDevice } from '@bombom/shared/ui-web';
import MobileInquiryRoomList from './MobileInquiryRoomList';
import PCInquiryRoomList from './PCInquiryRoomList';

const InquiryRoomList = () => {
  const device = useDevice();

  if (device === 'pc') {
    return <PCInquiryRoomList />;
  }

  return <MobileInquiryRoomList />;
};

export default InquiryRoomList;
