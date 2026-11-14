import { useDevice } from '@bombom/shared/ui-web';
import { useCallback, useMemo, type RefObject } from 'react';

interface UseInquiryMessageScrollParams {
  messageListRef: RefObject<HTMLDivElement | null>;
}

/**
 * 문의 채팅의 스크롤 대상을 화면 크기에 따라 다르게 다룬다.
 * PC는 목록과 채팅을 함께 보여주므로 메시지 영역만 스크롤하고, 모바일은 페이지 전체를 스크롤한다.
 */
export const useInquiryMessageScroll = ({
  messageListRef,
}: UseInquiryMessageScrollParams) => {
  const device = useDevice();
  const isMobile = device !== 'pc';

  const getScrollTarget = useCallback(
    () => (isMobile ? null : messageListRef.current),
    [isMobile, messageListRef],
  );

  // PC는 메시지 영역만 스크롤되고 페이지는 고정이라, ref가 아직 없다고 해서 페이지로 폴백하면 안 된다.
  const usesPageScroll = isMobile;

  const getScrollHeight = useCallback(
    () =>
      getScrollTarget()?.scrollHeight ??
      (usesPageScroll ? document.body.scrollHeight : 0),
    [getScrollTarget, usesPageScroll],
  );

  const getViewportHeight = useCallback(
    () =>
      getScrollTarget()?.clientHeight ??
      (usesPageScroll ? window.innerHeight : 0),
    [getScrollTarget, usesPageScroll],
  );

  const getScrollPosition = useCallback(
    () => getScrollTarget()?.scrollTop ?? (usesPageScroll ? window.scrollY : 0),
    [getScrollTarget, usesPageScroll],
  );

  const scrollTo = useCallback(
    (position: number) => {
      const target = getScrollTarget();
      if (target) {
        target.scrollTop = position;
        return;
      }
      if (!usesPageScroll) return;

      window.scrollTo(0, position);
    },
    [getScrollTarget, usesPageScroll],
  );

  const scrollToBottom = useCallback(
    () => scrollTo(getScrollHeight()),
    [getScrollHeight, scrollTo],
  );

  const getDistanceFromBottom = useCallback(
    () => getScrollHeight() - (getScrollPosition() + getViewportHeight()),
    [getScrollHeight, getScrollPosition, getViewportHeight],
  );

  return useMemo(
    () => ({
      getScrollTarget,
      getScrollHeight,
      getScrollPosition,
      getViewportHeight,
      getDistanceFromBottom,
      scrollTo,
      scrollToBottom,
    }),
    [
      getScrollTarget,
      getScrollHeight,
      getScrollPosition,
      getViewportHeight,
      getDistanceFromBottom,
      scrollTo,
      scrollToBottom,
    ],
  );
};
