import { createStorage } from '@/utils/localStorage';

export const LANDING_VISITED_KEY = 'hasVisitedLanding';

export const landingVisitedStorage = createStorage<boolean>(
  LANDING_VISITED_KEY,
  false,
);
