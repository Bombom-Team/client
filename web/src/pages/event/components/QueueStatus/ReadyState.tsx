import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
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
        인증 후 지금 바로 쿠폰을 발급받으세요!
      </ReadyMessage>

      {queueEntry.activeExpiresInSeconds && (
        <Flex direction="column" gap={4} align="center" justify="center">
          <Text font={device === 'mobile' ? 'body3' : 'body2'}>
            ⏰ 이 창은
            <HighLight>{queueEntry.activeExpiresInSeconds}</HighLight>초 후에
            만료됩니다.
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
