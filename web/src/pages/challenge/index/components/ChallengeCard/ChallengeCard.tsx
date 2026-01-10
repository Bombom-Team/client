import ChallengeCardBeforeStart from './cards/ChallengeCardBeforeStart';
import ChallengeCardFailed from './cards/ChallengeCardFailed';
import ChallengeCardOngoing from './cards/ChallengeCardOngoing';
import type { Challenge } from '@/apis/challenge/challenge.api';

export type ChallengeCardProps = Challenge;

type CardType = 'BEFORE_START' | 'ONGOING' | 'FAILED' | 'COMPLETED';

const getCardType = (challenge: Challenge): CardType => {
  const { status, detail } = challenge;

  if (detail?.isSuccess === false) {
    return 'FAILED';
  }
  if (status === 'ONGOING') {
    return 'ONGOING';
  }
  if (status === 'BEFORE_START') {
    return 'BEFORE_START';
  }
  if (status === 'COMPLETED') {
    return 'COMPLETED';
  }

  return 'BEFORE_START';
};

const ChallengeCard = (props: ChallengeCardProps) => {
  const cardType = getCardType(props);

  switch (cardType) {
    case 'BEFORE_START':
      return <ChallengeCardBeforeStart {...props} />;
    case 'FAILED':
      return <ChallengeCardFailed {...props} />;
    case 'ONGOING':
      return <ChallengeCardOngoing {...props} />;
    case 'COMPLETED':
      return null;
  }
};

export default ChallengeCard;
