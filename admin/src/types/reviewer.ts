export type Reviewer = {
  id: number;
  github_username: string;
  display_name: string;
  rotation_order: number;
  is_on_vacation: boolean;
  last_assigned_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewAssignment = {
  id: number;
  reviewer_id: number;
  pr_number: number;
  pr_title: string;
  pr_author: string;
  pr_url: string;
  assigned_at: string;
  status: 'OPEN' | 'CLOSED';
};

export type ReviewerWithStats = Reviewer & {
  monthlyCount: number;
  weeklyCount: number;
  openAssignments: ReviewAssignment[];
};
