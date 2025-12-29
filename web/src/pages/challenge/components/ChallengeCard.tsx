import ChallengeCardBeforeStart from './ChallengeCard/cards/ChallengeCardBeforeStart';

type ChallengeStatus = 'BEFORE_START' | 'ONGOING' | 'COMPLETED';
type ChallengeGrade = 'GOLD' | 'SILVER' | 'BRONZE' | 'NONE' | 'FAIL';

export interface ChallengeCardProps {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  participantCount: number;
  status: ChallengeStatus;
  detail: {
    isJoined?: boolean;
    progress?: number;
    grade?: ChallengeGrade;
    isSuccess?: boolean;
  };
}

const ChallengeCard = (props: ChallengeCardProps) => {
  switch (props.status) {
    case 'BEFORE_START':
      return <ChallengeCardBeforeStart {...props} />;
  }
};

export default ChallengeCard;
