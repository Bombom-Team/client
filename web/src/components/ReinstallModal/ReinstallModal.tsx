import { APP_STORE_LINK, PLAY_STORE_LINK } from '@bombom/shared';
import styled from '@emotion/styled';
import { useRef } from 'react';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { getDeviceInWebView, needsReinstall } from '@/utils/device';
import logo from '#/assets/avif/logo.avif';

const ReinstallModal = () => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!needsReinstall()) return null;

  const handleReinstallClick = () => {
    const device = getDeviceInWebView();
    window.location.href =
      device === 'android' ? PLAY_STORE_LINK : APP_STORE_LINK;
  };

  return (
    <Modal
      modalRef={modalRef}
      isOpen={true}
      closeModal={() => {}}
      position="fullscreen"
      showCloseButton={false}
      showBackdrop={true}
    >
      <Container>
        <LogoImage src={logo} alt="봄봄 로고" />
        <TextWrapper>
          <Title>앱을 최신 버전으로 업데이트해 주세요</Title>
          <Description>
            앱을 재설치하면 정상적으로 이용할 수 있어요.
          </Description>
        </TextWrapper>
        <ReinstallButton onClick={handleReinstallClick}>
          앱 재설치하기
        </ReinstallButton>
      </Container>
    </Modal>
  );
};

export default ReinstallModal;

const Container = styled.div`
  width: 100%;
  max-width: 280px;

  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const LogoImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 20px;

  object-fit: contain;
`;

const TextWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
  white-space: pre-line;
`;

const ReinstallButton = styled(Button)`
  width: 100%;
  font: ${({ theme }) => theme.fonts.heading5};
`;
