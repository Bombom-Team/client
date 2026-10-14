import {
  compareDates,
  filterWeekdays,
  formatDate,
  getDatesDiff,
  getDatesInRange,
} from './date';

describe('formatDate', () => {
  it('Date 정보를 점(.)으로 구분된 문자열로 변환한다.', () => {
    const date = new Date('2025-07-01T12:00:00');
    expect(formatDate(date)).toBe('2025.07.01');
  });
});

describe('getDatesInRange', () => {
  it('시작일과 종료일이 같으면 해당 날짜 하나만 반환한다.', () => {
    expect(getDatesInRange('2025-07-01', '2025-07-01')).toEqual(['2025-07-01']);
  });

  it('시작일부터 종료일까지 모든 날짜를 반환한다.', () => {
    expect(getDatesInRange('2025-07-01', '2025-07-03')).toEqual([
      '2025-07-01',
      '2025-07-02',
      '2025-07-03',
    ]);
  });

  it('월을 넘어가는 범위도 올바르게 반환한다.', () => {
    expect(getDatesInRange('2025-01-30', '2025-02-01')).toEqual([
      '2025-01-30',
      '2025-01-31',
      '2025-02-01',
    ]);
  });

  it('시작일이 종료일보다 늦으면 빈 배열을 반환한다.', () => {
    expect(getDatesInRange('2025-07-03', '2025-07-01')).toEqual([]);
  });
});

describe('filterWeekdays', () => {
  it('주말을 제외한 평일만 반환한다.', () => {
    const week = [
      '2025-07-07',
      '2025-07-08',
      '2025-07-09',
      '2025-07-10',
      '2025-07-11',
      '2025-07-12',
      '2025-07-13',
    ];
    expect(filterWeekdays(week)).toEqual([
      '2025-07-07',
      '2025-07-08',
      '2025-07-09',
      '2025-07-10',
      '2025-07-11',
    ]);
  });

  it('평일만 있으면 그대로 반환한다.', () => {
    expect(filterWeekdays(['2025-07-07', '2025-07-08'])).toEqual([
      '2025-07-07',
      '2025-07-08',
    ]);
  });

  it('주말만 있으면 빈 배열을 반환한다.', () => {
    expect(filterWeekdays(['2025-07-12', '2025-07-13'])).toEqual([]);
  });

  it('빈 배열이면 빈 배열을 반환한다.', () => {
    expect(filterWeekdays([])).toEqual([]);
  });
});

describe('compareDates', () => {
  it('date1이 date2보다 이르면 -1을 반환한다.', () => {
    expect(compareDates(new Date('2025-07-01'), new Date('2025-07-02'))).toBe(
      -1,
    );
  });

  it('date1이 date2보다 늦으면 1을 반환한다.', () => {
    expect(compareDates(new Date('2025-07-02'), new Date('2025-07-01'))).toBe(
      1,
    );
  });

  it('날짜가 같으면 0을 반환한다.', () => {
    expect(compareDates(new Date('2025-07-01'), new Date('2025-07-01'))).toBe(
      0,
    );
  });

  it('시간이 달라도 날짜가 같으면 0을 반환한다.', () => {
    expect(
      compareDates(
        new Date('2025-07-01T00:00:00'),
        new Date('2025-07-01T23:59:59'),
      ),
    ).toBe(0);
  });
});

describe('getDatesDiff', () => {
  it('같은 날짜면 0을 반환한다.', () => {
    expect(getDatesDiff(new Date('2025-07-01'), new Date('2025-07-01'))).toBe(
      0,
    );
  });

  it('하루 차이면 1을 반환한다.', () => {
    expect(getDatesDiff(new Date('2025-07-01'), new Date('2025-07-02'))).toBe(
      1,
    );
  });

  it('인수 순서가 바뀌어도 동일한 값을 반환한다.', () => {
    expect(getDatesDiff(new Date('2025-07-10'), new Date('2025-07-01'))).toBe(
      9,
    );
  });
});
