import styled from '@emotion/styled';
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
import useChallengeCancelMutation from '@/pages/challenge/index/hooks/useChallengeCancelMutation';
import { openExternalLink } from '@/utils/externalLink';
import type { ChallengeCardProps } from '../ChallengeCard';

const ChallengeCardBeforeStart = (props: ChallengeCardProps) => {
  const { newsletters, participantCount, generation, startDate, title, id } =
    props;
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const { mutate: applyChallenge } = useChallengeApplyMutation({
    challengeId: id,
  });
  const { mutate: cancelMutation } = useChallengeCancelMutation({
    challengeId: id,
  });

  const handleCardClick = () => {
    trackEvent({
      category: 'Challenge',
      action: 'BEFORE_START 카드 클릭',
      label: title,
    });

    openExternalLink(
      'https://maroon-geranium-880.notion.site/2d103dcf205680dfa045d47385af3df9?source=copy_link',
    );
  };

  const handleApplyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openModal();

    trackEvent({
      category: 'Challenge',
      action: '신청하기 버튼 클릭',
      label: title,
    });
  };

  const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    cancelMutation();

    trackEvent({
      category: 'Challenge',
      action: '신청취소 버튼 클릭',
      label: title,
    });
  };

  return (
    <>
      <CardContainer onClick={handleCardClick}>
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
          {props.detail?.isJoined ? (
            <ApplyButton variant="outlined" onClick={handleCancelClick}>
              신청취소
            </ApplyButton>
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

export default ChallengeCardBeforeStart;

const ApplyButton = styled(Button)`
  padding: 10px 16px;
  border-radius: 10px;

  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;
