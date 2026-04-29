import { maeilMailHandlers } from './handlers/maeilMail';
import { membersHandlers } from './handlers/members';

export const handlers = [...maeilMailHandlers, ...membersHandlers];
