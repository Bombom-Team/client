import { supabase } from '@/lib/supabase';
import type { Reviewer, ReviewAssignment, ReviewerWithStats } from '@/types/reviewer';

export const getReviewersWithStats = async (): Promise<ReviewerWithStats[]> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
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
    .update({ is_on_vacation: !currentValue, updated_at: new Date().toISOString() })
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
