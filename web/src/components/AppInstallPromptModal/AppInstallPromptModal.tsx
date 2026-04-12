import styled from '@emotion/styled';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { useAppInstallPrompt } from '@/hooks/useAppInstallPrompt';
import logo from '#/assets/avif/logo.avif';

const AppInstallPromptModal = () => {
  const {
    modalRef,
    isShowModal,
    handleInstallClick,
    handleLaterClick,
    handleCloseModal,
  } = useAppInstallPrompt();

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isShowModal}
      closeModal={handleCloseModal}
      position="bottom"
      showCloseButton={false}
      showBackdrop={true}
    >
      <Container>
        <ContentWrapper>
          <LogoSection>
            <LogoImage src={logo} alt="봄봄 로고" />
          </LogoSection>
          <TextWrapper>
            <MainText>앱에서는 1초만에!</MainText>
            <SubText>간편하게 로그인하기</SubText>
          </TextWrapper>
        </ContentWrapper>
        <ButtonSection>
          <InstallAppButton onClick={handleInstallClick}>
            편리한 앱으로 보기
          </InstallAppButton>
          <UseMobileWebButton onClick={handleLaterClick} variant="outlined">
            모바일 웹으로 볼래요
          </UseMobileWebButton>
        </ButtonSection>
      </Container>
    </Modal>
  );
};

export default AppInstallPromptModal;

const Container = styled.div`
  width: 100%;

  display: flex;
  gap: 1.5rem;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;
`;

const LogoSection = styled.div`
  overflow: hidden;
  width: 6rem;
  height: 6rem;
  border-radius: 1.5rem;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.primary};
`;

const LogoImage = styled.img`
  width: 4.5rem;
  height: 4.5rem;

  object-fit: contain;
`;

const TextWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  flex: 1;
  flex-direction: column;
`;

const MainText = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
`;

const SubText = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const ButtonSection = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-direction: column;
`;

const InstallAppButton = styled(Button)`
  width: 100%;
  font: ${({ theme }) => theme.fonts.heading5};
`;

const UseMobileWebButton = styled(Button)`
  width: 100%;
  font: ${({ theme }) => theme.fonts.body1};
`;
