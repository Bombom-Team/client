export const MONTHLY_READING_RANK = [
  {
    rank: 1,
    nickname: '독서왕김씨',
    monthlyReadCount: 127,
  },
  {
    rank: 2,
    nickname: '뉴스레터마스터',
    monthlyReadCount: 98,
  },
  {
    rank: 3,
    nickname: '아침독서',
    monthlyReadCount: 85,
  },
  {
    rank: 4,
    nickname: '정보수집가',
    monthlyReadCount: 72,
  },
  {
    rank: 5,
    nickname: '열정독자',
    monthlyReadCount: 68,
  },
];

export const MONTHLY_READING_RANK_UPDATED = [
  {
    rank: 1,
    nickname: '뉴스레터마스터',
    monthlyReadCount: 150,
  },
  {
    rank: 2,
    nickname: '독서왕김씨',
    monthlyReadCount: 135,
  },
  {
    rank: 3,
    nickname: '열정독자',
    monthlyReadCount: 92,
  },
  {
    rank: 4,
    nickname: '아침독서',
    monthlyReadCount: 88,
  },
  {
    rank: 5,
    nickname: '정보수집가',
    monthlyReadCount: 75,
  },
];

export const getRankingMetadata = () => {
  const now = new Date();

  const secondsSinceEpoch = Math.floor(now.getTime() / 1000);
  const intervalCount = Math.floor(secondsSinceEpoch / 15);
  const shouldUseUpdatedData = intervalCount % 2 === 1;

  const data = shouldUseUpdatedData
    ? MONTHLY_READING_RANK_UPDATED
    : MONTHLY_READING_RANK;

  return {
    rankingUpdatedAt: now.toISOString(),
    nextRefreshAt: new Date(now.getTime() + 15000).toISOString(),
    serverTime: now.toISOString(),
    data,
  };
};
