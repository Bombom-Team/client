import { fetcher } from '@bombom/shared/apis';

export type MigrationStatus =
  | 'LOCAL_WIP'
  | 'PR_REVIEW'
  | 'MERGE_PENDING'
  | 'DB_APPLIED';

export type WorkKind = 'NEW_TABLE' | 'EXISTING_TABLE';

export type ConflictSeverity = 'TABLE' | 'COLUMN';

export type MigrationItem = {
  version: string;
  description: string;
  fileName: string;
  status: MigrationStatus;
  createsNewTable: boolean;
  tables: string[];
  sourceLabel: string;
  sourceUrl: string;
  author: string;
};

export type FlywayConflict = {
  version: string;
  sources: string[];
  suggestedVersion: string;
};

export type FlywayLeapfrog = {
  mineVersion: string;
  aheadVersion: string;
  sharedTables: string[];
  severity: ConflictSeverity;
};

export type FlywayOverview = {
  deployBranch: string;
  integrationBranch: string;
  latestVersion: string;
  appliedCount: number;
  pendingCount: number;
  nextSafeMinor: string;
  nextSafeMajor: string;
  migrations: MigrationItem[];
  conflicts: FlywayConflict[];
  leapfrogWarnings: FlywayLeapfrog[];
};

export type MigrationScript = {
  fileName: string;
  content: string;
  sourceUrl: string;
};

export type CreateWipIssuePayload = {
  workKind: WorkKind;
  targetTable?: string;
  plannedVersion: string;
  description: string;
  assignee: string;
};

export type CreateWipIssueResponse = {
  issueNumber: number;
  issueUrl: string;
};

export const getFlywayOverview = async () => {
  return fetcher.get<FlywayOverview>({
    path: '/flyway/overview',
  });
};

export const getMigrationScript = async (fileName: string) => {
  return fetcher.get<MigrationScript>({
    path: '/flyway/script',
    query: { fileName },
  });
};

export const createWipIssue = async (payload: CreateWipIssuePayload) => {
  return fetcher.post<CreateWipIssuePayload, CreateWipIssueResponse>({
    path: '/flyway/wip',
    body: payload,
  });
};
