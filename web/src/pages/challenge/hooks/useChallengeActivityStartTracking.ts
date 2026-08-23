import { useCallback, useRef } from 'react';
import { trackRetentionEvent } from '@/libs/googleAnalytics/retentionEvents';

interface UseChallengeActivityStartTrackingParams {
  challengeId: number;
  isAttendanceEligible: boolean;
}

export const useChallengeActivityStartTracking = ({
  challengeId,
  isAttendanceEligible,
}: UseChallengeActivityStartTrackingParams) => {
  const trackedChallengeIdsRef = useRef(new Set<number>());

  return useCallback(
    (value: string) => {
      if (
        trackedChallengeIdsRef.current.has(challengeId) ||
        !value.trim() ||
        !isAttendanceEligible
      ) {
        return;
      }

      trackRetentionEvent('challenge_activity_started', {
        challenge_id: String(challengeId),
      });
      trackedChallengeIdsRef.current.add(challengeId);
    },
    [challengeId, isAttendanceEligible],
  );
};
