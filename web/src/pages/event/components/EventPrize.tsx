import styled from '@emotion/styled';
import Flex from '@/components/Flex';

const EventPrize = () => {
  return (
    <Container>
      <Flex direction="column" align="center" gap={8}>
        <SectionLabel>선착순 70명!</SectionLabel>
        <SectionTitle>이벤트 경품</SectionTitle>
      </Flex>

      <PrizeCard>
        <CoffeeImage src="/assets/png/event-coffee.png" alt="" />
        <PrizeTitle>메가커피 아메리카노(ICE)</PrizeTitle>
      </PrizeCard>
    </Container>
  );
};

export default EventPrize;

const Container = styled.section`
  width: 100%;
  padding: 64px 24px 68px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.black};

  display: flex;
  gap: 40px;
  flex-direction: column;
  align-items: center;

  background-color: #ffd1e0;
`;

const SectionLabel = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Bold};
  text-align: center;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t13Bold};
  line-height: 2.5rem;
  text-align: center;
  white-space: nowrap;
`;

const PrizeCard = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 54px 28px;
  border: 4px solid ${({ theme }) => theme.colors.black};
  border-radius: 32px;
  box-shadow: 4px 4px 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const CoffeeImage = styled.img`
  width: 80%;
  height: auto;
`;

const PrizeTitle = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
  text-align: center;
`;
