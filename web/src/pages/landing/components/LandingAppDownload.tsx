import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import useModal from '@/components/Modal/useModal';
import { useDevice } from '@/hooks/useDevice';
import QRCodeModal from '@/pages/recommend/components/QRCodeModal/QRCodeModal';
import { downloadApp } from '@/utils/downloadApp';
import type { Device } from '@/hooks/useDevice';
import type { StoreType } from '@/pages/recommend/components/PromotionBanner/PromotionBanner.types';
import AppStoreIcon from '#/assets/svg/apple.svg';
import PlayStoreIcon from '#/assets/svg/play-store.svg';

const LandingAppDownload = () => {
  const device = useDevice();
  const { modalRef, closeModal, isOpen, openModal } = useModal();
  const [storeType, setStoreType] = useState<StoreType | null>(null);

  const handleStoreButtonClick = (type: StoreType) => {
    if (device === 'mobile') {
      downloadApp();
    } else {
      setStoreType(type);
      openModal();
    }
  };

  const handleCloseModal = () => {
    setStoreType(null);
    closeModal();
  };

  return (
    <>
      <Container device={device}>
        <ContentWrapper device={device}>
          <Title device={device}>언제 어디서나 이어지는 인사이트</Title>
          <Description device={device}>
            PC는 물론, 모바일 앱에서도
            <br />
            언제 어디서나 뉴스레터를 편하게 읽어보세요.
          </Description>
          <ButtonGroup device={device}>
            <AppStoreButton
              onClick={() => handleStoreButtonClick('appStore')}
              device={device}
            >
              <AppStoreIcon width={32} fill={theme.colors.icons} />
              App Store 설치
            </AppStoreButton>
            <GooglePlayStoreButton
              onClick={() => handleStoreButtonClick('playStore')}
              variant="outlined"
              device={device}
            >
              <PlayStoreIcon width={32} />
              Google Play 설치
            </GooglePlayStoreButton>
          </ButtonGroup>
        </ContentWrapper>
      </Container>

      <QRCodeModal
        modalRef={modalRef}
        isOpen={isOpen}
        onClose={handleCloseModal}
        storeType={storeType}
      />
    </>
  );
};

export default LandingAppDownload;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '60px 0' : '100px 0')};

  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'mobile' ? '400px' : '800px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '20px' : '28px')};
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.heading5};
  font-weight: 400;
`;

const ButtonGroup = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '12px' : '16px')};
  flex-direction: ${({ device }) => (device === 'mobile' ? 'column' : 'row')};
  align-items: center;
  justify-content: center;
`;

const StoreButton = styled(Button)<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '100%' : 'fit-content')};

  font: ${({ theme }) => theme.fonts.heading6};

  box-sizing: border-box;

  transition: opacity 0.5s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const AppStoreButton = styled(StoreButton)`
  padding: ${({ device }) => (device === 'mobile' ? '16px 28px' : '18px 32px')};

  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};

  &:hover {
    background-color: ${({ theme }) => theme.colors.black};
  }
`;

const GooglePlayStoreButton = styled(StoreButton)`
  padding: ${({ device }) => (device === 'mobile' ? '14px 22px' : '16px 26px')};
  border: 2px solid ${({ theme }) => theme.colors.primary};

  color: ${({ theme }) => theme.colors.primary};
`;
