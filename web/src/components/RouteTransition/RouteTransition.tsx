import styled from '@emotion/styled';
import { useRouterState } from '@tanstack/react-router';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
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

const RouteTransition = ({ children }: RouteTransitionProps) => {
  const device = useDevice();
  const shouldReduceMotion = useReducedMotion();
  const location = useRouterState({ select: (state) => state.location });
  const previousLocationRef = useRef(location);

  const previousLocation = previousLocationRef.current;
  const currentIndex = location.state.__TSR_index;
  const previousIndex = previousLocation.state.__TSR_index;
  const direction: NavigationDirection =
    currentIndex < previousIndex ? 'pop' : 'push';

  const currentChallengeId = getChallengeId(location.pathname);
  const previousChallengeId = getChallengeId(previousLocation.pathname);
  const isSameChallenge =
    !!currentChallengeId && currentChallengeId === previousChallengeId;
  const shouldAnimate =
    device === 'mobile' &&
    !shouldReduceMotion &&
    !isSameChallenge &&
    (isDetailPath(location.pathname) ||
      isDetailPath(previousLocation.pathname));

  useEffect(() => {
    previousLocationRef.current = location;
  }, [location]);

  if (device !== 'mobile') return children;

  return (
    <AnimatePresence initial={false} custom={direction} mode="popLayout">
      <AnimatedPage
        key={location.state.__TSR_key ?? location.href}
        custom={direction}
        initial={shouldAnimate ? 'initial' : false}
        animate="visible"
        exit={shouldAnimate ? 'exit' : undefined}
        variants={{
          initial: (navigationDirection: NavigationDirection) => ({
            x: navigationDirection === 'push' ? '100%' : '-20%',
          }),
          visible: { x: 0 },
          exit: (navigationDirection: NavigationDirection) => ({
            x: navigationDirection === 'pop' ? '100%' : '-20%',
          }),
        }}
        transition={{
          duration: 0.28,
          ease: [0.32, 0.72, 0, 1],
        }}
      >
        {children}
      </AnimatedPage>
    </AnimatePresence>
  );
};

export default RouteTransition;

const AnimatedPage = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: 100dvh;

  background-color: ${({ theme }) => theme.colors.white};
`;
