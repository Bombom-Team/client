import styled from '@emotion/styled';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import {
  NEWSLETTER_PREVIOUS_STRATEGY_LABELS,
  type NewsletterSummary,
} from '@/types/newsletter';

interface NewsletterListProps {
  newsletters: NewsletterSummary[];
}

const NewsletterList = ({ newsletters }: NewsletterListProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingNewsletterId, setDeletingNewsletterId] = useState<
    number | null
  >(null);

  const { mutate: deleteNewsletter, isPending } = useMutation({
    ...newslettersQueries.mutation.delete(),
    onMutate: (newsletterId) => {
      setDeletingNewsletterId(newsletterId);
    },
    onSettled: () => {
      setDeletingNewsletterId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newslettersQueries.all });
    },
  });

  const handleDelete = (newsletterId?: number) => {
    if (!newsletterId) return;
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteNewsletter(newsletterId);
    }
  };

  if (newsletters.length === 0) {
    return (
      <EmptyState>
        <p>등록된 뉴스레터가 없습니다.</p>
      </EmptyState>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>뉴스레터</Th>
          <Th>카테고리</Th>
          <Th>발행 주기</Th>
          <Th>구독자 수</Th>
          <Th>지난호 전략</Th>
          <Th>관리</Th>
        </Tr>
      </Thead>
      <Tbody>
        {newsletters.map((newsletter, index) => {
          const newsletterId = newsletter.id;
          const previousStrategyLabel = newsletter.previousStrategy
            ? NEWSLETTER_PREVIOUS_STRATEGY_LABELS[newsletter.previousStrategy]
            : '-';
          const isDeleting =
            isPending && newsletterId === deletingNewsletterId;

          return (
            <BodyRow
              key={newsletterId ?? `${newsletter.name ?? 'newsletter'}-${index}`}
              onClick={() => {
                if (!newsletterId) return;
                navigate({
                  to: '/newsletters/$newsletterId',
                  params: { newsletterId: newsletterId.toString() },
                });
              }}
            >
              <Td>
                <NameCell>
                  {newsletter.imageUrl ? (
                    <Thumbnail
                      src={newsletter.imageUrl}
                      alt={`${newsletter.name ?? '뉴스레터'} 이미지`}
                    />
                  ) : (
                    <ThumbnailPlaceholder>이미지</ThumbnailPlaceholder>
                  )}
                  <NameText>
                    <strong>{newsletter.name ?? '이름 없음'}</strong>
                    <span>{newsletter.issueCycle ?? '-'}</span>
                  </NameText>
                </NameCell>
              </Td>
              <Td>{newsletter.categoryName ?? '-'}</Td>
              <Td>{newsletter.issueCycle ?? '-'}</Td>
              <Td>{newsletter.subscriptionCount ?? 0}</Td>
              <Td>{previousStrategyLabel}</Td>
              <Td>
                <ActionButtons>
                  <IconButton
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (!newsletterId) return;
                      navigate({
                        to: '/newsletters/$newsletterId/edit',
                        params: { newsletterId: newsletterId.toString() },
                      });
                    }}
                    aria-label="뉴스레터 수정"
                  >
                    <FiEdit size={18} />
                  </IconButton>
                  <IconButton
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(newsletterId);
                    }}
                    disabled={isDeleting}
                    aria-label="뉴스레터 삭제"
                  >
                    <FiTrash2 size={18} />
                  </IconButton>
                </ActionButtons>
              </Td>
            </BodyRow>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default NewsletterList;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const Tbody = styled.tbody``;

const Tr = styled.tr``;

const BodyRow = styled.tr`
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const NameCell = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const Thumbnail = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: cover;
`;

const ThumbnailPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const NameText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  strong {
    color: ${({ theme }) => theme.colors.gray900};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }

  span {
    color: ${({ theme }) => theme.colors.gray500};
    font-size: ${({ theme }) => theme.fontSize.xs};
  }
`;

const ActionButtons = styled.div`
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
