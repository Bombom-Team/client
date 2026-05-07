import { answerQueries } from './answer/answer.query';
import { membersQueries } from './members/members.query';
import { subscriptionsQueries } from './subscriptions/subscriptions.query';

export const queries = {
  ...answerQueries,
  ...membersQueries,
  ...subscriptionsQueries,
};
