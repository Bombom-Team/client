import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DRUM_SLIDE_DURATION_MS,
  SLIDE_DURATION_MS,
  STORY_SLIDE_COUNT,
} from '../constants/result';

const LAST_INDEX = STORY_SLIDE_COUNT - 1;

const clampIndex = (index: number) => Math.max(0, Math.min(LAST_INDEX, index));

interface UseStoryPlayerParams {
  startAtLast: boolean;
}

// 결과 스토리: 두구두구 → 성장 → 칭호 → 마지막 장. 마지막 장 전까지는 시간이 지나면 저절로 넘어간다.
// 동작 감소 설정이어도 읽을 시간은 같게 두고, 각 장의 애니메이션만 끈다.
export const useStoryPlayer = ({ startAtLast }: UseStoryPlayerParams) => {
  const [slide, setSlide] = useState(() => ({
    index: startAtLast ? LAST_INDEX : 0,
    previousIndex: startAtLast ? LAST_INDEX : 0,
  }));

  const goTo = useCallback((index: number) => {
    setSlide((current) => ({
      index: clampIndex(index),
      previousIndex: current.index,
    }));
  }, []);

  const goNext = useCallback(() => goTo(slide.index + 1), [goTo, slide.index]);
  const goPrevious = useCallback(
    () => goTo(slide.index - 1),
    [goTo, slide.index],
  );

  useEffect(() => {
    if (slide.index >= LAST_INDEX) return;

    const duration =
      slide.index === 0 ? DRUM_SLIDE_DURATION_MS : SLIDE_DURATION_MS;
    const timerId = setTimeout(() => goTo(slide.index + 1), duration);
    return () => clearTimeout(timerId);
  }, [goTo, slide.index]);

  return useMemo(
    () => ({
      index: slide.index,
      previousIndex: slide.previousIndex,
      isLast: slide.index === LAST_INDEX,
      goNext,
      goPrevious,
    }),
    [goNext, goPrevious, slide.index, slide.previousIndex],
  );
};
