import { isIOS, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { motion, useAnimate, useReducedMotion } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ParsedLocation } from '@tanstack/react-router';
import type { PropsWithChildren } from 'react';

type NavigationDirection = 'push' | 'pop';

const DETAIL_PATH_PATTERNS = [
  /^\/articles\/(previous\/)?[^/]+$/,
  /^\/newsletters\/[^/]+(\/[^/]+)?$/,
  /^\/challenge\/[^/]+\/(landing|dashboard|daily|comments|review|certification)$/,
];

const PAGE_TRANSITION = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
} as const;

const getChallengeId = (pathname: string) =>
  pathname.match(/^\/challenge\/([^/]+)\//)?.[1];

const isDetailPath = (pathname: string) =>
  DETAIL_PATH_PATTERNS.some((pattern) => pattern.test(pathname));

const getLocationKey = (location: ParsedLocation) =>
  location.state.__TSR_key ?? location.href;

const isSameChallenge = (fromPathname: string, toPathname: string) => {
  const fromChallengeId = getChallengeId(fromPathname);
  return !!fromChallengeId && fromChallengeId === getChallengeId(toPathname);
};

// 상세 화면으로 들어가는 Push와 상세 화면에서 나오는 Pop만 전환한다.
// replace 이동(리다이렉트 등)은 history index가 그대로라 전환하지 않는다.
const getTransitionDirection = (
  from: ParsedLocation,
  to: ParsedLocation,
): NavigationDirection | null => {
  if (isSameChallenge(from.pathname, to.pathname)) return null;

  if (
    to.state.__TSR_index > from.state.__TSR_index &&
    isDetailPath(to.pathname)
  ) {
    return 'push';
  }

  // iOS는 스와이프 뒤로 가기가 네이티브 전환을 먼저 보여 주므로 Pop 전환을 생략한다
  if (
    to.state.__TSR_index < from.state.__TSR_index &&
    isDetailPath(from.pathname) &&
    !isIOS()
  ) {
    return 'pop';
  }

  return null;
};

interface PageSnapshot {
  html: string;
  scrollY: number;
}

interface PageTransition {
  id: number;
  direction: NavigationDirection;
  snapshot: PageSnapshot;
}

const RouteTransition = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const device = useDevice();
  const shouldReduceMotion = useReducedMotion();
  // 로딩 중에는 이전 화면이 그대로 그려지므로, 새 화면이 반영되는 시점의 location만 본다
  const loadedLocation = useRouterState({
    select: (state) => (state.isLoading ? undefined : state.location),
  });
  const [pageScope, animatePage] = useAnimate<HTMLDivElement>();
  const snapshotRef = useRef<PageSnapshot>({ html: '', scrollY: 0 });
  const [renderedLocation, setRenderedLocation] = useState(loadedLocation);
  const [transition, setTransition] = useState<PageTransition | null>(null);
  const isTransitionEnabled = device === 'mobile' && !shouldReduceMotion;

  useEffect(() => {
    if (!isTransitionEnabled) return;

    return router.subscribe('onBeforeLoad', ({ fromLocation, toLocation }) => {
      const page = pageScope.current;
      if (
        !page ||
        !fromLocation ||
        !getTransitionDirection(fromLocation, toLocation)
      ) {
        return;
      }

      snapshotRef.current = { html: page.innerHTML, scrollY: window.scrollY };
    });
  }, [router, pageScope, isTransitionEnabled]);

  // Outlet이 다시 마운트되지 않도록 같은 요소에서 Push 애니메이션을 재생한다
  useLayoutEffect(() => {
    const page = pageScope.current;
    if (!page || transition?.direction !== 'push') return;

    page.style.transform = 'translateX(100%)';
    const controls = animatePage(page, { x: ['100%', 0] }, PAGE_TRANSITION);
    const finishTransition = async () => {
      await controls;
      setTransition((current) => (current === transition ? null : current));
    };
    void finishTransition();

    return () => {
      controls.stop();
      page.style.transform = '';
    };
  }, [animatePage, pageScope, transition]);

  if (
    loadedLocation &&
    (!renderedLocation ||
      getLocationKey(loadedLocation) !== getLocationKey(renderedLocation))
  ) {
    setRenderedLocation(loadedLocation);

    // replace 이동은 진행 중인 전환을 유지하기 위해 상태를 바꾸지 않는다
    const isReplace =
      !!renderedLocation &&
      loadedLocation.state.__TSR_index === renderedLocation.state.__TSR_index;

    if (renderedLocation && !isReplace) {
      const direction =
        isTransitionEnabled &&
        getTransitionDirection(renderedLocation, loadedLocation);

      setTransition(
        direction
          ? {
              id: (transition?.id ?? 0) + 1,
              direction,
              snapshot: snapshotRef.current,
            }
          : null,
      );
    }
  }

  const handleSnapshotExitComplete = () => setTransition(null);

  const isPush = transition?.direction === 'push';

  return (
    <Container isTransitionEnabled={isTransitionEnabled}>
      {transition && (
        <SnapshotPage
          aria-hidden
          inert
          key={transition.id}
          isOverlay={!isPush}
          initial={{ x: 0 }}
          animate={{ x: isPush ? 0 : '100%' }}
          transition={PAGE_TRANSITION}
          onAnimationComplete={isPush ? undefined : handleSnapshotExitComplete}
        >
          <SnapshotContent
            scrollY={transition.snapshot.scrollY}
            dangerouslySetInnerHTML={{ __html: transition.snapshot.html }}
          />
        </SnapshotPage>
      )}
      <Page ref={pageScope} isTransitionEnabled={isTransitionEnabled}>
        {children}
      </Page>
    </Container>
  );
};

export default RouteTransition;

const Container = styled.div<{ isTransitionEnabled: boolean }>`
  ${({ isTransitionEnabled, theme }) =>
    isTransitionEnabled &&
    `
    position: relative;
    width: 100%;
    min-height: 100dvh;

    background-color: ${theme.colors.white};

    overflow-x: clip;
  `}
`;

const Page = styled.div<{ isTransitionEnabled: boolean }>`
  ${({ isTransitionEnabled, theme }) =>
    isTransitionEnabled &&
    `
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 100dvh;

    background-color: ${theme.colors.white};
  `}
`;

// 고정 요소가 화면 기준 위치를 지키도록 화면 크기로 자르고, 안쪽 콘텐츠만 스크롤 위치만큼 올린다
const SnapshotPage = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'isOverlay',
})<{ isOverlay: boolean }>`
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: ${({ isOverlay }) => (isOverlay ? 2 : 0)};
  height: 100dvh;

  background-color: ${({ theme }) => theme.colors.white};

  pointer-events: none;
`;

const SnapshotContent = styled.div<{ scrollY: number }>`
  margin-top: ${({ scrollY }) => `-${scrollY}px`};
`;
