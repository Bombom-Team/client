import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { navigateToOAuthLogin } from '@/utils/auth';
import { isIOS, isWebView } from '@/utils/device';
import { isInAppBrowser } from '@/utils/inAppBrowser';
import type { Ref } from 'react';
import AppleIcon from '#/assets/svg/apple.svg';
import GoogleIcon from '#/assets/svg/google.svg';

interface LoginSheetProps {
  modalRef: Ref<HTMLDivElement | null>;
  isOpen: boolean;
  closeModal: () => void;
  title: string;
  redirectPath: string;
}

// 회원 여부는 기존 OAuth 로그인 흐름이 판단한다. 처음 온 사람도 같은 버튼으로 가입된다.
const LoginSheet = ({
  modalRef,
  isOpen,
  closeModal,
  title,
  redirectPath,
}: LoginSheetProps) => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    if (isWebView()) {
      sendMessageToRN({ type: 'SHOW_LOGIN_SCREEN' });
      return;
    }
    if (isInAppBrowser()) {
      navigate({ to: '/login-guide' });
      return;
    }
    navigateToOAuthLogin({ provider: 'google', redirectPath });
  };

  const handleAppleLogin = () => {
    navigateToOAuthLogin({ provider: 'apple', redirectPath });
  };

  const handleSignupClick = () => {
    navigate({ to: '/login', search: { redirect: redirectPath } });
  };

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen}
      closeModal={closeModal}
      position="bottom"
      showCloseButton={false}
    >
      <Container>
        <HeadWrapper>
          <Title>{title}</Title>
          <Description>
            로그인하면 하던 신청을 바로 이어서 할 수 있어요.
          </Description>
        </HeadWrapper>
        <ButtonWrapper>
          <LoginButton variant="outlined" onClick={handleGoogleLogin}>
            <GoogleIcon width={24} height={24} fill="black" />
            Google로 계속하기
          </LoginButton>
          {(!isWebView() || isIOS()) && (
            <LoginButton variant="outlined" onClick={handleAppleLogin}>
              <AppleIcon width={24} height={24} fill="black" />
              Apple로 계속하기
            </LoginButton>
          )}
        </ButtonWrapper>
        <Terms>
          로그인하시면 봄봄의 서비스 약관과 개인정보 처리방침에 동의하게 돼요.
        </Terms>
        <SignupBox>
          아직 회원이 아니신가요?
          <SignupButton type="button" onClick={handleSignupClick}>
            회원가입
          </SignupButton>
        </SignupBox>
      </Container>
    </Modal>
  );
};

export default LoginSheet;

const Container = styled.div`
  width: 100%;
  padding: 8px 4px 4px;

  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const HeadWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t8Bold};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const LoginButton = styled(Button)`
  width: 100%;
  height: 52px;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const Terms = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
  text-align: center;
`;

const SignupBox = styled.p`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const SignupButton = styled.button`
  padding: 4px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t4Bold};

  text-decoration: underline;
`;
