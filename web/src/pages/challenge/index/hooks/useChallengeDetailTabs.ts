import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';

const CHALLENGE_TABS = [
  { id: 'certification', label: '수료증', path: 'certification' },
  { id: 'daily', label: '데일리 가이드', path: 'daily' },
  { id: 'dashboard', label: '진행 현황판', path: 'dashboard' },
  { id: 'comments', label: '한 줄 코멘트', path: 'comments' },
] as const;

type ChallengeTabId = (typeof CHALLENGE_TABS)[number]['id'];
type ChallengeTabPath = (typeof CHALLENGE_TABS)[number]['path'];

interface UseChallengeDetailTabsProps {
  challengeId: string;
  isChallengeEnd: boolean;
}

export const useChallengeDetailTabs = ({
  challengeId,
  isChallengeEnd,
}: UseChallengeDetailTabsProps) => {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const tabs = useMemo(
    () =>
      CHALLENGE_TABS.filter((tab) =>
        isChallengeEnd ? tab.id !== 'daily' : tab.id !== 'certification',
      ),
    [isChallengeEnd],
  );

  const defaultTabId: ChallengeTabId = isChallengeEnd
    ? 'certification'
    : 'daily';

  const activeTabId: ChallengeTabId = useMemo(
    () =>
      tabs.find((tab) => currentPath.endsWith(`/${tab.path}`))?.id ||
      defaultTabId,
    [currentPath, tabs, defaultTabId],
  );

  const goToTab = useCallback(
    (tabPath: ChallengeTabPath) => {
      navigate({
        to: `/challenge/$challengeId/${tabPath}`,
        params: { challengeId },
      });
    },
    [challengeId, navigate],
  );

  return {
    tabs,
    activeTabId,
    goToTab,
  };
};
