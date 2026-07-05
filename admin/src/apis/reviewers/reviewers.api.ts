import { supabase } from '@/lib/supabase';
import type {
  LeaderboardEntry,
  Reviewer,
  ReviewAssignment,
  ReviewerWithStats,
  ReviewSetting,
} from '@/types/reviewer';

export const isOverdue = (assignment: ReviewAssignment) =>
  assignment.status === 'OPEN' && new Date(assignment.deadline_at) < new Date();

// 자동 배정이 감시하는 대상 레포/브랜치 (admin 레포 reviewer-rotation.yml과 동일)
export const TARGET_REPO = 'woowacourse-teams/2025-bom-bom';
const TARGET_BASE_BRANCHES = ['server-dev', 'email-server-dev'];

export type PrAuthorCount = {
  monthly: number;
  weekly: number;
};

export type PrStats = {
  monthly: number;
  weekly: number;
  byAuthor: Record<string, PrAuthorCount>;
};

type GithubPr = {
  created_at: string;
  base: { ref: string };
  user: { login: string } | null;
};

/**
 * 대상 레포의 이번 달 백엔드 PR을 목록 API로 가져와
 * 전체/사용자별 생성 수를 집계한다. 실패(rate limit 등) 시 null — 대시보드를 깨지 않음.
 */
export const getPrStats = async (): Promise<PrStats | null> => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay(),
  );

  try {
    const prs: GithubPr[] = [];
    for (let page = 1; page <= 3; page += 1) {
      const response = await fetch(
        `https://api.github.com/repos/${TARGET_REPO}/pulls?state=all&sort=created&direction=desc&per_page=100&page=${page}`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (!response.ok)
        throw new Error(`GitHub 조회 실패 (${response.status})`);
      const batch = (await response.json()) as GithubPr[];
      if (batch.length === 0) break;
      prs.push(...batch);
      const oldest = batch[batch.length - 1];
      if (batch.length < 100 || new Date(oldest.created_at) < monthStart) {
        break;
      }
    }

    const stats: PrStats = { monthly: 0, weekly: 0, byAuthor: {} };
    for (const pr of prs) {
      const createdAt = new Date(pr.created_at);
      if (createdAt < monthStart) continue;
      if (!TARGET_BASE_BRANCHES.includes(pr.base.ref)) continue;

      const author = pr.user?.login ?? 'unknown';
      if (!stats.byAuthor[author]) {
        stats.byAuthor[author] = { monthly: 0, weekly: 0 };
      }
      stats.monthly += 1;
      stats.byAuthor[author].monthly += 1;
      if (createdAt >= weekStart) {
        stats.weekly += 1;
        stats.byAuthor[author].weekly += 1;
      }
    }
    return stats;
  } catch {
    return null;
  }
};

export const getSetting = async (): Promise<ReviewSetting> => {
  const { data, error } = await supabase
    .from('review_setting')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) throw error;
  return data;
};

