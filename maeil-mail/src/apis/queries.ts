import { membersQueries } from './members/members.query';
import { subscriptionsQueries } from './subscriptions/subscriptions.query';

export const queries = {
  ...membersQueries,
  ...subscriptionsQueries,
};
