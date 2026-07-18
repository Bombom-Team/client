import { basicUIPlugin, AppScreen } from '@stackflow/plugin-basic-ui';
import { historySyncPlugin } from '@stackflow/plugin-history-sync';
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic';
import {
  stackflow,
  useActivity,
  useFlow,
  type ActivityComponentType,
} from '@stackflow/react';
import { stackflowConfig } from './stackflow.config';
import { StackflowBackProvider } from './StackflowBackContext';
import AppInstallPromptModal from '@/components/AppInstallPromptModal/AppInstallPromptModal';
import BomBomPageLayout from '@/components/PageLayout/BomBomPageLayout';
import { MainPageLayout } from '@/routes/_bombom/_main';
import { Route as BookmarkRoute } from '@/routes/_bombom/_main/bookmark';
import { Route as ChallengeDetailRoute } from '@/routes/_bombom/_main/challenge/$challengeId';
import { Route as ChallengeListRoute } from '@/routes/_bombom/_main/challenge/index';
import { Route as RecommendRoute } from '@/routes/_bombom/_main/index';
import { Route as MemoRoute } from '@/routes/_bombom/_main/memo';
import { Route as TodayRoute } from '@/routes/_bombom/_main/today';
import { Route as ArticleDetailRoute } from '@/routes/_bombom/articles.$articleId';
import { Route as PreviousArticleRoute } from '@/routes/_bombom/articles.previous.$articleId';
import { Route as ChallengeLandingRoute } from '@/routes/challenge/$challengeId/landing';
import { Route as NewsletterDetailRoute } from '@/routes/newsletters.$newsletterId';
import type { ComponentType, ReactNode } from 'react';

const RecommendPage = RecommendRoute.options.component as ComponentType;
const TodayPage = TodayRoute.options.component as ComponentType;
const BookmarkPage = BookmarkRoute.options.component as ComponentType;
const MemoPage = MemoRoute.options.component as ComponentType;
const ChallengeListPage = ChallengeListRoute.options.component as ComponentType;
const ChallengeDetailPage = ChallengeDetailRoute.options
  .component as ComponentType;
const ArticleDetailPage = ArticleDetailRoute.options.component as ComponentType;
const PreviousArticlePage = PreviousArticleRoute.options
  .component as ComponentType;
const ChallengeLandingPage = ChallengeLandingRoute.options
  .component as ComponentType;
const NewsletterDetailPage = NewsletterDetailRoute.options
  .component as ComponentType;

interface ActivityScreenProps {
  children: ReactNode;
  isMain?: boolean;
  withBomBomLayout?: boolean;
}

const ActivityScreen = ({
  children,
  isMain = false,
  withBomBomLayout = true,
}: ActivityScreenProps) => {
  const activity = useActivity();
  const { pop } = useFlow();

  const handleBack = () => {
    if (activity.isRoot) {
      window.history.back();
      return;
    }
    pop();
  };

  const content = isMain ? (
    <MainPageLayout>{children}</MainPageLayout>
  ) : (
    children
  );

  return (
    <AppScreen>
      <StackflowBackProvider onBack={handleBack}>
        {withBomBomLayout ? (
          <BomBomPageLayout>
            {content}
            <AppInstallPromptModal />
          </BomBomPageLayout>
        ) : (
          content
        )}
      </StackflowBackProvider>
    </AppScreen>
  );
};

const RecommendActivity: ActivityComponentType<'RecommendActivity'> = () => (
  <ActivityScreen isMain>
    <RecommendPage />
  </ActivityScreen>
);

const TodayActivity: ActivityComponentType<'TodayActivity'> = () => (
  <ActivityScreen isMain>
    <TodayPage />
  </ActivityScreen>
);

const BookmarkActivity: ActivityComponentType<'BookmarkActivity'> = () => (
  <ActivityScreen isMain>
    <BookmarkPage />
  </ActivityScreen>
);

const MemoActivity: ActivityComponentType<'MemoActivity'> = () => (
  <ActivityScreen isMain>
    <MemoPage />
  </ActivityScreen>
);

const ArticleActivity: ActivityComponentType<'ArticleActivity'> = () => (
  <ActivityScreen>
    <ArticleDetailPage />
  </ActivityScreen>
);

const PreviousArticleActivity: ActivityComponentType<
  'PreviousArticleActivity'
> = () => (
  <ActivityScreen>
    <PreviousArticlePage />
  </ActivityScreen>
);

const NewsletterActivity: ActivityComponentType<'NewsletterActivity'> = () => (
  <ActivityScreen withBomBomLayout={false}>
    <NewsletterDetailPage />
  </ActivityScreen>
);

const ChallengeListActivity: ActivityComponentType<
  'ChallengeListActivity'
> = () => (
  <ActivityScreen isMain>
    <ChallengeListPage />
  </ActivityScreen>
);

const ChallengeLandingActivity: ActivityComponentType<
  'ChallengeLandingActivity'
> = () => (
  <ActivityScreen withBomBomLayout={false}>
    <ChallengeLandingPage />
  </ActivityScreen>
);

const ChallengeDetailActivity = () => (
  <ActivityScreen isMain>
    <ChallengeDetailPage />
  </ActivityScreen>
);

export const { Stack: WebViewStack, actions: webViewStackActions } = stackflow({
  config: stackflowConfig,
  components: {
    RecommendActivity,
    TodayActivity,
    BookmarkActivity,
    MemoActivity,
    ArticleActivity,
    PreviousArticleActivity,
    NewsletterActivity,
    ChallengeListActivity,
    ChallengeLandingActivity,
    ChallengeDashboardActivity: ChallengeDetailActivity,
    ChallengeDailyActivity: ChallengeDetailActivity,
    ChallengeCommentsActivity: ChallengeDetailActivity,
    ChallengeReviewActivity: ChallengeDetailActivity,
    ChallengeCertificationActivity: ChallengeDetailActivity,
  },
  plugins: [
    basicRendererPlugin(),
    basicUIPlugin({ theme: 'cupertino' }),
    historySyncPlugin({
      config: stackflowConfig,
      fallbackActivity: () => 'RecommendActivity',
    }),
  ],
});
