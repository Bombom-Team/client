const createRandomHex = (length: number) =>
  Array.from({ length }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');

// crypto.randomUUID는 보안 컨텍스트에서만 있어서, 없으면 같은 형식으로 만든다.
export const createVisitorId = () => {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // 아래 대체 형식으로 만든다.
  }

  return [
    createRandomHex(8),
    createRandomHex(4),
    `4${createRandomHex(3)}`,
    `${((Math.random() * 4) | 8).toString(16)}${createRandomHex(3)}`,
    createRandomHex(12),
  ].join('-');
};
