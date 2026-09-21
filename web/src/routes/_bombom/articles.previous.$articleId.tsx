import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useRouterState } from '@tanstack/react-router';
import { useMemo } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import MobileDetailHeader from '@/components/Header/MobileDetailHeader';
import ChevronIcon from '@/components/icons/ChevronIcon';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { processContent } from '@/pages/detail/components/ArticleContent/ArticleContent.utils';
import ArticleFontSizeControl from '@/pages/detail/components/ArticleFontSizeControl/ArticleFontSizeControl';
import ArticleHeader from '@/pages/detail/components/ArticleHeader/ArticleHeader';
import { useArticleFontSize } from '@/pages/detail/hooks/useArticleFontSize';
import PreviousArticleContent from '@/pages/newsletter-detail/components/PreviousArticleContent';
import { openSubscribeLink } from '@/pages/newsletter-detail/utils';
import { cutHtmlByTextRatio } from '@/utils/element';

export const Route = createFileRoute('/_bombom/articles/previous/$articleId')({
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
      {
        title: '봄봄 | 지난 뉴스레터 상세',
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const device = useDevice();
  const { percentage, selectFontSize } = useArticleFontSize();
  const { userProfile, isLoggedIn } = useAuth();
  const { articleId } = Route.useParams();
  const { subscribeUrl } = useRouterState({
    select: (routerState) => ({
      subscribeUrl: routerState.location.state.subscribeUrl,
    }),
  });
  const articleIdNumber = Number(articleId);
  const { data: article } = useQuery(
    queries.previousArticleDetail({ id: articleIdNumber }),
  );

  const shouldShowSubscribePrompt =
    !!article?.exposureRatio && article.exposureRatio !== 100;

  const bodyContent = useMemo(
    () => cutHtmlByTextRatio(article?.contents, article?.exposureRatio),
    [article?.contents, article?.exposureRatio],
  );
  const processedContent = useMemo(
    () => processContent(article?.newsletter.name ?? '', bodyContent),
    [article?.newsletter.name, bodyContent],
  );

  if (!article) return null;

  const handleSubscribeClick = () => {
    trackEvent({
      category: 'Newsletter',
      action: '구독하기 버튼 클릭',
      label: article.newsletter.name,
    });
    openSubscribeLink(subscribeUrl, article.newsletter.name, userProfile);
  };

  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSubscribeButtonText = () => {
    if (!isLoggedIn) return '로그인 후 구독할 수 있어요';

    if (article.isSubscribed) return '구독 중';
    return '구독 하러 가기';
  };

  return (
    <Container>
      {device !== 'pc' && (
        <MobileDetailHeader
          right={
            <MobileHeaderActions>
              <ArticleFontSizeControl
                percentage={percentage}
                onSelect={selectFontSize}
              />
              <Button onClick={handleSubscribeClick}>구독하기</Button>
            </MobileHeaderActions>
          }
        />
      )}

      <ArticleReadingIntro>
        <ArticleHeader
          title={article.title}
          newsletterCategory={article.newsletter.category}
          newsletterName={article.newsletter.name}
          arrivedDateTime={new Date(article.arrivedDateTime)}
          expectedReadTime={article.expectedReadTime}
        />
      </ArticleReadingIntro>
      <Divider />

      <PreviousArticleContent
        content={processedContent}
        showGradient={shouldShowSubscribePrompt}
        fontSizePercentage={percentage}
      />

      {shouldShowSubscribePrompt && (
        <SubscribePrompt>
          <SubscribePromptText>
            뉴스레터가 마음에 드셨다면, 구독으로 계속 만나보세요!
          </SubscribePromptText>
          <SubscribePromptButton
            onClick={handleSubscribeClick}
            disabled={!isLoggedIn || (isLoggedIn && article.isSubscribed)}
          >
            {getSubscribeButtonText()}
          </SubscribePromptButton>
        </SubscribePrompt>
      )}

      <Divider />

      {device === 'pc' && (
        <ActionButtonWrapper>
          <ArticleFontSizeControl
            percentage={percentage}
            onSelect={selectFontSize}
          />
          <SubscribeButton
            type="button"
            onClick={handleSubscribeClick}
            disabled={!isLoggedIn || (isLoggedIn && article.isSubscribed)}
          >
            구독
          </SubscribeButton>

          <ActionButton type="button" onClick={handleScrollUp}>
            <ChevronIcon
              direction="up"
              width={28}
              height={28}
              color={theme.colors.icons}
            />
          </ActionButton>
        </ActionButtonWrapper>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 28px;
  border-right: 1px solid ${({ theme }) => theme.colors.stroke};
  border-left: 1px solid ${({ theme }) => theme.colors.stroke};

  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
`;

const ArticleReadingIntro = styled.div`
  width: 100%;
  margin-bottom: 4px;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;

  background-color: ${({ theme }) => theme.colors.dividers};
`;

const ActionButtonWrapper = styled.div`
  position: fixed;
  top: 80vh;
  left: 10%;
  z-index: ${({ theme }) => theme.zIndex.floating};
  width: 56px;
  padding: 4px 0;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 5%);

  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.dividers};
`;

const MobileHeaderActions = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const ActionButton = styled.button`
  width: 44px;
  height: 44px;
  padding: 8px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};

  & > svg {
    transition: transform 0.2s ease;
  }

  &:hover > svg {
    transform: scale(1.1);
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabledBackground};
    cursor: not-allowed;
  }
`;

const SubscribeButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.colors.primaryBomBom};
  color: ${({ theme }) => theme.colors.white};
`;

const SubscribePrompt = styled.div`
  width: 100%;
  padding: 24px 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const SubscribePromptText = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  text-align: center;
`;

const SubscribePromptButton = styled(Button)`
  width: 100%;
  padding: 12px 24px;

  font: ${({ theme }) => theme.fonts.t6Regular};
`;
