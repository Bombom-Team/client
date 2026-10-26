import { useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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
  const pageRef = useRef<HTMLDivElement>(null);
  const snapshotRef = useRef<PageSnapshot>({ html: '', scrollY: 0 });
  const [renderedLocation, setRenderedLocation] = useState(loadedLocation);
  const [pageKey, setPageKey] = useState(0);
  const [transition, setTransition] = useState<PageTransition | null>(null);

  useEffect(
    () =>
      router.subscribe('onBeforeLoad', () => {
        const page = pageRef.current;
        if (!page) return;

        snapshotRef.current = { html: page.innerHTML, scrollY: window.scrollY };
      }),
    [router],
  );

  if (
    loadedLocation &&
    (!renderedLocation ||
      getLocationKey(loadedLocation) !== getLocationKey(renderedLocation))
  ) {
    setRenderedLocation(loadedLocation);

    const direction =
      renderedLocation && getDirection(renderedLocation, loadedLocation);

    if (renderedLocation && direction) {
      const shouldAnimate =
        device === 'mobile' &&
        !shouldReduceMotion &&
        shouldAnimateBetween(renderedLocation, loadedLocation);

      setTransition(
        shouldAnimate ? { direction, snapshot: snapshotRef.current } : null,
      );
      if (shouldAnimate) setPageKey((key) => key + 1);
    }
  }

  const handleTransitionComplete = () => setTransition(null);

  if (device !== 'mobile') return children;

  const isPush = transition?.direction === 'push';

  return (
    <Container>
      {transition && (
        <SnapshotPage
          aria-hidden
          key={`snapshot-${pageKey}`}
          scrollY={transition.snapshot.scrollY}
          isOverlay={!isPush}
          initial={{ x: 0 }}
          animate={{ x: isPush ? 0 : '100%' }}
          transition={PAGE_TRANSITION}
          onAnimationComplete={isPush ? undefined : handleTransitionComplete}
          dangerouslySetInnerHTML={{ __html: transition.snapshot.html }}
        />
      )}
      <AnimatedPage
        ref={pageRef}
        key={`page-${pageKey}`}
        initial={isPush ? { x: '100%' } : false}
        animate={{ x: 0 }}
        transition={PAGE_TRANSITION}
        onAnimationComplete={isPush ? handleTransitionComplete : undefined}
      >
        {children}
      </AnimatedPage>
    </Container>
  );
};

export default RouteTransition;

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100dvh;

  background-color: ${({ theme }) => theme.colors.white};

  overflow-x: clip;
`;

const AnimatedPage = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 100dvh;

  background-color: ${({ theme }) => theme.colors.white};
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
