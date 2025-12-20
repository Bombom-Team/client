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
  {
    rank: 6,
    nickname: '책벌레',
    monthlyReadCount: 54,
  },
  {
    rank: 7,
    nickname: '지식탐험가',
    monthlyReadCount: 47,
  },
  {
    rank: 8,
    nickname: '꾸준히읽기',
    monthlyReadCount: 42,
  },
  {
    rank: 9,
    nickname: '뉴스중독',
    monthlyReadCount: 38,
  },
  {
    rank: 10,
    nickname: '스타트업러버',
    monthlyReadCount: 35,
  },
];

// 현재 시간 기준으로 10분 단위로 계산
const getCurrentRankingTime = () => {
  const now = new Date();
  const minutes = Math.floor(now.getMinutes() / 10) * 10;
  now.setMinutes(minutes, 0, 0);
  return now;
};

const getNextRankingTime = () => {
  const current = getCurrentRankingTime();
  current.setMinutes(current.getMinutes() + 10);
  return current;
};

export const getRankingMetadata = () => ({
  rankingUpdatedAt: getCurrentRankingTime().toISOString(),
  nextRefreshAt: getNextRankingTime().toISOString(),
  serverTime: new Date().toISOString(),
});