export const updateSetting = async (params: {
  deadlineHours: number;
  excludeLabel: string;
}): Promise<void> => {
  const { error } = await supabase
    .from('review_setting')
    .update({
      deadline_hours: params.deadlineHours,
      exclude_label: params.excludeLabel,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1);

  if (error) throw error;
};

export const addReviewer = async (params: {
  displayName: string;
  githubUsername: string;
}): Promise<void> => {
  // rotation_order 계산과 INSERT를 DB 함수에서 원자적으로 처리 (동시 추가 시 순번 중복 방지)
  const { error } = await supabase.rpc('add_reviewer', {
    p_display_name: params.displayName,
    p_github_username: params.githubUsername,
  });

  if (error) throw error;
};

export const deleteReviewer = async (reviewerId: number): Promise<void> => {
  const { error } = await supabase
    .from('reviewer')
    .delete()
    .eq('id', reviewerId);

  if (error) {
    if (error.code === '23503') {
      throw new Error(
        '배정 이력이 있는 리뷰어는 삭제할 수 없습니다. 휴가 처리로 배정에서 제외하세요.',
      );
    }
    throw error;
  }
};

export const updateReviewerName = async (params: {
  reviewerId: number;
  displayName: string;
}): Promise<void> => {
  const { error } = await supabase
    .from('reviewer')
    .update({
      display_name: params.displayName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.reviewerId);

  if (error) throw error;
};

export const getReviewersWithStats = async (): Promise<ReviewerWithStats[]> => {
  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();
  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay(),
  ).toISOString();

  const { data: reviewers, error: reviewerError } = await supabase
    .from('reviewer')
    .select('*')
    .order('rotation_order', { ascending: true });

  if (reviewerError) throw reviewerError;
  if (!reviewers) return [];

  const { data: assignments, error: assignmentError } = await supabase
    .from('review_assignment')
    .select('*');

  if (assignmentError) throw assignmentError;
  const allAssignments = assignments ?? [];

  return reviewers.map((reviewer: Reviewer) => {
    const reviewerAssignments = allAssignments.filter(
      (a: ReviewAssignment) => a.reviewer_id === reviewer.id,
    );
    return {
      ...reviewer,
      monthlyCount: reviewerAssignments.filter(
        (a: ReviewAssignment) => a.assigned_at >= startOfMonth,
      ).length,
      weeklyCount: reviewerAssignments.filter(
        (a: ReviewAssignment) => a.assigned_at >= startOfWeek,
      ).length,
      openAssignments: reviewerAssignments.filter(
        (a: ReviewAssignment) => a.status === 'OPEN',
      ),
    };
  });
};

export const toggleVacation = async (
  reviewerId: number,
  currentValue: boolean,
): Promise<void> => {
  const { error } = await supabase
    .from('reviewer')
    .update({
      is_on_vacation: !currentValue,
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewerId);

  if (error) throw error;
};

export const getMonthlyStats = async (year: number, month: number) => {
  const start = new Date(year, month - 1, 1).toISOString();
  const end = new Date(year, month, 1).toISOString();

  const { data, error } = await supabase
    .from('review_assignment')
    .select('reviewer_id, review:reviewer(display_name)')
    .gte('assigned_at', start)
    .lt('assigned_at', end);

  if (error) throw error;
  return data ?? [];
};

export const getOpenAssignments = async (): Promise<ReviewAssignment[]> => {
  const { data, error } = await supabase
    .from('review_assignment')
    .select('*')
    .eq('status', 'OPEN')
    .order('assigned_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
};

type CompletedAssignment = ReviewAssignment & {
  completed_at: string;
  reviewer: { display_name: string } | null;
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data, error } = await supabase
    .from('review_assignment')
    .select('*, reviewer(display_name)')
    .eq('status', 'CLOSED')
    .not('completed_at', 'is', null);

  if (error) throw error;
  const assignments = (data ?? []) as CompletedAssignment[];

  const byReviewer = assignments.reduce(
    (acc: Record<number, LeaderboardEntry & { totalHours: number }>, a) => {
      if (!acc[a.reviewer_id]) {
        acc[a.reviewer_id] = {
          reviewerId: a.reviewer_id,
          displayName: a.reviewer?.display_name ?? `#${a.reviewer_id}`,
          completedCount: 0,
          lateCount: 0,
          avgHours: 0,
          totalHours: 0,
        };
      }
      const entry = acc[a.reviewer_id];
      entry.completedCount += 1;
      if (new Date(a.completed_at) > new Date(a.deadline_at)) {
        entry.lateCount += 1;
      }
      entry.totalHours +=
        (new Date(a.completed_at).getTime() -
          new Date(a.assigned_at).getTime()) /
        (60 * 60 * 1000);
      return acc;
    },
    {},
  );

  return Object.values(byReviewer)
    .map(({ totalHours, ...entry }) => ({
      ...entry,
      avgHours: Math.round((totalHours / entry.completedCount) * 10) / 10,
    }))
    .sort((a, b) => b.completedCount - a.completedCount);
};
