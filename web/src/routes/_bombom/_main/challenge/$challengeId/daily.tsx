import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import useModal from '@/components/Modal/useModal';
import Tooltip from '@/components/Tooltip/Tooltip';
import { useDevice } from '@/hooks/useDevice';
import DailyGuideComment from '@/pages/challenge/daily/components/DailyGuideComment';
import DailyGuideCommentsModal from '@/pages/challenge/daily/components/DailyGuideCommentsModal';
import LockIcon from '#/assets/svg/lock.svg';

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
  const [showTooltip, setShowTooltip] = useState(false);

  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/daily',
  });
  const device = useDevice();
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const { data: dailyGuide } = useQuery(
    queries.todayDailyGuide(Number(challengeId)),
  );

  const isMobile = device === 'mobile';

  const handleViewAllAnswersClick = () => {
    if (dailyGuide?.myComment.exists) {
      openModal();
    }
  };

  const handleButtonMouseEnter = () => {
    if (!dailyGuide?.myComment.exists) {
      setShowTooltip(true);
    }
  };

  const handleButtonMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleButtonTouch = () => {
    if (!dailyGuide?.myComment.exists) {
      setShowTooltip((prev) => !prev);
    }
  };

  if (!dailyGuide) {
    return null;
  }

  return (
    <Container>
      <GuideCard>
        <DayBadge>Day {dailyGuide.dayIndex}</DayBadge>
        <GuideImage
          src={dailyGuide.imageUrl}
          alt={`Day ${dailyGuide.dayIndex} guide`}
        />
        {dailyGuide.notice && (
          <NoticeBox>
            <NoticeIcon isMobile={isMobile}>💡</NoticeIcon>
            <NoticeText isMobile={isMobile}>{dailyGuide.notice}</NoticeText>
          </NoticeBox>
        )}

        {dailyGuide.type === 'COMMENT' && dailyGuide.commentEnabled && (
          <>
            <DailyGuideComment
              challengeId={Number(challengeId)}
              dayIndex={dailyGuide.dayIndex}
              myComment={dailyGuide.myComment}
            />
            <ButtonWrapper>
              <ViewAllAnswersButton
                variant="outlined"
                onClick={handleViewAllAnswersClick}
                onMouseEnter={handleButtonMouseEnter}
                onMouseLeave={handleButtonMouseLeave}
                onTouchStart={handleButtonTouch}
              >
                {!dailyGuide.myComment.exists && (
                  <LockIcon width={16} height={16} />
                )}
                전체 답변 보기
              </ViewAllAnswersButton>
              <Tooltip opened={showTooltip} position="left">
                답변을 제출해야 확인할 수 있어요!
              </Tooltip>
            </ButtonWrapper>
            <DailyGuideCommentsModal
              challengeId={Number(challengeId)}
              dayIndex={dailyGuide.dayIndex}
              modalRef={modalRef}
              isOpen={isOpen}
              closeModal={closeModal}
            />
          </>
        )}
      </GuideCard>
    </Container>
  );
}

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 24px;
  flex-direction: column;
`;

const GuideCard = styled.div`
  width: 100%;
  border-radius: 12px;

  display: flex;
  gap: 16px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const DayBadge = styled.div`
  width: fit-content;
  padding: 6px 12px;
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;

const GuideImage = styled.img`
  width: 100%;
  max-height: 600px;

  object-fit: contain;
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

const ButtonWrapper = styled.div`
  position: relative;
  align-self: flex-end;
`;

const ViewAllAnswersButton = styled(Button)`
  font: ${({ theme }) => theme.fonts.body3};
`;
