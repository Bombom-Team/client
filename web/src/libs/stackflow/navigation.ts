import { isWebView } from '@/utils/device';
import type { Actions } from '@stackflow/react';

const MOBILE_MAX_WIDTH = 768;

const isStackflowEnabled = () =>
  isWebView() ||
  window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;

const withStackflowActions = async (callback: (actions: Actions) => void) => {
  const { webViewStackActions } = await import('./stackflow.tsx');
  callback(webViewStackActions);
};

export const pushWebViewArticle = (articleId: string) => {
  if (!isStackflowEnabled()) return false;
  void withStackflowActions((actions) => {
    actions.push('ArticleActivity', { articleId });
  });
  return true;
};

export const pushWebViewPreviousArticle = (articleId: string) => {
  if (!isStackflowEnabled()) return false;
  void withStackflowActions((actions) => {
    actions.push('PreviousArticleActivity', { articleId });
  });
  return true;
};

const CHALLENGE_TAB_ACTIVITY = {
  dashboard: 'ChallengeDashboardActivity',
  daily: 'ChallengeDailyActivity',
  comments: 'ChallengeCommentsActivity',
  review: 'ChallengeReviewActivity',
  certification: 'ChallengeCertificationActivity',
} as const;

export const replaceWebViewChallengeTab = (
  challengeId: string,
  tab: keyof typeof CHALLENGE_TAB_ACTIVITY,
) => {
  if (!isStackflowEnabled()) return false;
  void withStackflowActions((actions) => {
    actions.replace(
      CHALLENGE_TAB_ACTIVITY[tab],
      { challengeId },
      {
        animate: false,
      },
    );
  });
  return true;
};

export const pushWebViewNewsletter = (newsletterId: string) => {
  if (!isStackflowEnabled()) return false;
  void withStackflowActions((actions) => {
    actions.push('NewsletterActivity', { newsletterId });
  });
  return true;
};

export const pushWebViewChallengeLanding = (challengeId: string) => {
  if (!isStackflowEnabled()) return false;
  void withStackflowActions((actions) => {
    actions.push('ChallengeLandingActivity', { challengeId });
  });
  return true;
};

export const pushWebViewChallengeDetail = (
  challengeId: string,
  tab: 'certification' | 'daily',
) => {
  if (!isStackflowEnabled()) return false;

  if (tab === 'certification') {
    void withStackflowActions((actions) => {
      actions.push('ChallengeCertificationActivity', { challengeId });
    });
  } else {
    void withStackflowActions((actions) => {
      actions.push('ChallengeDailyActivity', { challengeId });
    });
  }
  return true;
};
