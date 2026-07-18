import styled from '@emotion/styled';
import { useRouter, useRouterState } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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

interface TransitionSnapshot {
  direction: NavigationDirection;
  fromKey: string;
  html: string;
  scrollY: number;
}

const RouteTransition = ({ children }: RouteTransitionProps) => {
  const device = useDevice();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const location = useRouterState({ select: (state) => state.location });
  const pageRef = useRef<HTMLDivElement>(null);
  const [snapshot, setSnapshot] = useState<TransitionSnapshot | null>(null);
  const locationKey = location.state.__TSR_key ?? location.href;
  const isTransitioning = !!snapshot && snapshot.fromKey !== locationKey;

  useEffect(() => {
    return router.subscribe(
      'onBeforeNavigate',
      ({ fromLocation, toLocation, pathChanged }) => {
        const fromIndex = fromLocation?.state.__TSR_index;
        const toIndex = toLocation.state.__TSR_index;
        const currentPage = pageRef.current;

        if (
          device !== 'mobile' ||
          shouldReduceMotion ||
          !pathChanged ||
          !fromLocation ||
          !currentPage
        ) {
          setSnapshot(null);
          return;
        }

        const currentChallengeId = getChallengeId(fromLocation.pathname);
        const nextChallengeId = getChallengeId(toLocation.pathname);
        const isSameChallenge =
          !!currentChallengeId && currentChallengeId === nextChallengeId;
        const shouldAnimate =
          !isSameChallenge &&
          (isDetailPath(fromLocation.pathname) ||
            isDetailPath(toLocation.pathname));

        if (!shouldAnimate) {
          setSnapshot(null);
          return;
        }

        setSnapshot({
          direction:
            fromIndex !== undefined && toIndex < fromIndex ? 'pop' : 'push',
          fromKey: fromLocation.state.__TSR_key ?? fromLocation.href,
          html: currentPage.innerHTML,
          scrollY: window.scrollY,
        });
      },
    );
  }, [device, router, shouldReduceMotion]);

  if (device !== 'mobile') return children;

  return (
    <Container>
      {snapshot?.direction === 'push' && (
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
          isTransitioning && snapshot.direction === 'push'
            ? { x: '100%' }
            : false
        }
        animate={{ x: 0 }}
        transition={{
          duration: 0.28,
          ease: [0.32, 0.72, 0, 1],
        }}
        onAnimationComplete={() => {
          if (isTransitioning && snapshot.direction === 'push') {
            setSnapshot(null);
          }
        }}
      >
        {children}
      </AnimatedPage>
      {snapshot?.direction === 'pop' && (
        <SnapshotPage
          aria-hidden
          key={snapshot.fromKey}
          $scrollY={snapshot.scrollY}
          $isOverlay
          initial={{ x: 0 }}
          animate={{ x: isTransitioning ? '100%' : 0 }}
          transition={{
            duration: 0.28,
            ease: [0.32, 0.72, 0, 1],
          }}
          onAnimationComplete={() => {
            if (isTransitioning) setSnapshot(null);
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
