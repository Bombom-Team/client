import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
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
      position="bottom"
    >
      <Title>문의 카테고리를 선택해주세요</Title>

      <CategoryList>
        {categories?.map((category) => (
          <CategoryOption key={category.id}>
            <input
              type="radio"
              name="inquiry-category"
              value={category.id}
              checked={selectedCategoryId === category.id}
              onChange={() => setSelectedCategoryId(category.id)}
            />
            {category.name}
          </CategoryOption>
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
  margin: 16px 0;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const CategoryOption = styled.label`
  display: flex;
  gap: 8px;
  align-items: center;

  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const SubmitButton = styled(Button)`
  width: 100%;
`;
