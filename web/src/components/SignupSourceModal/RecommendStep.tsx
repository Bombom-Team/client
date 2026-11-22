import { Button } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useRef, useState } from 'react';
import RecommendItem from './RecommendItem';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';
import { openSubscribeLink } from '@/pages/newsletter-detail/utils';
import { trackSignupSourceEvent } from '@/utils/trackSignupSourceEvent';
import type { SignupRecommendation } from '@/apis/signupSource/signupSource.api';
import type { PointerEvent } from 'react';

const ALL_CATEGORY = '전체';
const PAGE_SIZE = 4;
const MAX_PAGE_COUNT = 3;
const SWIPE_THRESHOLD = 60;

const splitPages = (newsletters: SignupRecommendation[]) => {
  const limited = newsletters.slice(0, PAGE_SIZE * MAX_PAGE_COUNT);
  const pages: SignupRecommendation[][] = [];
  for (let i = 0; i < limited.length; i += PAGE_SIZE) {
    pages.push(limited.slice(i, i + PAGE_SIZE));
  }
  return pages;
};

interface RecommendStepProps {
  onFinish: () => void;
}

const RecommendStep = ({ onFinish }: RecommendStepProps) => {
  const { userProfile } = useAuth();
  const { data } = useQuery(queries.signupRecommendations());
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [pageIndex, setPageIndex] = useState(0);
  const [expandedIdByPage, setExpandedIdByPage] = useState<
    Record<number, number>
  >({});
  const [openedIds, setOpenedIds] = useState<number[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ startX: 0, startY: 0, dx: 0, isDragging: false });
  const isPointerDownRef = useRef(false);

  const categories = [ALL_CATEGORY, ...(data?.categories ?? [])];
  const pages = useMemo(
    () =>
      splitPages(
        (data?.newsletters ?? []).filter(
          (newsletter) =>
            category === ALL_CATEGORY || newsletter.category === category,
        ),
      ),
    [data, category],
  );
  const pageCount = Math.max(pages.length, 1);
  const currentPage = pages[pageIndex] ?? [];
  const firstRank = pageIndex * PAGE_SIZE + 1;
  const lastRank = pageIndex * PAGE_SIZE + currentPage.length;

  const goToPage = (nextIndex: number) => {
    const clampedIndex = Math.max(0, Math.min(pageCount - 1, nextIndex));
    if (clampedIndex === pageIndex) return;

    setPageIndex(clampedIndex);
    if (clampedIndex > pageIndex) {
      trackSignupSourceEvent({
        action: '추천 다음 4개 보기',
        label: category,
        value: clampedIndex + 1,
      });
    }
  };

  const handleCategoryClick = (nextCategory: string) => {
    setCategory(nextCategory);
    setPageIndex(0);
    setExpandedIdByPage({});
    trackSignupSourceEvent({
      action: '추천 카테고리 선택',
      label: nextCategory,
    });
  };

  const handleSubscribe = (newsletter: SignupRecommendation, rank: number) => {
    trackSignupSourceEvent({
      action: '추천 뉴스레터 구독 클릭',
      label: String(newsletter.newsletterId),
      value: rank,
    });
    openSubscribeLink(newsletter.subscribeUrl, newsletter.name, userProfile);
    setOpenedIds((prev) =>
      prev.includes(newsletter.newsletterId)
        ? prev
        : [...prev, newsletter.newsletterId],
    );
  };

  const handleStart = () => {
    trackSignupSourceEvent({
      action: '구독 마치고 시작하기 클릭',
      value: openedIds.length,
    });
    onFinish();
  };

  const handleSkip = () => {
    trackSignupSourceEvent({
      action: '추천 건너뛰기 클릭',
      value: openedIds.length,
    });
    onFinish();
  };

  const setTrackOffset = (dx: number) => {
    if (!trackRef.current) return;
    trackRef.current.style.transform =
      dx === 0 ? '' : `translateX(calc(${-pageIndex * 100}% + ${dx}px))`;
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    isPointerDownRef.current = true;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      isDragging: false,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;
    const drag = dragRef.current;
    const moveX = e.clientX - drag.startX;

    if (!drag.isDragging) {
      const isHorizontal = Math.abs(moveX) > Math.abs(e.clientY - drag.startY);
      if (Math.abs(moveX) < 8 || !isHorizontal) return;
      drag.isDragging = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      trackRef.current?.setAttribute('data-dragging', 'true');
    }

    const isAtEdge =
      (pageIndex === 0 && moveX > 0) ||
      (pageIndex === pageCount - 1 && moveX < 0);
    drag.dx = isAtEdge ? moveX * 0.3 : moveX;
    requestAnimationFrame(() => setTrackOffset(drag.dx));
  };

  const handlePointerEnd = () => {
    isPointerDownRef.current = false;
    const drag = dragRef.current;
    if (!drag.isDragging) return;

    trackRef.current?.removeAttribute('data-dragging');
    setTrackOffset(0);
    if (drag.dx < -SWIPE_THRESHOLD) goToPage(pageIndex + 1);
    if (drag.dx > SWIPE_THRESHOLD) goToPage(pageIndex - 1);
    dragRef.current = { ...drag, dx: 0, isDragging: false };
  };

  return (
    <Container>
      <Title>첫 뉴스레터를 골라볼까요?</Title>

      <ChipRow role="tablist" aria-label="카테고리">
        {categories.map((name) => (
          <CategoryChip
            key={name}
            type="button"
            role="tab"
            aria-selected={category === name}
            isSelected={category === name}
            onClick={() => handleCategoryClick(name)}
          >
            {name}
          </CategoryChip>
        ))}
      </ChipRow>

      <ListHeader>
        <RankLabel>
          <strong>
            {firstRank}~{lastRank}위
          </strong>{' '}
          · 많이 읽는 순서
        </RankLabel>
        <ArrowGroup>
          <ArrowButton
            type="button"
            aria-label="이전 4개"
            disabled={pageIndex === 0}
            onClick={() => goToPage(pageIndex - 1)}
          >
            ‹
          </ArrowButton>
          <ArrowButton
            type="button"
            aria-label="다음 4개"
            disabled={pageIndex >= pageCount - 1}
            onClick={() => goToPage(pageIndex + 1)}
          >
            ›
          </ArrowButton>
        </ArrowGroup>
      </ListHeader>

      <Viewport
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        <Track ref={trackRef} pageIndex={pageIndex}>
          {pages.map((page, index) => {
            const isCurrentPage = index === pageIndex;
            const expandedId = expandedIdByPage[index] ?? page[0]?.newsletterId;
            return (
              <Page
                key={`${category}-${index}`}
                aria-hidden={!isCurrentPage}
                isCurrentPage={isCurrentPage}
              >
                {page.map((newsletter, itemIndex) => (
                  <RecommendItem
                    key={newsletter.newsletterId}
                    newsletter={newsletter}
                    isExpanded={newsletter.newsletterId === expandedId}
                    isOpened={openedIds.includes(newsletter.newsletterId)}
                    isFocusable={isCurrentPage}
                    onExpand={() =>
                      setExpandedIdByPage((prev) => ({
                        ...prev,
                        [index]: newsletter.newsletterId,
                      }))
                    }
                    onSubscribe={() =>
                      handleSubscribe(
                        newsletter,
                        index * PAGE_SIZE + itemIndex + 1,
                      )
                    }
                  />
                ))}
              </Page>
            );
          })}
        </Track>
      </Viewport>

      <ActionGroup>
        <StartButton disabled={openedIds.length === 0} onClick={handleStart}>
          구독 마치고 시작하기
        </StartButton>
        <SkipButton variant="transparent" onClick={handleSkip}>
          건너뛰기
        </SkipButton>
      </ActionGroup>
    </Container>
  );
};

