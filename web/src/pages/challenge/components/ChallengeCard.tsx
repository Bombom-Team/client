import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { getDday } from '@/utils/date';
import { openExternalLink } from '@/utils/externalLink';

type ChallengeStatus = 'COMING_SOON' | 'OPEN';

interface ChallengeCardProps {
  title: string;
  applicantCount: number;
  day: {
    start: Date;
    end: Date;
  };
  tag?: string;
  status: ChallengeStatus;
}

const ChallengeCard = ({
  title,
  applicantCount,
  day,
  tag,
  status,
}: ChallengeCardProps) => {
  const dday = getDday(day.start);

  const handleDetailClick = () => {
    trackEvent({
      category: 'Challenge',
      action: '카드 클릭',
      label: title,
    });
    openExternalLink(
      'https://maroon-geranium-880.notion.site/2d103dcf205680dfa045d47385af3df9?source=copy_link',
    );
  };

  return (
    <Container>
      <Header>
        <TitleSection>
          <Title>{title}</Title>
          {tag && <Tag>{tag}</Tag>}
        </TitleSection>
        <Meta>
          {applicantCount > 0 && (
            <Applicant>신청자 {applicantCount}명</Applicant>
          )}
          <DDay>D{dday}</DDay>
        </Meta>
      </Header>

      <Footer>
        {status === 'COMING_SOON' && (
          <ComingSoonBadge disabled onClick={() => {}}>
            Coming Soon
          </ComingSoonBadge>
        )}

        <DetailButton variant="transparent" onClick={handleDetailClick}>
          자세히 보기 →
        </DetailButton>
      </Footer>
    </Container>
  );
};

export default ChallengeCard;

const Container = styled.div`
  width: 100%;
  height: 172px;
  max-width: 440px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 14px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const TitleSection = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
  font-weight: 700;
`;

const Meta = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const Applicant = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body3};
`;

const DDay = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;

const Tag = styled.span`
  padding: 4px 10px;
  border-radius: 999px;

  align-self: flex-start;

  background-color: ${({ theme }) => `${theme.colors.primaryLight}40`};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body3};
  font-weight: 600;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ComingSoonBadge = styled(Button)`
  padding: 10px 16px;
  border-radius: 10px;

  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;

const DetailButton = styled(Button)`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;

  &:hover {
    background-color: transparent;
    text-decoration: underline;
  }
`;
