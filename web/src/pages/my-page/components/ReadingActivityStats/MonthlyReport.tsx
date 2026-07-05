import styled from '@emotion/styled';
import { useState } from 'react';
import ChevronIcon from '@/components/icons/ChevronIcon';
import Text from '@/components/Text';
import MonthlyReadingCalendar from '@/pages/my-page/components/ReadingActivityStats/MonthlyReadingCalendar';
import MonthlyReportStats from '@/pages/my-page/components/ReadingActivityStats/MonthlyReportStats';
import SubscribedCategoryStats from '@/pages/my-page/components/ReadingActivityStats/SubscribedCategoryStats';

interface Props {
  isMobile?: boolean;
}

interface ViewMonth {
  year: number;
  month: number;
}

const COLORS = {
  brand: '#FE5E04',
  navBorder: '#E9E2DD',
  navText: '#111111',
  boxBorder: '#FFD9C5',
  boxFrom: '#FFFDFC',
  boxTo: '#FFF8F3',
} as const;

const getCurrentMonth = (): ViewMonth => {
  const now = new Date();

  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

const MonthlyReport = ({ isMobile = false }: Props) => {
  const [viewMonth, setViewMonth] = useState<ViewMonth>(getCurrentMonth);

  const { year, month } = viewMonth;
  const current = getCurrentMonth();
  const isCurrentMonth = year === current.year && month === current.month;

  const moveMonth = (offset: number) => {
    setViewMonth(({ year, month }) => {
      const next = new Date(year, month - 1 + offset, 1);

      return { year: next.getFullYear(), month: next.getMonth() + 1 };
    });
  };

  return (
    <Container>
      <Header>
        <ReportTitle>
          <TitleIcon viewBox="36 22 40 46" aria-hidden="true">
            <rect
              x="40"
              y="32"
              width="32"
              height="32"
              rx="6"
              stroke={COLORS.brand}
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M48 26V40M64 26V40M40 48H72"
              stroke={COLORS.brand}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </TitleIcon>
          월간 리포트 ✦
        </ReportTitle>
        <MonthNav>
          <NavButton
            type="button"
            aria-label="이전 달"
            onClick={() => moveMonth(-1)}
          >
            <ChevronIcon direction="left" width={16} />
          </NavButton>
          <MonthLabel font="t5Bold">
            {year}년 {month}월
          </MonthLabel>
          <NavButton
            type="button"
            aria-label="다음 달"
            onClick={() => moveMonth(1)}
            disabled={isCurrentMonth}
          >
            <ChevronIcon direction="right" width={16} />
          </NavButton>
        </MonthNav>
      </Header>

      <MonthlyReportStats year={year} month={month} isMobile={isMobile} />
      <ReportContentWrapper isMobile={isMobile}>
        <MonthlyReadingCalendar year={year} month={month} isMobile={isMobile} />
        <CategoryStatsWrapper>
          <SubscribedCategoryStats
            isMobile={isMobile}
            params={{ year, month }}
          />
        </CategoryStatsWrapper>
      </ReportContentWrapper>
    </Container>
  );
};

export default MonthlyReport;

const Container = styled.div`
  width: 100%;
  padding: 20px;
  border: 1px solid ${COLORS.boxBorder};
  border-radius: 20px;

  display: flex;
  gap: 16px;
  flex-direction: column;

  background: linear-gradient(135deg, ${COLORS.boxFrom}, ${COLORS.boxTo});

  box-sizing: border-box;
`;

const ReportContentWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 16px;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: stretch;
`;

const CategoryStatsWrapper = styled.div`
  min-width: 0;
  flex: 1;
`;

const Header = styled.div`
  display: grid;
  gap: 8px;
  align-items: center;

  grid-template-columns: 1fr auto 1fr;
`;

const ReportTitle = styled.h2`
  margin: 0;

  display: flex;
  gap: 8px;
  align-items: center;

  color: ${COLORS.brand};
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const TitleIcon = styled.svg`
  width: 20px;
  height: 22px;

  display: block;
`;

const MonthNav = styled.div`
  padding: 4px;
  border: 1px solid ${COLORS.navBorder};
  border-radius: 12px;

  display: flex;
  gap: 4px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const MonthLabel = styled(Text)`
  min-width: 76px;
  text-align: center;

  && {
    color: ${COLORS.navText};
  }
`;

const NavButton = styled.button`
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: transparent;
  color: ${COLORS.navText};

  cursor: pointer;

  &:disabled {
    color: ${({ theme }) => theme.colors.disabledText};
    cursor: default;
  }
`;
