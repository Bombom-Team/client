import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useDateFilter } from '../hooks/useDateFilter';
import Button from '@/components/Button/Button';
import ChevronIcon from '@/components/icons/ChevronIcon';
import Tab, { type TabProps } from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import { useDevice, type Device } from '@/hooks/useDevice';

interface DateFilterProps {
  today: string;
  dates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const DateFilter = ({
  today,
  dates,
  selectedDate,
  onDateSelect,
}: DateFilterProps) => {
  const {
    displayDates,
    canGoPrevWeek,
    canGoNextWeek,
    goToPrevWeek,
    goToNextWeek,
  } = useDateFilter({ today, dates, selectedDate, onDateSelect });

  const device = useDevice();

  return (
    <Container device={device}>
      {device !== 'mobile' && (
        <NavButton
          variant="transparent"
          onClick={goToPrevWeek}
          disabled={!canGoPrevWeek}
          device={device}
        >
          <ChevronIcon
            direction="left"
            width={36}
            height={36}
            fill={
              canGoPrevWeek ? theme.colors.primary : theme.colors.disabledText
            }
          />
        </NavButton>
      )}

      <DateTabsWrapper device={device}>
        <StyledTabs device={device}>
          {[
            ...displayDates.map((dateString) => {
              const date = new Date(dateString);
              return (
                <StyledTab
                  key={dateString}
                  value={dateString}
                  label={`${date.getMonth() + 1}/${date.getDate()}`}
                  selected={selectedDate === dateString}
                  onTabSelect={onDateSelect}
                  device={device}
                />
              );
            }),
            ...(device !== 'mobile'
              ? [
                  <StyledTab
                    key={today}
                    value={today}
                    label="오늘"
                    selected={selectedDate === today}
                    onTabSelect={onDateSelect}
                    device={device}
                  />,
                ]
              : []),
          ]}
        </StyledTabs>
      </DateTabsWrapper>

      {device === 'mobile' && (
        <TodayTabWrapper>
          <StyledTab
            value={today}
            label="오늘"
            selected={selectedDate === today}
            onTabSelect={onDateSelect}
            device={device}
          />
        </TodayTabWrapper>
      )}

      {device !== 'mobile' && (
        <NavButton
          variant="transparent"
          onClick={goToNextWeek}
          disabled={!canGoNextWeek}
          device={device}
        >
          <ChevronIcon
            direction="right"
            width={36}
            height={36}
            fill={
              canGoNextWeek ? theme.colors.primary : theme.colors.disabledText
            }
          />
        </NavButton>
      )}
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

const DateTabsWrapper = styled.div<{ device: Device }>`
  border-right: ${({ device, theme }) =>
    device === 'mobile'
      ? 'none'
      : `2px solid ${theme.colors.disabledBackground}`};
  border-left: ${({ device, theme }) =>
    device === 'mobile'
      ? 'none'
      : `2px solid ${theme.colors.disabledBackground}`};

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
  gap: ${({ device }) => (device === 'pc' ? '24px' : '8px')};
`;

const TodayTabWrapper = styled.div`
  padding-left: 8px;
  border-left: 2px solid ${({ theme }) => theme.colors.disabledBackground};

  display: flex;
  align-items: center;
`;

const DateTab = (props: TabProps<string>) => <Tab {...props} />;
const StyledTab = styled(DateTab, {
  shouldForwardProp: (prop) => prop !== 'device',
})<{ device: Device }>`
  min-width: ${({ device }) => (device === 'mobile' ? '52px' : 'fit-content')};
  padding: ${({ device }) => (device === 'mobile' ? '8px' : '12px 16px')};
  border-radius: ${({ device }) => (device === 'mobile' ? '12px' : '24px')};

  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.bodyLarge};
`;
