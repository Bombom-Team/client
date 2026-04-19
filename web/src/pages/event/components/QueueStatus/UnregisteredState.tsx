import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';

const UnregisteredState = () => {
  const device = useDevice();

  return (
    <Flex direction="column" gap={device === 'mobile' ? 12 : 16} align="center">
      <Text
        font={device === 'mobile' ? 't10Bold' : 't11Bold'}
        color="textPrimary"
      >
        대기열 미등록
      </Text>
      <Description
        font={device === 'mobile' ? 't6Regular' : 't7Regular'}
        color="textPrimary"
      >
        선착순 경품 받기를 클릭하여 대기열에 등록해주세요.
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
          ※ 대기 중에 발생하는 인증 요구를 시간 내에 완료하지 못한 경우 인증이
          만료되어 이 창이 뜰 수 있습니다.{'\n'}경품 받기 버튼을 클릭해서 다시
          대기열에 등록해주세요.
        </Caution>
      </Flex>
    </Flex>
  );
};

export default UnregisteredState;

const Description = styled(Text)`
  text-align: center;
`;

const Caution = styled(Text)`
  line-height: 1.4;
`;
