import styled from '@emotion/styled';
import Tab from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import CalendarIcon from '#/assets/svg/calendar.svg';

export interface DateTab {
  label: string;
  value: string;
}

interface DateTabsProps {
  dateTabs: DateTab[];
  value: string;
  onDateSelect: (value: string) => void;
  onCalendarClick?: () => void;
}

const DateTabs = ({
  dateTabs,
  value,
  onDateSelect,
  onCalendarClick,
}: DateTabsProps) => {
  const handleDateSelect = (tabValue: string) => {
    onDateSelect(tabValue);
  };

  const handleCalendarClick = () => {
    onCalendarClick?.();
  };

  return (
    <Tabs>
      {[
        ...dateTabs.map((tab) => (
          <DateTab<string>
            key={tab.value}
            value={tab.value}
            label={tab.label}
            selected={tab.value === value}
            onTabSelect={handleDateSelect}
          />
        )),
        <DateTab<string>
          key="calendar"
          value="calendar"
          label="날짜 선택"
          selected={value === 'calendar'}
          onTabSelect={handleCalendarClick}
          StartComponent={<CalendarIcon width={20} height={20} />}
        />,
      ]}
    </Tabs>
  );
};

export default DateTabs;

const DateTab = styled(Tab)`
  padding: 4px 8px;
  border-radius: 16px;
` as typeof Tab;
