import styled from '@emotion/styled';
import type { RefObject } from 'react';

const ROUTINE_POINTS = ['하루 1문항', '짧은 집중', '누적 복습'] as const;
const SERVICE_FLOW = [
  '서비스에서 바로 열람',
  '관심 질문 저장',
  '복습 카드 재확인',
] as const;
const ANSWER_FLOW = ['질문 확인', '내 답안 작성', '정답 비교'] as const;

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
      <HeaderWrapper>
        <SectionKicker>EXPERIENCE</SectionKicker>
        <SectionTitle $scale={1.04 - experienceProgress * 0.04}>
          매일메일을 읽는 3가지 성장 루틴
        </SectionTitle>
        <SectionDescription>
          매일 읽는 흐름이 실제 학습 습관으로 이어지도록, 행동 중심 구조로
          정리했습니다.
        </SectionDescription>
      </HeaderWrapper>

      <CardGridWrapper>
        <ExperienceCard
          $area="routine"
          $tone="warm"
          $progress={experienceProgress}
          $offset={0}
        >
          <CardTextWrapper>
            <CardTag $tone="warm">DAILY ROUTINE</CardTag>
            <CardTitle $tone="warm">
              하루 한 문제로 꾸준한 학습 습관 형성
            </CardTitle>
            <CardDescription $tone="warm">
              짧게 시작해도 매일 끊기지 않도록 질문 단위를 작게 설계해, 학습
              루틴이 자연스럽게 유지돼요.
            </CardDescription>
          </CardTextWrapper>

          <InfoPanel $tone="warm" aria-hidden>
            <InfoTitle $tone="warm">루틴 포인트</InfoTitle>
            <InfoList>
              {ROUTINE_POINTS.map((point) => (
                <InfoItem key={point} $tone="warm">
                  {point}
                </InfoItem>
              ))}
            </InfoList>
          </InfoPanel>
        </ExperienceCard>

        <ExperienceCard
          $area="email"
          $tone="deep"
          $progress={experienceProgress}
          $offset={0.08}
        >
          <CardTextWrapper>
            <CardTag $tone="deep">IN-SERVICE READING</CardTag>
            <CardTitle $tone="deep">
              복잡한 이메일함 관리 없이 서비스에서 읽고 바로 복습
            </CardTitle>
            <CardDescription $tone="deep">
              메일함 정리나 분류에 시간을 쓰지 않고, 필요한 질문을 서비스 안에서
              바로 확인하고 이어서 복습할 수 있어요.
            </CardDescription>
          </CardTextWrapper>

          <InfoPanel $tone="deep" aria-hidden>
            <InfoTitle $tone="deep">읽기 흐름</InfoTitle>
            <FlowList>
              {SERVICE_FLOW.map((step, index) => (
                <FlowItem key={step} $tone="deep">
                  <FlowIndex $tone="deep">{index + 1}</FlowIndex>
                  <span>{step}</span>
                </FlowItem>
              ))}
            </FlowList>
          </InfoPanel>
        </ExperienceCard>

        <ExperienceCard
          $area="interview"
          $tone="fresh"
          $progress={experienceProgress}
          $offset={0.16}
        >
          <CardTextWrapper>
            <CardTag $tone="fresh">ANSWER FIRST</CardTag>
            <CardTitle $tone="fresh">
              정답을 확인하기 전에 내 답변을 작성하여 학습 효과 극대화
            </CardTitle>
            <CardDescription $tone="fresh">
              먼저 생각을 글로 정리한 뒤 정답과 비교하는 구조라, 기억 유지와
              실전 응답력이 함께 올라갑니다.
            </CardDescription>
          </CardTextWrapper>

          <InfoPanel $tone="fresh" aria-hidden>
            <InfoTitle $tone="fresh">답변 루프</InfoTitle>
            <FlowList>
              {ANSWER_FLOW.map((step, index) => (
                <FlowItem key={step} $tone="fresh">
                  <FlowIndex $tone="fresh">{index + 1}</FlowIndex>
                  <span>{step}</span>
                </FlowItem>
              ))}
            </FlowList>
            <DraftBox>
              <DraftLabel>내 답변 메모</DraftLabel>
              <DraftText>
                핵심 개념과 근거를 먼저 적고 정답을 비교해요.
              </DraftText>
            </DraftBox>
          </InfoPanel>
        </ExperienceCard>
      </CardGridWrapper>
    </Container>
  );
};

