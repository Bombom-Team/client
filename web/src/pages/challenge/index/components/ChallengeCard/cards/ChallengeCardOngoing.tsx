import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
import ChallengeApplyModal from '../../ChallengeApplyModal/ChallengeApplyModal';
import LoadingModal from '../../ChallengeApplyModal/modals/LoadingModal';
import CardContainer from '../CardContainer';
import { Applicant, CardDetailButton, DDay, Tag, Title } from '../CardElements';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import useChallengeApplyMutation from '@/pages/challenge/index/hooks/useChallengeApplyMutation';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardOngoing = (props: ChallengeCardProps) => {
  const navigate = useNavigate();
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const {
    participationInfo,
    registrationPhase,
    id,
    participantCount,
    generation,
    startDate,
    title,
    newsletters,
  } = props;
  const { mutate: applyChallenge } = useChallengeApplyMutation({
    challengeId: id,
  });

  const moveToDetail = () => {
    trackEvent({
      category: 'Challenge',
      action: 'ONGOING 카드 클릭',
      label: title,
    });

    navigate({
      to: participationInfo?.isJoined
        ? '/challenge/$challengeId'
        : '/challenge/$challengeId/landing',
      params: { challengeId: String(id) },
    });
  };

  const handleApplyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openModal();

    trackEvent({
      category: 'Challenge',
      action: 'ONGOING 신청하기 버튼 클릭',
      label: title,
    });
  };

  const shouldShowApplyButton =
    !participationInfo?.isJoined &&
    (registrationPhase === 'EARLY' || registrationPhase === 'LATE');
  const applyButtonText =
    registrationPhase === 'LATE' ? '추가 신청하기' : '신청하기';

  return (
    <>
      <CardContainer onClick={moveToDetail}>
        <CardHeader>
          <Flex gap={8} align="center">
            <Tag>{generation}기</Tag>
            {participantCount > 0 && (
              <Applicant>{participantCount}명</Applicant>
            )}
          </Flex>
          <DDay startDate={startDate} />
        </CardHeader>

        <Title>{title}</Title>

        <CardFooter>
          {shouldShowApplyButton ? (
            <>
              <ApplyButton onClick={handleApplyClick}>
                {applyButtonText}
              </ApplyButton>
              <CardDetailButton>자세히 보기 →</CardDetailButton>
            </>
          ) : (
            <ProgressSection>
              <ChallengeProgress>
                {participationInfo?.progress ?? 0}% 달성 중
              </ChallengeProgress>
              <ProgressBar rate={participationInfo?.progress ?? 0} />
              <Flex justify="flex-end">
                <CardDetailButton>자세히 보기 →</CardDetailButton>
              </Flex>
            </ProgressSection>
          )}
        </CardFooter>
      </CardContainer>

      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={false}
      >
        <Suspense fallback={<LoadingModal />}>
          <ChallengeApplyModal
            challengeId={id}
            closeModal={closeModal}
            onApply={applyChallenge}
            newsletters={newsletters}
          />
        </Suspense>
      </Modal>
    </>
  );
};

export default ChallengeCardOngoing;

const ProgressSection = styled.div`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const ChallengeProgress = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  font-weight: 600;
`;

const ApplyButton = styled(Button)`
  padding: 10px 16px;
  border-radius: 10px;

  font: ${({ theme }) => theme.fonts.t5Regular};
  font-weight: 600;
`;
