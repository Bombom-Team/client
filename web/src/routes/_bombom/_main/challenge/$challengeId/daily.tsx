import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import DailyGuideCard from '@/pages/challenge/daily/components/DailyGuideCard';
import DailyGuideComment from '@/pages/challenge/daily/components/DailyGuideComment';
import DailyGuideCommentsModal from '@/pages/challenge/daily/components/DailyGuideCommentsModal';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/daily',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 데일리 가이드',
      },
    ],
  }),
  component: ChallengeDaily,
});

function ChallengeDaily() {
  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/daily',
  });

  const device = useDevice();
  const isMobile = device === 'mobile';
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const { data: dailyGuide } = useQuery(
    queries.todayDailyGuide(Number(challengeId)),
  );

  if (!dailyGuide) {
    return null;
  }

  const commentSectionEnabled =
    (dailyGuide.type === 'COMMENT' || dailyGuide.type === 'SHARING') &&
    dailyGuide.commentEnabled;

  return (
    <Container>
      <DayBadge>Day {dailyGuide.dayIndex}</DayBadge>
      <DailyGuideCard
        imageUrl={dailyGuide.imageUrl}
        dayIndex={dailyGuide.dayIndex}
      />
      {dailyGuide.notice && (
        <NoticeBox>
          <NoticeIcon isMobile={isMobile}>💡</NoticeIcon>
          <NoticeText isMobile={isMobile}>{dailyGuide.notice}</NoticeText>
        </NoticeBox>
      )}

      {commentSectionEnabled && (
        <>
          <DailyGuideComment
            challengeId={Number(challengeId)}
            dayIndex={dailyGuide.dayIndex}
            myComment={dailyGuide.myComment}
            viewAllCommentsEnabled={dailyGuide.type === 'SHARING'}
            onViewAllComments={openModal}
          />
          <DailyGuideCommentsModal
            challengeId={Number(challengeId)}
            dayIndex={dailyGuide.dayIndex}
            modalRef={modalRef}
            isOpen={isOpen}
            closeModal={closeModal}
          />
        </>
      )}
    </Container>
  );
}

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const DayBadge = styled.div`
  width: fit-content;
  padding: 6px 12px;
  border-radius: 8px;

  align-self: flex-start;

  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;

const NoticeBox = styled.div`
  width: 100%;
  padding: 12px 16px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;

  display: flex;
  gap: 8px;
  align-items: flex-start;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
`;

const NoticeIcon = styled.span<{ isMobile: boolean }>`
  flex-shrink: 0;
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;

const NoticeText = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;
