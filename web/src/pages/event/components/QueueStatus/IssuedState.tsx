import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import html2canvas from 'html2canvas';
import { useCallback, useRef } from 'react';
import { formatEventDateTime } from '../../utils/date';
import CloseWarningModal from '../CloseWarningModal';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';

interface IssuedStateProps {
  onClose: () => void;
}

const COUPON_IMAGE_BASE_URL = 'https://www.bombom.news/';

const IssuedState = ({ onClose }: IssuedStateProps) => {
  const device = useDevice();
  const couponRef = useRef<HTMLDivElement>(null);
  const {
    modalRef,
    openModal: openWarningModal,
    closeModal: closeWarningModal,
    isOpen,
  } = useModal({
    closeOnBackdropClick: false,
  });

  const { data: coupons } = useQuery(queries.myCoupons());

  const handleDownload = useCallback(async () => {
    if (!couponRef.current) return;
    const canvas = await html2canvas(couponRef.current);
    const dataUrl = canvas.toDataURL('image/png');
    const fileName = '봄봄_이벤트 당첨_쿠폰.png';

    if (isWebView()) {
      sendMessageToRN({
        type: 'SAVE_IMAGE',
        payload: { imageFileBase64: dataUrl, fileName },
      });
    } else {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    }
  }, []);

  if (!coupons || coupons.length === 0) return null;

  return (
    <>
      <Flex direction="column" gap={16} align="center">
        <CompletedMessage>
          쿠폰이 성공적으로 발급되었습니다! 🎉
        </CompletedMessage>
        <CouponContainer ref={couponRef}>
          <Flex
            direction={device === 'mobile' ? 'column' : 'row'}
            gap={8}
            align="center"
            justify="center"
          >
            {coupons.map((coupon) => {
              return (
                <Flex
                  key={coupon.couponName}
                  direction="column"
                  gap={8}
                  align="center"
                  justify="center"
                >
                  <img
                    src={`${COUPON_IMAGE_BASE_URL}${coupon.imageUrl}`}
                    alt="선착순 경품 쿠폰"
                    width="90%"
                    height="auto"
                  />
                  <Text font={device === 'mobile' ? 't5Regular' : 't6Regular'}>
                    {`${formatEventDateTime(new Date(coupon.issuedAt))} 발급`}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        </CouponContainer>
        <Flex
          direction={device === 'mobile' ? 'column' : 'row'}
          align="center"
          justify="center"
          gap={device === 'mobile' ? 8 : 16}
        >
          <DownloadButton variant="outlined" onClick={handleDownload}>
            💾 이미지로 저장하기
          </DownloadButton>
          <CloseButton onClick={openWarningModal}>닫기</CloseButton>
        </Flex>
      </Flex>
      <Modal
        modalRef={modalRef}
        closeModal={closeWarningModal}
        isOpen={isOpen}
        showCloseButton={false}
      >
        <CloseWarningModal onDownload={handleDownload} onClose={onClose} />
      </Modal>
    </>
  );
};

export default IssuedState;

const CompletedMessage = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
  text-align: center;
`;

const CouponContainer = styled.div`
  width: 100%;
`;

const DownloadButton = styled(Button)`
  width: 100%;
  min-width: 180px;
  border: ${({ theme }) => `2px solid ${theme.colors.black}`};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const CloseButton = styled(Button)`
  width: 100%;
  min-width: 180px;

  font: ${({ theme }) => theme.fonts.t6Regular};
`;
