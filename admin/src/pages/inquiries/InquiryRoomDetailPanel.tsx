import styled from '@emotion/styled';
import {
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { FiCheck } from 'react-icons/fi';
import { inquiryCategoriesQueries } from '@/apis/inquiries/inquiryCategories.query';
import {
  inquiryMessagesQueries,
  useDeleteInquiryMessageMutation,
  useUpdateInquiryMessageMutation,
} from '@/apis/inquiries/inquiryMessages.query';
import {
  inquiryRoomsQueries,
  useAssignInquiryRoomMutation,
  useUpdateInquiryRoomCategoryMutation,
  useUpdateInquiryRoomStatusMutation,
} from '@/apis/inquiries/inquiryRooms.query';
import { membersQueries } from '@/apis/members/members.query';
import { formatDateDivider, isSameDay } from '@/lib/formatRelativeTime';
import { getRequesterIdentity } from '@/lib/inquiryDisplay';
import { CopyableText } from '@/pages/inquiries/CopyableText';
import { InquiryAvatar } from '@/pages/inquiries/InquiryAvatar';
import { InquiryMessageBubble } from '@/pages/inquiries/InquiryMessageBubble';
import { InquiryMessageInput } from '@/pages/inquiries/InquiryMessageInput';
import {
  INQUIRY_STATUS_COLORS,
  INQUIRY_STATUS_LABELS,
  type InquiryMessage,
  type InquiryRoom,
  type InquiryStatus,
} from '@/types/inquiry';

interface InquiryRoomDetailPanelProps {
  roomId: number;
  // 목록 쿼리가 받아둔 방 정보. 상세 조회 응답에 문의자 닉네임·이메일이 없어
  // 필요하다. 목록이 갱신되면 이 값도 함께 바뀌어야 두 화면이 어긋나지 않는다.
  listRoom?: InquiryRoom;
}

const STATUS_OPTIONS: InquiryStatus[] = [
  'UNCONFIRMED',
  'IN_PROGRESS',
  'DONE',
  'ON_HOLD',
];

export function InquiryRoomDetailPanel({
  roomId,
  listRoom,
}: InquiryRoomDetailPanelProps) {
  const queryClient = useQueryClient();
  const { data: room } = useSuspenseQuery(inquiryRoomsQueries.detail(roomId));
  const { data: categories } = useSuspenseQuery(
    inquiryCategoriesQueries.list(),
  );
  const { data: admins } = useSuspenseQuery(
    membersQueries.list({ role: 'ADMIN', size: 100 }),
  );

  const {
    data: messagePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(inquiryMessagesQueries.infiniteList(roomId));

  const { mutate: assignRoom } = useAssignInquiryRoomMutation();
  const { mutate: changeStatus } = useUpdateInquiryRoomStatusMutation();
  const { mutate: changeCategory } = useUpdateInquiryRoomCategoryMutation();
  const { mutate: updateMessage } = useUpdateInquiryMessageMutation();
  const { mutate: deleteMessage } = useDeleteInquiryMessageMutation();

  const invalidateRoom = () => {
    queryClient.invalidateQueries({ queryKey: inquiryRoomsQueries.all });
  };

  // 목록 카드가 마지막 메시지를 미리보기로 쓰므로, 메시지가 바뀌면 방 정보도 함께
  // 다시 받아와야 목록과 상세가 어긋나지 않는다.
  const invalidateMessages = () => {
    queryClient.invalidateQueries({
      queryKey: inquiryMessagesQueries.all(roomId),
    });
    invalidateRoom();
  };

  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = topSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isClosed = room.status === 'DONE' || room.status === 'ON_HOLD';

  // 상세 조회 응답에는 문의자 닉네임이 없다. 목록에서 받아온 값이 있으면 그것을 쓰고,
  // 없으면 상세 응답의 식별자만으로 표시한다.
  const requester = listRoom
    ? getRequesterIdentity(listRoom)
    : {
        name: room.memberId
          ? `회원 #${room.memberId}`
          : `비회원 (${room.guestId?.slice(0, 8) ?? '알 수 없음'})`,
        email: null,
      };

  // 셀렉트 폭이 좁아 긴 이름은 잘린다. 잘린 값을 title로 볼 수 있게 미리 만든다.
  const assigneeName =
    admins.content.find((admin) => admin.id === room.assigneeId)?.nickname ??
    '담당자 미지정';
  const categoryName =
    categories.find((category) => category.id === room.categoryId)?.name ??
    '카테고리 없음';

  // 문의자 메시지는 모두 같은 사람이 보낸 것이라 방 정보의 이름을 그대로 쓴다.
  // 관리자 메시지에는 작성자 표시를 두지 않는다.
  const getSenderName = (message: InquiryMessage): string | undefined =>
    message.senderType === 'ADMIN' ? undefined : requester.name;

  // 서버는 최신순(id desc)으로 페이지를 내려주므로, 오래된 페이지가 뒤에 오도록 뒤집고
  // 각 페이지 내부도 오래된 메시지가 위로 오도록 뒤집어 시간 순으로 렌더링한다.
  const orderedMessages = [...messagePages.pages]
    .reverse()
    .flatMap((page) => [...page.messages].reverse());

  // 이전 메시지와 날짜(연-월-일)가 다르면 그 앞에 날짜 구분자를 끼워 넣는다.
  const timelineItems = orderedMessages.flatMap((message, index) => {
    const previousMessage = orderedMessages[index - 1];
    const needsDateDivider =
      !previousMessage ||
      !isSameDay(previousMessage.createdAt, message.createdAt);
    return needsDateDivider
      ? [
          {
            type: 'divider' as const,
            key: `divider-${message.id}`,
            date: message.createdAt,
          },
          { type: 'message' as const, key: message.id, message },
        ]
      : [{ type: 'message' as const, key: message.id, message }];
  });

  const latestMessageId = orderedMessages[orderedMessages.length - 1]?.id;

  // 최초 진입 시, 그리고 최신 메시지(끝쪽)가 새로 추가됐을 때만 맨 아래로 스크롤한다.
  // 위로 스크롤해서 과거 메시지를 불러온 경우(latestMessageId 불변)에는 스크롤 위치를 건드리지 않는다.
  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    timeline.scrollTop = timeline.scrollHeight;
  }, [latestMessageId]);

  const handleAssigneeChange = (assigneeId: number) => {
    assignRoom(
      { roomId, assigneeId },
      {
        onSuccess: invalidateRoom,
        onError: (error) => alert(`담당자 지정 실패: ${error.message}`),
      },
    );
  };

  const handleStatusChange = (status: InquiryStatus) => {
    changeStatus(
      { roomId, status },
      {
        onSuccess: invalidateRoom,
        onError: (error) => alert(`상태 변경 실패: ${error.message}`),
      },
    );
  };

  // 되돌리려면 상태 셀렉트에서 바꾸면 되므로 따로 확인하지 않고 바로 종료한다.
  const handleCloseRoom = () => {
    handleStatusChange('DONE');
  };

  const handleCategoryChange = (categoryId: number) => {
    changeCategory(
      { roomId, categoryId },
      {
        onSuccess: invalidateRoom,
        onError: (error) => alert(`카테고리 변경 실패: ${error.message}`),
      },
    );
  };

  const handleEditMessage = (messageId: number, content: string) => {
    updateMessage(
      { roomId, messageId, content },
      {
        onSuccess: invalidateMessages,
        onError: (error) => alert(`메시지 수정 실패: ${error.message}`),
      },
    );
  };

  const handleDeleteMessage = (messageId: number) => {
    deleteMessage(
      { roomId, messageId },
      {
        onSuccess: invalidateMessages,
        onError: (error) => alert(`메시지 삭제 실패: ${error.message}`),
      },
    );
  };

  return (
    <DetailContainer>
      <DetailHeader>
        <HeaderInfo>
          <InquiryAvatar name={requester.name} />
          <RequesterText>
            <RoomIdentity title={requester.name}>{requester.name}</RoomIdentity>
            {/* 이메일은 복사해서 쓰는 일이 잦아 눌러서 바로 복사할 수 있게 한다. */}
            {requester.email && <RequesterEmail value={requester.email} />}
          </RequesterText>
        </HeaderInfo>
        <HeaderControls>
          <HeaderSelect
            aria-label="카테고리"
            title={categoryName}
            value={room.categoryId}
            onChange={(e) => handleCategoryChange(Number(e.target.value))}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </HeaderSelect>
          <HeaderSelect
            aria-label="담당자"
            title={assigneeName}
            value={room.assigneeId ?? ''}
            onChange={(e) =>
              e.target.value && handleAssigneeChange(Number(e.target.value))
            }
          >
            <option value="">담당자 미지정</option>
            {admins.content.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.nickname}
              </option>
            ))}
          </HeaderSelect>
          <StatusSelectWrapper>
            <StatusDot $color={INQUIRY_STATUS_COLORS[room.status]} />
            <StatusSelect
              aria-label="상태"
              value={room.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as InquiryStatus)
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {INQUIRY_STATUS_LABELS[status]}
                </option>
              ))}
            </StatusSelect>
          </StatusSelectWrapper>
          {!isClosed && (
            <CloseRoomButton type="button" onClick={handleCloseRoom}>
              <FiCheck size={14} />
              종료
            </CloseRoomButton>
          )}
        </HeaderControls>
      </DetailHeader>

      <MessageTimeline ref={timelineRef}>
        <div ref={topSentinelRef} />
        {isFetchingNextPage && (
          <LoadingMore>이전 메시지 불러오는 중...</LoadingMore>
        )}
        {timelineItems.map((item) =>
          item.type === 'divider' ? (
            <DateDivider key={item.key}>
              <DateDividerLabel>
                {formatDateDivider(item.date)}
              </DateDividerLabel>
            </DateDivider>
          ) : (
            <InquiryMessageBubble
              key={item.key}
              message={item.message}
              senderName={getSenderName(item.message)}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
            />
          ),
        )}
      </MessageTimeline>

      {isClosed && (
        <ClosedNotice>
          종료된 문의입니다. 상태를 변경한 뒤 답변할 수 있습니다.
        </ClosedNotice>
      )}

      <InquiryMessageInput roomId={roomId} disabled={isClosed} />
    </DetailContainer>
  );
}

