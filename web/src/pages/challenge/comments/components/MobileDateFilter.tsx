import styled from '@emotion/styled';
import { useMemo } from 'react';
import DateTab from './DateTab';
import { getDisplayDates } from '../utils/date';
import Tabs from '@/components/Tabs/Tabs';

interface MobileDateFilterProps {
  today: string;
  dates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const MobileDateFilter = ({
  today,
  dates,
  selectedDate,
  onDateSelect,
}: MobileDateFilterProps) => {
  const displayDates = useMemo(
    () => getDisplayDates(dates, today),
    [dates, today],
  );
  const scrollableDates = displayDates.filter((date) => date !== today);

  return (
    <Container>
      <DateTabsWrapper>
        <StyledTabs>
          {scrollableDates.map((dateString) => (
            <DateTab
              key={dateString}
              dateString={dateString}
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
            />
          ))}
        </StyledTabs>
      </DateTabsWrapper>

      <TodayTabWrapper>
        <DateTab
          dateString={today}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </TodayTabWrapper>
    </Container>
  );
};

export default MobileDateFilter;

const Container = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const DateTabsWrapper = styled.div`
  flex: 1;

  text-align: center;

  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledTabs = styled(Tabs)`
  display: inline-flex;
  gap: 8px;
`;

const TodayTabWrapper = styled.div`
  padding-left: 8px;
  border-left: 2px solid ${({ theme }) => theme.colors.disabledBackground};

  display: flex;
  align-items: center;
`;
