import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute, useParams } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import {
  previousArticlesQueries,
  useUpdatePreviousArticle,
} from '@/apis/previousArticles/previousArticles.query';
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
  const queryClient = useQueryClient();
  const { mutate: updatePreviousArticle, isPending } =
    useUpdatePreviousArticle();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    contents: '',
    arrivedDateTime: '',
    isFixed: false,
  });

  const { data: newsletter } = useSuspenseQuery(
    newslettersQueries.detail(parsedNewsletterId),
  );
  const { data: article } = useSuspenseQuery(
    previousArticlesQueries.detail({
      newsletterId: parsedNewsletterId,
      articleId: parsedArticleId,
    }),
  );

  useEffect(() => {
    const arrivedDate = new Date(article.arrivedDateTime);
    const localDatetimeValue = Number.isNaN(arrivedDate.getTime())
      ? ''
      : toDatetimeLocalValue(arrivedDate);

    setFormData({
      title: article.title,
      contents: article.contents,
      arrivedDateTime: localDatetimeValue,
      isFixed: article.isFixed,
    });
  }, [article]);

  const handleUpdateSubmit = (event: FormEvent<HTMLFormElement>) => {
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

    updatePreviousArticle(
      {
        newsletterId: parsedNewsletterId,
        articleId: parsedArticleId,
        payload: {
          title: formData.title,
          contents: formData.contents,
          arrivedDateTime: parsedDate.toISOString(),
          isFixed: formData.isFixed,
        },
      },
      {
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: previousArticlesQueries.detail({
                newsletterId: parsedNewsletterId,
                articleId: parsedArticleId,
              }).queryKey,
            }),
            queryClient.invalidateQueries({
              queryKey: previousArticlesQueries.list({
                newsletterId: parsedNewsletterId,
              }).queryKey,
            }),
          ]);
          setIsEditOpen(false);
        },
        onError: (error) => {
          alert(`수정 실패: ${error.message}`);
        },
      },
    );
  };

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
          <Button type="button" onClick={() => setIsEditOpen(true)}>
            수정
          </Button>
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

      {isEditOpen && (
        <ModalOverlay onClick={() => setIsEditOpen(false)}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>지난 뉴스레터 수정</ModalTitle>
            <ModalForm onSubmit={handleUpdateSubmit}>
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
                  rows={10}
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
                  id="is-fixed-edit"
                  type="checkbox"
                  checked={formData.isFixed}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      isFixed: event.target.checked,
                    }))
                  }
                />
                <CheckLabel htmlFor="is-fixed-edit">
                  고정 아티클로 등록
                </CheckLabel>
              </CheckRow>

              <ModalActions>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? '수정 중...' : '수정'}
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
  gap: ${({ theme }) => theme.spacing.xs};
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
  min-height: 340px;
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

const toDatetimeLocalValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
