import ChallengeCardBeforeStart from './ChallengeCard/cards/ChallengeCardBeforeStart';
import ChallengeCardOngoing from './ChallengeCard/cards/ChallengeCardOngoing';
import type { Challenge } from '@/apis/challenge/challenge.api';

export type ChallengeCardProps = Challenge;

const ChallengeCard = (props: ChallengeCardProps) => {
  switch (props.status) {
    case 'BEFORE_START':
      return <ChallengeCardBeforeStart {...props} />;
    case 'ONGOING':
      return <ChallengeCardOngoing {...props} />;
    default:
      return null;
  }
};

export default ChallengeCard;
