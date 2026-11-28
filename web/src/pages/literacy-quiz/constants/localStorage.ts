import { createStorage } from '@/utils/localStorage';

export const visitorIdStorage = createStorage<string>(
  'bombom-literacy-visitor-id',
);
