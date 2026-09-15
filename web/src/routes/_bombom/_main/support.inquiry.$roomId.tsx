import styled from '@emotion/styled';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  deleteInquiryMessage,
  sendInquiryMessage,
  updateInquiryMessage,
} from '@/apis/inquiry/inquiry.api';
import { queries } from '@/apis/queries';
import Badge from '@/components/Badge/Badge';
import ChevronIcon from '@/components/icons/ChevronIcon';
import { toast } from '@/components/Toast/utils/toastActions';
import { useDevice } from '@/hooks/useDevice';
import { useIntersectionTrigger } from '@/hooks/useIntersectionTrigger';
import InquiryMessageBubble from '@/pages/support/inquiry/components/InquiryMessageBubble';
import InquiryMessageDateDivider from '@/pages/support/inquiry/components/InquiryMessageDateDivider';
import InquiryMessageInput from '@/pages/support/inquiry/components/InquiryMessageInput';
import {
  INQUIRY_ROOM_STATUS_BADGE_VARIANTS,
  INQUIRY_ROOM_STATUS_LABELS,
} from '@/types/inquiry';
import { compareDates, formatDateToKorean } from '@/utils/date';

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
  const device = useDevice();
  const isMobile = device !== 'pc';
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const hasScrolledToBottomRef = useRef(false);
  const [editingMessage, setEditingMessage] = useState<{
    id: number;
    content: string;
  } | null>(null);

  const { data: roomsPage } = useQuery(queries.inquiryRooms());
  const room = roomsPage?.content.find((r) => r.id === roomId);
  const { data: categories } = useQuery(queries.inquiryCategories());
  const categoryName = categories?.find(
    (category) => category.id === room?.categoryId,
  )?.name;

  const {
    data: messagePages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(queries.inquiryMessages(roomId));

  const messages = useMemo(
    () =>
      messagePages?.pages.flatMap((page) => page?.messages ?? []).reverse() ??
      [],
    [messagePages],
  );

  useEffect(() => {
    if (hasScrolledToBottomRef.current) return;
    if (messages.length === 0) return;

    window.scrollTo(0, document.body.scrollHeight);
    hasScrolledToBottomRef.current = true;
  }, [messages]);

  const invalidateMessages = () => {
    queryClient.invalidateQueries({
      queryKey: queries.inquiryMessages(roomId).queryKey,
    });
  };

  const { mutate: mutateSendMessage, isPending: isSending } = useMutation({
    mutationFn: (body: { content?: string; imageUrls?: string[] }) =>
      sendInquiryMessage(roomId, body),
    onSuccess: invalidateMessages,
    onError: () => {
      toast.error('메시지 전송에 실패했습니다.');
    },
  });

  const { mutate: mutateUpdateMessage, isPending: isUpdating } = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: number;
      content: string;
    }) => updateInquiryMessage(roomId, messageId, content),
    onSuccess: () => {
      invalidateMessages();
      setEditingMessage(null);
    },
    onError: () => {
      toast.error('메시지 수정에 실패했습니다.');
    },
  });

  const { mutate: mutateDeleteMessage } = useMutation({
    mutationFn: (messageId: number) => deleteInquiryMessage(roomId, messageId),
    onSuccess: invalidateMessages,
    onError: () => {
      toast.error('메시지 삭제에 실패했습니다.');
    },
  });

  useIntersectionTrigger({
    targetRef: loadMoreRef,
    enabled:
      hasScrolledToBottomRef.current &&
      Boolean(hasNextPage) &&
      !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  const isRoomsLoaded = roomsPage !== undefined;
  const canSendMessage = room?.status !== undefined && room.status !== 'DONE';

  return (
    <ChatCard>
      <Header>
        <BackLink to="/support/inquiry">
          <ChevronIcon direction="left" width={20} height={20} />
          목록으로
        </BackLink>

        {room && (
          <CreatedAtText>
            {formatDateToKorean(new Date(room.createdAt))}
          </CreatedAtText>
        )}

        <HeaderRow>
          <HeaderSpacer />
          {categoryName && <CategoryText>{categoryName}</CategoryText>}
          <HeaderSpacer>
            {room && (
              <Badge
                text={INQUIRY_ROOM_STATUS_LABELS[room.status]}
                variant={INQUIRY_ROOM_STATUS_BADGE_VARIANTS[room.status]}
              />
            )}
          </HeaderSpacer>
        </HeaderRow>
      </Header>

      <MessageList>
        <LoadMoreTrigger ref={loadMoreRef} />
        {messages.map((message, index) => {
          const prevMessage = messages[index - 1];
          const messageDate = new Date(message.createdAt);
          const showDateDivider =
            !prevMessage ||
            compareDates(new Date(prevMessage.createdAt), messageDate) !== 0;

          return (
            <Fragment key={message.id}>
              {showDateDivider && (
                <InquiryMessageDateDivider date={messageDate} />
              )}
              <InquiryMessageBubble
                message={message}
                isOwnMessage={message.senderType === 'USER'}
                isMobile={isMobile}
                isEditing={editingMessage?.id === message.id}
                onStartEdit={() =>
                  setEditingMessage({
                    id: message.id,
                    content: message.content,
                  })
                }
                onDelete={(messageId) => mutateDeleteMessage(messageId)}
              />
            </Fragment>
          );
        })}
      </MessageList>

      {isRoomsLoaded && !canSendMessage ? (
        <ClosedNotice>문의가 종료되었습니다.</ClosedNotice>
      ) : (
        <InquiryMessageInput
          disabled={!isRoomsLoaded}
          isSubmitting={isSending}
          onSubmit={mutateSendMessage}
          editingMessage={editingMessage}
          isUpdating={isUpdating}
          onSubmitEdit={(content) =>
            editingMessage &&
            mutateUpdateMessage({ messageId: editingMessage.id, content })
          }
          onCancelEdit={() => setEditingMessage(null)}
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

const Header = styled.div`
  padding: 0 0 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.stroke};

  display: flex;
  gap: 2px;
  flex-direction: column;
`;

const BackLink = styled(Link)`
  margin-bottom: 8px;

  display: flex;
  align-items: center;
  gap: 2px;

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
