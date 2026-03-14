import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute, useParams } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import {
  previousArticlesQueries,
  useCreatePreviousArticle,
  useDeletePreviousArticle,
  useUpdatePreviousArticle,
} from '@/apis/previousArticles/previousArticles.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import {
  PREVIOUS_STRATEGY_LABELS,
  type PreviousStrategyType,
} from '@/types/newsletter';
import type { PreviousArticle } from '@/apis/previousArticles/previousArticles.api';

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
  const { mutate: updatePreviousArticle, isPending: isUpdatePending } =
    useUpdatePreviousArticle();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    contents: '',
    arrivedDateTime: '',
    isFixed: false,
  });
  const [editFormData, setEditFormData] = useState({
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
  const strategy = resolveStrategy(newsletter.previousStrategy);
  const exposedArticleIds = getExposedArticleIdSet({
    articles: previousArticles,
    strategy,
    fixedCount: newsletter.previousFixedCount,
    recentCount: newsletter.previousRecentCount,
  });

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

  const handleOpenEditModal = (articleId: number) => {
    const targetArticle = previousArticles.find(
      (article) => article.id === articleId,
    );
    if (!targetArticle) return;

    const arrivedDate = new Date(targetArticle.arrivedDateTime);
    const localDatetimeValue = Number.isNaN(arrivedDate.getTime())
      ? ''
      : toDatetimeLocalValue(arrivedDate);

    setEditingArticleId(articleId);
    setEditFormData({
      title: targetArticle.title,
      contents: targetArticle.contents,
      arrivedDateTime: localDatetimeValue,
      isFixed: targetArticle.isFixed,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingArticleId === null) return;
    if (!editFormData.arrivedDateTime) {
      alert('도착일을 입력해주세요.');
      return;
    }

    const parsedDate = new Date(editFormData.arrivedDateTime);
    if (Number.isNaN(parsedDate.getTime())) {
      alert('도착일 형식이 올바르지 않습니다.');
      return;
    }

    const confirmed = window.confirm('수정 내용을 저장할까요?');
    if (!confirmed) return;

    updatePreviousArticle(
      {
        newsletterId: parsedNewsletterId,
        articleId: editingArticleId,
        payload: {
          title: editFormData.title,
          contents: editFormData.contents,
          arrivedDateTime: parsedDate.toISOString(),
          isFixed: editFormData.isFixed,
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: previousArticlesQueries.list({
              newsletterId: parsedNewsletterId,
            }).queryKey,
          });
          setIsEditOpen(false);
          setEditingArticleId(null);
        },
        onError: (error) => {
          alert(`수정 실패: ${error.message}`);
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

        <PolicySection>
          <PolicyToggleButton
            type="button"
            onClick={() => setIsPolicyOpen((prev) => !prev)}
          >
            지난 아티클 노출 정책 {isPolicyOpen ? '숨기기' : '보기'}
          </PolicyToggleButton>
          {isPolicyOpen && (
            <PolicyBody>
              <PolicyRow>
                <PolicyLabel>현재 전략</PolicyLabel>
                <PolicyValue>{PREVIOUS_STRATEGY_LABELS[strategy]}</PolicyValue>
              </PolicyRow>
              <PolicyRow>
                <PolicyLabel>고정 아티클 노출 개수</PolicyLabel>
                <PolicyValue>
                  {newsletter.previousFixedCount ?? 0}개
                </PolicyValue>
              </PolicyRow>
              <PolicyRow>
                <PolicyLabel>최신 제외 자동 이동 노출 개수</PolicyLabel>
                <PolicyValue>
                  {newsletter.previousRecentCount ?? 0}개
                </PolicyValue>
              </PolicyRow>
              <PolicyRow>
                <PolicyLabel>노출 비율</PolicyLabel>
                <PolicyValue>
                  {newsletter.previousExposureRatio ?? 0}%
                </PolicyValue>
              </PolicyRow>
              <PolicyHint>
                `RECENT_ONLY`, `FIXED_WITH_RECENT`는 자동 이동 아티클 중
                arrivedDateTime이 가장 최신인 1개를 제외하고 노출 대상을
                계산합니다.
              </PolicyHint>
            </PolicyBody>
          )}
        </PolicySection>

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
                      <ExposureBadge
                        $isExposed={exposedArticleIds.has(article.id)}
                      >
                        {exposedArticleIds.has(article.id) ? '공개' : '비공개'}
                      </ExposureBadge>
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
                  <EditButton
                    type="button"
                    onClick={() => handleOpenEditModal(article.id)}
                  >
                    수정
                  </EditButton>
                  <DeleteButton
                    type="button"
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

      {isEditOpen && (
        <ModalOverlay
          onClick={() => {
            setIsEditOpen(false);
            setEditingArticleId(null);
          }}
        >
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>지난 뉴스레터 수정</ModalTitle>
            <ModalForm onSubmit={handleEditSubmit}>
              <Field>
                <FieldLabel>제목</FieldLabel>
                <FieldInput
                  value={editFormData.title}
                  onChange={(event) =>
                    setEditFormData((prev) => ({
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
                  value={editFormData.contents}
                  onChange={(event) =>
                    setEditFormData((prev) => ({
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
                  value={editFormData.arrivedDateTime}
                  onChange={(event) =>
                    setEditFormData((prev) => ({
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
                  checked={editFormData.isFixed}
                  onChange={(event) =>
                    setEditFormData((prev) => ({
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
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingArticleId(null);
                  }}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isUpdatePending}>
                  {isUpdatePending ? '수정 중...' : '수정'}
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

const PolicySection = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const PolicyToggleButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray800};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;

  cursor: pointer;
`;

const PolicyBody = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const PolicyRow = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;

  grid-template-columns: 180px 1fr;
`;

const PolicyLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const PolicyValue = styled.span`
  color: ${({ theme }) => theme.colors.gray800};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const PolicyHint = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.4;
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
  align-items: center;
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
  padding-right: ${({ theme }) => theme.spacing.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-shrink: 0;
  align-items: center;
`;

const EditButton = styled(Button)`
  min-width: 76px;
  min-height: 36px;
  padding: 8px 14px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 12px;

  background: #6f72ee;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:hover:not(:disabled) {
    background: #5f63e5;
  }
`;

const DeleteButton = styled(Button)`
  min-width: 76px;
  min-height: 36px;
  padding: 8px 14px;
  border: 1px solid #e6655b;
  border-radius: 12px;

  background: #f26a5d;
  color: #fff;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:hover:not(:disabled) {
    background: #e6655b;
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
  padding: 4px 10px;
  border-radius: 9999px;

  background: ${({ $isFixed, theme }) =>
    $isFixed ? theme.colors.gray100 : '#EEF2FF'};
  color: ${({ $isFixed, theme }) =>
    $isFixed ? theme.colors.gray700 : '#4338CA'};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ExposureBadge = styled.span<{ $isExposed: boolean }>`
  padding: 4px 10px;
  border-radius: 9999px;

  background: ${({ $isExposed }) => ($isExposed ? '#ecfdf3' : '#f3f4f6')};
  color: ${({ $isExposed }) => ($isExposed ? '#067647' : '#4b5563')};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
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

const toDatetimeLocalValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const resolveStrategy = (strategy?: string): PreviousStrategyType => {
  if (
    strategy === 'FIXED_WITH_RECENT' ||
    strategy === 'FIXED_ONLY' ||
    strategy === 'RECENT_ONLY' ||
    strategy === 'INACTIVE'
  ) {
    return strategy;
  }
  return 'INACTIVE';
};

const getExposedArticleIdSet = ({
  articles,
  strategy,
  fixedCount,
  recentCount,
}: {
  articles: PreviousArticle[];
  strategy: PreviousStrategyType;
  fixedCount?: number;
  recentCount?: number;
}) => {
  if (strategy === 'INACTIVE') {
    return new Set<number>();
  }

  const normalizedFixedCount = Math.max(0, fixedCount ?? 0);
  const normalizedRecentCount = Math.max(0, recentCount ?? 0);
  const sorted = [...articles].sort(
    (left, right) =>
      new Date(right.arrivedDateTime).getTime() -
      new Date(left.arrivedDateTime).getTime(),
  );

  const fixedArticles = sorted.filter((article) => article.isFixed);
  const nonFixedArticles = sorted.filter((article) => !article.isFixed);
  const latestNonFixedId = nonFixedArticles[0]?.id;
  const recentCandidates = nonFixedArticles.filter(
    (article) => article.id !== latestNonFixedId,
  );

  if (strategy === 'FIXED_ONLY') {
    return new Set(
      fixedArticles.slice(0, normalizedFixedCount).map((article) => article.id),
    );
  }

  if (strategy === 'RECENT_ONLY') {
    return new Set(
      recentCandidates
        .slice(0, normalizedRecentCount)
        .map((article) => article.id),
    );
  }

  const fixedIds = fixedArticles
    .slice(0, normalizedFixedCount)
    .map((article) => article.id);
  const recentIds = recentCandidates
    .slice(0, normalizedRecentCount)
    .map((article) => article.id);

  return new Set([...fixedIds, ...recentIds]);
};
