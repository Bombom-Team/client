import { trackGAEvent } from '@/libs/googleAnalytics/gaEvents';
import type { LiteracyQuizPlatform } from '@/apis/literacyQuiz/literacyQuiz.api';
import type { GAEventParams } from '@/libs/googleAnalytics/gaEvents';

export type LiteracyEventName =
  | 'literacy_quiz_view'
  | 'literacy_quiz_start'
  | 'literacy_quiz_leave_screen'
  | 'literacy_quiz_submit'
  | 'literacy_quiz_nickname_register'
  | 'literacy_quiz_challenge_share'
  | 'literacy_quiz_review_open'
  | 'literacy_quiz_newsletter_click'
  | 'literacy_quiz_browse_click';

interface TrackLiteracyEventParams {
  attemptCode?: string;
  platform: LiteracyQuizPlatform;
  params?: GAEventParams;
}

// 모든 문해력 평가 이벤트에 attempt_code·platform을 공통으로 붙인다.
export const trackLiteracyEvent = (
  eventName: LiteracyEventName,
  { attemptCode, platform, params = {} }: TrackLiteracyEventParams,
) => {
  trackGAEvent(eventName, {
    attempt_code: attemptCode,
    platform,
    ...params,
  });
};
