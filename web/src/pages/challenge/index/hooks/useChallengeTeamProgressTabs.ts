import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChallengeTeamSummary } from '@/apis/challenge/challenge.api';

interface UseChallengeTeamProgressTabsProps {
  teams?: ChallengeTeamSummary[];
}

const getTeamLabel = (team: ChallengeTeamSummary) =>
  team.isMyTeam ? '우리팀' : `${team.displayOrder}팀`;

export const useChallengeTeamProgressTabs = ({
  teams,
}: UseChallengeTeamProgressTabsProps) => {
  const sortedTeams = useMemo(() => {
    if (!teams) return [];

    return [...teams].sort((a, b) => a.displayOrder - b.displayOrder);
  }, [teams]);

  const tabs = useMemo(
    () =>
      sortedTeams.map((team) => ({
        id: team.teamId,
        label: getTeamLabel(team),
      })),
    [sortedTeams],
  );

  const defaultTeamId = useMemo(() => {
    return (
      sortedTeams.find((team) => team.isMyTeam)?.teamId ??
      sortedTeams[0]?.teamId
    );
  }, [sortedTeams]);

  const [activeTeamId, setActiveTeamId] = useState<number | null>(
    defaultTeamId ?? null,
  );

  useEffect(() => {
    if (!sortedTeams.length || !defaultTeamId) return;

    setActiveTeamId((prev) => {
      if (prev && sortedTeams.some((team) => team.teamId === prev)) {
        return prev;
      }
      return defaultTeamId;
    });
  }, [defaultTeamId, sortedTeams]);

  const goToTab = useCallback((teamId: number) => {
    setActiveTeamId(teamId);
  }, []);

  return {
    tabs,
    activeTeamId,
    goToTab,
  };
};
