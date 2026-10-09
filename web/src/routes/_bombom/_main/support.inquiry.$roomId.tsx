import { ApiError } from '@bombom/shared/apis';
import styled from '@emotion/styled';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { INQUIRY_ROOMS_QUERY_KEY } from '@/apis/inquiry/inquiry.query';
import { queries } from '@/apis/queries';
import Badge from '@/components/Badge/Badge';
import ChevronIcon from '@/components/icons/ChevronIcon';
import { useDevice } from '@/hooks/useDevice';
import { useIntersectionTrigger } from '@/hooks/useIntersectionTrigger';
import InquiryMessageBubble from '@/pages/support/inquiry/components/InquiryMessageBubble';
import InquiryMessageDateDivider from '@/pages/support/inquiry/components/InquiryMessageDateDivider';
import InquiryMessageInput from '@/pages/support/inquiry/components/InquiryMessageInput';
import { useInquiryMessageDeleteMutation } from '@/pages/support/inquiry/hooks/useInquiryMessageDeleteMutation';
import { useInquiryMessageSendMutation } from '@/pages/support/inquiry/hooks/useInquiryMessageSendMutation';
import {
  INQUIRY_ROOM_STATUS_BADGE_VARIANTS,
  INQUIRY_ROOM_STATUS_LABELS,
} from '@/types/inquiry';
import { compareDates, formatDateToKorean } from '@/utils/date';
import type { SendInquiryMessageBody } from '@/apis/inquiry/inquiry.api';

