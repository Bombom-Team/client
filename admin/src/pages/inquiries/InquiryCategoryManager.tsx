import styled from '@emotion/styled';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { FiCheck, FiEdit2, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import {
  inquiryCategoriesQueries,
  useCreateInquiryCategoryMutation,
  useDeleteInquiryCategoryMutation,
  useUpdateInquiryCategoryMutation,
} from '@/apis/inquiries/inquiryCategories.query';
import { Button } from '@/components/Button';
import { INQUIRY_CATEGORY_NAME_MAX_LENGTH } from '@/types/inquiry';

export function InquiryCategoryManager() {
  const queryClient = useQueryClient();
  const { data: categories } = useSuspenseQuery(
    inquiryCategoriesQueries.list(),
  );
  const { mutate: createCategory, isPending: isCreatePending } =
    useCreateInquiryCategoryMutation();
  const { mutate: updateCategory, isPending: isUpdatePending } =
    useUpdateInquiryCategoryMutation();
  const { mutate: deleteCategory } = useDeleteInquiryCategoryMutation();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const invalidateCategories = () =>
    queryClient.invalidateQueries({ queryKey: inquiryCategoriesQueries.all });

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

  const startEditing = (id: number, name: string) => {
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleUpdateCategory = (id: number) => {
    const trimmedName = editingCategoryName.trim();
    if (!trimmedName) {
      alert('카테고리명을 입력해주세요.');
      return;
    }

    updateCategory(
      { id, name: trimmedName },
      {
        onSuccess: async () => {
          cancelEditing();
          await invalidateCategories();
        },
        onError: (error) => {
          alert(`카테고리 수정 실패: ${error.message}`);
        },
      },
    );
  };

  const handleDeleteCategory = (id: number) => {
    if (
      !confirm('카테고리를 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.')
    ) {
      return;
    }

    deleteCategory(id, {
      onSuccess: async () => {
        await invalidateCategories();
      },
      onError: (error) => {
        alert(`카테고리 삭제 실패: ${error.message}`);
      },
    });
  };

  return (
    <Container>
      <Header>
        <Title>문의 카테고리 ({categories.length}개)</Title>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <FiPlus />새 카테고리
        </Button>
      </Header>

      <CategoryList>
        {categories.map((category) => (
          <CategoryRow key={category.id}>
            {editingCategoryId === category.id ? (
              <EditingRow>
                <EditInput
                  value={editingCategoryName}
                  maxLength={INQUIRY_CATEGORY_NAME_MAX_LENGTH}
                  onChange={(e) => setEditingCategoryName(e.target.value)}
                />
                <CharCount>
                  {editingCategoryName.length}/
                  {INQUIRY_CATEGORY_NAME_MAX_LENGTH}
                </CharCount>
                <IconButton
                  onClick={() => handleUpdateCategory(category.id)}
                  disabled={isUpdatePending}
                >
                  <FiCheck size={18} />
                </IconButton>
                <IconButton onClick={cancelEditing}>
                  <FiX size={18} />
                </IconButton>
              </EditingRow>
            ) : (
              <>
                <CategoryName>{category.name}</CategoryName>
                <RowActions>
                  <IconButton
                    onClick={() => startEditing(category.id, category.name)}
                  >
                    <FiEdit2 size={18} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCategory(category.id)}>
                    <FiTrash2 size={18} />
                  </IconButton>
                </RowActions>
              </>
            )}
          </CategoryRow>
        ))}
        {categories.length === 0 && (
          <EmptyState>등록된 문의 카테고리가 없습니다.</EmptyState>
        )}
      </CategoryList>

      {isCreateModalOpen && (
        <ModalOverlay onClick={() => setIsCreateModalOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>새 카테고리</ModalTitle>
            <form onSubmit={handleCreateCategory}>
              <EditInput
                value={newCategoryName}
                maxLength={INQUIRY_CATEGORY_NAME_MAX_LENGTH}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="카테고리명"
              />
              <CharCount>
                {newCategoryName.length}/{INQUIRY_CATEGORY_NAME_MAX_LENGTH}
              </CharCount>
              <ModalActions>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isCreatePending}>
                  등록
                </Button>
              </ModalActions>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const CategoryList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const CategoryRow = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const EditingRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  align-items: center;
`;

const CategoryName = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const RowActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray600};

  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};

  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const EditInput = styled.input`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CharCount = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  white-space: nowrap;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalCard = styled.div`
  width: 400px;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background-color: ${({ theme }) => theme.colors.white};
`;

const ModalTitle = styled.h4`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const ModalActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;
