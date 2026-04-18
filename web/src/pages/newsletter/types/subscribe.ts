import type { WEEKLY_ISSUE_COUNTS } from '../constants/subscribe';

export interface NewsletterLandingConfig {
  name: string;
  primaryColor: string;
  launchDate: string;
}

export type WeeklyIssueCount = (typeof WEEKLY_ISSUE_COUNTS)[number]['value'];
