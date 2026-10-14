import styled from '@emotion/styled';
import Tab from '@/components/Tab/Tab';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { TabProps } from '@/components/Tab/Tab';

interface DateTabProps {
  dateString: string;
  today: string;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const DateTab = ({
  dateString,
  today,
  selectedDate,
  onDateSelect,
}: DateTabProps) => {
  const device = useDevice();
  const date = new Date(dateString);

  return (
    <StyledTab
      key={dateString}
      value={dateString}
      label={
        dateString === today
          ? '오늘'
          : `${date.getMonth() + 1}/${date.getDate()}`
      }
      selected={selectedDate === dateString}
      onTabSelect={onDateSelect}
      device={device}
      data-date={dateString}
    />
  );
};

export default DateTab;

const stringTab = (props: TabProps<string>) => <Tab {...props} />;
const StyledTab = styled(stringTab, {
  shouldForwardProp: (prop) => prop !== 'device',
})<{ device: Device }>`
  min-width: ${({ device }) => (device === 'mobile' ? '52px' : 'fit-content')};
  padding: ${({ device }) => (device === 'mobile' ? '8px' : '10px 14px')};
  border-radius: ${({ device }) => (device === 'mobile' ? '12px' : '24px')};

  font: ${({ theme }) => theme.fonts.t6Regular};
`;
