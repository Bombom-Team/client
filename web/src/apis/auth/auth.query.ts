import { queryOptions } from '@tanstack/react-query';
import { getSignupCheck, type GetSignupCheckParams } from './auth.api';

export const authQueries = {
  signupCheck: (params: GetSignupCheckParams) =>
    queryOptions({
      queryKey: ['auth', 'signup', 'check', params],
      queryFn: () => getSignupCheck(params),
      enabled: false,
    }),
};
