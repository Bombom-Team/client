import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useState } from 'react';
import Flex from '@/components/Flex';
import useModal from '@/components/Modal/useModal';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import QRCodeModal from '@/pages/recommend/components/QRCodeModal/QRCodeModal';
import { downloadApp } from '@/utils/downloadApp';
import type { Device } from '@/hooks/useDevice';
import type { StoreType } from '@/pages/recommend/components/PromotionBanner/PromotionBanner.types';
import playStoreIcon from '#/assets/avif/play_store.avif';
import AppStoreIcon from '#/assets/svg/apple.svg';

const AppInstallSection = () => {
  const device = useDevice();
  const { modalRef, closeModal, isOpen, openModal } = useModal();
  const [storeType, setStoreType] = useState<StoreType | null>(null);

  const handleStoreButtonClick = (type: StoreType) => {
    if (device === 'pc') {
      setStoreType(type);
      openModal();
    } else {
      downloadApp();
    }
  };

  const handleCloseModal = () => {
    setStoreType(null);
    closeModal();
  };

  return (
    <>
      <Container>
        <ContentWrapper gap={20} direction="column" align="center">
          <Flex direction="column" gap={8} align="center">
            <Text
              as="h3"
              color="textPrimary"
              font={device === 'mobile' ? 'heading6' : 'heading5'}
            >
              언제 어디서나 이어지는 인사이트
            </Text>
            <Text
              as="p"
              color="textTertiary"
              font={device === 'mobile' ? 'body3' : 'body2'}
            >
              PC는 물론, 모바일 앱에서도
              {'\n'}
              언제 어디서나 뉴스레터를 편하게 읽어보세요.
            </Text>
          </Flex>

          <ButtonWrapper gap={12} wrap="wrap">
            <StoreButton
              device={device}
              onClick={() => handleStoreButtonClick('appStore')}
              variant="appStore"
            >
              <AppStoreIcon width={24} height={24} fill={theme.colors.white} />
              App Store
            </StoreButton>
            <StoreButton
              device={device}
              onClick={() => handleStoreButtonClick('playStore')}
              variant="playStore"
            >
              <img
                src={playStoreIcon}
                alt="Google Play"
                width={24}
                height={24}
              />
              Google Play
            </StoreButton>
          </ButtonWrapper>
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

export default AppInstallSection;

const Container = styled.section`
  width: 100%;
  max-width: 400px;
  padding: 22px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 20px;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 10%),
    0 4px 6px -4px rgb(0 0 0 / 10%);

  display: flex;
  gap: 16px;
  flex-direction: column;

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(10px);
`;

const ButtonWrapper = styled(Flex)`
  width: 100%;
  flex-wrap: wrap;
`;

const ContentWrapper = styled(Flex)`
  text-align: center;
`;

const StoreButton = styled.button<{
  device: Device;
  variant: 'appStore' | 'playStore';
}>`
  min-width: 160px;
  padding: 14px 20px;
  border: ${({ variant, theme }) =>
    variant === 'playStore' ? `1px solid ${theme.colors.stroke}` : 'none'};
  border-radius: 12px;

  display: flex;
  gap: 8px;
  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: ${({ variant, theme }) =>
    variant === 'appStore' ? theme.colors.black : theme.colors.white};
  color: ${({ variant, theme }) =>
    variant === 'appStore' ? theme.colors.white : theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    theme.fonts.heading6};
  font-weight: 600;

  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
