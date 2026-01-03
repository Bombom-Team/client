import { useNavigate, useRouterState } from '@tanstack/react-router';

export const CHALLENGE_TABS = [
  { id: 'daily', label: '데일리 가이드', path: 'daily' },
  { id: 'dashboard', label: '진행 현황판', path: 'dashboard' },
  { id: 'comments', label: '한 줄 코멘트', path: 'comments' },
] as const;

export type ChallengeTabId = (typeof CHALLENGE_TABS)[number]['id'];
export type ChallengeTabPath = (typeof CHALLENGE_TABS)[number]['path'];

interface UseChallengeDetailTabsProps {
  challengeId: string;
}

export const useChallengeDetailTabs = ({
  challengeId,
}: UseChallengeDetailTabsProps) => {
  const navigate = useNavigate();
  const routerState = useRouterState();

  const currentPath = routerState.location.pathname;
  const activeTabId: ChallengeTabId =
    CHALLENGE_TABS.find((tab) => currentPath.endsWith(`/${tab.path}`))?.id ||
    'daily';

  const goToTab = (tabPath: ChallengeTabPath) => {
    navigate({
      to: `/challenge/$challengeId/${tabPath}`,
      params: { challengeId },
    });
  };

  return {
    tabs: CHALLENGE_TABS,
    activeTabId,
    goToTab,
  };
};
