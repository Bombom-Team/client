import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { formatEventDateTime } from '../event/utils/date';
import { queries } from '@/apis/queries';

const COUPON_IMAGE_BASE_URL = 'https://www.bombom.news/';

const RewardsSection = () => {
  const { data: coupons, isLoading } = useQuery(queries.myCoupons());

  if (isLoading) {
    return (
      <Container>
        <Title>선물함</Title>
        <Description>선물을 불러오는 중이에요.</Description>
      </Container>
    );
  }

  return (
    <Container>
      <Title>선물함</Title>
      {!coupons || coupons.length === 0 ? (
        <Description>아직 받은 선물이 없어요.</Description>
      ) : (
        <CouponList>
          {coupons.map((coupon) => {
            return (
              <CouponItem key={`${coupon.couponName}-${coupon.issuedAt}`}>
                <CouponImage
                  src={`${COUPON_IMAGE_BASE_URL}${coupon.imageUrl}`}
                  alt="이벤트 쿠폰"
                />
                <IssuedAt>
                  {`${formatEventDateTime(new Date(coupon.issuedAt))} 발급`}
                </IssuedAt>
              </CouponItem>
            );
          })}
        </CouponList>
      )}
    </Container>
  );
};

export default RewardsSection;

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const CouponList = styled.div`
  width: 100%;

  display: grid;
  gap: 16px;

  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
`;

const CouponItem = styled.div`
  width: 100%;
  padding: 12px;
  border: ${({ theme }) => `1px solid ${theme.colors.stroke}`};
  border-radius: 12px;

  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
`;

const CouponImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const IssuedAt = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body3};
`;
