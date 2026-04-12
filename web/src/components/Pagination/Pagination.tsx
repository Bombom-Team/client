import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { ELLIPSIS } from './Pagination.constants';
import {
  getPageNumbers,
  canGoToPreviousPage,
  canGoToNextPage,
  shouldShowPagination,
} from './Pagination.utils';
import ChevronIcon from '../icons/ChevronIcon';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handlePrevPage = () => {
    if (canGoToPreviousPage(currentPage)) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (canGoToNextPage(currentPage, totalPages)) {
      onPageChange(currentPage + 1);
    }
  };

  if (!shouldShowPagination(totalPages)) return null;

  return (
    <Container>
      <NavigationButton
        onClick={handlePrevPage}
        disabled={!canGoToPreviousPage(currentPage)}
        aria-label="이전 페이지"
      >
        <ChevronIcon direction="left" width={16} color={theme.colors.black} />
      </NavigationButton>

      <PageNumberButtonWrapper>
        {pageNumbers.map((page, index) =>
          page === ELLIPSIS ? (
            <EllipsisText key={index}>{ELLIPSIS}</EllipsisText>
          ) : (
            <PageNumberButton
              key={index}
              isCurrent={page === currentPage}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </PageNumberButton>
          ),
        )}
      </PageNumberButtonWrapper>

      <NavigationButton
        onClick={handleNextPage}
        disabled={!canGoToNextPage(currentPage, totalPages)}
        aria-label="다음 페이지"
      >
        <ChevronIcon direction="right" width={16} color={theme.colors.black} />
      </NavigationButton>
    </Container>
  );
};

export default Pagination;

const Container = styled.div`
  width: 100%;
  margin-top: 2rem;

  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
`;

const NavigationButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};

  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.disabledBackground};
  }

  svg {
    width: 1rem;
    height: 1rem;

    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const PageNumberButtonWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

const PageNumberButton = styled.button<{
  isCurrent: boolean;
}>`
  height: 2.5rem;
  min-width: 40px;
  padding: 0 0.75rem;
  border: 1px solid
    ${({ theme, isCurrent }) =>
      isCurrent ? theme.colors.primary : theme.colors.stroke};
  border-radius: 0.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme, isCurrent }) =>
    isCurrent ? theme.colors.primary : theme.colors.white};
  color: ${({ theme, isCurrent }) =>
    isCurrent ? theme.colors.white : theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, isCurrent }) =>
      isCurrent ? theme.colors.primary : theme.colors.disabledBackground};
  }
`;

const EllipsisText = styled.span`
  height: 2.5rem;
  min-width: 40px;
  padding: 0 0.75rem;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;
