import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import { useDevice } from '@/hooks/useDevice';
import type { QueueEntry } from '@/apis/event/event.api';
import type { Device } from '@/hooks/useDevice';

interface ReadyStateProps {
  queueEntry: QueueEntry;
}

const ReadyState = ({ queueEntry }: ReadyStateProps) => {
  const device = useDevice();

  return (
    <Flex direction="column" gap={16} align="center">
      <ReadyMessage device={device}>
        봇이 아님을 인증하고 지금 바로 쿠폰을 발급받으세요!
      </ReadyMessage>

      {queueEntry.activeExpiresInSeconds && (
        <TimerWrapper device={device}>
          <TimerText device={device}>
            ⏰ {queueEntry.activeExpiresInSeconds}초 남음
          </TimerText>
        </TimerWrapper>
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

const TimerWrapper = styled.div<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '12px 20px' : '16px 28px')};
  border: 3px solid ${({ theme }) => theme.colors.black};
  border-radius: 12px;
  box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  background-color: #fef3c7;
`;

const TimerText = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading3};
`;
