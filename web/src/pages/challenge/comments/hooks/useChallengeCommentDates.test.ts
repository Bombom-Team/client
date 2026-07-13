import { renderHook } from '@testing-library/react';
import { useChallengeCommentDates } from './useChallengeCommentDates';

const START_DATE = '2026-07-07';
const END_DATE = '2026-07-18';

const render = (today: string) => renderAt(`${today}T12:00:00`);

const renderAt = (now: string) => {
  jest.setSystemTime(new Date(now));

  return renderHook(() =>
    useChallengeCommentDates({
      startDate: START_DATE,
      endDate: END_DATE,
    }),
  ).result.current;
};

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('challengeDates — 날짜 필터 목록', () => {
  it('오늘이 챌린지 기간 내 평일이면 오늘까지의 평일을 반환한다', () => {
    const { challengeDates } = render('2026-07-09');
    expect(challengeDates).toEqual(['2026-07-07', '2026-07-08', '2026-07-09']);
  });

  it('오늘이 챌린지 기간 내 주말이면 오늘 없이 직전 금요일까지의 평일을 반환한다', () => {
    const { challengeDates } = render('2026-07-12');
    expect(challengeDates).toEqual([
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
    ]);
    expect(challengeDates).not.toContain('2026-07-12');
  });

  it('오늘이 챌린지 종료일 이후면 기간 내 전체 평일을 반환한다', () => {
    const { challengeDates } = render('2026-07-20');
    expect(challengeDates).toEqual([
      '2026-07-07',
      '2026-07-08',
      '2026-07-09',
      '2026-07-10',
      '2026-07-13',
      '2026-07-14',
      '2026-07-15',
      '2026-07-16',
      '2026-07-17',
    ]);
    expect(challengeDates).not.toContain('2026-07-20');
  });

  it('오늘이 챌린지 시작일 이전이면 빈 배열을 반환한다', () => {
    const { challengeDates } = render('2026-07-05');
    expect(challengeDates).toEqual([]);
  });

  it('startDate/endDate가 없으면 빈 배열을 반환한다', () => {
    jest.setSystemTime(new Date('2026-07-09T12:00:00'));

    const { result } = renderHook(() => useChallengeCommentDates({}));
    expect(result.current.challengeDates).toEqual([]);
  });
});

describe('initialSelectedDate — 날짜 필터 초기 선택 날짜', () => {
  it('오늘이 챌린지 기간 내 평일이면 오늘을 선택한다', () => {
    const { initialSelectedDate } = render('2026-07-09');

    expect(initialSelectedDate).toBe('2026-07-09');
  });

  it('오늘이 챌린지 기간 내 주말이면 직전 유효 챌린지 일을 선택한다', () => {
    const { initialSelectedDate } = render('2026-07-12');

    expect(initialSelectedDate).toBe('2026-07-10');
  });

  it('오늘이 챌린지 종료일 이후면 마지막 챌린지 일을 선택한다', () => {
    const { initialSelectedDate } = render('2026-07-20');

    expect(initialSelectedDate).toBe('2026-07-17');
  });
});

describe('isRestDay — 오늘 날짜를 필터에 추가할지 여부', () => {
  it('오늘이 챌린지 기간 내 주말(토)이면 true를 반환한다', () => {
    const { isRestDay } = render('2026-07-11');
    expect(isRestDay).toBe(true);
  });

  it('오늘이 챌린지 기간 내 주말(일)이면 true를 반환한다', () => {
    const { isRestDay } = render('2026-07-12');
    expect(isRestDay).toBe(true);
  });

  it('오늘이 챌린지 기간 내 평일이면 false를 반환한다', () => {
    const { isRestDay } = render('2026-07-09');
    expect(isRestDay).toBe(false);
  });

  it('오늘이 챌린지 종료일 이후면 false를 반환한다', () => {
    const { isRestDay } = render('2026-07-20');
    expect(isRestDay).toBe(false);
  });

  it('오늘이 챌린지 시작일 이전이면 false를 반환한다', () => {
    const { isRestDay } = render('2026-07-05');
    expect(isRestDay).toBe(false);
  });
});

describe('자정 경계  날짜가 바뀌는 시각의 정책 전환', () => {
  it('금요일 자정 직전(23:59:59)에는 금요일이 필터에 포함되고 선택된다', () => {
    const { challengeDates, initialSelectedDate, isRestDay } = renderAt(
      '2026-07-10T23:59:59',
    );

    expect(challengeDates).toContain('2026-07-10');
    expect(initialSelectedDate).toBe('2026-07-10');
    expect(isRestDay).toBe(false);
  });

  it('토요일 자정 직후(00:00:00)에는 주말 정책이 적용되어 직전 금요일이 선택된다', () => {
    const { challengeDates, initialSelectedDate, isRestDay } = renderAt(
      '2026-07-11T00:00:00',
    );

    expect(challengeDates).not.toContain('2026-07-11');
    expect(initialSelectedDate).toBe('2026-07-10');
    expect(isRestDay).toBe(true);
  });

  it('챌린지 시작일 전날 자정 직전(23:59:59)에는 빈 배열을 반환한다', () => {
    const { challengeDates } = renderAt('2026-07-06T23:59:59');

    expect(challengeDates).toEqual([]);
  });

  it('챌린지 시작일 자정 직후(00:00:00)부터 시작일이 필터에 포함되고 선택된다', () => {
    const { challengeDates, initialSelectedDate } = renderAt(
      '2026-07-07T00:00:00',
    );

    expect(challengeDates).toEqual(['2026-07-07']);
    expect(initialSelectedDate).toBe('2026-07-07');
  });
});
