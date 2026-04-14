import { theme } from '@bombom/shared';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { Suspense, useEffect, useRef, useState } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import ArrowIcon from '@/components/icons/ArrowIcon';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
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
import type { MouseEvent } from 'react';

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
  const heroRef = useRef<HTMLDivElement>(null);
  const challengeApplySectionRef = useRef<HTMLDivElement>(null);
  const [isFloatingApplyVisible, setIsFloatingApplyVisible] = useState(false);

  const { modalRef, closeModal, isOpen, openModal } = useModal();

  const { data: challengeLandingInfo } = useQuery(
    queries.challengeLanding(challengeId),
  );

  const { mutate: applyChallenge } = useChallengeApplyMutation({
    challengeId,
  });

  const handleFloatingApplyClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openModal();

    trackEvent({
      category: 'Challenge',
      action: '신청하기 버튼 클릭',
      label: challengeLandingInfo?.name,
    });
  };

  useEffect(() => {
    const handleVisibility = () => {
      const heroElement = heroRef.current;
      const challengeApplySectionElement = challengeApplySectionRef.current;

      if (!heroElement) {
        return;
      }

      const heroBottom = heroElement.getBoundingClientRect().bottom;
      const isHeroVisible = heroBottom > 0;

      if (!challengeApplySectionElement) {
        return;
      }

      const challengeApplySectionRect =
        challengeApplySectionElement.getBoundingClientRect();
      const isSectionVisible =
        challengeApplySectionRect.top < window.innerHeight &&
        challengeApplySectionRect.bottom > 0;

      const shouldShowFloatingApply = !isHeroVisible && !isSectionVisible;

      setIsFloatingApplyVisible(shouldShowFloatingApply);
    };

    handleVisibility();
    window.addEventListener('scroll', handleVisibility, { passive: true });
    window.addEventListener('resize', handleVisibility);

    return () => {
      window.removeEventListener('scroll', handleVisibility);
      window.removeEventListener('resize', handleVisibility);
    };
  }, []);

  if (!challengeLandingInfo) {
    return null;
  }

  return (
    <>
      <Container>
        <LandingHeader />
        <HeroWrapper ref={heroRef}>
          <Hero
            challengeName={challengeLandingInfo.name}
            generation={challengeLandingInfo.generation}
            onApply={openModal}
          />
        </HeroWrapper>
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
        <ChallengeApplySectionWrapper ref={challengeApplySectionRef}>
          <ChallengeApplySection
            challengeName={challengeLandingInfo.name}
            onApply={openModal}
          />
        </ChallengeApplySectionWrapper>
        <FloatingApplyButton
          device={device}
          isVisible={isFloatingApplyVisible}
          onClick={handleFloatingApplyClick}
        >
          지금 참여하기
          <ArrowIcon
            direction="right"
            color={theme.colors.white}
            width={device === 'mobile' ? 24 : 32}
            height={device === 'mobile' ? 24 : 32}
          />
        </FloatingApplyButton>
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

const HeroWrapper = styled.div``;

const ChallengeApplySectionWrapper = styled.div``;

const floatingMotion = keyframes`
  0% {
    transform: translateX(-50%) translateY(0);
    box-shadow: 0 10px 28px rgb(0 0 0 / 20%);
  }
  50% {
    transform: translateX(-50%) translateY(-4px);
    box-shadow: 0 14px 32px rgb(0 0 0 / 24%);
  }
  100% {
    transform: translateX(-50%) translateY(0);
    box-shadow: 0 10px 28px rgb(0 0 0 / 20%);
  }
`;

const FloatingApplyButton = styled(Button)<{
  device: Device;
  isVisible: boolean;
}>`
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  position: fixed;
  bottom: ${({ theme, device }) =>
    device === 'mobile'
      ? `calc(${theme.heights.bottomNav} + env(safe-area-inset-bottom) + 20px)`
      : '28px'};
  left: 50%;
  z-index: ${({ theme }) => theme.zIndex.floating};
  padding: ${({ device }) => (device === 'mobile' ? '14px 20px' : '16px 28px')};
  border-radius: 999px;
  box-shadow: 0 10px 28px rgb(0 0 0 / 20%);

  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};

  animation: ${({ isVisible }) =>
    isVisible ? `${floatingMotion} 2.2s ease-in-out infinite` : 'none'};

  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
  transform: ${({ isVisible }) =>
    isVisible
      ? 'translateX(-50%) translateY(0)'
      : 'translateX(-50%) translateY(10px)'};
  transition:
    opacity 240ms ease,
    transform 240ms ease,
    visibility 0ms linear ${({ isVisible }) => (isVisible ? '0ms' : '240ms')};

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
