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
import BomBomFooter from '@/components/Footer/BomBomFooter';
import MobileMainHeader from '@/components/Header/MobileMainHeader';
import PCHeader from '@/components/Header/PCHeader';
import { toast } from '@/components/Toast/utils/toastActions';
import { useDevice } from '@/hooks/useDevice';
import { useWebViewRegisterToken } from '@/libs/webview/useWebViewRegisterToken';
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
  useWebViewRegisterToken();
  const device = useDevice();
  const isMobile = device !== 'pc';
  const { roomId: roomIdParam } = Route.useParams();
  const roomId = Number(roomIdParam);
  const queryClient = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);

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
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isClosed = room?.status === 'DONE';

  return (
    <>
      {device === 'pc' ? <PCHeader activeNav={null} /> : <MobileMainHeader />}

      <Container isMobile={isMobile}>
        <ChatCard>
          <Header>
            <Title>1:1 문의하기</Title>
            {room && (
              <StatusText>{INQUIRY_ROOM_STATUS_LABELS[room.status]}</StatusText>
            )}
          </Header>

          <MessageList>
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

          {isClosed ? (
            <ClosedNotice>문의가 종료되었습니다.</ClosedNotice>
          ) : (
            <InquiryMessageInput
              isSubmitting={isSending}
              onSubmit={mutateSendMessage}
            />
          )}
        </ChatCard>
      </Container>

      <BomBomFooter />
    </>
  );
}

const Container = styled.main<{ isMobile: boolean }>`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ isMobile, theme }) =>
    isMobile
      ? `calc(${theme.heights.headerMobile} + ${theme.safeArea.top} + 24px) 16px 24px`
      : `calc(${theme.heights.headerPC} + 40px + 24px) 16px 24px`};

  box-sizing: border-box;
`;

const ChatCard = styled.div`
  width: 100%;
  height: calc(100vh - 200px);
  max-width: 800px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.stroke};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.t8Bold};
`;

const StatusText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const MessageList = styled.div`
  padding: 16px;

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
