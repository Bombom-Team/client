import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Checkbox/Checkbox';
import Modal from '@/components/Modal/Modal';
import type { Ref } from 'react';

interface InquiryCategoryModalProps {
  isOpen: boolean;
  modalRef: Ref<HTMLDivElement | null>;
  closeModal: () => void;
  onSelectCategory: (categoryId: number) => void;
  isSubmitting?: boolean;
}

const InquiryCategoryModal = ({
  isOpen,
  modalRef,
  closeModal,
  onSelectCategory,
  isSubmitting = false,
}: InquiryCategoryModalProps) => {
  const { data: categories } = useQuery(queries.inquiryCategories());
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const handleSubmit = () => {
    if (selectedCategoryId === null) return;
    onSelectCategory(selectedCategoryId);
  };

  return (
    <Modal
      isOpen={isOpen}
      modalRef={modalRef}
      closeModal={closeModal}
      position="center"
    >
      <Title>문의 카테고리를 선택해주세요</Title>

      <CategoryList role="radiogroup" aria-label="문의 카테고리">
        {categories?.map((category) => (
          <CategoryItem
            key={category.id}
            selected={selectedCategoryId === category.id}
          >
            <Checkbox
              id={`inquiry-category-${category.id}`}
              checked={selectedCategoryId === category.id}
              onChange={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </Checkbox>
          </CategoryItem>
        ))}
      </CategoryList>

      <SubmitButton
        onClick={handleSubmit}
        disabled={selectedCategoryId === null || isSubmitting}
      >
        문의 시작하기
      </SubmitButton>
    </Modal>
  );
};

export default InquiryCategoryModal;

const Title = styled.h2`
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const CategoryList = styled.div`
  width: 100%;
  min-width: 280px;
  margin: 16px 0;

  display: flex;
  gap: 8px;
  flex-direction: column;

  @media (width >= 769px) {
    width: 320px;
  }
`;

const CategoryItem = styled.div<{ selected: boolean }>`
  padding: 14px 16px;
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.colors.primaryBomBom : theme.colors.stroke};
  border-radius: 8px;

  background: ${({ theme, selected }) =>
    selected ? theme.colors.primaryInfo : theme.colors.white};

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;

  label {
    width: 100%;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
`;
