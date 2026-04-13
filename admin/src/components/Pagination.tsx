import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const DEFAULT_MAX_VISIBLE_PAGES = 5;

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  countUnitLabel?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  maxVisiblePages = DEFAULT_MAX_VISIBLE_PAGES,
  countUnitLabel = '개',
}: PaginationProps) => {
  const [pageInput, setPageInput] = useState((currentPage + 1).toString());

  useEffect(() => {
    setPageInput((currentPage + 1).toString());
  }, [currentPage]);

  if (totalPages <= 0) {
    return null;
  }

  const visiblePages = getVisiblePageNumbers(
    currentPage,
    totalPages,
    maxVisiblePages,
  );

  const handleChange = (page: number) => {
    if (page < 0 || page === currentPage || page >= totalPages) {
      return;
    }
    onPageChange(page);
  };

  const handlePageJump = () => {
    const page = Number(pageInput);
    if (Number.isNaN(page)) {
      setPageInput((currentPage + 1).toString());
      return;
    }

    const nextPage = Math.min(Math.max(page, 1), totalPages) - 1;
    handleChange(nextPage);
    setPageInput((nextPage + 1).toString());
  };

  const showLeadingEllipsis = visiblePages[0] > 1;
  const showTrailingEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 2;
  const shouldShowFirstPage = visiblePages[0] > 0;
  const shouldShowLastPage =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <Container>
      <PaginationInfo>
        총 {totalCount.toLocaleString()} {countUnitLabel} · 페이지{' '}
        {currentPage + 1} / {totalPages}
      </PaginationInfo>
      <PaginationControls>
        <PaginationButton
          type="button"
          onClick={() => handleChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <FiChevronLeft />
        </PaginationButton>
        {shouldShowFirstPage && (
          <PaginationButton type="button" onClick={() => handleChange(0)}>
            1
          </PaginationButton>
        )}
        {showLeadingEllipsis && <PaginationEllipsis>...</PaginationEllipsis>}
        {visiblePages.map((page) => (
          <PaginationButton
            key={page}
            type="button"
            active={page === currentPage}
            onClick={() => handleChange(page)}
          >
            {page + 1}
          </PaginationButton>
        ))}
        {showTrailingEllipsis && <PaginationEllipsis>...</PaginationEllipsis>}
        {shouldShowLastPage && (
          <PaginationButton
            type="button"
            onClick={() => handleChange(totalPages - 1)}
          >
            {totalPages}
          </PaginationButton>
        )}
        <PaginationButton
          type="button"
          onClick={() => handleChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          <FiChevronRight />
        </PaginationButton>
        <PageJumpWrapper>
          <PageJumpInput
            type="number"
            min={1}
            max={totalPages}
            value={pageInput}
            onChange={(event) => setPageInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handlePageJump();
              }
            }}
            aria-label="이동할 페이지 번호"
          />
          <PaginationButton type="button" onClick={handlePageJump}>
            이동
          </PaginationButton>
        </PageJumpWrapper>
      </PaginationControls>
    </Container>
  );
};

export default Pagination;

const getVisiblePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number,
) => {
  if (totalPages <= 0) {
    return [];
  }

  const visibleCount = Math.min(maxVisiblePages, totalPages);
  let start = Math.max(currentPage - Math.floor(visibleCount / 2), 0);
  let end = start + visibleCount;

  if (end > totalPages) {
    end = totalPages;
    start = totalPages - visibleCount;
  }

  return Array.from({ length: end - start }, (_, index) => start + index);
};

const Container = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  min-width: 36px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid
    ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  justify-content: center;

  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.white};
  color: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.gray700};
  font-weight: ${({ active, theme }) =>
    active ? theme.fontWeight.semibold : theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray400};

    border-color: ${({ theme }) => theme.colors.gray200};
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: ${({ active, theme }) =>
      active ? theme.colors.primaryHover : theme.colors.gray50};
  }
`;

const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const PaginationEllipsis = styled.span`
  min-width: 36px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const PageJumpWrapper = styled.div`
  display: inline-flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
`;

const PageJumpInput = styled.input`
  width: 72px;
  min-height: 32px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;

  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
