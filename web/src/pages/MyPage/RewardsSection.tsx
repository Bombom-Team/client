import styled from '@emotion/styled';

const RewardsSection = () => {
  return (
    <Container>
      <Title>선물함</Title>
      <Description>아직 받은 선물이 없어요.</Description>
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
