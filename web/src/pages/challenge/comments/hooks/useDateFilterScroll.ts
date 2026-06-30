import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';

const useDateFilterScroll = () => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollDateFilter = useCallback((direction: 'left' | 'right') => {
    const scrollAmount = (scrollRef.current?.clientWidth ?? 0) * 0.5;
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }, []);

  useLayoutEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
  }, []);

  useEffect(() => {
    const filterContainer = scrollRef.current;
    if (!filterContainer) return;

    const updateCanScroll = () => {
      setCanScrollLeft(filterContainer.scrollLeft > 0);
      setCanScrollRight(
        filterContainer.scrollLeft + filterContainer.clientWidth <
          filterContainer.scrollWidth - 1,
      );
    };

    updateCanScroll();

    filterContainer.addEventListener('scroll', updateCanScroll, {
      passive: true,
    });
    return () => filterContainer.removeEventListener('scroll', updateCanScroll);
  }, []);

  return { scrollRef, canScrollLeft, canScrollRight, scrollDateFilter };
};

export default useDateFilterScroll;
