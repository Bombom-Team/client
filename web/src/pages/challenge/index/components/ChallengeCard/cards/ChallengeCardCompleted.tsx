import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import CardContainer from '../CardContainer';
import { CardDetailButton, Tag, Title } from '../CardElements';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { ChallengeCardProps } from '../ChallengeCard';

type GradeType = 'GOLD' | 'SILVER' | 'BRONZE';

const GRADE_CONFIG: Record<GradeType, string> = {
  GOLD: '/assets/avif/medal-gold.avif',
  SILVER: '/assets/avif/medal-silver.avif',
  BRONZE: '/assets/avif/medal-bronze.avif',
};

const ChallengeCardCompleted = (props: ChallengeCardProps) => {
  const navigate = useNavigate();

  const { participationInfo, id, generation, title } = props;

  const grade = participationInfo?.grade as GradeType;
  const gradeConfig = grade ? GRADE_CONFIG[grade] : null;

  const moveToDetail = () => {
    trackEvent({
      category: 'Challenge',
      action: 'COMPLETED 카드 클릭',
      label: title,
    });

    navigate({
      to: '/challenge/$challengeId/certification',
      params: { challengeId: String(id) },
    });
  };

  return (
    <CardContainer onClick={moveToDetail}>
      <CardHeader>
        <Tag>{generation}기</Tag>
        {participationInfo?.isSurvived && gradeConfig && (
          <GradeBadgeTopRight>
            <img src={GRADE_CONFIG[grade]} alt={`${grade} 메달`} width={48} />
          </GradeBadgeTopRight>
        )}
      </CardHeader>

      <Title>{title}</Title>

      <CardFooter>
        <CompletionText>
          {participationInfo?.progress}% 달성 완료
        </CompletionText>
        <CardDetailButton>자세히 보기 →</CardDetailButton>
      </CardFooter>
    </CardContainer>
  );
};

export default ChallengeCardCompleted;

const GradeBadgeTopRight = styled.span`
  position: absolute;
  top: -6px;
  right: 32px;

  color: ${({ color }) => color};
  font: ${({ theme }) => theme.fonts.t3Regular};
  font-weight: 600;
`;

const CompletionText = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
`;
