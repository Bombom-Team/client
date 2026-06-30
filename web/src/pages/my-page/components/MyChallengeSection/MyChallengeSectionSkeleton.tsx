import styled from '@emotion/styled';
import Skeleton from '@/components/Skeleton/Skeleton';

const MyChallengeSectionSkeleton = () => {
  return (
    <Container>
      <Header>
        <Skeleton width="100px" height="28px" />
        <Skeleton width="220px" height="18px" />
      </Header>

      <Skeleton width="100%" height="96px" borderRadius="12px" />

      <Section>
        <Skeleton width="120px" height="22px" />
        <Skeleton width="100%" height="120px" borderRadius="16px" />
      </Section>

      <Section>
        <Skeleton width="120px" height="22px" />
        <Skeleton width="100%" height="80px" borderRadius="12px" />
        <Skeleton width="100%" height="80px" borderRadius="12px" />
      </Section>
    </Container>
  );
};

export default MyChallengeSectionSkeleton;

const Container = styled.div`
  width: 100%;

  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Section = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;
