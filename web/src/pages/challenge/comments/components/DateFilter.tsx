import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useMemo } from 'react';
import { findWeekIndex } from '../utils/date';
import Button from '@/components/Button/Button';
import ChevronIcon from '@/components/icons/ChevronIcon';
import Tab, { type TabProps } from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import { useDevice, type Device } from '@/hooks/useDevice';
import { isToday } from '@/utils/date';

interface DateFilterProps {
  totalWeeks: string[][];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const DateFilter = ({
  totalWeeks,
  selectedDate,
  onDateSelect,
}: DateFilterProps) => {
  const device = useDevice();

  const selectedWeekIndex = useMemo(
    () => findWeekIndex(totalWeeks, selectedDate),
    [totalWeeks, selectedDate],
  );

  const selectedWeekDates = useMemo(
    () => totalWeeks[selectedWeekIndex] ?? [],
    [totalWeeks, selectedWeekIndex],
  );

  const canGoPrev = selectedWeekIndex > 0;
  const canGoNext = selectedWeekIndex < totalWeeks.length - 1;

  const selectDate = (dateString: string) => {
    onDateSelect(dateString);
  };

  const goToPrevWeek = () => {
    if (canGoPrev) {
      const prevWeekDate = totalWeeks[selectedWeekIndex - 1]?.[0];
      if (prevWeekDate) {
        onDateSelect(prevWeekDate);
      }
    }
  };

  const goToNextWeek = () => {
    if (canGoNext) {
      const nextWeekDate = totalWeeks[selectedWeekIndex + 1]?.[0];
      if (nextWeekDate) {
        onDateSelect(nextWeekDate);
      }
    }
  };

  return (
    <Container device={device}>
      <NavButton
        variant="transparent"
        onClick={goToPrevWeek}
        disabled={!canGoPrev}
        device={device}
      >
        <ChevronIcon
          direction="left"
          width={device === 'mobile' ? 20 : 36}
          height={device === 'mobile' ? 20 : 36}
          fill={canGoPrev ? theme.colors.primary : theme.colors.disabledText}
        />
      </NavButton>

      <DateTabsWrapper>
        <StyledTabs device={device}>
          {selectedWeekDates.map((dateString) => {
            const date = new Date(dateString);
            return (
              <StyledTab
                key={dateString}
                value={dateString}
                label={
                  isToday(date)
                    ? '오늘'
                    : `${date.getMonth() + 1}/${date.getDate()}`
                }
                selected={selectedDate === dateString}
                onTabSelect={selectDate}
                device={device}
              />
            );
          })}
        </StyledTabs>
      </DateTabsWrapper>

      <NavButton
        variant="transparent"
        onClick={goToNextWeek}
        disabled={!canGoNext}
        device={device}
      >
        <ChevronIcon
          direction="right"
          width={device === 'mobile' ? 20 : 36}
          height={device === 'mobile' ? 20 : 36}
          fill={canGoNext ? theme.colors.primary : theme.colors.disabledText}
        />
      </NavButton>
    </Container>
  );
};

export default DateFilter;

const Container = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavButton = styled(Button)<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '6px' : '8px')};

  color: ${({ theme }) => theme.colors.primary};

  transition: opacity 0.2s;

  &:disabled {
    background-color: transparent;
  }

  &:hover {
    background-color: transparent;
    opacity: 0.6;
  }
`;

const DateTabsWrapper = styled.div`
  border-right: 2px solid ${({ theme }) => theme.colors.disabledBackground};
  border-left: 2px solid ${({ theme }) => theme.colors.disabledBackground};

  flex: 1;

  text-align: center;

  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledTabs = styled(Tabs)<{ device: Device }>`
  display: inline-flex;
  gap: ${({ device }) => (device === 'pc' ? '24px' : '4px')};
`;

const DateTab = (props: TabProps<string>) => <Tab {...props} />;
const StyledTab = styled(DateTab, {
  shouldForwardProp: (prop) => prop !== 'device',
})<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '4px 8px' : '8px 12px')};
  border-radius: ${({ device }) => (device === 'mobile' ? '8px' : '24px')};

  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.bodyLarge};
`;
