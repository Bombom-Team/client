import { defineConfig } from '@stackflow/config';

declare module '@stackflow/config' {
  interface Register {
    RecommendActivity: Record<string, never>;
    TodayActivity: Record<string, never>;
    BookmarkActivity: Record<string, never>;
    MemoActivity: Record<string, never>;
    ArticleActivity: { articleId: string };
    PreviousArticleActivity: { articleId: string };
    NewsletterActivity: { newsletterId: string };
    ChallengeListActivity: Record<string, never>;
    ChallengeLandingActivity: { challengeId: string };
    ChallengeDashboardActivity: { challengeId: string };
    ChallengeDailyActivity: { challengeId: string };
    ChallengeCommentsActivity: { challengeId: string };
    ChallengeReviewActivity: { challengeId: string };
    ChallengeCertificationActivity: { challengeId: string };
  }
}

export const stackflowConfig = defineConfig({
  activities: [
    { name: 'RecommendActivity', route: '/' },
    { name: 'TodayActivity', route: '/today' },
    { name: 'BookmarkActivity', route: '/bookmark' },
    { name: 'MemoActivity', route: '/memo' },
    { name: 'ArticleActivity', route: '/articles/:articleId' },
    {
      name: 'PreviousArticleActivity',
      route: '/articles/previous/:articleId',
    },
    { name: 'NewsletterActivity', route: '/newsletters/:newsletterId' },
    { name: 'ChallengeListActivity', route: '/challenge' },
    {
      name: 'ChallengeLandingActivity',
      route: '/challenge/:challengeId/landing',
    },
    {
      name: 'ChallengeDashboardActivity',
      route: '/challenge/:challengeId/dashboard',
    },
    {
      name: 'ChallengeDailyActivity',
      route: '/challenge/:challengeId/daily',
    },
    {
      name: 'ChallengeCommentsActivity',
      route: '/challenge/:challengeId/comments',
    },
    {
      name: 'ChallengeReviewActivity',
      route: '/challenge/:challengeId/review',
    },
    {
      name: 'ChallengeCertificationActivity',
      route: '/challenge/:challengeId/certification',
    },
  ],
  transitionDuration: 320,
});
