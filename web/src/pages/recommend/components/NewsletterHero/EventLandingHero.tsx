import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';

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
      <EventImage src="/assets/png/event-logo.png" alt="" />
    </Container>
  );
};

export default EventLandingHero;

const Container = styled.button<{ isPC: boolean }>`
  width: 100%;
  padding: ${({ isPC }) => (isPC ? '12px 24px' : '12px 16px')};
  border-radius: 16px;

  display: flex;
  gap: ${({ isPC }) => (isPC ? '24px' : '8px')};
  align-items: center;
  justify-content: center;

  background-color: #f1c972;
`;

const HeroContent = styled.div<{ isPC: boolean }>`
  padding: ${({ isPC }) => (isPC ? '0 24px' : '0 4px')};

  display: flex;
  gap: ${({ isPC }) => (isPC ? '16px' : '12px')};
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

const EventImage = styled.img`
  width: 50%;
  height: auto;
`;

const HeroTitle = styled.p<{ isPC: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isPC }) =>
    isPC ? theme.fonts.t11Bold : theme.fonts.t10Bold};
  text-align: left;

  word-break: keep-all;
`;

const HeroBadge = styled.div<{ isPC: boolean }>`
  padding: ${({ isPC }) => (isPC ? '6px 14px' : '4px 12px')};
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 32px;
  box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme, isPC }) =>
    isPC ? theme.fonts.t5Regular : theme.fonts.t3Regular};
  font-weight: 700;
  text-align: center;

  transform: rotate(-2deg);
`;

const IndicateText = styled.p<{ isPC: boolean }>`
  padding: ${({ isPC }) => (isPC ? '12px 24px' : '8px 12px')};
  border: none;
  border-radius: 12px;

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isPC }) =>
    isPC ? theme.fonts.t5Regular : theme.fonts.t3Regular};
  font-weight: 700;
`;
