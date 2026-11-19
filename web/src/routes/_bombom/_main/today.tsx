import { theme } from '@bombom/shared/theme';
import { useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { queries } from '@/apis/queries';
import RequireLogin from '@/hocs/RequireLogin';
import {
  GUIDE_MAIL_STORAGE_KEY,
  GUIDE_MAILS,
} from '@/pages/guide-detail/constants/guideMail';
import { useDeleteArticlesMutation } from '@/pages/storage/hooks/useDeleteArticlesMutation';
import ArticleCardList from '@/pages/today/components/ArticleCardList/ArticleCardList';
import ArticleCardListSkeleton from '@/pages/today/components/ArticleCardList/ArticleCardListSkeleton';
import { formatDate } from '@/utils/date';
import { createStorage } from '@/utils/localStorage';
import type { LocalGuideMail } from '@/types/guide';
import HomeIcon from '#/assets/svg/home.svg';

export const Route = createFileRoute('/_bombom/_main/today')({
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
      {
        title: '봄봄 | 오늘의 뉴스레터',
      },
    ],
  }),
  component: () => (
    <RequireLogin>
      <Index />
    </RequireLogin>
  ),
});

function Index() {
  const today = useMemo(() => new Date(), []);
  const todayDateStr = useMemo(() => formatDate(today, '-'), [today]);

  const { data: todayArticles, isLoading: isArticlesLoading } = useQuery(
    queries.articles({ date: todayDateStr, size: 50 }),
  );

  const { mutate: deleteArticles } = useDeleteArticlesMutation('today');

  const guideMails = createStorage<LocalGuideMail>(
    GUIDE_MAIL_STORAGE_KEY,
  ).get();

  const guideMailReadMailIds = guideMails?.readMailIds ?? [];

  const guideArticles =
    guideMails?.createdAt && guideMails.createdAt === formatDate(new Date())
      ? GUIDE_MAILS
      : [];

  const mergedArticles = [
    ...(todayArticles?.content?.map((article) => ({
      ...article,
      type: 'article' as const,
    })) ?? []),
    ...(guideArticles.map((guide) => ({
      ...guide,
      isRead: guideMailReadMailIds.includes(guide.articleId),
      isBookmarked: false,
      type: 'guide' as const,
    })) ?? []),
  ];

  const device = useDevice();

  return (
    <Container>
      {device !== 'mobile' && (
        <>
          <TitleWrapper>
            <TitleIconBox>
              <HomeIcon width={20} height={20} color={theme.colors.white} />
            </TitleIconBox>
            <Title>오늘의 뉴스레터</Title>
          </TitleWrapper>
        </>
      )}

      {isArticlesLoading ? (
        <ArticleCardListSkeleton />
      ) : (
        <ArticleCardList
          articles={mergedArticles}
          onDeleteArticles={(articleIds) => deleteArticles(articleIds)}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: flex-start;

  box-sizing: border-box;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const TitleIconBox = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.t11Bold};
`;
