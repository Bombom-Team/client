import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { Device } from '@/hooks/useDevice';

const EventLandingHero = () => {
  const navigate = useNavigate();
  const device = useDevice();
  const isPC = device === 'pc';

  const handleNavigateEventClick = () => {
    navigate({ to: '/event' });
  };

  return (
    <Container
      isPC={isPC}
      type="button"
      onClick={() => {
        handleNavigateEventClick();
        trackEvent({
          category: 'Navigation',
          action: '이벤트 페이지 이동버튼 클릭',
          label: '이벤트 페이지 배너',
        });
      }}
    >
      <HeroContent isPC={isPC}>
        <HeroBadge isPC={isPC}>회원가입 500명 돌파</HeroBadge>
        <HeroTitle isPC={isPC}>봄봄이{'\n'}커피 쏜다!</HeroTitle>
        <IndicateText isPC={isPC}>지금 확인하기</IndicateText>
      </HeroContent>
      <EventImage src="/assets/png/event-logo.png" alt="" device={device} />
    </Container>
  );
};

export default EventLandingHero;

const Container = styled.button<{ isPC: boolean }>`
  width: 100%;
  padding: ${({ isPC }) => (isPC ? '0.75rem 1.5rem' : '0.75rem 1rem')};
  border-radius: 1rem;

  display: flex;
  gap: ${({ isPC }) => (isPC ? '1.5rem' : '0.5rem')};
  align-items: center;
  justify-content: center;

  background-color: #f1c972;
`;

const HeroContent = styled.div<{ isPC: boolean }>`
  padding: ${({ isPC }) => (isPC ? '0 1.5rem' : '0 0.25rem')};

  display: flex;
  gap: ${({ isPC }) => (isPC ? '1rem' : '0.75rem')};
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const EventImage = styled.img<{ device: Device }>`
  width: 50%;
  height: auto;
`;

const HeroTitle = styled.p<{ isPC: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isPC }) =>
    isPC ? theme.fonts.heading3 : theme.fonts.heading4};
  text-align: left;

  word-break: keep-all;
`;

const HeroBadge = styled.div<{ isPC: boolean }>`
  padding: ${({ isPC }) => (isPC ? '0.375rem 0.875rem' : '0.25rem 0.75rem')};
  border: 0.125rem solid ${({ theme }) => theme.colors.black};
  border-radius: 2rem;
  box-shadow: 0.125rem 0.125rem 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme, isPC }) => (isPC ? theme.fonts.body2 : theme.fonts.body3)};
  font-weight: 700;
  text-align: center;

  transform: rotate(-2deg);
`;

const IndicateText = styled.p<{ isPC: boolean }>`
  padding: ${({ isPC }) => (isPC ? '0.75rem 1.5rem' : '0.5rem 0.75rem')};
  border: none;
  border-radius: 0.75rem;

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isPC }) => (isPC ? theme.fonts.body2 : theme.fonts.body3)};
  font-weight: 700;
`;
