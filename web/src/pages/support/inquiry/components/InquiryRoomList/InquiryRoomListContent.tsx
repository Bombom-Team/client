import styled from '@emotion/styled';
import InquiryRoomListItem from '../InquiryRoomListItem';
import type { InquiryCategory, InquiryRoom } from '@/types/inquiry';

interface InquiryRoomListContentProps {
  categories?: InquiryCategory[];
  rooms: InquiryRoom[];
}

const InquiryRoomListContent = ({
  categories,
  rooms,
}: InquiryRoomListContentProps) => {
  if (rooms.length === 0) {
    return <EmptyState>아직 문의 내역이 없어요</EmptyState>;
  }

  return (
    <RoomList>
      {rooms.map((room) => (
        <InquiryRoomListItem
          key={room.id}
          room={room}
          categoryName={
            categories?.find((category) => category.id === room.categoryId)
              ?.name
          }
        />
      ))}
    </RoomList>
  );
};

export default InquiryRoomListContent;

const RoomList = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const EmptyState = styled.p`
  padding: 48px 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  text-align: center;
`;
