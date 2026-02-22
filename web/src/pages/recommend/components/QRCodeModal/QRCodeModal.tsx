import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Modal from '@/components/Modal/Modal';
import type { StoreType } from '../PromotionBanner/PromotionBanner.types';
import appStoreQRCodeIcon from '#/assets/avif/app_store_qr_code.avif';
import playStoreQRCodeIcon from '#/assets/avif/play_store_qr_code.avif';

interface QRCodeModalProps {
  modalRef: (node: HTMLDivElement) => void;
  isOpen: boolean;
  onClose: () => void;
  storeType: StoreType | null;
}

const QRCodeModal = ({
  modalRef,
  isOpen,
  onClose,
  storeType,
}: QRCodeModalProps) => {
  const getStoreInfo = () => {
    if (storeType === 'appStore') {
      return { title: 'App Store 앱 설치', src: appStoreQRCodeIcon, alt: '' };
    }
    return { title: 'Google Play 앱 설치', src: playStoreQRCodeIcon, alt: '' };
  };

  const storeInfo = getStoreInfo();

  return (
    <Modal
      modalRef={modalRef}
      isOpen={isOpen && storeType !== null}
      closeModal={onClose}
    >
      <Container>
        {storeType === 'all' ? (
          <>
            <QRCodesWrapper>
              <Flex direction="column" gap={16} align="center">
                <QRModalTitle>App Store</QRModalTitle>
                <QRCodeWrapper>
                  <img
                    src={appStoreQRCodeIcon}
                    width={200}
                    height={200}
                    alt="App Store QR Code"
                  />
                </QRCodeWrapper>
              </Flex>

              <Flex direction="column" gap={16} align="center">
                <QRModalTitle>Google Play</QRModalTitle>
                <QRCodeWrapper>
                  <img
                    src={playStoreQRCodeIcon}
                    width={200}
                    height={200}
                    alt="Google Play QR Code"
                  />
                </QRCodeWrapper>
              </Flex>
            </QRCodesWrapper>
            <QRModalDescription>
              QR 코드를 스캔하여 앱을 설치하세요
            </QRModalDescription>
          </>
        ) : (
          <>
            <QRModalTitle>{storeInfo.title}</QRModalTitle>
            <QRCodeWrapper>
              <img
                src={storeInfo.src}
                width={256}
                height={256}
                alt={storeInfo.alt}
              />
            </QRCodeWrapper>
            <QRModalDescription>
              QR 코드를 스캔하여 앱을 설치하세요
            </QRModalDescription>
          </>
        )}
      </Container>
    </Modal>
  );
};

export default QRCodeModal;

const Container = styled.div`
  padding: 24px 0 0;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: center;
`;

const QRCodesWrapper = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
`;

const QRModalTitle = styled.h2`
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme }) => theme.fonts.heading4};
`;

const QRCodeWrapper = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const QRModalDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;
