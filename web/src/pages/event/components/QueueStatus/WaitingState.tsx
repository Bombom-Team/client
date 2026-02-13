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
    <Flex direction="column" gap={device === 'mobile' ? 12 : 16} align="center">
      <Text
        font={device === 'mobile' ? 'heading6' : 'heading5'}
        color="textPrimary"
      >
        접속자가 많아 대기 중이에요.
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

      <Text
        font={device === 'mobile' ? 'body2' : 'body1'}
        color="textSecondary"
      >
        ※ 이 창을 닫거나 새로고침 또는 뒤로가기를 누를 경우 대기 시간이
        초기화돼요.
      </Text>
    </Flex>
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
