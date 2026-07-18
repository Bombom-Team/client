import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import ArticleDeleteModal from '../ArticleDeleteModal/ArticleDeleteModal';
import Checkbox from '@/components/Checkbox/Checkbox';
import useModal from '@/components/Modal/useModal';
import SearchInput from '@/components/SearchInput/SearchInput';
import Select from '@/components/Select/Select';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDevice } from '@/hooks/useDevice';
import { useSearchParamState } from '@/hooks/useSearchParamState';
import StorageUsageBar from '@/pages/storage/components/StorageUsageBar/StorageUsageBar';
import type { Sort } from './ArticleListControls.types';
import CancelIcon from '#/assets/svg/close.svg';
import DeleteIcon from '#/assets/svg/delete.svg';
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
  showUnreadOnly: boolean;
  onToggleUnreadOnly: () => void;
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
  showUnreadOnly,
  onToggleUnreadOnly,
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

  const unreadFilterButton = (
    <UnreadFilterButton
      type="button"
      aria-pressed={showUnreadOnly}
      isActive={showUnreadOnly}
      onClick={onToggleUnreadOnly}
    >
      안 읽은 뉴스레터만
    </UnreadFilterButton>
  );

  return (
    <Container>
      {isMobile ? (
        <MobileSearchWrapper>
          <SearchIconButton
            type="button"
            aria-label="검색 열기"
            onClick={() => setIsSearchExpanded(true)}
          >
            <ReadingGlassesIcon width={20} height={20} />
          </SearchIconButton>
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
        </MobileSearchWrapper>
      ) : (
        <StorageSearchInput
          placeholder="뉴스레터 제목으로 검색하세요..."
          value={search}
          onChange={handleSearchChange}
        />
      )}
      <SummaryBar isMobile={isMobile}>
        <SummaryBox isMobile={isMobile}>
          {editMode ? (
            <DeleteWrapper>
              <Checkbox
                id="all"
                checked={isAllSelected}
                onChange={onToggleSelectAll}
              />
              <DeleteCount>{checkedCount}개 선택됨</DeleteCount>
              <HorizontalDivider />
              <DeleteIconButton
                disabled={checkedCount === 0}
                onClick={() => {
                  if (checkedCount === 0) return;

                  openModal();
                }}
              >
                <DeleteIcon
                  fill={
                    checkedCount === 0
                      ? theme.colors.disabledBackground
                      : theme.colors.error
                  }
                />
              </DeleteIconButton>

              <CancelIcon fill={theme.colors.black} onClick={onExitEditMode} />
            </DeleteWrapper>
          ) : (
            <TextButton onClick={onEnterEditMode}>선택 삭제</TextButton>
          )}

          <StorageUsageBarWrapper>
            <StorageUsageBar cur={totalStorageCount ?? 0} max={500} />
          </StorageUsageBarWrapper>
        </SummaryBox>

        <ListViewControls isMobile={isMobile}>
          {unreadFilterButton}
          <Select
            options={[
              { value: 'DESC', label: '최신순' },
              { value: 'ASC', label: '오래된순' },
            ]}
            selectedValue={sort as Sort}
            onSelectOption={handleSortChange}
          />
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

const MobileSearchWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 32px;

  display: flex;
  justify-content: flex-end;
`;

const SearchIconButton = styled.button`
  width: 32px;
  height: 32px;
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
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  align-items: center;
`;

const StorageUsageBarWrapper = styled.div`
  max-width: 160px;
  display: flex;
`;

const DeleteWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const DeleteCount = styled.p`
  min-width: 68px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const HorizontalDivider = styled.div`
  width: 2px;
  height: 16px;

  background-color: ${({ theme }) => theme.colors.stroke};
`;

const TextButton = styled.button`
  padding-left: 8px;

  display: flex;
  gap: 4px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
    transition: all 0.2s ease-in-out;
  }
`;

const DeleteIconButton = styled.button``;
