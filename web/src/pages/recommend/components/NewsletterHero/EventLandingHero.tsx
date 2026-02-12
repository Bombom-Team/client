import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import ArrowIcon from '@/components/icons/ArrowIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';
import type { Device } from '@/hooks/useDevice';

const EventLandingHero = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const device = useDevice();
  const isPC = device === 'pc';

  const handleNavigateEventClick = () => {
    navigate({ to: '/event' });
  };

  const handleLoginClick = () => {
    if (isWebView())
      sendMessageToRN({
        type: 'SHOW_LOGIN_SCREEN',
      });
    else navigate({ to: '/login' });
  };

  return (
    <Container isPC={isPC}>
      <HeroContent isPC={isPC}>
        <HeroTitle isPC={isPC}>
          봄봄은 지금{'\n'}
          <Highlight>선착순 이벤트</Highlight> 중!
        </HeroTitle>
        {isLoggedIn ? (
          <HeroButton
            isPC={isPC}
            onClick={() => {
              handleNavigateEventClick();
              trackEvent({
                category: 'Navigation',
                action: '이벤트 페이지 이동버튼 클릭',
                label: '이벤트 페이지 배너',
              });
            }}
          >
            지금 확인하기
            <ArrowIcon direction="right" color={theme.colors.primary} />
          </HeroButton>
        ) : (
          <HeroButton
            isPC={isPC}
            onClick={() => {
              handleLoginClick();
              trackEvent({
                category: 'Navigation',
                action: '로그인 버튼 클릭',
                label: '이벤트 페이지 배너',
              });
            }}
          >
            로그인하고 참여하기
          </HeroButton>
        )}
      </HeroContent>
      <EventImage src="/assets/png/event-logo.png" alt="" device={device} />
    </Container>
  );
};

export default EventLandingHero;

const Container = styled.section<{ isPC: boolean }>`
  width: 100%;
  padding: ${({ isPC }) => (isPC ? '12px 24px' : '12px 16px')};
  border-radius: 16px;

  display: flex;
  gap: ${({ isPC }) => (isPC ? '24px' : '8px')};
  align-items: center;
  justify-content: center;

  background-color: #cf0;
`;

const HeroContent = styled.div<{ isPC: boolean }>`
  padding: ${({ isPC }) => (isPC ? '0 24px' : '0 4px')};

  display: flex;
  gap: ${({ isPC }) => (isPC ? '16px' : '8px')};
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
    isPC ? theme.fonts.heading3 : theme.fonts.heading5};
  text-align: left;

  word-break: keep-all;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const HeroButton = styled.button<{ isPC: boolean }>`
  padding: ${({ isPC }) => (isPC ? '12px 24px' : '8px 12px')};
  border: none;
  border-radius: 12px;

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isPC }) => (isPC ? theme.fonts.body2 : theme.fonts.body3)};
  font-weight: 700;

  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
    transform: translateY(-2px);
  }
`;
