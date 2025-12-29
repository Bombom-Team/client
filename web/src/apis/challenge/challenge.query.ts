import { queryOptions } from '@tanstack/react-query';
import { getChallenges } from './challenge.api';

export const challengeQueries = {
  challenges: () =>
    queryOptions({
      queryKey: ['challenge', 'list'],
      queryFn: getChallenges,
    }),
};
