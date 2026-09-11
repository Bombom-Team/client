import styled from '@emotion/styled';
import {
  useQueryClient,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { inquiryCategoriesQueries } from '@/apis/inquiries/inquiryCategories.query';
import {
  inquiryMessagesQueries,
  useDeleteInquiryMessageMutation,
  useUpdateInquiryMessageMutation,
} from '@/apis/inquiries/inquiryMessages.query';
import {
  inquiryRoomsQueries,
  useAssignInquiryRoomMutation,
  useUpdateInquiryRoomStatusMutation,
} from '@/apis/inquiries/inquiryRooms.query';
import { membersQueries } from '@/apis/members/members.query';
import { formatDateDivider, isSameDay } from '@/lib/formatRelativeTime';
import { getRequesterLabel } from '@/lib/inquiryDisplay';
import { InquiryMessageBubble } from '@/pages/inquiries/InquiryMessageBubble';
import { InquiryMessageInput } from '@/pages/inquiries/InquiryMessageInput';
import {
  INQUIRY_STATUS_LABELS,
  type InquiryRoom,
  type InquiryStatus,
} from '@/types/inquiry';

interface InquiryRoomDetailPanelProps {
  roomId: number;
  // 목록에서 이미 받아온 문의자/담당자 등 정보. 상세 조회 API가 아직 같은 정보를
  // 내려주지 않으므로, 있으면 이 값을 우선 사용해 추가 API 호출 없이 표시한다.
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
  const { mutate: updateMessage } = useUpdateInquiryMessageMutation();
  const { mutate: deleteMessage } = useDeleteInquiryMessageMutation();

  const invalidateRoom = () => {
    queryClient.invalidateQueries({ queryKey: inquiryRoomsQueries.all });
  };

  const invalidateMessages = () => {
    queryClient.invalidateQueries({
      queryKey: inquiryMessagesQueries.all(roomId),
    });
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

  const category = categories.find((c) => c.id === room.categoryId);
  const isClosed = room.status === 'DONE' || room.status === 'ON_HOLD';

  // 서버는 최신순(id desc)으로 페이지를 내려주므로, 오래된 페이지가 뒤에 오도록 뒤집고
  // 각 페이지 내부도 오래된 메시지가 위로 오도록 뒤집어 시간 순으로 렌더링한다.
  const orderedMessages = [...messagePages.pages]
    .reverse()
    .flatMap((page) => [...page.messages].reverse());

  // 이전 메시지와 날짜(연-월-일)가 다르면 그 앞에 날짜 구분자를 끼워 넣는다.
  const timelineItems = orderedMessages.flatMap((message, index) => {
    const previousMessage = orderedMessages[index - 1];
    const needsDateDivider =
      !previousMessage || !isSameDay(previousMessage.createdAt, message.createdAt);
    return needsDateDivider
      ? [
          { type: 'divider' as const, key: `divider-${message.id}`, date: message.createdAt },
          { type: 'message' as const, key: message.id, message },
        ]
      : [{ type: 'message' as const, key: message.id, message }];
  });

  const latestMessageId =
    orderedMessages[orderedMessages.length - 1]?.id;

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
          <RoomIdentity>
            {listRoom
              ? getRequesterLabel(listRoom)
              : room.memberId
                ? `회원 #${room.memberId}`
                : `비회원 (${room.guestId?.slice(0, 8) ?? '알 수 없음'})`}
          </RoomIdentity>
          <CategoryText>{category?.name ?? '카테고리 없음'}</CategoryText>
        </HeaderInfo>
        <HeaderControls>
          <HeaderSelect
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
          <HeaderSelect
            value={room.status}
            onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {INQUIRY_STATUS_LABELS[status]}
              </option>
            ))}
          </HeaderSelect>
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
              <DateDividerLabel>{formatDateDivider(item.date)}</DateDividerLabel>
            </DateDivider>
          ) : (
            <InquiryMessageBubble
              key={item.key}
              message={item.message}
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

      <InquiryMessageInput
        roomId={roomId}
        disabled={isClosed}
        onSent={invalidateMessages}
      />
    </DetailContainer>
  );
}

const DetailContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  min-width: 0;
`;

const DetailHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: baseline;
`;

const RoomIdentity = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const CategoryText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const HeaderControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const HeaderSelect = styled.select`
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
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.white};
  }
`;

const MessageTimeline = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};

  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
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

