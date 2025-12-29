import type { Challenge } from '@/types/challenge';
import ChallengeCardBeforeStart from './ChallengeCard/cards/ChallengeCardBeforeStart';

export type ChallengeCardProps = Challenge;

const ChallengeCard = (props: ChallengeCardProps) => {
  switch (props.status) {
    case 'BEFORE_START':
      return <ChallengeCardBeforeStart {...props} />;
  }
};

export default ChallengeCard;
