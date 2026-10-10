import styled from '@emotion/styled';
/* eslint-disable import/named */
import { captureMessage } from '@sentry/react';
/* eslint-enable import/named */
import { useEffect } from 'react';
import Button from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';

const SUPPORT_URL = 'https://e0pq0.channel.io/';

type OAuthLoginFailureReason =
  | 'server_error'
  | 'temporarily_unavailable'
  | 'unknown_oauth_error';

export const getOAuthLoginFailureReason = (
  error: string,
): OAuthLoginFailureReason | null => {
  if (error === 'access_denied') return null;
  if (error === 'server_error' || error === 'temporarily_unavailable') {
    return error;
  }

  return 'unknown_oauth_error';
};

const LoginFailureModal = () => {
  const device = useDevice();
  const isMobile = device !== 'pc';
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  useEffect(() => {
    const url = new URL(window.location.href);
    const error = url.searchParams.get('error');
    if (error === null) return;

    const reason = getOAuthLoginFailureReason(error);
    if (reason) {
      captureMessage('Web OAuth login failed', {
        level: 'warning',
        tags: {
          flow: 'auth_login',
          stage: 'oauth_redirect',
          reason,
        },
      });
    }

    openModal();
  }, [openModal]);

  return (
    <Modal
      modalRef={modalRef}
      closeModal={closeModal}
      isOpen={isOpen}
      showCloseButton={false}
    >
      <Container isMobile={isMobile}>
        <Title>로그인을 완료하지 못했어요</Title>
        <Description>
          잠시 후 다시 시도해주세요. 같은 문제가 계속되면 문의하기로 알려주세요.
        </Description>
        <ButtonGroup>
          <SupportLink
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            문의하기
          </SupportLink>
          <ConfirmButton onClick={closeModal}>확인</ConfirmButton>
        </ButtonGroup>
      </Container>
    </Modal>
  );
};

export default LoginFailureModal;

const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '240px' : '320px')};

  display: flex;
  gap: 16px;
  flex-direction: column;

  text-align: center;
  word-break: keep-all;
  overflow-wrap: break-word;
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const SupportLink = styled.a`
  min-height: 44px;
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 16px;

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-decoration: none;
`;

const ConfirmButton = styled(Button)`
  min-height: 44px;

  flex: 1;

  font: ${({ theme }) => theme.fonts.t5Regular};
`;
