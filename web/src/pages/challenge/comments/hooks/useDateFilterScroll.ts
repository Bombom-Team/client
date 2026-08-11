import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';

export const useDateFilterScroll = (dates: string[], selectedDate: string) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateString = dates.join(',');

  const updateCanScroll = useCallback(() => {
    const filterContainer = scrollRef.current;
    if (!filterContainer) return;

    setCanScrollLeft(filterContainer.scrollLeft > 0);
    setCanScrollRight(
      filterContainer.scrollLeft + filterContainer.clientWidth <
        filterContainer.scrollWidth - 1,
    );
  }, []);

  const scrollDateFilter = useCallback((direction: 'left' | 'right') => {
    const scrollAmount = (scrollRef.current?.clientWidth ?? 0) * 0.5;
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  useLayoutEffect(() => {
    const filterContainer = scrollRef.current;
    if (!filterContainer) return;

    filterContainer.scrollLeft = Math.max(
      filterContainer.scrollWidth - filterContainer.clientWidth,
      0,
    );
    updateCanScroll();
  }, [dateString, updateCanScroll]);

  useEffect(() => {
    const filterContainer = scrollRef.current;
    if (!filterContainer) return;

    updateCanScroll();

    filterContainer.addEventListener('scroll', updateCanScroll, {
      passive: true,
    });
    return () => filterContainer.removeEventListener('scroll', updateCanScroll);
  }, [updateCanScroll]);

  useEffect(() => {
    const selectedTab = scrollRef.current?.querySelector<HTMLElement>(
      `[data-date="${selectedDate}"]`,
    );

    selectedTab?.scrollIntoView({ inline: 'nearest' });
  }, [selectedDate]);

  return { scrollRef, canScrollLeft, canScrollRight, scrollDateFilter };
};
