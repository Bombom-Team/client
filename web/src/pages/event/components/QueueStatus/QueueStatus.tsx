import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { QueueEntry } from '@/apis/event/event.api';

interface QueueStatusProps {
  queueData: QueueEntry;
}

const QueueStatus = ({ queueData }: QueueStatusProps) => {
  const device = useDevice();

  if (!queueData) {
    return null;
  }

  if (queueData.status === 'WAITING') {
    return (
      <Container device={device}>
        <StatusBadge device={device} statusColor="#f59e0b">
          대기 중
        </StatusBadge>

        <Flex direction="column" gap={12} align="center">
          <Text
            font={device === 'mobile' ? 'heading5' : 'heading4'}
            color="textPrimary"
          >
            현재 접속자가 많아 대기 중입니다.
          </Text>
          <WaitingInfo device={device}>
            <InfoLabel device={device}>나의 대기 번호</InfoLabel>
            <InfoValue device={device} emphasis>
              {queueData.position}번
            </InfoValue>
          </WaitingInfo>

          <Divider />

          <WaitingInfo device={device}>
            <InfoLabel device={device}>현재 입장 인원</InfoLabel>
            <InfoValue device={device}>{queueData.activeCount}명</InfoValue>
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
            font={device === 'mobile' ? 'body3' : 'body2'}
            color="textTertiary"
          >
            ※ 이 창을 닫거나 새로고침 또는 뒤로가기를 누를 경우 대기 시간이
            초기화됩니다.
          </Text>
        </Flex>
      </Container>
    );
  }
};

export default QueueStatus;

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

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

const Container = styled.div<{ device: Device; highlight?: boolean }>`
  position: relative;
  width: 100%;
  max-width: 360px;
  padding: ${({ device }) =>
    device === 'mobile' ? '32px 20px 20px' : '36px 28px 28px'};
  border: 4px solid ${({ theme }) => theme.colors.black};
  border-radius: 16px;
  box-shadow: ${({ highlight, theme }) =>
    highlight
      ? `0 0 0 4px ${theme.colors.primary}, 4px 4px 0 0 ${theme.colors.black}`
      : `2px 2px 0 0 ${theme.colors.black}`};

  display: flex;
  gap: 20px;
  flex-direction: column;

  background-color: ${({ theme, highlight }) =>
    highlight ? '#f0fdf4' : theme.colors.white};

  animation: ${({ highlight }) => (highlight ? bounce : 'none')} 0.6s
    ease-in-out;
`;

const StatusBadge = styled.div<{ device: Device; statusColor: string }>`
  position: absolute;
  top: -16px;
  left: 50%;
  padding: ${({ device }) => (device === 'mobile' ? '4px 16px' : '6px 20px')};
  border: 3px solid ${({ theme }) => theme.colors.black};
  border-radius: 32px;
  box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.black};

  background-color: ${({ statusColor }) => statusColor};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
  font-weight: 800;
  text-align: center;
  white-space: nowrap;

  transform: translateX(-50%) rotate(-2deg);
`;

const WaitingInfo = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const InfoLabel = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.bodyLarge};
`;

const InfoValue = styled.span<{ device: Device; emphasis?: boolean }>`
  color: ${({ theme, emphasis }) =>
    emphasis ? theme.colors.primary : theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};
  font-weight: ${({ emphasis }) => (emphasis ? 900 : 700)};
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
