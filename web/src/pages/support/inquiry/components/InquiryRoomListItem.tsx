import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Badge from '@/components/Badge/Badge';
import {
  INQUIRY_ROOM_STATUS_BADGE_VARIANTS,
  INQUIRY_ROOM_STATUS_LABELS,
} from '@/types/inquiry';
import { formatDate } from '@/utils/date';
import type { InquiryRoom } from '@/types/inquiry';

const IMAGE_ONLY_MESSAGE = '사진을 보냈습니다.';

interface InquiryRoomListItemProps {
  room: InquiryRoom;
  categoryName?: string;
}

const InquiryRoomListItem = ({
  room,
  categoryName,
}: InquiryRoomListItemProps) => {
  const hasUnread = Boolean(room.hasUnreadMessage);
  const lastMessage = room.lastMessage;
  const lastMessageText = lastMessage
    ? lastMessage.content?.trim() || IMAGE_ONLY_MESSAGE
    : null;
  const listDate = lastMessage?.createdAt ?? room.createdAt;

  return (
    <Container
      to={`/support/inquiry/${room.id}`}
      hasUnread={hasUnread}
      aria-label={
        hasUnread
          ? `${categoryName ?? '문의'} (읽지 않은 메시지 있음)`
          : categoryName
      }
    >
      <ContentColumn>
        <TopRow>
          <BadgeGroup>
            {room.status && (
              <Badge
                text={INQUIRY_ROOM_STATUS_LABELS[room.status]}
                variant={INQUIRY_ROOM_STATUS_BADGE_VARIANTS[room.status]}
              />
            )}
            {categoryName && (
              <CategoryText hasUnread={hasUnread}>{categoryName}</CategoryText>
            )}
          </BadgeGroup>
          <CreatedAt hasUnread={hasUnread}>
            {formatDate(new Date(listDate ?? ''))}
          </CreatedAt>
        </TopRow>
        {lastMessageText && (
          <LastMessageText hasUnread={hasUnread}>
            {lastMessageText}
          </LastMessageText>
        )}
      </ContentColumn>
    </Container>
  );
};

export default InquiryRoomListItem;

const Container = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'hasUnread',
})<{ hasUnread: boolean }>`
  padding: 16px;
  border: 1px solid
    ${({ theme, hasUnread }) =>
      hasUnread ? theme.colors.primaryBomBom : theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  align-items: center;

  text-decoration: none;
`;

const ContentColumn = styled.div`
  overflow: hidden;
  width: 100%;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const LastMessageText = styled.span<{ hasUnread: boolean }>`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, hasUnread }) =>
    hasUnread ? theme.fonts.t5Bold : theme.fonts.t5Regular};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const BadgeGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CategoryText = styled.span<{ hasUnread: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, hasUnread }) =>
    hasUnread ? theme.fonts.t5Bold : theme.fonts.t5Regular};
`;

const CreatedAt = styled.span<{ hasUnread: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, hasUnread }) =>
    hasUnread ? theme.fonts.t5Bold : theme.fonts.t5Regular};
`;
