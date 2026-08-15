import { useCallback, useRef } from 'react';
import { trackRetentionEvent } from '@/libs/googleAnalytics/retentionEvents';

interface UseChallengeActivityStartTrackingParams {
  challengeId: number;
  dayIndex?: number;
  enabled?: boolean;
  todoType: string;
}

export const useChallengeActivityStartTracking = ({
  challengeId,
  dayIndex,
  enabled = true,
  todoType,
}: UseChallengeActivityStartTrackingParams) => {
  const trackedActivityKeysRef = useRef(new Set<string>());
  const activityKey = `${challengeId}:${dayIndex ?? ''}:${todoType}`;

  return useCallback(
    (value: string) => {
      if (
        !enabled ||
        trackedActivityKeysRef.current.has(activityKey) ||
        !value.trim()
      ) {
        return;
      }

      trackRetentionEvent('challenge_activity_started', {
        challenge_id: String(challengeId),
        ...(dayIndex !== undefined && { day_index: dayIndex }),
        todo_type: todoType,
      });
      trackedActivityKeysRef.current.add(activityKey);
    },
    [activityKey, challengeId, dayIndex, enabled, todoType],
  );
};