export default LandingExperienceSection;

const Container = styled.section<{ $visible: boolean }>`
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 92px 18px 132px;

  isolation: isolate;

  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? 'translateY(0)' : 'translateY(24px)'};
  transition:
    opacity 460ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 460ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (width >= 920px) {
    padding: 114px 28px 164px;
  }

  &::before {
    position: absolute;
    z-index: -1;
    border-radius: 32px;

    background-color: oklch(98.6% 0.004 55deg);

    content: '';
    inset: 0;
  }
`;

const HeaderWrapper = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: 40px;

  display: flex;
  gap: 14px;
  flex-direction: column;
`;

const SectionKicker = styled.p`
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;

  background-color: rgb(255 255 255 / 70%);
  color: rgb(0 0 0 / 62%);
  font: ${({ theme }) => theme.fonts.t3Regular};
  letter-spacing: 0.1em;
`;

const SectionTitle = styled.h2<{ $scale: number }>`
  color: rgb(0 0 0 / 84%);
  font: ${({ theme }) => theme.fonts.t10Bold};
  line-height: 1.22;

  transform: ${({ $scale }) => `scale(${$scale})`};
  transform-origin: left center;
`;

const SectionDescription = styled.p`
  max-width: 64ch;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  line-height: 1.68;
`;

const CardGridWrapper = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1020px;
  margin: 0 auto;

  display: grid;
  gap: 18px;

  grid-template-areas:
    'routine email'
    'interview interview';
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (width <= 860px) {
    grid-template-areas:
      'routine'
      'email'
      'interview';
    grid-template-columns: 1fr;
  }
`;

const ExperienceCard = styled.article<{
  $area: 'routine' | 'email' | 'interview';
  $tone: 'warm' | 'deep' | 'fresh';
  $progress: number;
  $offset: number;
}>`
  overflow: hidden;
  position: relative;
  min-height: 286px;
  padding: clamp(22px, 3.2vw, 34px);
  border-radius: clamp(24px, 3vw, 36px);

  display: flex;
  gap: clamp(16px, 2.4vw, 28px);
  align-items: flex-start;
  justify-content: space-between;

  background: ${({ $tone }) => {
    if ($tone === 'warm') {
      return `linear-gradient(
        140deg,
        oklch(95% 0.03 94deg) 0%,
        oklch(89% 0.07 84deg) 100%
      )`;
    }

    if ($tone === 'deep') {
      return `linear-gradient(
        145deg,
        oklch(30% 0.03 252deg) 0%,
        oklch(36% 0.05 244deg) 100%
      )`;
    }

    return `linear-gradient(
      150deg,
      oklch(87% 0.07 177deg) 0%,
      oklch(78% 0.1 189deg) 100%
    )`;
  }};

  grid-area: ${({ $area }) => $area};
  opacity: ${({ $progress }) => 0.42 + $progress * 0.58};
  transform: ${({ $progress, $offset }) =>
    `translateY(${(1 - $progress) * (24 + $offset * 26)}px)`};
  transition:
    opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (width <= 960px) {
    flex-direction: column;
  }

  @media (width <= 860px) {
    min-height: 244px;
  }
`;

const CardTextWrapper = styled.div`
  max-width: 52ch;

  display: flex;
  gap: 14px;
  flex: 1;
  flex-direction: column;
`;

