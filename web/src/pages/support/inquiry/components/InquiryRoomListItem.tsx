import { useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { Link, useMatchRoute } from '@tanstack/react-router';
import { ADMIN_FALLBACK_NAME } from '../constants/inquiry';
import { formatAssigneeLabel } from '../utils/assignee';
import Badge from '@/components/Badge/Badge';
import {
  INQUIRY_ROOM_STATUS_BADGE_VARIANTS,
  INQUIRY_ROOM_STATUS_LABELS,
} from '@/types/inquiry';
import { convertRelativeTime } from '@/utils/date';
import type { InquiryRoom } from '@/types/inquiry';

const IMAGE_ONLY_MESSAGE = '사진을 보냈습니다.';
const MY_MESSAGE_SENDER_NAME = '나';
const EMPTY_MESSAGE_PLACEHOLDER = '문의 내용을 입력해 주세요';
const UNREAD_LABEL = '읽지 않은 메시지 있음';

interface InquiryRoomListItemProps {
  room: InquiryRoom;
}

const InquiryRoomListItem = ({ room }: InquiryRoomListItemProps) => {
  const device = useDevice();
  const isMobile = device !== 'pc';
  const matchRoute = useMatchRoute();
  const isSelected = Boolean(
    matchRoute({
      to: '/support/inquiry/$roomId',
      params: { roomId: String(room.id) },
    }),
  );
  const hasUnread = Boolean(room.hasUnreadMessage);
  const lastMessage = room.lastMessage;
  const lastMessageText = lastMessage
    ? lastMessage.content?.trim() || IMAGE_ONLY_MESSAGE
    : null;
  // senderType이 비어 있으면 어드민 메시지를 내 메시지로 오인하지 않도록 USER를 양성 조건으로 둔다
  const senderName =
    lastMessage?.senderType === 'USER'
      ? MY_MESSAGE_SENDER_NAME
      : (lastMessage?.adminNickname ?? ADMIN_FALLBACK_NAME);
  const listDate = lastMessage?.createdAt ?? room.createdAt;

  return (
    <Container
      to={`/support/inquiry/${room.id}`}
      isSelected={isSelected}
      isMobile={isMobile}
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
            <AssigneeName hasUnread={hasUnread}>
              {formatAssigneeLabel(room.assigneeNickname)}
            </AssigneeName>
          </BadgeGroup>
          <DateGroup>
            <CreatedAt hasUnread={hasUnread}>
              {convertRelativeTime(listDate ?? '')}
            </CreatedAt>
            {hasUnread && <UnreadDot role="img" aria-label={UNREAD_LABEL} />}
          </DateGroup>
        </TopRow>
        <LastMessageText hasUnread={hasUnread}>
          {lastMessageText ? (
            <>
              <SenderName>{senderName}:</SenderName> {lastMessageText}
            </>
          ) : (
            EMPTY_MESSAGE_PLACEHOLDER
          )}
        </LastMessageText>
      </ContentColumn>
    </Container>
  );
};

export default InquiryRoomListItem;

const Container = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isMobile',
})<{ isSelected: boolean; isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '16px 4px' : '16px 16px 16px 12px')};

  /* 모바일은 목록과 채팅방이 다른 화면이라 선택 상태를 표시하지 않는다 */
  border-left: ${({ theme, isSelected, isMobile }) => {
    if (isMobile) return '0 solid transparent';
    return `4px solid ${isSelected ? theme.colors.primaryBomBom : 'transparent'}`;
  }};

  display: flex;
  align-items: center;

  /* 상태 배지 배경(primaryInfo)과 같은 색을 쓰면 배지 형태가 묻히므로 중립색으로 구분한다 */
  background-color: ${({ theme, isSelected, isMobile }) =>
    isSelected && !isMobile ? theme.colors.backgroundHover : 'transparent'};

  text-decoration: none;

  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.colors.dividers};
  }
`;

const ContentColumn = styled.div`
  overflow: hidden;
  width: 100%;

  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: space-between;
`;

const BadgeGroup = styled.div`
  overflow: hidden;
  min-height: 32px;

  display: flex;
  gap: 8px;
  align-items: center;
`;

const AssigneeName = styled.span<{ hasUnread: boolean }>`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, hasUnread }) =>
    hasUnread ? theme.fonts.t5Bold : theme.fonts.t5Regular};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

/**
 * 안읽음 점이 생겨도 행 높이가 달라지지 않도록 점이 차지할 높이를 항상 확보한다.
 */
const DateGroup = styled.div`
  min-height: 32px;

  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: flex-end;
`;

const UnreadDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.primaryBomBom};
`;

/* 상태 배지의 좌측 패딩만큼 들여써서 배지 글자와 세로선을 맞춘다 */
const LastMessageText = styled.p<{ hasUnread: boolean }>`
  overflow: hidden;
  min-height: 20px;
  padding-left: 8px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, hasUnread }) =>
    hasUnread ? theme.fonts.t5Bold : theme.fonts.t5Regular};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

/**
 * 굵기는 안읽음 여부를 나타내는 신호로만 쓰기 위해 부모(LastMessageText)의 굵기를 그대로 따른다.
 */
const SenderName = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CreatedAt = styled.span<{ hasUnread: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, hasUnread }) =>
    hasUnread ? theme.fonts.t5Bold : theme.fonts.t5Regular};
`;
