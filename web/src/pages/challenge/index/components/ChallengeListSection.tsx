import styled from '@emotion/styled';
import ChallengeCard from './ChallengeCard/ChallengeCard';
import { useDevice } from '@/hooks/useDevice';
import type { Challenge } from '@/apis/challenge/challenge.api';

interface ChallengeSectionProps {
  title: string;
  challenges?: Challenge[];
}

const ChallengeListSection = ({ title, challenges }: ChallengeSectionProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  if (!challenges || challenges.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      <ChallengeGrid isMobile={isMobile}>
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} {...challenge} />
        ))}
      </ChallengeGrid>
    </Section>
  );
};

export default ChallengeListSection;

const Section = styled.div`
  width: 100%;

  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const ChallengeGrid = styled.div<{ isMobile: boolean }>`
  width: 100%;

  display: grid;
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};

  grid-template-columns: ${({ isMobile }) =>
    isMobile ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))'};
`;
