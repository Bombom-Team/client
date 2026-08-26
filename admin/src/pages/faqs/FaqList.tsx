import styled from '@emotion/styled';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { faqsQueries } from '@/apis/faqs/faqs.query';
import { type Faq, FAQ_CATEGORY_LABELS } from '@/types/faq';

export function FaqList({ faqs }: { faqs: Faq[] }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: deleteFaq } = useMutation({
    ...faqsQueries.mutation.delete(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqsQueries.all });
    },
  });

  const handleDelete = (faqId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteFaq(faqId);
    }
  };

  if (faqs.length === 0) {
    return (
      <EmptyState>
        <p>등록된 FAQ가 없습니다.</p>
      </EmptyState>
    );
  }

  return (
    <Container>
      {faqs.map((faq) => (
        <FaqItem
          key={faq.id}
          onClick={() =>
            navigate({
              to: '/faqs/$faqId',
              params: { faqId: faq.id.toString() },
            })
          }
        >
          <FaqHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CategoryBadge>
                {FAQ_CATEGORY_LABELS[
                  faq.faqCategory as keyof typeof FAQ_CATEGORY_LABELS
                ] ?? faq.faqCategory}
              </CategoryBadge>
              <FaqQuestion>{faq.question}</FaqQuestion>
            </div>
            <FaqActions>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({
                    to: '/faqs/$faqId/edit',
                    params: { faqId: faq.id.toString() },
                  });
                }}
              >
                <FiEdit size={18} />
              </IconButton>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(faq.id);
                }}
              >
                <FiTrash2 size={18} />
              </IconButton>
            </FaqActions>
          </FaqHeader>
          <FaqMeta>
            <DateText>{faq.createdAt}</DateText>
          </FaqMeta>
        </FaqItem>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const FaqItem = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FaqHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const FaqQuestion = styled.h4`
  margin-bottom: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const FaqActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: transparent;
  color: ${({ theme }) => theme.colors.gray600};

  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xxl};

  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const FaqMeta = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const CategoryBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const DateText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
