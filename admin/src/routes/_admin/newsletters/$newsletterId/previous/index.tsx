import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute, useParams } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import {
  previousArticlesQueries,
  useCreatePreviousArticle,
  useDeletePreviousArticle,
} from '@/apis/previousArticles/previousArticles.query';
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
  const queryClient = useQueryClient();
  const { mutate: createPreviousArticle, isPending } =
    useCreatePreviousArticle();
  const { mutate: deletePreviousArticle, isPending: isDeletePending } =
    useDeletePreviousArticle();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    contents: '',
    arrivedDateTime: '',
    isFixed: false,
  });

  const { data: newsletter } = useSuspenseQuery(
    newslettersQueries.detail(parsedNewsletterId),
  );
  const { data: previousArticles } = useSuspenseQuery(
    previousArticlesQueries.list({
      newsletterId: parsedNewsletterId,
    }),
  );

  const handleCreateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.arrivedDateTime) {
      alert('도착일을 입력해주세요.');
      return;
    }

    const parsedDate = new Date(formData.arrivedDateTime);
    if (Number.isNaN(parsedDate.getTime())) {
      alert('도착일 형식이 올바르지 않습니다.');
      return;
    }

    createPreviousArticle(
      {
        newsletterId: parsedNewsletterId,
        payload: {
          title: formData.title,
          contents: formData.contents,
          arrivedDateTime: parsedDate.toISOString(),
          isFixed: formData.isFixed,
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: previousArticlesQueries.list({
              newsletterId: parsedNewsletterId,
            }).queryKey,
          });
          setIsCreateOpen(false);
          setFormData({
            title: '',
            contents: '',
            arrivedDateTime: '',
            isFixed: false,
          });
        },
        onError: (error) => {
          alert(`생성 실패: ${error.message}`);
        },
      },
    );
  };

  const handleDeletePreviousArticle = (articleId: number) => {
    const targetArticle = previousArticles.find(
      (article) => article.id === articleId,
    );
    const confirmed = window.confirm(
      `정말 삭제할까요?\n제목: ${targetArticle?.title ?? '알 수 없음'}`,
    );
    if (!confirmed) return;

    deletePreviousArticle(
      { newsletterId: parsedNewsletterId, articleId },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: previousArticlesQueries.list({
              newsletterId: parsedNewsletterId,
            }).queryKey,
          });
        },
        onError: (error) => {
          alert(`삭제 실패: ${error.message}`);
        },
      },
    );
  };

  return (
    <Layout title="지난 뉴스레터 관리">
      <Container>
        <Header>
          <HeaderText>
            <Title>{newsletter.name}</Title>
            <Description>
              지난 뉴스레터 {previousArticles.length.toLocaleString()}건
            </Description>
          </HeaderText>
          <Button type="button" onClick={() => setIsCreateOpen(true)}>
            지난 뉴스레터 생성
          </Button>
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
                <ItemActions>
                  <DeleteButton
                    type="button"
                    variant="secondary"
                    disabled={isDeletePending}
                    onClick={() => handleDeletePreviousArticle(article.id)}
                  >
                    삭제
                  </DeleteButton>
                </ItemActions>
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

      {isCreateOpen && (
        <ModalOverlay onClick={() => setIsCreateOpen(false)}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>지난 뉴스레터 생성</ModalTitle>
            <ModalForm onSubmit={handleCreateSubmit}>
              <Field>
                <FieldLabel>제목</FieldLabel>
                <FieldInput
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <Field>
                <FieldLabel>본문(HTML)</FieldLabel>
                <FieldTextArea
                  value={formData.contents}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      contents: event.target.value,
                    }))
                  }
                  rows={8}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>도착일</FieldLabel>
                <FieldInput
                  type="datetime-local"
                  value={formData.arrivedDateTime}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      arrivedDateTime: event.target.value,
                    }))
                  }
                  required
                />
              </Field>

              <CheckRow>
                <CheckInput
                  id="is-fixed"
                  type="checkbox"
                  checked={formData.isFixed}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFixed: event.target.checked,
                    }))
                  }
                />
                <CheckLabel htmlFor="is-fixed">고정 아티클로 등록</CheckLabel>
              </CheckRow>

              <ModalActions>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreateOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? '생성 중...' : '생성'}
                </Button>
              </ModalActions>
            </ModalForm>
          </ModalCard>
        </ModalOverlay>
      )}
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
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
  justify-content: space-between;
`;

const HeaderText = styled.div`
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

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: stretch;
  justify-content: space-between;
`;

const DetailContent = styled.div`
  padding: ${({ theme }) => theme.spacing.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  flex-direction: column;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const ItemActions = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
`;

const DeleteButton = styled(Button)`
  min-width: 72px;
  min-height: 20px;
  padding: 0 14px;

  font-size: ${({ theme }) => theme.fontSize.sm};
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

const ModalOverlay = styled.div`
  position: fixed;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgb(0 0 0 / 45%);

  inset: 0;
`;

const ModalCard = styled.div`
  width: min(760px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};

  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const ModalForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const Field = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const FieldLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const FieldInput = styled.input`
  min-height: 48px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const FieldTextArea = styled.textarea`
  min-height: 380px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.5;

  resize: vertical;
`;

const CheckRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const CheckInput = styled.input`
  width: 24px;
  height: 24px;
`;

const CheckLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: flex-end;
`;
