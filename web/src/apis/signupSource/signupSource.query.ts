import { queryOptions } from '@tanstack/react-query';
import {
  getSignupRecommendations,
  getSignupSourceStatus,
} from './signupSource.api';

export const signupSourceQueries = {
  signupSourceStatus: () =>
    queryOptions({
      queryKey: ['members', 'me', 'signup-source'],
      queryFn: getSignupSourceStatus,
    }),

  signupRecommendations: () =>
    queryOptions({
      queryKey: ['newsletters', 'signup-recommendations'],
      queryFn: getSignupRecommendations,
    }),
};
