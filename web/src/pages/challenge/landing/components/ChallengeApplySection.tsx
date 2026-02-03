import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import ChallengeApplyModal from '../../index/components/ChallengeApplyModal/ChallengeApplyModal';
import LoadingModal from '../../index/components/ChallengeApplyModal/modals/LoadingModal';
import useChallengeApplyMutation from '../../index/hooks/useChallengeApplyMutation';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { MouseEvent } from 'react';

interface ChallengeApplySectionProps {
  challengeId: number;
}

const ChallengeApplySection = ({ challengeId }: ChallengeApplySectionProps) => {
  const device = useDevice();
  const { modalRef, closeModal, isOpen, openModal } = useModal();

  const { data: challenges } = useQuery(queries.challenges());
  const currentChallenge = challenges?.find(
    (challenge) => challenge.id === challengeId,
  );
  const newsletters = currentChallenge?.newsletters ?? [];
  const title = currentChallenge?.title ?? '';

  const { mutate: applyChallenge } = useChallengeApplyMutation({
    challengeId,
  });

  const handleApplyClick = (event: MouseEvent) => {
    event.stopPropagation();
    openModal();

    trackEvent({
      category: 'Challenge',
      action: '신청하기 버튼 클릭',
      label: title,
    });
  };

  return (
    <>
      <Container device={device}>
        <Title device={device}>지금 바로 시작하세요</Title>
        <ParticipantButton device={device} onClick={handleApplyClick}>
          챌린지 참여하기
        </ParticipantButton>
        <Text color="textTertiary" font="caption">
          © 2026 Bombom. All rights reserved.
        </Text>
      </Container>

      <Modal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        showCloseButton={false}
      >
        <Suspense fallback={<LoadingModal />}>
          <ChallengeApplyModal
            challengeId={challengeId}
            closeModal={closeModal}
            onApply={applyChallenge}
            newsletters={newsletters}
          />
        </Suspense>
      </Modal>
    </>
  );
};

export default ChallengeApplySection;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) =>
    device === 'mobile' ? '48px 12px' : '120px 60px'};

  display: flex;
  gap: 28px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.navy};
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.white};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading3 : theme.fonts.heading1};
  text-align: center;
`;

const ParticipantButton = styled(Button)<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '16px 24px' : '20px 36px')};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};

  &:hover {
    opacity: 0.8;
  }
`;
