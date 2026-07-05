import { supabase } from '@/lib/supabase';
import type {
  LeaderboardEntry,
  Reviewer,
  ReviewAssignment,
  ReviewerWithStats,
} from '@/types/reviewer';

export const isOverdue = (assignment: ReviewAssignment) =>
  assignment.status === 'OPEN' && new Date(assignment.deadline_at) < new Date();

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
