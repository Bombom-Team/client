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

  const getScrollHeight = useCallback(
    () => getScrollTarget()?.scrollHeight ?? document.body.scrollHeight,
    [getScrollTarget],
  );

  const getViewportHeight = useCallback(
    () => getScrollTarget()?.clientHeight ?? window.innerHeight,
    [getScrollTarget],
  );

  const getScrollPosition = useCallback(
    () => getScrollTarget()?.scrollTop ?? window.scrollY,
    [getScrollTarget],
  );

  const scrollTo = useCallback(
    (position: number) => {
      const target = getScrollTarget();
      if (target) {
        target.scrollTop = position;
        return;
      }
      window.scrollTo(0, position);
    },
    [getScrollTarget],
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
