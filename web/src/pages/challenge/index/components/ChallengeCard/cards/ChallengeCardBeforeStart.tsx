import styled from '@emotion/styled';
import { Suspense } from 'react';
import { getDday } from '../../../utils/date';
import ChallengeApplyModal from '../../ChallengeApplyModal/ChallengeApplyModal';
import LoadingModal from '../../ChallengeApplyModal/modals/LoadingModal';
import CardContainer from '../CardContainer';
import { CardDetailButton, Tag } from '../CardElements';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import Text from '@/components/Text';
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

  const dday = getDday(startDate);

  const handleCardClick = () => {
    trackEvent({
      category: 'Challenge',
      action: '카드 클릭',
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
            <Text as="h3" font="heading5" color="textPrimary">
              {title}
            </Text>
            <Tag>{generation}기</Tag>
          </Flex>

          <Flex align="flex-end" gap={12}>
            {participantCount > 0 && (
              <Text font="body3" color="textSecondary">
                신청자 {participantCount}명
              </Text>
            )}
            <Text font="body2" color="primary">
              D{dday}
            </Text>
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
