import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import Modal from '@/components/Modal/Modal';
import { useDevice } from '@/hooks/useDevice';
import { convertRelativeTime } from '@/pages/challenge/comments/utils/date';
import type { DailyGuideCommentItem } from '@/apis/challenge/challenge.api';

interface DailyGuideCommentsModalProps {
  challengeId: number;
  dayIndex: number;
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  closeModal: () => void;
}

const DailyGuideCommentsModal = ({
  challengeId,
  dayIndex,
  modalRef,
  isOpen,
  closeModal,
}: DailyGuideCommentsModalProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const { data, isLoading } = useQuery({
    ...queries.dailyGuideComments({
      challengeId,
      dayIndex,
      size: 50,
      sort: 'createdAt,desc',
    }),
    enabled: isOpen,
  });

  const comments: DailyGuideCommentItem[] = data?.content ?? [];
  const totalCount = data?.totalElements ?? 0;
  const hasComments = comments.length > 0;

  return (
    <Modal
      modalRef={modalRef}
      closeModal={closeModal}
      isOpen={isOpen}
      position={isMobile ? 'bottom' : 'center'}
      showCloseButton={!isMobile}
    >
      <ModalContent isMobile={isMobile}>
        <ModalHeader>
          <ModalTitle isMobile={isMobile}>다른 사람들의 답변</ModalTitle>
          <CountBadge isMobile={isMobile}>총 {totalCount}개</CountBadge>
        </ModalHeader>
        <ModalDescription isMobile={isMobile}>
          같은 질문에 참여한 사람들의 답변을 모았어요.
        </ModalDescription>
        <CommentsWrapper isMobile={isMobile}>
          {isLoading ? (
            <StateText isMobile={isMobile}>답변을 불러오는 중이에요.</StateText>
          ) : !hasComments ? (
            <StateText isMobile={isMobile}>
              아직 작성된 답변이 없어요.
            </StateText>
          ) : (
            <CommentsList>
              {comments.map((comment, index) => (
                <CommentItem
                  key={`${comment.nickname}-${comment.createdAt}-${index}`}
                >
                  <CommentMeta>
                    <Nickname isMobile={isMobile}>{comment.nickname}</Nickname>
                    <Timestamp isMobile={isMobile}>
                      {convertRelativeTime(comment.createdAt)}
                    </Timestamp>
                  </CommentMeta>
                  <CommentText isMobile={isMobile}>
                    {comment.comment}
                  </CommentText>
                </CommentItem>
              ))}
            </CommentsList>
          )}
        </CommentsWrapper>
      </ModalContent>
    </Modal>
  );
};

export default DailyGuideCommentsModal;

const ModalContent = styled.div<{ isMobile: boolean }>`
  width: 100%;
  max-width: 520px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  text-align: left;
`;

const ModalHeader = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ModalTitle = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const CountBadge = styled.span<{ isMobile: boolean }>`
  padding: 2px 8px;
  border-radius: 999px;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.caption : theme.fonts.body3};
`;

const ModalDescription = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const CommentsWrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;
  max-height: ${({ isMobile }) => (isMobile ? '50vh' : '360px')};
  padding: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.backgroundHover};

  overflow-y: auto;
`;

const CommentsList = styled.ul`
  margin: 0;
  padding: 0;

  display: flex;
  gap: 12px;
  flex-direction: column;

  list-style: none;
`;

const CommentItem = styled.li`
  padding: 16px;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
`;

const CommentMeta = styled.div`
  margin-bottom: 8px;

  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Nickname = styled.span<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
  font-weight: 600;
`;

const Timestamp = styled.time<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.caption : theme.fonts.body3};
`;

const CommentText = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const StateText = styled.p<{ isMobile: boolean }>`
  width: 100%;
  min-height: 160px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;
