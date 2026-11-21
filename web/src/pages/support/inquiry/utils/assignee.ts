import { UNASSIGNED_LABEL } from '../constants/inquiry';

export const formatAssigneeLabel = (assigneeNickname?: string) =>
  `담당: ${assigneeNickname ?? UNASSIGNED_LABEL}`;
