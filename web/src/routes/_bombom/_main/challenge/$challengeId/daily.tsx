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
  const { challengeId: stringChallengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/daily',
  });
  const challengeId = Number(stringChallengeId);

  const device = useDevice();
  const isMobile = device === 'mobile';
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const { data: dailyGuide } = useQuery(queries.todayDailyGuide(challengeId));

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
        challengeId={challengeId}
        isRemindEnabled={dailyGuide.type === 'REMIND'}
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
            challengeId={challengeId}
            dayIndex={dailyGuide.dayIndex}
            myComment={dailyGuide.myComment}
            viewAllCommentsEnabled={dailyGuide.type === 'SHARING'}
            onViewAllComments={openModal}
          />
          <DailyGuideCommentsModal
            challengeId={challengeId}
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
  gap: 1rem;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const DayBadge = styled.div`
  width: fit-content;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;

  align-self: flex-start;

  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;

const NoticeBox = styled.div`
  width: 100%;
  padding: 0.75rem 1rem;
  border-left: 0.25rem solid ${({ theme }) => theme.colors.primary};
  border-radius: 0.5rem;

  display: flex;
  gap: 0.5rem;
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
