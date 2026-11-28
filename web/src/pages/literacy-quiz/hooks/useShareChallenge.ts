import { useCallback } from 'react';
import { CHALLENGE_SHARE_PATH } from '../constants/links';
import { copyTextWithFallback } from '../utils/copyTextWithFallback';

interface UseShareChallengeParams {
  attemptCode: string;
  onCopied: () => void;
  onFailed: () => void;
}

// 도전장 링크만 클립보드에 복사한다. 링크를 열면 서버가 미리보기 HTML을 주고 퀴즈로 넘긴다.
export const useShareChallenge = ({
  attemptCode,
  onCopied,
  onFailed,
}: UseShareChallengeParams) => {
  return useCallback(async () => {
    const shareUrl = `${window.location.origin}${CHALLENGE_SHARE_PATH}/${attemptCode}`;
    const isCopied = await copyTextWithFallback(shareUrl);

    if (isCopied) onCopied();
    else onFailed();
  }, [attemptCode, onCopied, onFailed]);
};
