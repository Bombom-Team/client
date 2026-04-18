import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';

const SoldOutState = () => {
  const device = useDevice();

  return (
    <Flex direction="column" gap={device === 'mobile' ? 12 : 16} align="center">
      <Text
        font={device === 'mobile' ? 't10Bold' : 't11Bold'}
        color="textPrimary"
      >
        이벤트 마감
      </Text>
      <Description
        font={device === 'mobile' ? 't6Regular' : 't7Regular'}
        color="textPrimary"
      >
        아쉽지만 이번 이벤트의 쿠폰이 모두 소진되었어요. 😢
        {'\n'}다음 이벤트를 기대해주세요!
      </Description>

      <Flex
        direction="column"
        align="flex-start"
        gap={device === 'mobile' ? 8 : 4}
      >
        <Caution
          font={device === 'mobile' ? 't5Regular' : 't6Regular'}
          color="textSecondary"
        >
          ※ 다음 이벤트 일정은 이벤트 페이지에서 확인해주세요.
        </Caution>
      </Flex>
    </Flex>
  );
};

export default SoldOutState;

const Description = styled(Text)`
  text-align: center;
`;

const Caution = styled(Text)`
  line-height: 1.4;
`;
