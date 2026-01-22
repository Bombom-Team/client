export const MONTHLY_READING_RANK = [
  {
    rank: 1,
    nickname: '떤우',
    monthlyReadCount: 50,
    badges: {
      ranking: {
        grade: 'gold',
        year: 2025,
        month: 12,
      },
      challenge: {
        grade: 'gold',
        name: '뉴스레터 한달 읽기',
        generation: 1,
      },
    },
  },
];

export const MONTHLY_READING_RANK_UPDATED = [
  {
    rank: 1,
    nickname: '떤우',
    monthlyReadCount: 50,
    badges: {
      ranking: {
        grade: 'gold',
        year: 2025,
        month: 12,
      },
      challenge: {
        grade: 'gold',
        name: '뉴스레터 한달 읽기',
        generation: 1,
      },
    },
  },
];

export const getRankingMetadata = () => {
  const INTERVAL_SECONDS = 15;
  const INTERVAL_MS = INTERVAL_SECONDS * 1000;
  const now = new Date();

  const currentTimeSeconds = Math.floor(now.getTime() / 1000);
  const intervalCount = Math.floor(currentTimeSeconds / INTERVAL_SECONDS);
  const isUpdatedData = intervalCount % 2 === 1;

  const data = isUpdatedData
    ? MONTHLY_READING_RANK_UPDATED
    : MONTHLY_READING_RANK;

  return {
    rankingUpdatedAt: now.toISOString(),
    nextRefreshAt: new Date(now.getTime() + INTERVAL_MS).toISOString(),
    serverTime: now.toISOString(),
    data,
  };
};
