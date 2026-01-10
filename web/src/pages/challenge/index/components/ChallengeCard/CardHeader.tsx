import styled from '@emotion/styled';
import { getDday } from '@/utils/date';

interface CardHeaderProps {
  title: string;
  applicantCount?: number;
  tag: string;
  startDate: string;
  isEliminated?: boolean;
}

const CardHeader = ({
  title,
  applicantCount,
  tag,
  startDate,
  isEliminated = false,
}: CardHeaderProps) => {
  const dday = getDday(startDate);

  return (
    <Header>
      <TitleSection>
        <Title isEliminated={isEliminated}>{title}</Title>
        {tag && <Tag>{tag}</Tag>}
      </TitleSection>

      <Meta>
        {applicantCount && applicantCount > 0 ? (
          <Applicant>신청자 {applicantCount}명</Applicant>
        ) : null}
        <DDay isEliminated={isEliminated}>D{dday}</DDay>
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

const Title = styled.h3<{ isEliminated: boolean }>`
  color: ${({ theme, isEliminated }) =>
    isEliminated ? theme.colors.disabledText : theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
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

const Meta = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
`;

const Applicant = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body3};
`;

const DDay = styled.span<{ isEliminated: boolean }>`
  color: ${({ theme, isEliminated }) =>
    isEliminated ? theme.colors.disabledText : theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
`;
