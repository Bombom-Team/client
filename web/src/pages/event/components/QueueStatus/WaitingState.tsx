import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { QueueEntry } from '@/apis/event/event.api';

interface WaitingStateProps {
  queueEntry: QueueEntry;
}

const WaitingState = ({ queueEntry }: WaitingStateProps) => {
  const device = useDevice();

  const remainingUserCount = (queueEntry.position ?? 1) - 1;

  return (
    <Flex direction="column" gap={device === 'mobile' ? 12 : 16} align="center">
      <Text
        font={device === 'mobile' ? 'heading3' : 'heading2'}
        color="textPrimary"
      >
        접속 대기
      </Text>
      <WaitingInfo
        font={device === 'mobile' ? 'heading5' : 'heading4'}
        color="textPrimary"
      >
        내 앞에 <Highlight>{remainingUserCount}명</Highlight>이 대기 중이에요.
      </WaitingInfo>
      <WaitingInfo
        font={device === 'mobile' ? 'heading5' : 'heading4'}
        color="textPrimary"
      >
        {remainingUserCount === 0
          ? '잠시후 자동으로 접속돼요.'
          : '대기 순서에 따라 자동으로 접속돼요.'}
      </WaitingInfo>

      <LoadingSpinner device={device}>
        <SpinnerDot delay={0} />
        <SpinnerDot delay={0.2} />
        <SpinnerDot delay={0.4} />
      </LoadingSpinner>

      <Flex
        direction="column"
        align="flex-start"
        gap={device === 'mobile' ? 8 : 4}
      >
        <Caution
          font={device === 'mobile' ? 'body2' : 'body1'}
          color="textSecondary"
        >
          ※ 이 창을 닫거나 새로고침 또는 뒤로가기를 누를 경우 대기 시간이
          초기화돼요.
        </Caution>
        <Caution
          font={device === 'mobile' ? 'body2' : 'body1'}
          color="textSecondary"
        >
          ※ 접속 대기 중에 쿠폰이 모두 소진되면 이벤트가 조기 마감될 수 있어요.
        </Caution>
      </Flex>
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

const Caution = styled(Text)`
  line-height: 1.4;
`;

const WaitingInfo = styled(Text)`
  font-weight: 400;
  text-align: center;
`;

const Highlight = styled.strong`
  color: ${({ theme }) => theme.colors.primary};
`;
