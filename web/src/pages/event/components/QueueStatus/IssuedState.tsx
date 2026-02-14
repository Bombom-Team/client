import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { COUPON_TYPE } from '../../constants/constants';
import { queries } from '@/apis/queries';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const IssuedState = () => {
  const device = useDevice();
  const { data: coupons } = useQuery(queries.myCoupons());

  if (!coupons || coupons.length === 0) return null;

  return (
    <Flex direction="column" gap={16} align="center">
      <CompletedMessage device={device}>
        쿠폰이 성공적으로 발급되었습니다! 🎉
      </CompletedMessage>
      <Flex
        direction={device === 'mobile' ? 'column' : 'row'}
        gap={8}
        align="center"
        justify="center"
      >
        {coupons.map((coupon) => {
          return (
            <>
              <img src={coupon.imageUrl} alt="선착순 경품 쿠폰" />
              <Text font={device === 'mobile' ? 'body3' : 'body2'}>
                {`${coupon.issuedAt} (${COUPON_TYPE[coupon.couponName]})`}
              </Text>
            </>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default IssuedState;

const CompletedMessage = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
  text-align: center;
`;
