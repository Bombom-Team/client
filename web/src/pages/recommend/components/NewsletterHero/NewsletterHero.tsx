import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import SlideCardList from '../SlideCardList/SlideCardList';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';
import logo from '#/assets/avif/logo.avif';

const NewsletterHero = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const device = useDevice();
  const isPC = device === 'pc';

  const handleLoginClick = () => {
    if (isWebView())
      sendMessageToRN({
        type: 'SHOW_LOGIN_SCREEN',
      });
    else navigate({ to: '/login' });
  };

  return (
    <>
      {isLoggedIn ? (
        <SlideCardList />
      ) : (
        <Container>
          <HeroContent isPC={isPC}>
            <HeroIcon src={logo} alt="logo" width={48} height={48} />
            <HeroTitle isPC={isPC}>
              새로운 뉴스레터를 발견해보세요! 📚
            </HeroTitle>
            <HeroSubtitle isPC={isPC}>
              당신의 관심사에 맞는 최고의 뉴스레터를 추천해드립니다.
            </HeroSubtitle>
            <CTAButton
              isPC={isPC}
              onClick={() => {
                handleLoginClick();
                trackEvent({
                  category: 'Navigation',
                  action: '로그인 버튼 클릭',
                  label: '추천 페이지 Hero',
                });
              }}
            >
              로그인하고 맞춤 추천 받기
            </CTAButton>
          </HeroContent>
        </Container>
      )}
    </>
  );
};

export default NewsletterHero;

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  border-radius: 16px;

  background: transparent;
`;

const HeroContent = styled.div<{ isPC: boolean }>`
  z-index: ${({ theme }) => theme.zIndex.content};
  width: 100%;
  height: ${({ isPC }) => (isPC ? '280px' : '200px')};

  display: flex;
  gap: ${({ isPC }) => (isPC ? '16px' : '12px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #f96 0%, #fe5e04 100%);
  text-align: center;
`;

const HeroIcon = styled.img``;

const HeroTitle = styled.h1<{ isPC: boolean }>`
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme, isPC }) =>
    isPC ? theme.fonts.t11Bold : theme.fonts.t10Bold};

  word-break: keep-all;
`;

const HeroSubtitle = styled.p<{ isPC: boolean }>`
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme, isPC }) =>
    isPC ? theme.fonts.t6Regular : theme.fonts.t5Regular};

  opacity: 0.9;
  word-break: keep-all;
`;

const CTAButton = styled.button<{ isPC: boolean }>`
  width: fit-content;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isPC }) =>
    isPC ? theme.fonts.t5Regular : theme.fonts.t3Regular};

  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
    transform: translateY(-2px);
  }
`;