const DetailContainer = styled.div`
  min-width: 0;

  display: flex;
  flex: 1;
  flex-direction: column;
`;

const DetailHeader = styled.div`
  /* 내용이 길어도 헤더가 패널 밖으로 넘쳐 레이아웃을 밀어내지 않게 한다. */
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: space-between;
`;

const HeaderInfo = styled.div`
  min-width: 0;

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const RequesterText = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
`;

const RoomIdentity = styled.span`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const RequesterEmail = styled(CopyableText)`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

// 공간이 모자라면 셀렉트부터 줄어들게 둔다. 종료 버튼은 flex-shrink를 0으로 두어
// 항상 온전히 보인다.
const HeaderControls = styled.div`
  min-width: 0;

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const HeaderSelect = styled.select`

  /* flex 자식은 기본값이 min-width: auto라 내용보다 작아지지 않는다. 0으로 풀어
     공간이 모자랄 때 셀렉트가 줄어들게 한다. */
  min-width: 0;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  padding-right: 28px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background-color: ${({ theme }) => theme.colors.gray50};
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 6px center;
  background-repeat: no-repeat;
  background-size: 16px 16px;
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  appearance: none;
  cursor: pointer;

  transition: border-color 0.15s, background-color 0.15s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }

  &:focus {
    outline: none;

    background-color: ${({ theme }) => theme.colors.white};

    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// 상담을 끝내는 동작이라 셀렉트와 구분되게 채워진 버튼으로 둔다.
const CloseRoomButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: flex;
  gap: 4px;
  flex-shrink: 0;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.gray800};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;

  transition: background-color 0.15s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray900};
  }
`;

// 좌측 색점이 들어갈 자리만큼 패딩을 넓힌 상태 전용 셀렉트.
const StatusSelect = styled(HeaderSelect)`
  padding-left: 24px;
`;

// 상태 색점을 셀렉트 안쪽에 겹쳐 놓기 위한 래퍼.
const StatusSelectWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;
`;

const StatusDot = styled('span', {
  shouldForwardProp: (prop) => prop !== '$color',
})<{ $color: string }>`
  position: absolute;
  left: 10px;
  width: 8px;
  height: 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background-color: ${({ $color }) => $color};

  pointer-events: none;
`;

const MessageTimeline = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.gray50};

  overflow-y: auto;
`;

const LoadingMore = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  text-align: center;
`;

const DateDivider = styled.div`
  margin: ${({ theme }) => theme.spacing.xs} 0;

  display: flex;
  justify-content: center;
`;

const DateDividerLabel = styled.span`
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray600};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const ClosedNotice = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};

  background-color: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;