export default RecommendStep;

const Container = styled.div`
  min-width: 0;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const Title = styled.h2`
  margin: 0 0 4px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t9Bold};
`;

const ChipRow = styled.div`
  display: flex;
  gap: 8px;

  overflow-x: auto;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryChip = styled.button<{ isSelected: boolean }>`
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 999px;

  flex-shrink: 0;

  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.textPrimary : theme.colors.disabledBackground};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.white : theme.colors.textPrimary};
  font: ${({ theme, isSelected }) =>
    isSelected ? theme.fonts.t4Bold : theme.fonts.t4Regular};
  white-space: nowrap;

  cursor: pointer;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RankLabel = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t4Regular};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font: ${({ theme }) => theme.fonts.t4Bold};
  }
`;

const ArrowGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ArrowButton = styled.button`
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Regular};

  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.3;
  }
`;

const Viewport = styled.div`
  overflow: hidden;
  touch-action: pan-y;
`;

const Track = styled.div<{ pageIndex: number }>`
  display: flex;
  align-items: flex-start;

  transform: translateX(${({ pageIndex }) => -pageIndex * 100}%);
  transition: transform 0.45s cubic-bezier(0.22, 0.9, 0.25, 1);

  &[data-dragging='true'] {
    transition: none;
  }
`;

const Page = styled.div<{ isCurrentPage: boolean }>`
  min-width: 0;

  display: flex;
  gap: 4px;
  flex: 0 0 100%;
  flex-direction: column;

  opacity: ${({ isCurrentPage }) => (isCurrentPage ? 1 : 0.35)};
  transition: opacity 0.35s ease;
  user-select: none;
`;

const ActionGroup = styled.div`
  margin-top: 4px;

  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const StartButton = styled(Button)`
  width: 100%;
  height: 52px;
  border-radius: 12px;

  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const SkipButton = styled(Button)`
  width: 100%;
  height: 40px;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
