import {
  findStartModalChallenge,
  getDaysSinceStart,
} from './challengeStartModal';
import type { Challenge } from '@/apis/challenge/challenge.api';

const createChallenge = (overrides: Partial<Challenge> = {}): Challenge => ({
  id: 1,
  title: '봄봄 챌린지',
  generation: 1,
  startDate: '2026-10-18',
  endDate: '2026-11-14',
  participantCount: 10,
  newsletters: [],
  status: 'ONGOING',
  registrationPhase: 'CLOSED',
  participationInfo: { isJoined: true, progress: 0 },
  ...overrides,
});

describe('getDaysSinceStart', () => {
  it('한국 시간으로 시작일이면 시각과 관계없이 0을 반환한다.', () => {
    expect(
      getDaysSinceStart('2026-10-18', new Date('2026-10-18T00:00:00+09:00')),
    ).toBe(0);
    expect(
      getDaysSinceStart('2026-10-18', new Date('2026-10-18T23:59:00+09:00')),
    ).toBe(0);
  });

  it('한국 시간으로 시작일 전날이면 -1을 반환한다.', () => {
    expect(
      getDaysSinceStart('2026-10-18', new Date('2026-10-17T23:59:00+09:00')),
    ).toBe(-1);
  });

  it('시작일과 오늘의 월이 달라도 지난 일수를 반환한다.', () => {
    expect(
      getDaysSinceStart('2026-10-30', new Date('2026-11-01T12:00:00+09:00')),
    ).toBe(2);
  });

  it('기기 시간대가 달라도 한국 시간 기준 날짜로 계산한다.', () => {
    // 미국 서부 10월 17일 오후 8시 = 한국 10월 18일 정오
    expect(
      getDaysSinceStart('2026-10-18', new Date('2026-10-17T20:00:00-07:00')),
    ).toBe(0);
  });
});

describe('findStartModalChallenge', () => {
  it('참가 중인 챌린지라도 시작일 전날이면 null을 반환한다.', () => {
    expect(
      findStartModalChallenge(
        [createChallenge()],
        new Date('2026-10-17T12:00:00+09:00'),
      ),
    ).toBeNull();
  });

  it('참가 중인 챌린지는 시작일부터 3일차까지 해당 챌린지를 반환한다.', () => {
    const challenge = createChallenge();

    expect(
      findStartModalChallenge(
        [challenge],
        new Date('2026-10-18T09:00:00+09:00'),
      ),
    ).toBe(challenge);
    expect(
      findStartModalChallenge(
        [challenge],
        new Date('2026-10-20T23:00:00+09:00'),
      ),
    ).toBe(challenge);
  });

  it('참가 중인 챌린지라도 4일차부터는 null을 반환한다.', () => {
    expect(
      findStartModalChallenge(
        [createChallenge()],
        new Date('2026-10-21T00:00:00+09:00'),
      ),
    ).toBeNull();
  });

  it('노출 기간이어도 사용자가 참가하지 않은 챌린지(isJoined: false)면 null을 반환한다.', () => {
    expect(
      findStartModalChallenge(
        [
          createChallenge({
            participationInfo: { isJoined: false, progress: 0 },
          }),
        ],
        new Date('2026-10-18T12:00:00+09:00'),
      ),
    ).toBeNull();
  });

  it('노출 기간이어도 참가 정보(participationInfo)가 없는 챌린지면 null을 반환한다.', () => {
    expect(
      findStartModalChallenge(
        [createChallenge({ participationInfo: undefined })],
        new Date('2026-10-18T12:00:00+09:00'),
      ),
    ).toBeNull();
  });
});