const CardTag = styled.span<{ $tone: 'warm' | 'deep' | 'fresh' }>`
  width: fit-content;
  padding: 5px 10px;
  border-radius: 999px;

  background-color: ${({ $tone }) => {
    if ($tone === 'warm') return 'rgb(255 255 255 / 68%)';
    if ($tone === 'deep') return 'rgb(255 255 255 / 15%)';
    return 'rgb(255 255 255 / 56%)';
  }};
  color: ${({ $tone }) => {
    if ($tone === 'deep') return 'rgb(255 255 255 / 86%)';
    return 'rgb(0 0 0 / 58%)';
  }};
  font: ${({ theme }) => theme.fonts.t3Regular};
  letter-spacing: 0.08em;
`;

const CardTitle = styled.h3<{ $tone: 'warm' | 'deep' | 'fresh' }>`
  color: ${({ $tone }) => {
    if ($tone === 'deep') return 'rgb(255 255 255 / 94%)';
    return 'rgb(0 0 0 / 78%)';
  }};
  font: ${({ theme }) => theme.fonts.t8Bold};
  line-height: 1.36;
`;

const CardDescription = styled.p<{ $tone: 'warm' | 'deep' | 'fresh' }>`
  color: ${({ $tone }) => {
    if ($tone === 'deep') return 'rgb(255 255 255 / 72%)';
    return 'rgb(0 0 0 / 62%)';
  }};
  font: ${({ theme }) => theme.fonts.t4Regular};
  line-height: 1.62;
`;

const InfoPanel = styled.div<{ $tone: 'warm' | 'deep' | 'fresh' }>`
  min-width: min(240px, 100%);
  padding: 16px;
  border-radius: 16px;

  display: flex;
  gap: 10px;
  flex-direction: column;

  background-color: ${({ $tone }) => {
    if ($tone === 'deep') return 'rgb(255 255 255 / 10%)';
    return 'rgb(255 255 255 / 60%)';
  }};
`;

const InfoTitle = styled.strong<{ $tone: 'warm' | 'deep' | 'fresh' }>`
  color: ${({ $tone }) => {
    if ($tone === 'deep') return 'rgb(255 255 255 / 90%)';
    return 'rgb(0 0 0 / 72%)';
  }};
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const InfoList = styled.ul`
  padding-left: 16px;

  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const InfoItem = styled.li<{ $tone: 'warm' | 'deep' | 'fresh' }>`
  color: ${({ $tone }) => {
    if ($tone === 'deep') return 'rgb(255 255 255 / 78%)';
    return 'rgb(0 0 0 / 64%)';
  }};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const FlowList = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const FlowItem = styled.div<{ $tone: 'warm' | 'deep' | 'fresh' }>`
  padding: 8px 10px;
  border-radius: 10px;

  display: flex;
  gap: 8px;
  align-items: center;

  background-color: ${({ $tone }) => {
    if ($tone === 'deep') return 'rgb(255 255 255 / 10%)';
    return 'rgb(255 255 255 / 44%)';
  }};
  color: ${({ $tone }) => {
    if ($tone === 'deep') return 'rgb(255 255 255 / 84%)';
    return 'rgb(0 0 0 / 68%)';
  }};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const FlowIndex = styled.span<{ $tone: 'warm' | 'deep' | 'fresh' }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ $tone }) => {
    if ($tone === 'deep') return 'rgb(255 255 255 / 22%)';
    return 'rgb(0 0 0 / 10%)';
  }};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const DraftBox = styled.div`
  margin-top: 2px;
  padding: 10px;
  border-radius: 10px;

  display: flex;
  gap: 4px;
  flex-direction: column;

  background-color: rgb(255 255 255 / 48%);
`;

const DraftLabel = styled.strong`
  color: rgb(0 0 0 / 68%);
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const DraftText = styled.p`
  color: rgb(0 0 0 / 56%);
  font: ${({ theme }) => theme.fonts.t3Regular};
  line-height: 1.5;
`;
