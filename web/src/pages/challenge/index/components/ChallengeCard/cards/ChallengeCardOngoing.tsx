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
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import useChallengeApplyMutation from '@/pages/challenge/index/hooks/useChallengeApplyMutation';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardOngoing = (props: ChallengeCardProps) => {
  const navigate = useNavigate();
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const {
    detail,
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
      to: detail?.isJoined
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

  return (
    <>
      <CardContainer onClick={moveToDetail}>
        <CardHeader>
          <Flex direction="column" gap={8}>
            <Title>{title}</Title>
            <Tag>{generation}기</Tag>
          </Flex>

          <Flex align="flex-end" gap={12}>
            {participantCount > 0 && (
              <Applicant>신청자 {participantCount}명</Applicant>
            )}
            <DDay startDate={startDate} />
          </Flex>
        </CardHeader>

        <CardFooter>
          {detail?.isJoined ? (
            <ChallengeProgress>{detail.progress}% 달성 중</ChallengeProgress>
          ) : (
            <ApplyButton onClick={handleApplyClick}>신청하기</ApplyButton>
          )}
          <CardDetailButton>자세히 보기 →</CardDetailButton>
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

const ChallengeProgress = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const ApplyButton = styled(Button)`
  padding: 10px 16px;
  border-radius: 10px;

  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;
