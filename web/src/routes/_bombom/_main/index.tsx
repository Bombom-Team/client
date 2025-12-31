import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import ReadingKingLeaderboard from '../../../pages/recommend/components/ReadingKingLeaderboard/ReadingKingLeaderboard';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import ChallengeSection from '@/pages/recommend/components/ChallengeSection/ChallengeSection';
import NewsletterHero from '@/pages/recommend/components/NewsletterHero/NewsletterHero';
import NoticeAnnounceBar from '@/pages/recommend/components/NoticeAnnounceBar/NoticeAnnounceBar';
import TrendySection from '@/pages/recommend/components/TrendySection/TrendySection';
import type { Device } from '@/hooks/useDevice';
import type { NewsletterTab } from '@/pages/recommend/components/NewsletterDetail/NewsletterDetail.types';
import type { SearchSchemaInput } from '@tanstack/react-router';

interface BombomIndexSearch {
  newsletterDetail?: number;
  tab?: NewsletterTab;
}

export const Route = createFileRoute('/_bombom/_main/')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 뉴스레터 추천',
      },
    ],
  }),
  component: Index,
  validateSearch: (search: BombomIndexSearch & SearchSchemaInput) => {
    return {
      newsletterDetail: search?.newsletterDetail,
      tab: search?.tab,
    };
  },
});

function Index() {
  const device = useDevice();
  const { data: notices } = useQuery(queries.notices());

  const recentNotice = notices?.content || [];
  const firstNotice = recentNotice[0];

  return (
    <Container device={device}>
      {firstNotice && <NoticeAnnounceBar notice={firstNotice} />}

      <MainContent device={device}>
        <MainSection device={device}>
          <NewsletterHero />
          <ChallengeSection />
          <TrendySection />
        </MainSection>
        <SideSection device={device}>
          <ReadingKingLeaderboard />
        </SideSection>
      </MainContent>
    </Container>
  );
}

const Container = styled.div<{ device: Device }>`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  gap: ${({ device }) =>
    device === 'mobile' ? '20px' : device === 'tablet' ? '24px' : '32px'};
  flex-direction: ${({ device }) =>
    device === 'mobile' ? 'column' : 'column'};
  align-items: flex-start;
`;

const MainContent = styled.div<{ device: Device }>`
  display: flex;
  gap: 16px;
  flex-direction: ${({ device }) => (device === 'mobile' ? 'column' : 'row')};
`;

const MainSection = styled.section<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '100%' : 'auto')};
  min-width: 0;
  max-width: ${({ device }) => (device === 'mobile' ? 'none' : '840px')};

  display: flex;
  gap: 24px;
  flex: 1;
  flex-direction: column;
`;

const SideSection = styled.div<{ device: Device }>`
  width: ${({ device }) =>
    device === 'mobile' ? '100%' : device === 'tablet' ? '360px' : '400px'};
  max-width: ${({ device }) => (device === 'mobile' ? '400px' : 'none')};
  margin: ${({ device }) => (device === 'mobile' ? '0 auto' : '0')};

  flex-shrink: 0;
`;
