import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute, useParams } from '@tanstack/react-router';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import { previousArticlesQueries } from '@/apis/previousArticles/previousArticles.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute(
  '/_admin/newsletters/$newsletterId/previous/',
)({
  component: NewsletterPreviousArticlesPage,
});

function NewsletterPreviousArticlesPage() {
  const { newsletterId } = useParams({ from: Route.id });
  const parsedNewsletterId = Number(newsletterId);
  const { data: newsletter } = useSuspenseQuery(
    newslettersQueries.detail(parsedNewsletterId),
  );
  const { data: previousArticles } = useSuspenseQuery(
    previousArticlesQueries.list({
      newsletterId: parsedNewsletterId,
    }),
  );

  return (
    <Layout title="지난 뉴스레터 관리">
      <Container>
        <Header>
          <Title>{newsletter.name}</Title>
          <Description>
            지난 뉴스레터 {previousArticles.length.toLocaleString()}건
          </Description>
        </Header>

        {previousArticles.length === 0 ? (
          <EmptyState>조회된 지난 뉴스레터가 없습니다.</EmptyState>
        ) : (
          <List>
            {previousArticles.map((article) => (
              <ListItem key={article.id}>
                <Link
                  to="/newsletters/$newsletterId/previous/$articleId"
                  params={{
                    newsletterId,
                    articleId: article.id.toString(),
                  }}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <DetailContent>
                    <TopRow>
                      <ItemTitle>{article.title}</ItemTitle>
                      <TypeBadge $isFixed={article.isFixed}>
                        {article.isFixed ? '고정' : '최신'}
                      </TypeBadge>
                    </TopRow>
                    <ItemSummary>{article.contentsSummary}</ItemSummary>
                    <ItemMeta>
                      예상 읽기 시간 {article.expectedReadTime}분 · 도착일{' '}
                      {new Date(article.arrivedDateTime).toLocaleDateString(
                        'ko-KR',
                      )}
                    </ItemMeta>
                  </DetailContent>
                </Link>
              </ListItem>
            ))}
          </List>
        )}

        <Footer>
          <Link
            to="/newsletters/$newsletterId"
            params={{ newsletterId }}
            style={{ textDecoration: 'none' }}
          >
            <Button as="span" variant="secondary">
              상세로 돌아가기
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

const Title = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const List = styled.ul`
  margin: 0;
  padding: 0;

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;

  list-style: none;
`;

const ListItem = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const DetailContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const TopRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const ItemTitle = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const TypeBadge = styled.span<{ $isFixed: boolean }>`
  padding: 2px 8px;
  border-radius: 9999px;

  background: ${({ $isFixed, theme }) =>
    $isFixed ? theme.colors.gray100 : '#ECFDF3'};
  color: ${({ $isFixed, theme }) =>
    $isFixed ? theme.colors.gray700 : '#067647'};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const ItemSummary = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.5;
`;

const ItemMeta = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px dashed ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;
