import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import EmptyUnreadCard from '../EmptyUnreadCard/EmptyUnreadCard';
import NewsletterItemCard from '../NewsletterItemCard/NewsletterItemCard';
import { queries } from '@/apis/queries';
import { formatDate } from '@/utils/date';

interface TodayUnreadArticlesSectionProps {
  articleId: number;
}

const TodayUnreadArticlesSection = ({
  articleId,
}: TodayUnreadArticlesSectionProps) => {
  const today = useMemo(() => new Date(), []);
  const { data: todayArticles } = useQuery(
    queries.articles({ date: formatDate(today, '-') }),
  );

  const unreadArticles = todayArticles?.content?.filter(
    (article) => !article.isRead && article.articleId !== articleId,
  );

  return (
    <Container>
      <TodayArticleTitle>오늘 읽지 않은 다른 아티클</TodayArticleTitle>
      {unreadArticles?.length && unreadArticles.length > 0 ? (
        <TodayArticleList>
          {unreadArticles.map((article) => (
            <NewsletterItemCard key={article.articleId} data={article} />
          ))}
        </TodayArticleList>
      ) : (
        <EmptyUnreadCard />
      )}
    </Container>
  );
};

export default TodayUnreadArticlesSection;

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const TodayArticleTitle = styled.h3`
  align-self: flex-start;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const TodayArticleList = styled.div`
  display: grid;
  gap: 20px;
  justify-items: center;

  grid-template-columns: repeat(2, 1fr);
`;
