import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import type { RefObject } from 'react';
import { EXPERIENCE_NOTES } from '@/pages/landing/constants/landingContent';

type LandingExperienceSectionProps = {
  experienceProgress: number;
  visible: boolean;
  sectionRef: RefObject<HTMLElement | null>;
};

const LandingExperienceSection = ({
  experienceProgress,
  visible,
  sectionRef,
}: LandingExperienceSectionProps) => {
  return (
    <Container id="experience" ref={sectionRef} $visible={visible}>
      <SectionKicker>EXPERIENCE</SectionKicker>
      <SectionTitle $scale={1.18 - experienceProgress * 0.18}>
        매일메일을
        <br />
        매일 읽고 싶게
      </SectionTitle>

      <ExperienceStage>
        <ExperiencePhone $progress={experienceProgress}>
          <PhoneTop>[example 이미지] 매일메일 모바일 화면</PhoneTop>
          <PhoneBottom>[텍스트] 카드형 질문 피드 + 빠른 복습 흐름</PhoneBottom>
        </ExperiencePhone>

        {EXPERIENCE_NOTES.map(({ title, text }, index) => (
          <ExperienceNote key={title} $index={index} $progress={experienceProgress}>
            <strong>{title}</strong>
            <p>{text}</p>
          </ExperienceNote>
        ))}
      </ExperienceStage>
    </Container>
  );
};

export default LandingExperienceSection;

const orbFloat = keyframes`
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(0);
  }
`;

const Container = styled.section<{ $visible: boolean }>`
  max-width: 1140px;
  margin: 0 auto;
  padding: 80px 18px 120px;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? 'translateY(0)' : 'translateY(24px)'};
  transition:
    opacity 460ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 460ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (width >= 920px) {
    padding: 100px 28px 150px;
  }
`;

const SectionKicker = styled.p`
  margin-bottom: 12px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t4Regular};
  letter-spacing: 0.14em;

  opacity: 0.38;
`;

const SectionTitle = styled.h2<{ $scale: number }>`
  margin-bottom: 44px;

  font-weight: 800;
  font-size: clamp(1.8rem, 6vw, 3.5rem);
  line-height: 1.03;
  letter-spacing: -0.03em;

  transform: ${({ $scale }) => `scale(${$scale})`};
  transform-origin: left center;
`;

const ExperienceStage = styled.div`
  position: relative;
  min-height: 680px;
  margin-top: 44px;

  @media (width >= 920px) {
    min-height: 760px;
  }
`;

const ExperiencePhone = styled.div<{ $progress: number }>`
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  width: min(76vw, 280px);
  border: 1px solid rgb(0 0 0 / 14%);
  border-radius: 36px;
  box-shadow: 0 34px 54px rgb(0 0 0 / 13%);

  display: flex;
  flex-direction: column;

  background: linear-gradient(
    170deg,
    oklch(95% 0.01 80deg) 0%,
    oklch(90% 0.02 162deg) 100%
  );

  aspect-ratio: 9 / 18;

  transform: translate(-50%, -50%)
    scale(${({ $progress }) => 1.14 - $progress * 0.14});
`;

const PhoneTop = styled.div`
  padding: 20px;

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
  text-align: center;
`;

const PhoneBottom = styled.div`
  padding: 14px 16px 22px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
  line-height: 1.6;
  text-align: center;
`;

const ExperienceNote = styled.article<{ $index: number; $progress: number }>`
  position: absolute;
  max-width: min(42vw, 220px);

  animation: ${orbFloat} 4.8s ease-in-out infinite;

  animation-delay: ${({ $index }) => `${$index * 220}ms`};

  transform: ${({ $index, $progress }) => {
    const xOffset = $index % 2 === 0 ? -1 : 1;
    const yBase = Math.floor($index / 2) * 180;

    return `translate(${xOffset * (40 + $progress * 84)}%, ${yBase - $progress * 24}px)`;
  }};

  &:nth-of-type(1) {
    top: 5%;
    left: 10%;
  }

  &:nth-of-type(2) {
    top: 12%;
    right: 10%;
  }

  &:nth-of-type(3) {
    top: 56%;
    left: 12%;
  }

  &:nth-of-type(4) {
    top: 60%;
    right: 12%;
  }

  strong {
    margin-bottom: 6px;

    display: block;

    color: ${({ theme }) => theme.colors.textPrimary};
    font: ${({ theme }) => theme.fonts.t5Bold};
  }

  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font: ${({ theme }) => theme.fonts.t4Regular};
    line-height: 1.58;
  }

  @media (width <= 760px) {
    position: relative;
    top: auto;
    right: auto;
    left: auto;
    max-width: none;
    margin: 14px 0;

    transform: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
