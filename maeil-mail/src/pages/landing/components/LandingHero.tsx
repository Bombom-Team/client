import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import HeroBackground from './HeroBackground';

const LandingHero = () => {
  return (
    <Container>
      <HeroBackground />
      <HeroInner>
        <HeroContent>
          <HeroKicker>MAEIL MAIL × BOMBOM</HeroKicker>
          <HeroTitle>
            <HeroTitleLine $delay={360}>이제 매일메일도</HeroTitleLine>
            <br />
            <HeroTitleLine $delay={500}>봄봄에서 읽습니다</HeroTitleLine>
          </HeroTitle>
          <HeroDescription>
            개발자를 위한 BE/FE 기술 면접 질문 큐레이션.
            <br />
            메일함이 아니라, 봄봄 안에서 끝까지 읽는 경험으로 바뀌었어요.
          </HeroDescription>
          <HeroMeta>
            <span>봄봄 전용 제공</span>
            <span>개발자 타깃</span>
            <span>무료 이용</span>
          </HeroMeta>
          <HeroCTARow>
            <HeroPrimaryCTA href="#about">매일메일 시작하기</HeroPrimaryCTA>
            <HeroSecondaryCTA href="#experience">둘러보기</HeroSecondaryCTA>
          </HeroCTARow>
        </HeroContent>
      </HeroInner>

      <HeroScrollCue aria-hidden>↓</HeroScrollCue>
    </Container>
  );
};

export default LandingHero;

const heroBlurReveal = keyframes`
  from {
    opacity: 0;
    filter: blur(12px);
    transform: translateY(14px);
  }

  to {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
`;

const scrollCuePulse = keyframes`
  0%,
  100% {
    opacity: 0.5;
    transform: translateX(-50%) translateY(0);
  }

  50% {
    opacity: 0.9;
    transform: translateX(-50%) translateY(9px);
  }
`;

const Container = styled.section`
  overflow: hidden;
  position: relative;
  min-height: 100dvh;
  padding: 100px 18px 80px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: white;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;

  display: grid;
  gap: 48px;
  align-items: center;

  grid-template-columns: 1fr;

  @media (width >= 860px) {
    gap: 32px;
    grid-template-columns: 1fr 1fr;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeroKicker = styled.p`
  margin-bottom: 10px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
  letter-spacing: 0.16em;

  animation: ${heroBlurReveal} 700ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const HeroTitle = styled.h1`
  margin-bottom: 14px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 900;
  font-size: clamp(2.3rem, 9.6vw, 6.3rem);
  line-height: 0.96;
  letter-spacing: -0.03em;
`;

const HeroTitleLine = styled.span<{ $delay: number }>`
  display: inline-block;
  animation: ${heroBlurReveal} 900ms cubic-bezier(0.22, 1, 0.36, 1)
    ${({ $delay }) => `${$delay}ms`} both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const HeroDescription = styled.p`
  max-width: 42ch;
  margin-bottom: 18px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  line-height: 1.7;

  animation: ${heroBlurReveal} 700ms cubic-bezier(0.22, 1, 0.36, 1) 620ms both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const HeroMeta = styled.div`
  margin-bottom: 22px;

  display: flex;
  flex-wrap: wrap;
  align-items: center;

  animation: ${heroBlurReveal} 600ms cubic-bezier(0.22, 1, 0.36, 1) 760ms both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  span {
    padding: 0 12px;
    border-right: 1px solid rgb(0 0 0 / 14%);

    color: ${({ theme }) => theme.colors.textSecondary};
    font: ${({ theme }) => theme.fonts.t4Regular};
    letter-spacing: 0.06em;

    &:first-of-type {
      padding-left: 0;
    }

    &:last-of-type {
      border-right: none;
    }
  }
`;

const HeroCTARow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;

  animation: ${heroBlurReveal} 600ms cubic-bezier(0.22, 1, 0.36, 1) 880ms both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const HeroPrimaryCTA = styled.a`
  padding: 13px 26px;
  border-radius: 100px;

  display: inline-flex;
  align-items: center;

  background: oklch(14% 0.008 260deg);
  color: white;
  font: ${({ theme }) => theme.fonts.t6Bold};
  letter-spacing: 0.01em;
  white-space: nowrap;

  transition:
    background 160ms ease,
    transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    background: oklch(22% 0.01 260deg);
    transform: scale(1.04);
  }

  &:active {
    transform: scale(0.97);
    transition-duration: 80ms;
  }
`;

const HeroSecondaryCTA = styled.a`
  padding: 13px 22px;
  border: 1px solid rgb(0 0 0 / 20%);
  border-radius: 100px;

  display: inline-flex;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  letter-spacing: 0.01em;
  white-space: nowrap;

  transition:
    border-color 180ms ease,
    color 180ms ease,
    transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};

    border-color: rgb(0 0 0 / 40%);
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.97);
  }
`;

const HeroScrollCue = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 48px;

  color: rgb(0 0 0 / 28%);
  font-size: 1.5rem;
  line-height: 1;
  text-align: center;

  animation: ${scrollCuePulse} 2.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
