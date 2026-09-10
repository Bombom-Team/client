import styled from '@emotion/styled';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useRef } from 'react';
import {
  deleteInquiryMessage,
  sendInquiryMessage,
  updateInquiryMessage,
} from '@/apis/inquiry/inquiry.api';
import { queries } from '@/apis/queries';
import { toast } from '@/components/Toast/utils/toastActions';
import InquiryMessageBubble from '@/pages/support/inquiry/components/InquiryMessageBubble';
import InquiryMessageInput from '@/pages/support/inquiry/components/InquiryMessageInput';
import { INQUIRY_ROOM_STATUS_LABELS } from '@/types/inquiry';

export const Route = createFileRoute('/support/inquiry/$roomId')({
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
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const hasScrolledToBottomRef = useRef(false);

  const { data: roomsPage } = useQuery(queries.inquiryRooms());
  const room = roomsPage?.content.find((r) => r.id === roomId);

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
    if (!messageListRef.current || messages.length === 0) return;

    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
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

  const { mutate: mutateUpdateMessage } = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: number;
      content: string;
    }) => updateInquiryMessage(roomId, messageId, content),
    onSuccess: invalidateMessages,
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

  useEffect(() => {
    if (!loadMoreRef.current || !messageListRef.current) return;
    if (!hasScrolledToBottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: messageListRef.current, threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, messages.length]);

  const isRoomsLoaded = roomsPage !== undefined;
  const canSendMessage = room?.status !== undefined && room.status !== 'DONE';

  return (
    <ChatCard>
      <Header>
        {room && (
          <StatusText>{INQUIRY_ROOM_STATUS_LABELS[room.status]}</StatusText>
        )}
      </Header>

      <MessageList ref={messageListRef}>
        <LoadMoreTrigger ref={loadMoreRef} />
        {messages.map((message) => (
          <InquiryMessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderType === 'USER'}
            onEdit={(messageId, content) =>
              mutateUpdateMessage({ messageId, content })
            }
            onDelete={(messageId) => mutateDeleteMessage(messageId)}
          />
        ))}
      </MessageList>

      {isRoomsLoaded && !canSendMessage ? (
        <ClosedNotice>문의가 종료되었습니다.</ClosedNotice>
      ) : (
        <InquiryMessageInput
          disabled={!isRoomsLoaded}
          isSubmitting={isSending}
          onSubmit={mutateSendMessage}
        />
      )}
    </ChatCard>
  );
}

const ChatCard = styled.div`
  width: 100%;
  height: calc(100vh - 320px);
  max-width: 800px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 0 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.stroke};

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StatusText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const MessageList = styled.div`
  padding: 16px 0;

  display: flex;
  gap: 12px;
  flex: 1;
  flex-direction: column;

  overflow-y: auto;
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
