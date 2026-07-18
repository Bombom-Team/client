import styled from '@emotion/styled';
import { useRouterState } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { useDevice } from '@/hooks/useDevice';
import type { ReactNode } from 'react';

type NavigationDirection = 'push' | 'pop';

const DETAIL_PATH_PATTERNS = [
  /^\/articles\/(previous\/)?[^/]+$/,
  /^\/newsletters\/[^/]+$/,
  /^\/challenge\/[^/]+\/(landing|dashboard|daily|comments|review|certification)$/,
];

const getChallengeId = (pathname: string) =>
  pathname.match(/^\/challenge\/([^/]+)\//)?.[1];

const isDetailPath = (pathname: string) =>
  DETAIL_PATH_PATTERNS.some((pattern) => pattern.test(pathname));

interface RouteTransitionProps {
  children: ReactNode;
}

interface PageSnapshot {
  html: string;
  scrollY: number;
}

const RouteTransition = ({ children }: RouteTransitionProps) => {
  const device = useDevice();
  const shouldReduceMotion = useReducedMotion();
  const location = useRouterState({ select: (state) => state.location });
  const pageRef = useRef<HTMLDivElement>(null);
  const previousLocationRef = useRef(location);
  const previousPageRef = useRef<PageSnapshot>({ html: '', scrollY: 0 });
  const [, setTransitionFinishedKey] = useState<string>();
  const locationKey = location.state.__TSR_key ?? location.href;
  const previousLocation = previousLocationRef.current;
  const previousLocationKey =
    previousLocation.state.__TSR_key ?? previousLocation.href;
  const hasLocationChanged = previousLocationKey !== locationKey;
  const direction: NavigationDirection =
    location.state.__TSR_index < previousLocation.state.__TSR_index
      ? 'pop'
      : 'push';
  const currentChallengeId = getChallengeId(location.pathname);
  const previousChallengeId = getChallengeId(previousLocation.pathname);
  const isSameChallenge =
    !!currentChallengeId && currentChallengeId === previousChallengeId;
  const isTransitioning =
    hasLocationChanged &&
    device === 'mobile' &&
    !shouldReduceMotion &&
    !isSameChallenge &&
    (isDetailPath(location.pathname) ||
      isDetailPath(previousLocation.pathname));
  const snapshot = previousPageRef.current;

  useLayoutEffect(() => {
    const currentPage = pageRef.current;

    if (currentPage) {
      previousPageRef.current = {
        html: currentPage.innerHTML,
        scrollY: window.scrollY,
      };
    }
    previousLocationRef.current = location;
  }, [location]);

  if (device !== 'mobile') return children;

  return (
    <Container>
      {isTransitioning && direction === 'push' && (
        <SnapshotPage
          aria-hidden
          $scrollY={snapshot.scrollY}
          $isOverlay={false}
          dangerouslySetInnerHTML={{ __html: snapshot.html }}
        />
      )}
      <AnimatedPage
        ref={pageRef}
        key={locationKey}
        initial={
          isTransitioning && direction === 'push' ? { x: '100%' } : false
        }
        animate={{ x: 0 }}
        transition={{
          duration: 0.28,
          ease: [0.32, 0.72, 0, 1],
        }}
        onAnimationComplete={
          isTransitioning && direction === 'push'
            ? () => setTransitionFinishedKey(locationKey)
            : undefined
        }
      >
        {children}
      </AnimatedPage>
      {isTransitioning && direction === 'pop' && (
        <SnapshotPage
          aria-hidden
          key={previousLocationKey}
          $scrollY={snapshot.scrollY}
          $isOverlay
          initial={{ x: 0 }}
          animate={{ x: '100%' }}
          transition={{
            duration: 0.28,
            ease: [0.32, 0.72, 0, 1],
          }}
          onAnimationComplete={() => {
            setTransitionFinishedKey(locationKey);
          }}
          dangerouslySetInnerHTML={{ __html: snapshot.html }}
        />
      )}
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

const SnapshotPage = styled(motion.div)<{
  $scrollY: number;
  $isOverlay: boolean;
}>`
  position: fixed;
  top: ${({ $scrollY }) => `-${$scrollY}px`};
  right: 0;
  left: 0;
  z-index: ${({ $isOverlay }) => ($isOverlay ? 2 : 0)};
  min-height: 100dvh;

  background-color: ${({ theme }) => theme.colors.white};

  pointer-events: none;
`;