export const Route = createFileRoute('/_bombom/_main/support/inquiry/$roomId')({
  head: () => ({
    meta: [
      { title: '봄봄 | 1:1 문의하기' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: InquiryRoomDetailPage,
});

function InquiryRoomDetailPage() {
  const { roomId: roomIdParam } = Route.useParams();
  const roomId = Number(roomIdParam);
  const isValidRoomId = !Number.isNaN(roomId);
  const device = useDevice();
  const isMobile = device !== 'pc';
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasScrolledToBottomRef = useRef(false);
  const prevScrollHeightRef = useRef<number | null>(null);
  const isSendingRef = useRef(false);

  const { data: room, error: roomError } = useQuery({
    ...queries.inquiryRoom(roomId),
    enabled: isValidRoomId,
  });
  const isRoomNotFound =
    !isValidRoomId ||
    (roomError instanceof ApiError && roomError.status === 404);
  const isRoomFetchError = roomError != null && !isRoomNotFound;
  const isAwaitingMoreMessages =
    room?.status === 'UNCONFIRMED' || room?.status === 'IN_PROGRESS';
  const { data: categories } = useQuery(queries.inquiryCategories());
  const categoryName = categories?.find(
    (category) => category.id === room?.categoryId,
  )?.name;

  const {
    data: messagePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchedAfterMount,
    isSuccess: isMessagesFetchSuccess,
  } = useInfiniteQuery({
    ...queries.inquiryMessages(roomId),
    enabled: isValidRoomId,
    refetchInterval: isAwaitingMoreMessages ? 10000 : false,
  });

  useEffect(() => {
    if (!isFetchedAfterMount || !isMessagesFetchSuccess) return;

    queryClient.invalidateQueries({
      queryKey: queries.inquiryUnreadStatus().queryKey,
    });
    queryClient.invalidateQueries({
      queryKey: INQUIRY_ROOMS_QUERY_KEY,
    });
    queryClient.invalidateQueries({
      queryKey: queries.inquiryRoom(roomId).queryKey,
    });
  }, [
    isFetchedAfterMount,
    isMessagesFetchSuccess,
    messagePages,
    queryClient,
    roomId,
  ]);

  const messages = useMemo(
    () =>
      messagePages?.pages.flatMap((page) => page?.messages ?? []).reverse() ??
      [],
    [messagePages],
  );

  useEffect(() => {
    if (messages.length === 0) return;

    if (!hasScrolledToBottomRef.current) {
      window.scrollTo(0, document.body.scrollHeight);
      hasScrolledToBottomRef.current = true;
      return;
    }

    if (isSendingRef.current) {
      window.scrollTo(0, document.body.scrollHeight);
      isSendingRef.current = false;
      return;
    }

    if (prevScrollHeightRef.current !== null) {
      const scrollHeightDiff =
        document.body.scrollHeight - prevScrollHeightRef.current;
      window.scrollTo(0, window.scrollY + scrollHeightDiff);
      prevScrollHeightRef.current = null;
    }
  }, [messages]);

  const { mutateAsync: mutateSendMessage, isPending: isSending } =
    useInquiryMessageSendMutation({ roomId });
  const { mutate: mutateDeleteMessage, isPending: isDeleting } =
    useInquiryMessageDeleteMutation({ roomId });

  const handleSendMessage = async (body: SendInquiryMessageBody) => {
    isSendingRef.current = true;
    try {
      await mutateSendMessage(body);
    } catch (error) {
      isSendingRef.current = false;
      throw error;
    }
  };

  const handleLoadMore = () => {
    prevScrollHeightRef.current = document.body.scrollHeight;
    fetchNextPage();
  };

  useIntersectionTrigger({
    targetRef: loadMoreRef,
    enabled:
      hasScrolledToBottomRef.current &&
      Boolean(hasNextPage) &&
      !isFetchingNextPage,
    onIntersect: handleLoadMore,
  });

  const isRoomLoaded = room !== undefined;
  const canSendMessage = isAwaitingMoreMessages;

  return (
    <ChatCard>
      <Header isMobile={isMobile}>
        <BackLink to="/support/inquiry">
          <ChevronIcon direction="left" width={20} height={20} />
          목록으로
        </BackLink>

        {room && (
          <CreatedAtText>
            {formatDateToKorean(new Date(room.createdAt ?? ''))}
          </CreatedAtText>
        )}

        <HeaderRow>
          <HeaderSpacer />
          {categoryName && <CategoryText>{categoryName}</CategoryText>}
          <HeaderSpacer>
            {room?.status && (
              <Badge
                text={INQUIRY_ROOM_STATUS_LABELS[room.status]}
                variant={INQUIRY_ROOM_STATUS_BADGE_VARIANTS[room.status]}
              />
            )}
          </HeaderSpacer>
        </HeaderRow>

        <ResponseTimeNotice>
          문의 답변에는 평일 기준 평균 2시간이 소요됩니다.
        </ResponseTimeNotice>
      </Header>

      <MessageList>
        <LoadMoreTrigger ref={loadMoreRef} />
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const messageDate = new Date(message.createdAt ?? '');
          const showDateDivider =
            !prevMessage ||
            compareDates(new Date(prevMessage.createdAt ?? ''), messageDate) !==
              0;

          return (
            <Fragment key={message.id}>
              {showDateDivider && (
                <InquiryMessageDateDivider date={messageDate} />
              )}
              <InquiryMessageBubble
                message={message}
                isOwnMessage={message.senderType === 'USER'}
                isMobile={isMobile}
                isDeletePending={isDeleting}
                onDelete={mutateDeleteMessage}
              />
            </Fragment>
          );
        })}
      </MessageList>

      {isRoomNotFound ? (
        <ClosedNotice>문의를 찾을 수 없습니다.</ClosedNotice>
      ) : isRoomFetchError ? (
        <ClosedNotice>
          문의를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </ClosedNotice>
      ) : isRoomLoaded && !canSendMessage ? (
        <ClosedNotice>문의가 종료되었습니다.</ClosedNotice>
      ) : (
        <InquiryMessageInput
          disabled={!isRoomLoaded}
          isSubmitting={isSending}
          onSubmit={handleSendMessage}
        />
      )}
    </ChatCard>
  );
}

const ChatCard = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

const Header = styled.div<{ isMobile: boolean }>`
  position: sticky;
  top: ${({ isMobile, theme }) =>
    isMobile
      ? `calc(${theme.heights.headerMobile} + ${theme.safeArea.top})`
      : `calc(${theme.heights.headerPC} + 40px)`};
  z-index: ${({ theme }) => theme.zIndex.panel};

  padding: 0 0 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.stroke};

  display: flex;
  gap: 2px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const BackLink = styled(Link)`
  margin-bottom: 8px;

  display: flex;
  gap: 2px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  text-decoration: none;
`;

const CreatedAtText = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
  text-align: center;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderSpacer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const CategoryText = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Bold};
  text-align: center;
`;

const ResponseTimeNotice = styled.p`
  margin-top: 4px;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
  text-align: center;
`;

const MessageList = styled.div`
  padding: 4px 0;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 1px;
`;

const ClosedNotice = styled.p`
  padding: 16px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;
