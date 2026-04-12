import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Suspense } from 'react';
import { queries } from '@/apis/queries';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import ChallengeApplyModal from '@/pages/challenge/index/components/ChallengeApplyModal/ChallengeApplyModal';
import LoadingModal from '@/pages/challenge/index/components/ChallengeApplyModal/modals/LoadingModal';
import useChallengeApplyMutation from '@/pages/challenge/index/hooks/useChallengeApplyMutation';
import ChallengeApplySection from '@/pages/challenge/landing/components/ChallengeApplySection';
import ChallengeBenefits from '@/pages/challenge/landing/components/ChallengeBenefits';
import ChallengeChecklist from '@/pages/challenge/landing/components/ChallengeChecklist';
import ChallengeDetail from '@/pages/challenge/landing/components/ChallengeDetail';
import ChallengeRewards from '@/pages/challenge/landing/components/ChallengeRewards';
import Hero from '@/pages/challenge/landing/components/Hero';
import Introduction from '@/pages/challenge/landing/components/Introduction';
import ParticipationGuide from '@/pages/challenge/landing/components/ParticipationGuide';
import RecommendNewsletters from '@/pages/challenge/landing/components/RecommendNewsletters';
import LandingHeader from '@/pages/landing/components/LandingHeader';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/challenge/$challengeId/landing')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 뉴스레터 읽기 챌린지',
      },
    ],
  }),
  component: ChallengeLanding,
});

function ChallengeLanding() {
  const device = useDevice();
  const { challengeId: stringChallengeId } = useParams({
    from: '/challenge/$challengeId/landing',
  });
  const challengeId = Number(stringChallengeId);

  const { modalRef, closeModal, isOpen, openModal } = useModal();

  const { data: challengeLandingInfo } = useQuery(
    queries.challengeLanding(challengeId),
  );

  const { mutate: applyChallenge } = useChallengeApplyMutation({
    challengeId,
  });

  if (!challengeLandingInfo) {
    return null;
  }

  return (
    <>
      <Container>
        <LandingHeader />
        <Hero
          challengeName={challengeLandingInfo.name}
          generation={challengeLandingInfo.generation}
          onApply={openModal}
        />
        <Content device={device}>
          <Introduction
            startDate={challengeLandingInfo.startDate}
            endDate={challengeLandingInfo.endDate}
          />
          <ChallengeBenefits />
          <ChallengeDetail />
          <ChallengeChecklist />
          <RecommendNewsletters />
          <ParticipationGuide />
          <ChallengeRewards />
        </Content>
        <ChallengeApplySection
          challengeName={challengeLandingInfo.name}
          onApply={openModal}
        />
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
            newsletters={challengeLandingInfo.newsletters}
          />
        </Suspense>
      </Modal>
    </>
  );
}

const Container = styled.main`
  width: 100%;
  min-height: 100dvh;
`;

const Content = styled.div<{ device: Device }>`
  padding: ${({ device }) =>
    device === 'mobile' ? '0 8px 80px 8px' : '0 60px 240px 60px'};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '80px' : '180px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.white} 0%,
    #f8f8f8 15%,
    #fafafa 25%,
    #f8f8f8 40%,
    #fffbf7 55%,
    #fff8f4 70%,
    #f8f8f8 85%,
    ${({ theme }) => theme.colors.white} 100%
  );

  word-break: keep-all;
`;
