import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import html2canvas from 'html2canvas';
import { useCallback, useEffect, useRef } from 'react';
import { COUPON_TYPE } from '../../constants/constants';
import { formatEventDateTime } from '../../utils/date';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';
import type { Device } from '@/hooks/useDevice';

interface IssuedStateProps {
  onRegisterDownload?: (fn: () => Promise<void>) => void;
}

const IssuedState = ({ onRegisterDownload }: IssuedStateProps) => {
  const device = useDevice();
  const { data: coupons } = useQuery(queries.myCoupons());
  const couponRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!couponRef.current) return;
    const canvas = await html2canvas(couponRef.current);
    const dataUrl = canvas.toDataURL('image/png');
    const fileName = '봄봄_쿠폰.png';
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

  useEffect(() => {
    if (!coupons || coupons.length === 0) return;
    onRegisterDownload?.(handleDownload);
  }, [coupons, onRegisterDownload, handleDownload]);

  if (!coupons || coupons.length === 0) return null;

  return (
    <Flex direction="column" gap={16} align="center">
      <CompletedMessage device={device}>
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
                  src={coupon.imageUrl}
                  alt="선착순 경품 쿠폰"
                  width="90%"
                  height="auto"
                />
                <Text font={device === 'mobile' ? 'body2' : 'body1'}>
                  {`${formatEventDateTime(new Date(coupon.issuedAt))} 발급 (${COUPON_TYPE[coupon.couponName]})`}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </CouponContainer>
      <DownloadButton onClick={handleDownload}>
        💾 이미지로 저장하기
      </DownloadButton>
    </Flex>
  );
};

export default IssuedState;

const CompletedMessage = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
  text-align: center;
`;

const CouponContainer = styled.div`
  width: 100%;
`;

const DownloadButton = styled(Button)`
  padding: 12px 16px;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;
