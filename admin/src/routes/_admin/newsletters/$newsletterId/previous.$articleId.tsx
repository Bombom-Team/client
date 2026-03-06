import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute, useParams } from '@tanstack/react-router';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import { previousArticlesQueries } from '@/apis/previousArticles/previousArticles.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute(
  '/_admin/newsletters/$newsletterId/previous/$articleId',
)({
  component: PreviousArticleDetailPage,
  errorComponent: ({ error }) => (
    <Layout title="지난 뉴스레터 상세">
      <ErrorBox>{error.message}</ErrorBox>
    </Layout>
  ),
});

function PreviousArticleDetailPage() {
  const { newsletterId, articleId } = useParams({ from: Route.id });
  const parsedNewsletterId = Number(newsletterId);
  const parsedArticleId = Number(articleId);

  const { data: newsletter } = useSuspenseQuery(
    newslettersQueries.detail(parsedNewsletterId),
  );
  const { data: article } = useSuspenseQuery(
    previousArticlesQueries.detail({
      newsletterId: parsedNewsletterId,
      articleId: parsedArticleId,
    }),
  );

  return (
    <Layout title="지난 뉴스레터 상세">
      <Container>
        <Header>
          <NewsletterName>{newsletter.name}</NewsletterName>
          <Title>{article.title}</Title>
          <Meta>
            예상 읽기 시간 {article.expectedReadTime}분 · 도착일{' '}
            {new Date(article.arrivedDateTime).toLocaleDateString('ko-KR')}
          </Meta>
        </Header>

        <SummarySection>
          <SummaryLabel>요약</SummaryLabel>
          <Summary>{article.contentsSummary}</Summary>
        </SummarySection>
        <Body dangerouslySetInnerHTML={{ __html: article.contents }} />

        <Footer>
          <Link
            to="/newsletters/$newsletterId/previous"
            params={{ newsletterId }}
            style={{ textDecoration: 'none' }}
          >
            <Button as="span" variant="secondary">
              목록으로 돌아가기
            </Button>
          </Link>
        </Footer>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;

  background: white;
`;

const Header = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const NewsletterName = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const SummarySection = styled.section`
  padding: ${({ theme }) => theme.spacing.md};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.gray50};
`;

const SummaryLabel = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};

  color: ${({ theme }) => theme.colors.gray500};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const Summary = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;

const Body = styled.div`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.7;

  p,
  ul,
  ol,
  blockquote,
  pre {
    margin: 0 0 ${({ theme }) => theme.spacing.md};
  }

  h1,
  h2,
  h3,
  h4 {
    margin: ${({ theme }) => theme.spacing.lg} 0
      ${({ theme }) => theme.spacing.sm};
    line-height: 1.4;
  }

  img {
    height: auto;
    max-width: 100%;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.white};
  color: #dc2626;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
