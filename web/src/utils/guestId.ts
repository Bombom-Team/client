import { createStorage } from './localStorage';

const GUEST_ID_STORAGE_KEY = 'bombom_guest_id';

const guestIdStorage = createStorage<string>(GUEST_ID_STORAGE_KEY);

export const getOrCreateGuestId = (): string => {
  const stored = guestIdStorage.get();
  if (stored) return stored;

  const guestId = crypto.randomUUID();
  guestIdStorage.set(guestId);
  return guestId;
};
