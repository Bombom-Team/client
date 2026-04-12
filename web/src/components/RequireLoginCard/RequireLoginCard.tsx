import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import Button from '../Button/Button';
import { useDevice } from '@/hooks/useDevice';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';
import LockIcon from '#/assets/svg/lock.svg';

const RequireLoginCard = () => {
  const navigate = useNavigate();
  const device = useDevice();
  const isMobile = device === 'mobile';
  const handleLoginClick = () => {
    if (isWebView())
      sendMessageToRN({
        type: 'SHOW_LOGIN_SCREEN',
      });
    else navigate({ to: '/login' });
  };

  return (
    <Container isMobile={isMobile}>
      <StyledLockIcon />
      <Title>로그인이 필요해요</Title>
      <DescriptionWrapper>
        <Lead isMobile={isMobile}>
          현재 페이지를 이용하시려면 먼저 로그인해 주세요
        </Lead>
        <Support isMobile={isMobile}>
          봄봄에서 더 많은 특별한 기능들을 만나보실 수 있어요!
        </Support>
      </DescriptionWrapper>
      <GoToLoginButton onClick={handleLoginClick}>
        봄봄 시작하기
      </GoToLoginButton>
    </Container>
  );
};

export default RequireLoginCard;

const Container = styled.section<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '23.75rem')};
  height: 31.25rem;
  margin: auto 0;
  padding: ${({ isMobile }) => (isMobile ? '1rem' : '1.75rem')};

  display: flex;
  gap: 1.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};

  ${({ isMobile }) =>
    !isMobile &&
    `
    border-radius: 1.25rem;
    box-shadow: 0 1.5625rem 3.125rem -0.75rem rgb(0 0 0 / 25%);
  
  `}
`;

const StyledLockIcon = styled(LockIcon)`
  width: 3.25rem;
  height: 3.25rem;

  color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.heading3};
`;

const DescriptionWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-direction: column;
`;

const Lead = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
  text-align: center;
`;

const Support = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
  text-align: center;
`;

const GoToLoginButton = styled(Button)`
  width: 100%;
  max-width: 380px;

  font: ${({ theme }) => theme.fonts.heading5};
`;
