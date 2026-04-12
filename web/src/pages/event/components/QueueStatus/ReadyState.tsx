import { keyframes } from '@emotion/react';
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

  const { leftTime, isCompleting } = useCountdown({
    targetTime:
      expiredCaptchaTime ?? new Date(Date.now() + 1000 * 60 * 2).toISOString(),
    onComplete: expiredCaptchaTime ? refetchQueueEntry : undefined,
    completeDelay: 2000,
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

      <ReCAPTCHA
        sitekey={ENV.captchaSiteKey}
        onChange={handleCaptchaChange}
        size={device === 'mobile' ? 'compact' : 'normal'}
      />

      {expiredCaptchaTime && (
        <Flex direction="column" gap={4} align="center" justify="center">
          <Text font={device === 'mobile' ? 'body3' : 'body2'}>
            {isCompleting ? (
              '인증 시간이 만료되었어요.'
            ) : (
              <>
                ⏰ 이 창은
                <HighLight>{leftTime.totalSeconds}</HighLight>초 후에
                만료됩니다.
              </>
            )}
          </Text>
          <Text
            font={device === 'mobile' ? 'body4' : 'body3'}
            color="textTertiary"
          >
            {isCompleting
              ? '대기열에서 곧 나가져요. 참여를 원하시면 다시 신청해주세요.'
              : '만료 전에 인증을 통과해주세요!'}
          </Text>
          {isCompleting && (
            <LoadingSpinner device={device}>
              <SpinnerDot delay={0} />
              <SpinnerDot delay={0.2} />
              <SpinnerDot delay={0.4} />
            </LoadingSpinner>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default ReadyState;

const ReadyMessage = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme }) => theme.fonts.heading5};
  text-align: center;
`;

const HighLight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
`;

const LoadingSpinner = styled.div<{ device: Device }>`
  margin-top: 8px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  align-items: center;
  justify-content: center;
`;

const SpinnerDot = styled.div<{ delay: number }>`
  width: 12px;
  height: 12px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.primary};

  animation: ${pulse} 1.4s ease-in-out infinite;

  animation-delay: ${({ delay }) => delay}s;
`;
