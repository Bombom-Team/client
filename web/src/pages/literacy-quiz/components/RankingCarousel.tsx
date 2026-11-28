import styled from '@emotion/styled';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import RankingRow from './RankingRow';
import {
  RANKING_MAX_RANK,
  RANKING_PAGE_COUNT,
  RANKING_PAGE_SIZE,
} from '../constants/result';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import type { GetLiteracyQuizRankingResponse } from '@/apis/literacyQuiz/literacyQuiz.api';

interface RankingCarouselProps {
  ranking: GetLiteracyQuizRankingResponse | undefined;
}

const AROUND_PAGE_INDEX = RANKING_PAGE_COUNT;

const getPageLabel = (page: number) => {
  if (page === AROUND_PAGE_INDEX) return '내 주변';
  const first = page * RANKING_PAGE_SIZE + 1;
  return `${first}–${first + RANKING_PAGE_SIZE - 1}위`;
};

const getMyPage = (myRank: number | undefined) => {
  if (!myRank) return 0;
  if (myRank > RANKING_MAX_RANK) return AROUND_PAGE_INDEX;
  return Math.floor((myRank - 1) / RANKING_PAGE_SIZE);
};

// 5명씩 20위까지 옆으로 밀어 넘기는 랭킹. 내가 20위 밖이면 '내 주변' 페이지를 하나 더 둔다.
const RankingCarousel = ({ ranking }: RankingCarouselProps) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const swipeRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const myRank = ranking?.me?.rank;
  const hasAroundPage = !!myRank && myRank > RANKING_MAX_RANK;
  const pageCount = hasAroundPage ? RANKING_PAGE_COUNT + 1 : RANKING_PAGE_COUNT;
  const myPage = getMyPage(myRank);
  const entries = ranking?.top ?? [];

  useEffect(() => {
    const swipe = swipeRef.current;
    if (!swipe || myPage === 0) return;

    const timerId = setTimeout(() => {
      swipe.scrollTo({ left: myPage * swipe.clientWidth, behavior: 'auto' });
      setPage(myPage);
    }, 30);
    return () => clearTimeout(timerId);
  }, [myPage]);

  useEffect(() => {
    const swipe = swipeRef.current;
    if (!swipe) return;

    let frameId: number | null = null;
    const handleScroll = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        setPage(Math.round(swipe.scrollLeft / swipe.clientWidth));
      });
    };

    swipe.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      swipe.removeEventListener('scroll', handleScroll);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, []);

  const moveTo = (nextPage: number) => {
    const swipe = swipeRef.current;
    if (!swipe) return;
    swipe.scrollTo({
      left: nextPage * swipe.clientWidth,
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
    });
    setPage(nextPage);
  };

  return (
    <>
      <Header>
        <Title>랭킹</Title>
        <Pager>
          <PagerButton
            type="button"
            aria-label="이전 순위"
            disabled={page === 0}
            onClick={() => moveTo(page - 1)}
          >
            <PagerIcon viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 5l-7 7 7 7"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </PagerIcon>
          </PagerButton>
          <PagerLabel aria-live="polite">{getPageLabel(page)}</PagerLabel>
          <PagerButton
            type="button"
            aria-label="다음 순위"
            disabled={page >= pageCount - 1}
            onClick={() => moveTo(page + 1)}
          >
            <PagerIcon viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </PagerIcon>
          </PagerButton>
        </Pager>
      </Header>
      <Swipe ref={swipeRef}>
        {Array.from({ length: RANKING_PAGE_COUNT }, (_, pageIndex) => (
          <Rows key={pageIndex}>
            {Array.from({ length: RANKING_PAGE_SIZE }, (_, rowIndex) => {
              const rank = pageIndex * RANKING_PAGE_SIZE + rowIndex + 1;
              return (
                <RankingRow
                  key={rank}
                  rank={rank}
                  entry={entries.find((entry) => entry.rank === rank)}
                />
              );
            })}
          </Rows>
        ))}
        {hasAroundPage && (
          <Rows>
            <AroundLabel>20위 밖 · 내 주변 순위</AroundLabel>
            {(ranking?.around ?? []).map((entry) => (
              <RankingRow key={entry.rank} rank={entry.rank} entry={entry} />
            ))}
          </Rows>
        )}
      </Swipe>
      <Dots aria-hidden="true">
        {Array.from({ length: pageCount }, (_, dotIndex) => (
          <Dot
            key={dotIndex}
            isOn={dotIndex === page}
            isMine={dotIndex === AROUND_PAGE_INDEX}
          />
        ))}
      </Dots>
    </>
  );
};

export default RankingCarousel;

const Header = styled.div`
  display: flex;
  gap: 2cqw;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font: 400 6cqw/1.25 ${LITERACY_FONTS.display};
`;

const Pager = styled.div`
  display: inline-flex;
  gap: 1.4cqw;
  align-items: center;
`;

const PagerButton = styled.button`
  width: 8.6cqw;
  height: 8.6cqw;
  padding: 0;
  border: 0;
  border-radius: 2.4cqw;

  display: grid;

  background: ${LITERACY_COLORS.chipBackground};
  color: ${LITERACY_COLORS.ink};

  cursor: pointer;
  place-items: center;

  &:disabled {
    color: ${LITERACY_COLORS.rowEmptyNumber};
    cursor: default;
  }
`;

const PagerIcon = styled.svg`
  width: 4.2cqw;
  height: 4.2cqw;
`;

const PagerLabel = styled.span`
  min-width: 15cqw;

  font: 800 3.1cqw ${LITERACY_FONTS.body};
  text-align: center;

  font-variant-numeric: tabular-nums;
`;

const Swipe = styled.div`
  display: grid;
  gap: 3cqw;

  grid-auto-columns: 100%;
  grid-auto-flow: column;
  overflow-x: auto;

  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Rows = styled.ol`
  margin: 0;
  padding: 0;

  display: grid;
  gap: 1.1cqw;
  align-content: start;

  list-style: none;
  scroll-snap-align: start;
`;

const AroundLabel = styled.li`
  padding: 0.6cqw 0 0;

  color: ${LITERACY_COLORS.sub};
  font: 800 2.9cqw ${LITERACY_FONTS.body};
  text-align: center;
`;

const Dots = styled.div`
  display: flex;
  gap: 1.4cqw;
  justify-content: center;
`;

const Dot = styled.i<{ isOn: boolean; isMine: boolean }>`
  width: ${({ isOn }) => (isOn ? '5cqw' : '1.8cqw')};
  height: 1.8cqw;
  border-radius: 1cqw;

  background: ${({ isOn, isMine, theme }) => {
    if (isMine)
      return isOn ? theme.colors.primaryBomBom : LITERACY_COLORS.dotMine;
    return isOn ? LITERACY_COLORS.ink : LITERACY_COLORS.dotOff;
  }};

  transition: width 0.2s;
`;
