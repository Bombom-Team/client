import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/_bombom/_main/challenge/$challengeId')({
  component: ChallengeDetail,
});

function ChallengeDetail() {
  const { challengeId } = Route.useParams();
  const device = useDevice();

  // TODO: API를 통해 챌린지 상세 정보 가져오기
  const challengeData = {
    id: challengeId,
    title: '한달 뉴스레터 읽기 챌린지',
    description:
      '다른 사람들과 함께 한 달 동안 꾸준히 읽기를 실천해보세요! 매일 뉴스레터를 읽고 한줄평을 남기면서 건강한 독서 습관을 만들어갈 수 있습니다.',
    startDate: '2026-01-05',
    endDate: '2026-02-04',
    applicantCount: 0,
    status: 'COMING_SOON',
  };

  return (
    <Container device={device}>
      <Content device={device}>
        <Header>
          <TitleSection>
            <Title>{challengeData.title}</Title>
            {challengeData.status === 'COMING_SOON' && (
              <StatusBadge>Coming Soon</StatusBadge>
            )}
          </TitleSection>
          <MetaInfo>
            <MetaItem>
              <MetaLabel>기간</MetaLabel>
              <MetaValue>
                {challengeData.startDate} ~ {challengeData.endDate}
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>신청자</MetaLabel>
              <MetaValue>{challengeData.applicantCount}명</MetaValue>
            </MetaItem>
          </MetaInfo>
        </Header>

        <Description>{challengeData.description}</Description>

        <InfoSection>
          <InfoTitle>챌린지 참여 방법</InfoTitle>
          <InfoList>
            <InfoListItem>매일 뉴스레터를 읽고 한줄평을 남깁니다.</InfoListItem>
            <InfoListItem>
              다른 참여자들의 한줄평을 보며 서로 동기부여를 받습니다.
            </InfoListItem>
            <InfoListItem>
              챌린지 기간 동안 꾸준히 읽기를 실천하여 습관을 만듭니다.
            </InfoListItem>
          </InfoList>
        </InfoSection>

        <InfoSection>
          <InfoTitle>혜택</InfoTitle>
          <InfoList>
            <InfoListItem>
              다른 참여자들과 함께 성장하는 즐거움을 느낄 수 있습니다.
            </InfoListItem>
            <InfoListItem>
              독서 습관을 형성하여 지속적인 자기계발이 가능합니다.
            </InfoListItem>
            <InfoListItem>
              리더보드를 통해 자신의 성장을 확인할 수 있습니다.
            </InfoListItem>
          </InfoList>
        </InfoSection>

        <ApplyButton disabled={challengeData.status === 'COMING_SOON'}>
          {challengeData.status === 'COMING_SOON'
            ? '준비 중입니다'
            : '챌린지 신청하기'}
        </ApplyButton>
      </Content>
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

const Content = styled.div<{ device: Device }>`
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

const Header = styled.div`
  display: flex;
  gap: 24px;
  flex-direction: column;
`;

const TitleSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading2};
`;

const StatusBadge = styled.span`
  padding: 8px 16px;
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.backgroundHover};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body3};
  font-weight: 600;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const MetaLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const MetaValue = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
  line-height: 1.6;
`;

const InfoSection = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const InfoTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
`;

const InfoList = styled.ul`
  margin: 0;
  padding-left: 24px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  list-style-type: disc;
`;

const InfoListItem = styled.li`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
  line-height: 1.6;
`;

const ApplyButton = styled.button`
  padding: 16px 32px;
  border: none;
  border-radius: 12px;

  align-self: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.body1};
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
    color: ${({ theme }) => theme.colors.textSecondary};

    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgb(0 0 0 / 15%);

    background-color: ${({ theme }) => theme.colors.primaryDark};

    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;
