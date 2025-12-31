import styled from '@emotion/styled';
import { getDday } from '@/utils/date';

interface CardHeaderProps {
  title: string;
  applicantCount?: number;
  startDate: Date;
}

const CardHeader = ({ title, applicantCount, startDate }: CardHeaderProps) => {
  const dday = getDday(startDate);

  return (
    <Header>
      <TitleSection>
        <Title>{title}</Title>
      </TitleSection>

      <Meta>
        {applicantCount && applicantCount > 0 ? (
          <Applicant>참여자 {applicantCount}명</Applicant>
        ) : null}
        <DDay>D{dday}</DDay>
      </Meta>
    </Header>
  );
};

export default CardHeader;

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
