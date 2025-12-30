import type { Challenge } from '@/apis/challenge/challenge.api';

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: '한달 뉴스레터 읽기 챌린지',
    startDate: new Date('2026-01-05'),
    endDate: new Date('2026-02-04'),
    participantCount: 0,
    status: 'BEFORE_START',
    detail: {
      isJoined: false,
      progress: 0,
      grade: 'GOLD',
      isSuccess: false,
    },
  },
  {
    id: 2,
    title: '일주일 연속 읽기 챌린지',
    startDate: new Date('2025-12-30'),
    endDate: new Date('2026-01-06'),
    participantCount: 0,
    status: 'BEFORE_START',
    detail: {
      isJoined: false,
      progress: 0,
      grade: 'GOLD',
      isSuccess: false,
    },
  },
  {
    id: 3,
    title: '일주일 연속 읽기 챌린지33',
    startDate: new Date('2025-12-30'),
    endDate: new Date('2026-01-06'),
    participantCount: 0,
    status: 'BEFORE_START',
    detail: {
      isJoined: false,
      progress: 0,
      grade: 'GOLD',
      isSuccess: false,
    },
  },
  {
    id: 4,
    title: '일주일 연속 읽기 챌린지44',
    startDate: new Date('2025-12-30'),
    endDate: new Date('2026-01-06'),
    participantCount: 0,
    status: 'BEFORE_START',
    detail: {
      isJoined: true,
      progress: 0,
      grade: 'GOLD',
      isSuccess: false,
    },
  },
  {
    id: 5,
    title: '3개월 장기 독서 챌린지',
    startDate: new Date('2026-02-01'),
    endDate: new Date('2026-05-01'),
    participantCount: 20,
    status: 'ONGOING',
    detail: {
      isJoined: false,
      progress: 20,
      grade: 'GOLD',
      isSuccess: false,
    },
  },
];
