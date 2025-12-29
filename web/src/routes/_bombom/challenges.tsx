import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import TrophyIcon from '#/assets/svg/trophy.svg';

export const Route = createFileRoute('/_bombom/challenges')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지',
      },
    ],
  }),
  component: () => <Challenges />,
});

function Challenges() {
  const device = useDevice();

  const handleApplyClick = () => {
    // TODO: 챌린지 신청 로직 구현
    console.log('챌린지 신청하기');
  };

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
        <ChallengeCard device={device}>
          <CardHeader>
            <TrophyIcon width={32} height={32} color={theme.colors.primary} />
            <CardTitle>한 달 독서 챌린지</CardTitle>
          </CardHeader>

          <CardDescription>
            <DescriptionText>
              다른 사람들과 함께 한 달 동안 꾸준히 읽기를 실천해보세요!
            </DescriptionText>
            <DescriptionText>
              매일 뉴스레터를 읽고 한줄평을 남기면서
              <br />
              건강한 독서 습관을 만들어갈 수 있습니다.
            </DescriptionText>
          </CardDescription>

          <ChallengeInfo>
            <InfoItem>
              <InfoLabel>기간</InfoLabel>
              <InfoValue>한 달 (30일)</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>참여 방법</InfoLabel>
              <InfoValue>매일 뉴스레터 읽고 한줄평 남기기</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>혜택</InfoLabel>
              <InfoValue>다른 참여자들과 함께 성장하는 즐거움</InfoValue>
            </InfoItem>
          </ChallengeInfo>

          <ApplyButton onClick={handleApplyClick}>챌린지 신청하기</ApplyButton>
        </ChallengeCard>
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

const ChallengeCard = styled.div<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'mobile' ? '100%' : '800px')};
  padding: ${({ device }) => (device === 'mobile' ? '24px' : '40px')};
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 16px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 5%);

  display: flex;
  gap: 32px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const CardHeader = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const CardTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading2};
`;

const CardDescription = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const DescriptionText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
  line-height: 1.6;
`;

const ChallengeInfo = styled.div`
  padding: 24px;
  border-radius: 12px;

  display: flex;
  gap: 24px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.backgroundHover};
`;

const InfoItem = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
`;

const ApplyButton = styled.button`
  padding: 16px 32px;
  border: none;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.body1};
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);

    background-color: ${({ theme }) => theme.colors.primaryDark};

    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
