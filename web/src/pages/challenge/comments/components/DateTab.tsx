import styled from '@emotion/styled';
import Tab from '@/components/Tab/Tab';
import { useDevice, type Device } from '@/hooks/useDevice';
import { isToday } from '@/utils/date';
import type { TabProps } from '@/components/Tab/Tab';

interface DateTabProps {
  dateString: string;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const DateTab = ({ dateString, selectedDate, onDateSelect }: DateTabProps) => {
  const device = useDevice();

  const date = new Date(dateString);
  const label = isToday(date)
    ? '오늘'
    : `${date.getMonth() + 1}/${date.getDate()}`;

  return (
    <StyledTab
      key={dateString}
      value={dateString}
      label={label}
      selected={selectedDate === dateString}
      onTabSelect={onDateSelect}
      device={device}
    />
  );
};

export default DateTab;

const stringTab = (props: TabProps<string>) => <Tab {...props} />;
const StyledTab = styled(stringTab, {
  shouldForwardProp: (prop) => prop !== 'device',
})<{ device: Device }>`
  min-width: ${({ device }) => (device === 'mobile' ? '52px' : 'fit-content')};
  padding: ${({ device }) => (device === 'mobile' ? '0.5rem' : '0.75rem 1rem')};
  border-radius: ${({ device }) =>
    device === 'mobile' ? '0.75rem' : '1.5rem'};

  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.bodyLarge};
`;
