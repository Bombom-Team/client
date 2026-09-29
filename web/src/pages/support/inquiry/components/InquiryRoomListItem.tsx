import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Badge from '@/components/Badge/Badge';
import {
  INQUIRY_ROOM_STATUS_BADGE_VARIANTS,
  INQUIRY_ROOM_STATUS_LABELS,
} from '@/types/inquiry';
import { formatDate } from '@/utils/date';
import type { InquiryRoom } from '@/types/inquiry';

interface InquiryRoomListItemProps {
  room: InquiryRoom;
  categoryName?: string;
}

const InquiryRoomListItem = ({
  room,
  categoryName,
}: InquiryRoomListItemProps) => {
  return (
    <Container to={`/support/inquiry/${room.id}`}>
      <BadgeGroup>
        <Badge
          text={INQUIRY_ROOM_STATUS_LABELS[room.status]}
          variant={INQUIRY_ROOM_STATUS_BADGE_VARIANTS[room.status]}
        />
        {categoryName && <CategoryText>{categoryName}</CategoryText>}
      </BadgeGroup>
      <CreatedAt>{formatDate(new Date(room.createdAt))}</CreatedAt>
    </Container>
  );
};

export default InquiryRoomListItem;

const Container = styled(Link)`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  text-decoration: none;
`;

const BadgeGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CategoryText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const CreatedAt = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
