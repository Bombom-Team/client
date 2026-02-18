import styled from '@emotion/styled';
import { useMemo } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useCaptcha } from '../../hooks/useCaptcha';
import { useIssueCouponMutation } from '../../hooks/useIssueCouponMutation';
import { ENV } from '@/apis/env';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useCountdown } from '@/hooks/useCountdown';
import { useDevice } from '@/hooks/useDevice';
import type { QueueEntry } from '@/apis/event/event.api';
import type { Device } from '@/hooks/useDevice';

interface ReadyStateProps {
  queueEntry: QueueEntry;
  refetchQueueEntry: () => void;
}

const ReadyState = ({ queueEntry, refetchQueueEntry }: ReadyStateProps) => {
  const device = useDevice();
  const { isCaptchaValid } = useCaptcha();
  const { mutate: issueCoupon } = useIssueCouponMutation({
    couponName: queueEntry.couponName,
  });

  const expiredCaptchaTime = useMemo(
    () =>
      queueEntry.activeExpiresInSeconds
        ? new Date(Date.now() + queueEntry.activeExpiresInSeconds * 1000)
        : null,
    [],
  );

  const { leftTime } = useCountdown({
    targetTime: expiredCaptchaTime ?? new Date(),
    onComplete: expiredCaptchaTime ? refetchQueueEntry : undefined,
    completeDelay: 3000,
  });

  const handleCaptchaChange = async (token: string | null) => {
    if (token) {
      const isValid = await isCaptchaValid(token);
      if (isValid) {
        issueCoupon();
      }
    }
  };

  return (
    <Flex direction="column" gap={16} align="center">
      <ReadyMessage device={device}>
        인증 후 지금 바로 쿠폰을 발급받으세요!
      </ReadyMessage>

      <ReCAPTCHA sitekey={ENV.captchaSiteKey} onChange={handleCaptchaChange} />

      {expiredCaptchaTime && (
        <Flex direction="column" gap={4} align="center" justify="center">
          <Text font={device === 'mobile' ? 'body3' : 'body2'}>
            ⏰ 이 창은
            <HighLight>{leftTime.totalSeconds}</HighLight>초 후에 만료됩니다.
          </Text>
          <Text
            font={device === 'mobile' ? 'body4' : 'body3'}
            color="textTertiary"
          >
            만료 전에 인증을 통과해주세요!
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default ReadyState;

const ReadyMessage = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
  text-align: center;
`;

const HighLight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;
