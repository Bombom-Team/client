import { queryOptions } from '@tanstack/react-query';
import { getPet } from './pet.api';

export const petQueries = {
  pet: () =>
    queryOptions({
      queryKey: ['pet'],
      queryFn: getPet,
    }),
};
