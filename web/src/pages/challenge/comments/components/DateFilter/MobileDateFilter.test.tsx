import { theme } from '@bombom/shared/theme';
import { ThemeProvider } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import MobileDateFilter from './MobileDateFilter';

jest.mock('@/hooks/useDevice', () => ({
  useDevice: () => 'mobile',
}));

const renderMobileDateFilter = ({
  today,
  dates,
  selectedDate,
}: {
  today: string;
  dates: string[];
  selectedDate: string;
}) =>
  render(
    <ThemeProvider theme={theme}>
      <MobileDateFilter
        today={today}
        dates={dates}
        selectedDate={selectedDate}
        onDateSelect={jest.fn()}
      />
    </ThemeProvider>,
  );

describe('MobileDateFilter', () => {
  it('오늘이 유효한 챌린지 날짜이면 오늘 탭을 표시한다', () => {
    renderMobileDateFilter({
      today: '2026-07-10',
      dates: ['2026-07-07', '2026-07-08', '2026-07-09', '2026-07-10'],
      selectedDate: '2026-07-10',
    });

    expect(screen.getByText('오늘')).toBeTruthy();
  });

  it('오늘이 주말이면 오늘 탭과 구분 영역을 표시하지 않는다', () => {
    renderMobileDateFilter({
      today: '2026-07-12',
      dates: ['2026-07-07', '2026-07-08', '2026-07-09', '2026-07-10'],
      selectedDate: '2026-07-10',
    });

    expect(screen.queryByText('오늘')).toBeNull();
    expect(screen.getAllByRole('tablist')).toHaveLength(1);
    expect(screen.getByText('7/10')).toBeTruthy();
  });

  it('챌린지 종료 후에는 마지막 챌린지 날짜까지만 표시한다', () => {
    renderMobileDateFilter({
      today: '2026-07-20',
      dates: ['2026-07-16', '2026-07-17'],
      selectedDate: '2026-07-17',
    });

    expect(screen.queryByText('오늘')).toBeNull();
    expect(screen.getAllByRole('tablist')).toHaveLength(1);
    expect(screen.getByText('7/17')).toBeTruthy();
  });
});
