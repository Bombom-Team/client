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
  padding: 4rem 1.5rem 4.25rem;
  border-bottom: 0.25rem solid ${({ theme }) => theme.colors.black};

  display: flex;
  gap: 2.5rem;
  flex-direction: column;
  align-items: center;

  background-color: #ffd1e0;
`;

const SectionLabel = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.heading6};
  text-align: center;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading2};
  line-height: 2.5rem;
  text-align: center;
  white-space: nowrap;
`;

const PrizeCard = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 3.375rem 1.75rem;
  border: 0.25rem solid ${({ theme }) => theme.colors.black};
  border-radius: 2rem;
  box-shadow: 0.25rem 0.25rem 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  gap: 0.75rem;
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
  font: ${({ theme }) => theme.fonts.heading4};
  text-align: center;
`;
