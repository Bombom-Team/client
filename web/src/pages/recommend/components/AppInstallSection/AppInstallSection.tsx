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
  padding: 1.375rem;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 1.25rem;
  box-shadow:
    0 0.625rem 0.9375rem -0.1875rem rgb(0 0 0 / 10%),
    0 0.25rem 0.375rem -0.25rem rgb(0 0 0 / 10%);

  display: flex;
  gap: 1rem;
  flex-direction: column;

  background: rgb(255 255 255 / 80%);

  backdrop-filter: blur(0.625rem);
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
  padding: 0.875rem 1.25rem;
  border: ${({ variant, theme }) =>
    variant === 'playStore'
      ? `0.0625rem solid ${theme.colors.stroke}`
      : 'none'};
  border-radius: 0.75rem;

  display: flex;
  gap: 0.5rem;
  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: ${({ variant, theme }) =>
    variant === 'appStore' ? theme.colors.black : theme.colors.white};
  color: ${({ variant, theme }) =>
    variant === 'appStore' ? theme.colors.white : theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.heading6};
  font-weight: 600;

  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
    transform: translateY(-0.125rem);
  }

  &:active {
    transform: translateY(0);
  }
`;
