import { createStorage } from './localStorage';

const GUEST_ID_STORAGE_KEY = 'bombom_guest_id';

const guestIdStorage = createStorage<string>(GUEST_ID_STORAGE_KEY);

const formatUuid = (bytes: Uint8Array): string => {
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-');
};

// Chrome 92 미만 WebView에는 crypto.randomUUID가 없다.
const createGuestId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const view = new DataView(bytes.buffer);
  view.setUint8(6, (view.getUint8(6) & 0x0f) | 0x40);
  view.setUint8(8, (view.getUint8(8) & 0x3f) | 0x80);

  return formatUuid(bytes);
};

export const getOrCreateGuestId = (): string => {
  const stored = guestIdStorage.get();
  if (stored) return stored;

  const guestId = createGuestId();
  guestIdStorage.set(guestId);
  return guestId;
};
