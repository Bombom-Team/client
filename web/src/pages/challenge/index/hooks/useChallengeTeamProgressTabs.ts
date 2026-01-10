import { useCallback, useMemo, useState } from 'react';
import type { ChallengeTeamSummary } from '@/apis/challenge/challenge.api';

interface UseChallengeTeamProgressTabsProps {
  teams?: ChallengeTeamSummary[];
}

export const useChallengeTeamProgressTabs = ({
  teams = [],
}: UseChallengeTeamProgressTabsProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);

  const defaultTeamId = useMemo(() => {
    return (
      teams.find((team) => team.isMyTeam)?.teamId ?? teams[0]?.teamId ?? null
    );
  }, [teams]);

  const activeTeamId = useMemo(() => {
    if (selectedTeamId && teams.some((t) => t.teamId === selectedTeamId)) {
      return selectedTeamId;
    }
    return defaultTeamId;
  }, [defaultTeamId, selectedTeamId, teams]);

  const goToTab = useCallback((teamId: number) => {
    setSelectedTeamId(teamId);
  }, []);

  return { activeTeamId, goToTab };
};
