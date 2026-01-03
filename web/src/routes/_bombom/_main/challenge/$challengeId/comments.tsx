import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice, type Device } from '@/hooks/useDevice';
import { challengeComments } from '@/mocks/datas/challengeComments';
import AddCommentModalContent from '@/pages/challenge/comments/components/AddCommentModal/AddCommentModalContent';
import CommentCard from '@/pages/challenge/comments/components/CommentCard';
import DateFilter from '@/pages/challenge/comments/components/DateFilter';
import UserChallengeInfo from '@/pages/challenge/dashboard/components/UserChallengeInfo/UserChallengeInfo';
import { filterWeekdays, formatDate, getDatesInRange } from '@/utils/date';

const CHALLENGE_PERIOD = {
  startDate: '2025-11-05',
  endDate: '2026-02-02',
  totalDays: 31,
};

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/comments',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 한 줄 코멘트',
      },
    ],
  }),
  component: ChallengeComments,
});

function ChallengeComments() {
  const today = formatDate(new Date(), '-');
  const latestSelectableDate =
    today < CHALLENGE_PERIOD.endDate ? today : CHALLENGE_PERIOD.endDate;

  const [currentDate, setCurrentDate] = useState(latestSelectableDate);

  const { modalRef, openModal, closeModal, isOpen } = useModal();
  const device = useDevice();

  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/comments',
  });

  const { data: challengeInfo } = useQuery(
    queries.challengesInfo(Number(challengeId)),
  );

  const { data: memberChallengeProgressInfo } = useQuery(
    queries.memberProgress(Number(challengeId)),
  );

  const totalDates = getDatesInRange(
    CHALLENGE_PERIOD.startDate,
    latestSelectableDate,
  );

  return (
    <Container>
      {challengeInfo && memberChallengeProgressInfo && (
        <UserChallengeInfoWrapper device={device}>
          <UserChallengeInfo
            challengeInfo={challengeInfo}
            memberChallengeProgressInfo={memberChallengeProgressInfo}
          />
        </UserChallengeInfoWrapper>
      )}
      <DateFilter
        weekdays={filterWeekdays(totalDates)}
        selectedDate={currentDate}
        onDateSelect={setCurrentDate}
      />

      <ContentWrapper device={device}>
        {currentDate === today && (
          <AddCommentBox>
            <AddCommentTitle device={device}>
              오늘 읽은 뉴스레터, 한 줄만 남겨요.
            </AddCommentTitle>
            <AddCommentButton device={device} onClick={openModal}>
              코멘트 작성하기
            </AddCommentButton>
          </AddCommentBox>
        )}

        <CommentSection device={device}>
          <Comments>
            <CommentTitle device={device}>내 코멘트</CommentTitle>
            {challengeComments.length > 0 && (
              <CardList device={device}>
                <CommentCard {...challengeComments[0]!} />
              </CardList>
            )}
          </Comments>

          <Comments>
            <CommentTitle device={device}>전체 코멘트</CommentTitle>
            {challengeComments.length > 0 ? (
              <CardList device={device}>
                {challengeComments.map((comment, index) => (
                  <CommentCard key={`my-${index}`} {...comment} />
                ))}
              </CardList>
            ) : (
              <EmptyState device={device}>
                아직 작성한 코멘트가 없어요. 가장 먼저 남겨보세요!
              </EmptyState>
            )}
          </Comments>
        </CommentSection>
      </ContentWrapper>

      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        position={device === 'mobile' ? 'bottom' : 'center'}
        showCloseButton={false}
      >
        <AddCommentModalContent closeCommentModal={closeModal} />
      </Modal>
    </Container>
  );
}

export default ChallengeComments;

const Container = styled.section`
  width: 100%;
  min-height: 100vh;

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UserChallengeInfoWrapper = styled.div<{ device: Device }>`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 16px;
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '20px 0' : '24px')};
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '32px' : '44px')};
  flex-direction: column;

  background-color: ${({ theme, device }) =>
    device === 'mobile' ? 'none' : theme.colors.backgroundHover};
`;

const AddCommentBox = styled.article`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const AddCommentTitle = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const AddCommentButton = styled(Button)<{ device: Device }>`
  width: 100%;
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
`;

const CardList = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  flex-direction: column;
`;

const EmptyState = styled.div<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body2};
  text-align: center;
`;

const CommentSection = styled.article<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '20px' : '28px')};
  flex-direction: column;
`;

const Comments = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const CommentTitle = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.heading6};
`;
