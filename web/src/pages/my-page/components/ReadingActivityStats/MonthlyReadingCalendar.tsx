import { monthlyReportQueries } from '@bombom/shared/apis/monthlyreport';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';

interface Props {
  isMobile?: boolean;
}

interface ViewMonth {
  year: number;
  month: number;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

const COLORS = {
  cardBorder: '#E9E2DD',
  divider: '#E9E2DD',
  title: '#222222',
  subtitle: '#58708A',
  weekday: '#555555',
  day: '#333333',
  read: '#7DD500',
  readBg: '#ECFFD7',
  mostReadText: '#111111',
  legendText: '#555555',
} as const;

const pad = (value: number) => String(value).padStart(2, '0');

const getCurrentMonth = (): ViewMonth => {
  const now = new Date();

  return { year: now.getFullYear(), month: now.getMonth() + 1 };
};

const MonthlyReadingCalendar = ({ isMobile = false }: Props) => {
  const { year, month } = getCurrentMonth();

  const { data } = useQuery(
    monthlyReportQueries.getReadingCalendar({ year, month }),
  );

  const days = data ?? [];
  const readCountByDate = new Map(days.map((day) => [day.date, day.readCount]));
  const mostReadDay = days.reduce<{ date: string; readCount: number } | null>(
    (top, day) =>
      day.readCount > 0 && (!top || day.readCount > top.readCount) ? day : top,
    null,
  );
  const leadingBlanks = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  return (
    <Card isMobile={isMobile}>
      <Header>
        <Title>월간 읽기 요약</Title>
        <Subtitle>주요 독서 한눈에 보기</Subtitle>
      </Header>

      <WeekdayRow>
        {WEEKDAYS.map((weekday) => (
          <Weekday key={weekday}>{weekday}</Weekday>
        ))}
      </WeekdayRow>
      <Divider />

      <Grid>
        {Array.from({ length: leadingBlanks }, (_, index) => (
          <DayCell key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const dateKey = `${year}-${pad(month)}-${pad(day)}`;
          const readCount = readCountByDate.get(dateKey) ?? 0;
          const isMostRead = mostReadDay?.date === dateKey;
          const isRead = readCount > 0 && !isMostRead;

          return (
            <DayCell
              key={dateKey}
              aria-label={`${month}월 ${day}일 ${readCount}개 읽음`}
            >
              {isMostRead && <MostReadCircle />}
              <DayNumber isMostRead={isMostRead}>{day}</DayNumber>
              {isRead && <ReadUnderline />}
            </DayCell>
          );
        })}
      </Grid>

      <Divider />
      <Legend>
        <LegendItem>
          <LegendCircle>
            {mostReadDay ? Number(mostReadDay.date.slice(8)) : ''}
          </LegendCircle>
          <LegendText>가장 많이 읽은 날</LegendText>
        </LegendItem>
        <LegendItem>
          <LegendSquare />
          <LegendText>읽은 날</LegendText>
        </LegendItem>
      </Legend>
    </Card>
  );
};

export default MonthlyReadingCalendar;

const Card = styled.article<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '45%')};
  min-width: 0;
  padding: 16px 12px;
  border: 1px solid ${COLORS.cardBorder};
  border-radius: 20px;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-self: flex-start;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0;

  color: ${COLORS.title};
  font-size: 14px;
  font-weight: 700;
`;

const Subtitle = styled.p`
  margin: 0;

  color: ${COLORS.subtitle};
  font-size: 12px;
  font-weight: 700;
`;

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const Weekday = styled.span`
  color: ${COLORS.weekday};
  font-size: 12px;
  text-align: center;
`;

const Divider = styled.div`
  height: 1px;

  background-color: ${COLORS.divider};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const DayCell = styled.div`
  position: relative;

  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const DayNumber = styled.span<{ isMostRead: boolean }>`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.content};

  color: ${({ isMostRead }) => (isMostRead ? COLORS.mostReadText : COLORS.day)};
  font-size: 12px;
`;

const MostReadCircle = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;

  width: 40px;
  height: 40px;
  border-radius: 50%;

  background-color: ${COLORS.read};

  transform: translate(-50%, -50%);
`;

const ReadUnderline = styled.span`
  position: absolute;
  bottom: 0;
  left: 50%;

  width: 26px;
  height: 4px;
  border-radius: 2px;

  background-color: ${COLORS.read};

  transform: translateX(-50%);
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const LegendItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const LegendCircle = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${COLORS.read};
  color: ${COLORS.mostReadText};
  font-size: 10px;
`;

const LegendSquare = styled.span`
  width: 16px;
  height: 16px;
  border: 1px solid ${COLORS.read};
  border-radius: 5px;

  background-color: ${COLORS.readBg};
`;

const LegendText = styled.span`
  color: ${COLORS.legendText};
  font-size: 12px;
`;
