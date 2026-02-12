import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { QueueEntry } from '@/apis/event/event.api';

interface WaitingStateProps {
  queueData: QueueEntry;
}

const WaitingState = ({ queueData }: WaitingStateProps) => {
  const device = useDevice();

  return (
    <Container device={device}>
      <Flex direction="column" gap={12} align="center">
        <Text
          font={device === 'mobile' ? 'heading6' : 'heading5'}
          color="textPrimary"
        >
          현재 접속자가 많아 대기 중이에요.
        </Text>
        <WaitingInfo device={device}>
          <Text>나의 대기 번호</Text>
          <Text
            font={device === 'mobile' ? 'heading5' : 'heading4'}
            color="primary"
          >
            {queueData.position}번
          </Text>
        </WaitingInfo>

        <Divider />

        <WaitingInfo device={device}>
          <Text
            font={device === 'mobile' ? 'body2' : 'bodyLarge'}
            color="textSecondary"
          >
            현재 입장 인원
          </Text>
          <Text
            font={device === 'mobile' ? 'heading5' : 'heading4'}
            color="textPrimary"
          >
            {queueData.activeCount}명
          </Text>
        </WaitingInfo>

        <LoadingSpinner device={device}>
          <SpinnerDot delay={0} />
          <SpinnerDot delay={0.2} />
          <SpinnerDot delay={0.4} />
        </LoadingSpinner>

        <PollingMessage device={device}>
          {queueData.pollingTtlSeconds}초마다 자동 업데이트 중...
        </PollingMessage>
        <Text
          font={device === 'mobile' ? 'body2' : 'bodyLarge'}
          color="textSecondary"
        >
          ※ 이 창을 닫거나 새로고침 또는 뒤로가기를 누를 경우 대기 시간이
          초기화돼요.
        </Text>
      </Flex>
    </Container>
  );
};

export default WaitingState;

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

const Container = styled.div<{ device: Device }>`
  width: 100%;
  min-width: fit-content;
  padding: ${({ device }) =>
    device === 'mobile' ? '32px 20px 20px' : '36px 28px 28px'};
  border: 4px solid ${({ theme }) => theme.colors.black};
  border-radius: 16px;
  box-shadow: ${({ theme }) => `2px 2px 0 0 ${theme.colors.black}`};

  display: flex;
  gap: 20px;
  flex-direction: column;

  animation: bounce 0.6s ease-in-out;
`;

const WaitingInfo = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const Divider = styled.div`
  width: 100%;
  border-bottom: 2px dashed ${({ theme }) => theme.colors.stroke};
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

const PollingMessage = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.caption : theme.fonts.body3};
  text-align: center;
`;
