import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Badge from '@/components/Badge/Badge';
import { INQUIRY_ROOM_STATUS_LABELS } from '@/types/inquiry';
import { formatDate } from '@/utils/date';
import type { InquiryRoom } from '@/types/inquiry';

interface InquiryRoomListItemProps {
  room: InquiryRoom;
}

const InquiryRoomListItem = ({ room }: InquiryRoomListItemProps) => {
  return (
    <Container to="/support/inquiry/$roomId" params={{ roomId: String(room.id) }}>
      <Badge text={INQUIRY_ROOM_STATUS_LABELS[room.status]} />
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

const CreatedAt = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
