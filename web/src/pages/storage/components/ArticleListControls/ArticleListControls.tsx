import styled from '@emotion/styled';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import SelectionControl from './SelectionControl';
import ArticleDeleteModal from '../ArticleDeleteModal/ArticleDeleteModal';
import useModal from '@/components/Modal/useModal';
import SearchInput from '@/components/SearchInput/SearchInput';
import Select from '@/components/Select/Select';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDevice } from '@/hooks/useDevice';
import { useSearchParamState } from '@/hooks/useSearchParamState';
import StorageUsageBar from '@/pages/storage/components/StorageUsageBar/StorageUsageBar';
import type { Sort } from './ArticleListControls.types';
import CancelIcon from '#/assets/svg/close.svg';
import ReadingGlassesIcon from '#/assets/svg/reading-glasses.svg';

interface ArticleListControlsProps {
  editMode: boolean;
  onEnterEditMode: () => void;
  onExitEditMode: () => void;
  onDeleteSelected: () => void;
  checkedCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  hasBookmarkedArticles?: boolean;
  totalStorageCount: number;
}

const ArticleListControls = ({
  editMode,
  onEnterEditMode,
  onExitEditMode,
  onDeleteSelected,
  checkedCount,
  isAllSelected,
  onToggleSelectAll,
  hasBookmarkedArticles = false,
  totalStorageCount,
}: ArticleListControlsProps) => {
  const [searchParam, setSearchParam] = useSearchParamState('search');
  const [search, setSearch] = useState(searchParam ?? '');
  const [isSearchExpanded, setIsSearchExpanded] = useState(
    Boolean(searchParam),
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [sort, setSort] = useSearchParamState<Sort>('sort', {
    defaultValue: 'DESC',
  });
  const [unreadOnlyParam, setUnreadOnlyParam] =
    useSearchParamState<boolean>('unreadOnly');
  const showUnreadOnly = unreadOnlyParam ?? false;
  const debouncedSearchInput = useDebouncedValue(search, 500);
  const { modalRef, isOpen, openModal, closeModal } = useModal();

  const device = useDevice();
  const isMobile = device === 'mobile';

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (value: 'DESC' | 'ASC') => {
    setSort(value);
  };

  const handleSearchClose = () => {
    setSearch('');
    setSearchParam(null);
    setIsSearchExpanded(false);
  };

  const handleUnreadOnlyToggle = () => {
    setUnreadOnlyParam((prev) => (prev ? null : true));
  };

  useEffect(() => {
    setSearchParam(debouncedSearchInput || null);
  }, [debouncedSearchInput, setSearchParam]);

  useEffect(() => {
    setSearch(searchParam ?? '');
    if (searchParam) setIsSearchExpanded(true);
  }, [searchParam]);

  useEffect(() => {
    if (isMobile && isSearchExpanded) searchInputRef.current?.focus();
  }, [isMobile, isSearchExpanded]);

  return (
    <Container>
      {!isMobile && (
        <StorageSearchInput
          placeholder="뉴스레터 제목으로 검색하세요..."
          value={search}
          onChange={handleSearchChange}
        />
      )}
      <SummaryBar isMobile={isMobile}>
        <SummaryBox isMobile={isMobile}>
          {!isMobile && (
            <SelectionControl
              editMode={editMode}
              checkedCount={checkedCount}
              isAllSelected={isAllSelected}
              onEnterEditMode={onEnterEditMode}
              onExitEditMode={onExitEditMode}
              onToggleSelectAll={onToggleSelectAll}
              onDeleteClick={openModal}
            />
          )}
          <StorageUsageBarWrapper>
            <StorageUsageBar cur={totalStorageCount ?? 0} max={500} />
          </StorageUsageBarWrapper>
          {isMobile && !isSearchExpanded && (
            <SearchIconButton
              type="button"
              aria-label="검색 열기"
              onClick={() => setIsSearchExpanded(true)}
            >
              <ReadingGlassesIcon width={20} height={20} />
            </SearchIconButton>
          )}
          {isMobile && (
            <ExpandableSearchWrapper isExpanded={isSearchExpanded}>
              <StorageSearchInput
                ref={searchInputRef}
                placeholder="뉴스레터 제목으로 검색하세요..."
                value={search}
                onChange={handleSearchChange}
                onBlur={() => {
                  if (search === '') setIsSearchExpanded(false);
                }}
              />
              <CloseSearchButton
                type="button"
                aria-label="검색 닫기"
                onClick={handleSearchClose}
              >
                <CancelIcon width={20} height={20} />
              </CloseSearchButton>
            </ExpandableSearchWrapper>
          )}
        </SummaryBox>

        <ListViewControls isMobile={isMobile}>
          {isMobile && (
            <SelectionControl
              editMode={editMode}
              checkedCount={checkedCount}
              isAllSelected={isAllSelected}
              onEnterEditMode={onEnterEditMode}
              onExitEditMode={onExitEditMode}
              onToggleSelectAll={onToggleSelectAll}
              onDeleteClick={openModal}
            />
          )}
          <FilterControls>
            <UnreadFilterButton
              type="button"
              aria-pressed={showUnreadOnly}
              isActive={showUnreadOnly}
              onClick={handleUnreadOnlyToggle}
            >
              안 읽은 뉴스레터만
            </UnreadFilterButton>
            <Select
              options={[
                { value: 'DESC', label: '최신순' },
                { value: 'ASC', label: '오래된순' },
              ]}
              selectedValue={sort as Sort}
              onSelectOption={handleSortChange}
            />
          </FilterControls>
        </ListViewControls>
      </SummaryBar>
      <ArticleDeleteModal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        onDelete={onDeleteSelected}
        hasBookmarkedArticles={hasBookmarkedArticles}
      />
    </Container>
  );
};

export default ArticleListControls;

const Container = styled.div`
  margin-bottom: 2px;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const StorageSearchInput = styled(SearchInput)`
  &::placeholder {
    font: ${({ theme }) => theme.fonts.t5Regular};
  }
`;

const SearchIconButton = styled.button`
  width: 32px;
  height: 32px;
  margin-left: auto;
  padding: 0;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ExpandableSearchWrapper = styled.div<{ isExpanded: boolean }>`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.elevated};

  display: flex;
  gap: 8px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};

  inset: 0;
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
  pointer-events: ${({ isExpanded }) => (isExpanded ? 'auto' : 'none')};
  transform: translateX(${({ isExpanded }) => (isExpanded ? '0' : '20px')});
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CloseSearchButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 8px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.dividers};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SummaryBar = styled.div<{ isMobile: boolean }>`
  width: 100%;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : 0)};
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: ${({ isMobile }) => (isMobile ? 'stretch' : 'center')};
  justify-content: space-between;
`;

const ListViewControls = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : 'fit-content')};

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: ${({ isMobile }) =>
    isMobile ? 'space-between' : 'flex-start'};
`;

const FilterControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const UnreadFilterButton = styled.button<{ isActive: boolean }>`
  width: fit-content;
  padding: 8px 16px;
  border: 1px solid
    ${({ theme, isActive }) =>
      isActive ? theme.colors.primaryBomBom : theme.colors.stroke};
  border-radius: 16px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primaryBomBom : theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};

  transition: all 0.2s ease-in-out;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryLight};
    outline-offset: 2px;
  }
`;

const SummaryBox = styled.div<{ isMobile: boolean }>`
  position: relative;
  width: ${({ isMobile }) => (isMobile ? '100%' : 'fit-content')};
  min-height: ${({ isMobile }) => (isMobile ? '32px' : 0)};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  align-items: center;
`;

const StorageUsageBarWrapper = styled.div`
  max-width: 160px;
  display: flex;
`;
