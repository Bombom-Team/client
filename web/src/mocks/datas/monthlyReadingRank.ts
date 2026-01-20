export const MONTHLY_READING_RANK = [
  {
    rank: 1,
    nickname: '독서왕김씨',
    monthlyReadCount: 127,
    badges: {
      ranking: {
        gold: 1,
        silver: 0,
        bronze: 1,
      },
      challenge: [
        {
          name: '뉴스레터 한달 읽기',
          generation: 1,
          grade: 'gold',
        },
      ],
    },
  },
  {
    rank: 2,
    nickname: '뉴스레터마스터',
    monthlyReadCount: 98,
    badges: {
      ranking: {
        gold: 0,
        silver: 2,
        bronze: 1,
      },
      challenge: [
        {
          name: '뉴스레터 한달 읽기',
          generation: 1,
          grade: 'silver',
        },
      ],
    },
  },
  {
    rank: 3,
    nickname: '아침독서',
    monthlyReadCount: 85,
    badges: {
      ranking: {
        gold: 0,
        silver: 1,
        bronze: 2,
      },
      challenge: [
        {
          name: '뉴스레터 한달 읽기',
          generation: 2,
          grade: 'bronze',
        },
      ],
    },
  },
  {
    rank: 4,
    nickname: '정보수집가',
    monthlyReadCount: 72,
    badges: {
      ranking: {
        gold: 0,
        silver: 0,
        bronze: 1,
      },
      challenge: [],
    },
  },
  {
    rank: 5,
    nickname: '열정독자',
    monthlyReadCount: 68,
    badges: {
      ranking: {
        gold: 0,
        silver: 1,
        bronze: 0,
      },
      challenge: [
        {
          name: '뉴스레터 한달 읽기',
          generation: 1,
          grade: 'silver',
        },
      ],
    },
  },
];

export const MONTHLY_READING_RANK_UPDATED = [
  {
    rank: 1,
    nickname: '뉴스레터마스터',
    monthlyReadCount: 150,
    badges: {
      ranking: {
        gold: 1,
        silver: 2,
        bronze: 2,
      },
      challenge: [
        {
          name: '뉴스레터 한달 읽기',
          generation: 1,
          grade: 'gold',
        },
        {
          name: '뉴스레터 한달 읽기',
          generation: 2,
          grade: 'silver',
        },
      ],
    },
  },
  {
    rank: 2,
    nickname: '독서왕김씨',
    monthlyReadCount: 135,
    badges: {
      ranking: {
        gold: 1,
        silver: 0,
        bronze: 1,
      },
      challenge: [
        {
          name: '뉴스레터 한달 읽기',
          generation: 1,
          grade: 'gold',
        },
      ],
    },
  },
  {
    rank: 3,
    nickname: '열정독자',
    monthlyReadCount: 92,
    badges: {
      ranking: {
        gold: 0,
        silver: 1,
        bronze: 0,
      },
      challenge: [
        {
          name: '뉴스레터 한달 읽기',
          generation: 1,
          grade: 'silver',
        },
      ],
    },
  },
  {
    rank: 4,
    nickname: '아침독서',
    monthlyReadCount: 88,
    badges: {
      ranking: {
        gold: 0,
        silver: 1,
        bronze: 2,
      },
      challenge: [
        {
          name: '뉴스레터 한달 읽기',
          generation: 2,
          grade: 'bronze',
        },
      ],
    },
  },
  {
    rank: 5,
    nickname: '정보수집가',
    monthlyReadCount: 75,
    badges: {
      ranking: {
        gold: 0,
        silver: 0,
        bronze: 1,
      },
      challenge: [],
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
