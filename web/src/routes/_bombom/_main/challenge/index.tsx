import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import ChallengeCard from '@/pages/challenge/components/ChallengeCard';
import type { Device } from '@/hooks/useDevice';
import TrophyIcon from '#/assets/svg/trophy.svg';

export const Route = createFileRoute('/_bombom/_main/challenge/')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지',
      },
    ],
  }),
  component: RouteComponent,
});

const challengeData = [
  {
    id: 1,
    title: '한달 뉴스레터 읽기 챌린지',
    status: 'COMING_SOON' as const,
    day: {
      start: new Date('2026-01-05'),
      end: new Date('2026-02-04'),
    },
    applicantCount: 0,
  },
  {
    id: 2,
    title: '일주일 연속 읽기 챌린지',
    status: 'OPEN' as const,
    day: {
      start: new Date('2025-12-30'),
      end: new Date('2026-01-06'),
    },
    applicantCount: 15,
    tag: '인기',
  },
  {
    id: 3,
    title: '3개월 장기 독서 챌린지',
    status: 'COMING_SOON' as const,
    day: {
      start: new Date('2026-02-01'),
      end: new Date('2026-05-01'),
    },
    applicantCount: 0,
  },
];

function RouteComponent() {
  const device = useDevice();
  const navigate = useNavigate();

  return (
    <Container device={device}>
      {device !== 'mobile' && (
        <TitleWrapper>
          <TitleIconBox>
            <TrophyIcon width={20} height={20} color={theme.colors.white} />
          </TitleIconBox>
          <Title>챌린지</Title>
        </TitleWrapper>
      )}

      <ContentWrapper device={device}>
        <ChallengeGrid device={device}>
          {challengeData.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              title={challenge.title}
              status={challenge.status}
              day={challenge.day}
              applicantCount={challenge.applicantCount}
              tag={challenge.tag}
              onClick={() => navigate({ to: `/challenge/${challenge.id}` })}
            />
          ))}
        </ChallengeGrid>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div<{ device: Device }>`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: flex-start;

  box-sizing: border-box;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const TitleIconBox = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.heading3};
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  justify-content: center;
`;

const ChallengeGrid = styled.div<{ device: Device }>`
  width: 100%;

  display: grid;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '24px')};

  grid-template-columns: ${({ device }) =>
    device === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))'};
`;
