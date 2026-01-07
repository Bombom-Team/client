import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import CardContainer from '../CardContainer';
import CardDetailButton from '../CardDetailButton';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { ChallengeCardProps } from '../ChallengeCard';

type GradeType = 'GOLD' | 'SILVER' | 'BRONZE';

const GRADE_CONFIG: Record<
  GradeType,
  { icon: string; backgroundColor: string; color: string }
> = {
  GOLD: {
    icon: '🥇',
    backgroundColor: '#FFF9E6',
    color: '#D4A017',
  },
  SILVER: {
    icon: '🥈',
    backgroundColor: '#F5F5F5',
    color: '#A8A9AD',
  },
  BRONZE: {
    icon: '🥉',
    backgroundColor: '#FFF5EB',
    color: '#CD7F32',
  },
};

const ChallengeCardCompleted = (props: ChallengeCardProps) => {
  const navigate = useNavigate();

  const { detail, id, generation, startDate, title } = props;

  const isSuccess = detail?.isSuccess !== false;
  const grade = detail?.grade as GradeType;
  const gradeConfig = grade ? GRADE_CONFIG[grade] : null;

  const moveToDetail = () => {
    trackEvent({
      category: 'Challenge',
      action: 'COMPLETED 카드 클릭',
      label: title,
    });

    navigate({
      to: '/challenge/$challengeId',
      params: { challengeId: String(id) },
    });
  };

  return (
    <CardContainer onClick={moveToDetail}>
      <CardWrapper>
        {isSuccess && gradeConfig && (
          <GradeBadgeTopRight
            backgroundColor={gradeConfig.backgroundColor}
            color={gradeConfig.color}
          >
            {gradeConfig.icon} {grade}
          </GradeBadgeTopRight>
        )}

        <CardHeader
          title={title}
          startDate={startDate}
          tag={`${generation}기`}
          applicantCount={0}
        />

        <CardFooter>
          <CompletionInfo>
            <CompletionText>{detail?.progress}% 달성 완료</CompletionText>
          </CompletionInfo>
          <CardDetailButton>자세히 보기 →</CardDetailButton>
        </CardFooter>
      </CardWrapper>
    </CardContainer>
  );
};

export default ChallengeCardCompleted;

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const GradeBadgeTopRight = styled.span<{
  backgroundColor: string;
  color: string;
}>`
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 12px;
  border-radius: 0 14px 0 8px;

  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  font: ${({ theme }) => theme.fonts.body3};
  font-weight: 600;
`;

const CompletionInfo = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CompletionText = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;
