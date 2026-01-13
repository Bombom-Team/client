import ChallengeCardBeforeStart from './cards/ChallengeCardBeforeStart';
import ChallengeCardComingSoon from './cards/ChallengeCardComingSoon';
import ChallengeCardCompleted from './cards/ChallengeCardCompleted';
import ChallengeCardFailed from './cards/ChallengeCardFailed';
import ChallengeCardOngoing from './cards/ChallengeCardOngoing';
import type { Challenge } from '@/apis/challenge/challenge.api';

export type ChallengeCardProps = Challenge;

type CardType = Challenge['status'] | 'FAILED';

const getCardType = (challenge: Challenge): CardType => {
  const { status, detail } = challenge;

  if (detail?.isSuccess === false) {
    return 'FAILED';
  }

  return status;
};

const ChallengeCard = (props: ChallengeCardProps) => {
  const cardType = getCardType(props);

  switch (cardType) {
    case 'COMING_SOON':
      return <ChallengeCardComingSoon {...props} />;
    case 'BEFORE_START':
      return <ChallengeCardBeforeStart {...props} />;
    case 'FAILED':
      return <ChallengeCardFailed {...props} />;
    case 'ONGOING':
      return <ChallengeCardOngoing {...props} />;
    case 'COMPLETED':
      return <ChallengeCardCompleted {...props} />;
  }
};

export default ChallengeCard;
