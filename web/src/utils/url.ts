const ALLOWED_PROTOCOL = ['https:', 'http:', 'mailto:'];

export const validateUrl = (url: string): string => {
  try {
    const parsed = new URL(url, 'https://www.example.com');
    if (ALLOWED_PROTOCOL.includes(parsed.protocol)) return url;
  } catch {
    if (url.startsWith('/') || url.startsWith('#')) return url;
  }
  return '#';
};
