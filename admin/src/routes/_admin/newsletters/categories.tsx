import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { Link, createFileRoute } from '@tanstack/react-router';
import { Suspense, useState, type FormEvent } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { FiCheck, FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import {
  categoriesQueries,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from '@/apis/categories/categories.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

const CATEGORY_NAME_MAX_LENGTH = 20;

const NEWSLETTER_LIST_SEARCH = {
  sort: 'POPULAR',
  page: 0,
  size: 20,
  keyword: undefined,
  category: undefined,
  previousStrategy: undefined,
  status: undefined,
};

export const Route = createFileRoute('/_admin/newsletters/categories')({
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <Layout
      title="카테고리 관리"
      rightAction={
        <Link to="/newsletters" search={NEWSLETTER_LIST_SEARCH}>
          <Button variant="secondary">뉴스레터 관리</Button>
        </Link>
      }
    >
      <ErrorBoundary
        fallbackRender={({ error }) => (
          <div className="p-4 text-red-500">
            에러가 발생했습니다: {error.message}
          </div>
        )}
      >
        <Suspense fallback={<div>로딩 중...</div>}>
          <CategoriesContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function CategoriesContent() {
  const queryClient = useQueryClient();
  const { data: categories } = useSuspenseQuery(categoriesQueries.list());
  const { mutate: createCategory, isPending: isCreatePending } =
    useCreateCategoryMutation();
  const { mutate: updateCategory, isPending: isUpdatePending } =
    useUpdateCategoryMutation();
  const { mutate: deleteCategory, isPending: isDeletePending } =
    useDeleteCategoryMutation();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const invalidateCategories = () =>
    queryClient.invalidateQueries({ queryKey: categoriesQueries.all });

  const handleCreateCategory = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      alert('카테고리명을 입력해주세요.');
      return;
    }

    createCategory(
      { name: trimmedName },
      {
        onSuccess: async () => {
          alert('카테고리가 생성되었습니다.');
          setNewCategoryName('');
          setIsCreateModalOpen(false);
          await invalidateCategories();
        },
        onError: (error) => {
          alert(`카테고리 생성 실패: ${error.message}`);
        },
      },
    );
  };

  const handleStartEdit = (id: number, name: string) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleUpdateCategory = (id: number) => {
    const trimmedName = editingCategoryName.trim();

    if (!trimmedName) {
      alert('카테고리명을 입력해주세요.');
      return;
    }

    const isConfirmed = window.confirm('카테고리를 수정하시겠습니까?');

    if (!isConfirmed) return;

    updateCategory(
      { id, name: trimmedName },
      {
        onSuccess: async () => {
          alert('카테고리가 수정되었습니다.');
          handleCancelEdit();
          await invalidateCategories();
        },
        onError: (error) => {
          alert(`카테고리 수정 실패: ${error.message}`);
        },
      },
    );
  };

  const handleDeleteCategory = (id: number) => {
    const isConfirmed = window.confirm(
      '카테고리를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.',
    );

    if (!isConfirmed) return;

    deleteCategory(id, {
      onSuccess: async () => {
        alert('카테고리가 삭제되었습니다.');
        await invalidateCategories();
      },
      onError: (error) => {
        alert(`카테고리 삭제 실패: ${error.message}`);
      },
    });
  };

  return (
    <Container>
      <ListSection>
        <SectionHeader>
          <SectionTitleWrapper>
            <SectionTitle>카테고리 목록</SectionTitle>
            <FormDescription>
              카테고리를 추가하면 뉴스레터 등록/수정 화면의 선택 목록에 바로
              반영됩니다.
            </FormDescription>
          </SectionTitleWrapper>
          <SectionActionGroup>
            <CategoryCount>현재 {categories.length}개</CategoryCount>
            <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
              <FiPlus />
              추가
            </Button>
          </SectionActionGroup>
        </SectionHeader>

        {categories.length === 0 ? (
          <EmptyState>등록된 카테고리가 없습니다.</EmptyState>
        ) : (
          <CategoryGrid>
            {categories.map((category, index) => {
              const isEditing = editingCategoryId === category.id;

              return (
                <CategoryCard key={category.id}>
                  <CardTop>
                    <CategoryTextBox>
                      <MetaRow>
                        <CategoryBadge>{index + 1}</CategoryBadge>
                        <CategoryId>ID {category.id}</CategoryId>
                      </MetaRow>
                      {isEditing ? (
                        <>
                          <EditInput
                            value={editingCategoryName}
                            onChange={(e) =>
                              setEditingCategoryName(e.target.value)
                            }
                            disabled={isUpdatePending}
                            maxLength={CATEGORY_NAME_MAX_LENGTH}
                          />
                          <InputMeta>
                            최대 {CATEGORY_NAME_MAX_LENGTH}자
                            <InputCount>
                              {editingCategoryName.length}/
                              {CATEGORY_NAME_MAX_LENGTH}
                            </InputCount>
                          </InputMeta>
                        </>
                      ) : (
                        <>
                          <CategoryName>{category.name}</CategoryName>
                        </>
                      )}
                    </CategoryTextBox>
                  </CardTop>

                  <CardBottom>
                    <ActionButtonGroup>
                      {isEditing ? (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            disabled={isUpdatePending}
                            onClick={() => handleUpdateCategory(category.id)}
                          >
                            <FiCheck />
                            저장
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            <FiX />
                            취소
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              handleStartEdit(category.id, category.name)
                            }
                          >
                            <FiEdit2 />
                            수정
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isDeletePending}
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <FiTrash2 />
                            삭제
                          </Button>
                        </>
                      )}
                    </ActionButtonGroup>
                  </CardBottom>
                </CategoryCard>
              );
            })}
          </CategoryGrid>
        )}
      </ListSection>

      {isCreateModalOpen && (
        <ModalOverlay onClick={() => setIsCreateModalOpen(false)}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>새 카테고리 추가</ModalTitle>
            <ModalDescription>
              추가한 카테고리는 뉴스레터 등록/수정 화면에서 바로 선택할 수
              있습니다.
            </ModalDescription>
            <CreateForm onSubmit={handleCreateCategory}>
              <CategoryInput
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="예: 경제 브리핑, 커리어, 스타트업"
                disabled={isCreatePending}
                maxLength={CATEGORY_NAME_MAX_LENGTH}
              />
              <InputMeta>
                최대 {CATEGORY_NAME_MAX_LENGTH}자
                <InputCount>
                  {newCategoryName.length}/{CATEGORY_NAME_MAX_LENGTH}
                </InputCount>
              </InputMeta>
              <ModalActions>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isCreatePending}>
                  <FiPlus />
                  추가
                </Button>
              </ModalActions>
            </CreateForm>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;
`;

const CreateForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const FormDescription = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;

const CategoryInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ListSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const SectionHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  @media (width <= 768px) {
    gap: ${({ theme }) => theme.spacing.md};
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const CategoryCount = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const SectionActionGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  @media (width <= 640px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;

  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const CategoryGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};

  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (width <= 1440px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (width <= 640px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  transition:
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray300};
    transform: translateY(-2px);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
`;

const CategoryTextBox = styled.div`
  min-width: 0;

  display: flex;
  gap: 6px;
  flex: 1;
  flex-direction: column;
`;

const MetaRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  align-items: center;
`;

const CategoryBadge = styled.span`
  height: 24px;
  min-width: 24px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const CategoryId = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const CategoryName = styled.h4`
  overflow: hidden;
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.lg};
  line-height: 1.4;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const EditInput = styled(CategoryInput)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
`;

const InputMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const InputCount = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
`;

const CardBottom = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (width <= 640px) {
    justify-content: flex-end;
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;

  @media (width <= 640px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(15 23 42 / 55%);

  inset: 0;
`;

const ModalCard = styled.div`
  width: min(520px, calc(100vw - 32px));
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const ModalTitle = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const ModalDescription = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;
