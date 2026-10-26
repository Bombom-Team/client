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
  duration: 0.42,
  ease: [0.4, 0, 0.2, 1],
} as const;

const getChallengeId = (pathname: string) =>
  pathname.match(/^\/challenge\/([^/]+)\//)?.[1];

const isDetailPath = (pathname: string) =>
  DETAIL_PATH_PATTERNS.some((pattern) => pattern.test(pathname));

const getLocationKey = (location: ParsedLocation) =>
  location.state.__TSR_key ?? location.href;

// replace 이동(리다이렉트 등)은 history index가 그대로라 방향이 없다
const getDirection = (
  from: ParsedLocation,
  to: ParsedLocation,
): NavigationDirection | null => {
  if (to.state.__TSR_index > from.state.__TSR_index) return 'push';
  if (to.state.__TSR_index < from.state.__TSR_index) return 'pop';
  return null;
};

const shouldAnimateBetween = (from: ParsedLocation, to: ParsedLocation) => {
  const fromChallengeId = getChallengeId(from.pathname);
  const isSameChallenge =
    !!fromChallengeId && fromChallengeId === getChallengeId(to.pathname);

  return (
    !isSameChallenge &&
    (isDetailPath(from.pathname) || isDetailPath(to.pathname))
  );
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
  const isMobile = device === 'mobile';

  useEffect(
    () =>
      router.subscribe('onBeforeLoad', () => {
        const page = pageScope.current;
        if (!page) return;

        snapshotRef.current = { html: page.innerHTML, scrollY: window.scrollY };
      }),
    [router, pageScope],
  );

  // Outlet이 다시 마운트되지 않도록 같은 요소에서 Push 애니메이션을 재생한다
  useLayoutEffect(() => {
    const page = pageScope.current;
    if (!page || transition?.direction !== 'push') return;

    page.style.transform = 'translateX(100%)';
    const controls = animatePage(page, { x: ['100%', 0] }, PAGE_TRANSITION);
    controls.then(() =>
      setTransition((current) => (current === transition ? null : current)),
    );

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

    const direction =
      renderedLocation && getDirection(renderedLocation, loadedLocation);

    if (renderedLocation && direction) {
      // iOS는 스와이프 뒤로 가기가 네이티브 전환을 먼저 보여 주므로 Pop 전환을 생략한다
      const shouldAnimate =
        isMobile &&
        !shouldReduceMotion &&
        !(direction === 'pop' && isIOS()) &&
        shouldAnimateBetween(renderedLocation, loadedLocation);

      setTransition(
        shouldAnimate
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
    <Container isMobile={isMobile}>
      {transition && (
        <SnapshotPage
          aria-hidden
          inert
          key={transition.id}
          scrollY={transition.snapshot.scrollY}
          isOverlay={!isPush}
          initial={{ x: 0 }}
          animate={{ x: isPush ? 0 : '100%' }}
          transition={PAGE_TRANSITION}
          onAnimationComplete={isPush ? undefined : handleSnapshotExitComplete}
          dangerouslySetInnerHTML={{ __html: transition.snapshot.html }}
        />
      )}
      <Page ref={pageScope} isMobile={isMobile}>
        {children}
      </Page>
    </Container>
  );
};

export default RouteTransition;

const Container = styled.div<{ isMobile: boolean }>`
  ${({ isMobile, theme }) =>
    isMobile &&
    `
    position: relative;
    width: 100%;
    min-height: 100dvh;

    background-color: ${theme.colors.white};

    overflow-x: clip;
  `}
`;

const Page = styled.div<{ isMobile: boolean }>`
  ${({ isMobile, theme }) =>
    isMobile &&
    `
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 100dvh;

    background-color: ${theme.colors.white};
  `}
`;

const SnapshotPage = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'scrollY' && prop !== 'isOverlay',
})<{
  scrollY: number;
  isOverlay: boolean;
}>`
  position: fixed;
  top: ${({ scrollY }) => `-${scrollY}px`};
  right: 0;
  left: 0;
  z-index: ${({ isOverlay }) => (isOverlay ? 2 : 0)};
  min-height: 100dvh;

  background-color: ${({ theme }) => theme.colors.white};

  pointer-events: none;
`;
