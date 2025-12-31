import styled from '@emotion/styled';
import { useMemo } from 'react';
import Chip from '@/components/Chip/Chip';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import Tab, { type TabProps } from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import { useDevice, type Device } from '@/hooks/useDevice';
import { findWeekIndex } from '@/pages/challenge/comments/utils/findWeekIndex';
import { isToday } from '@/utils/date';
import CalendarIcon from '#/assets/svg/calendar.svg';

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
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const selectedWeekIndex = useMemo(
    () => findWeekIndex(totalWeeks, selectedDate),
    [totalWeeks, selectedDate],
  );

  const selectedWeekDates = useMemo(
    () => totalWeeks[selectedWeekIndex] ?? [],
    [totalWeeks, selectedWeekIndex],
  );

  const selectDate = (dateString: string) => {
    onDateSelect(dateString);
  };

  const selectWeek = (weekIndex: number) => {
    const defaultDate = totalWeeks[weekIndex]?.[0];
    if (defaultDate) {
      onDateSelect(defaultDate);
    }
    closeModal();
  };

  return (
    <>
      <Container>
        <StyledTabs device={device}>
          {[
            <WeekSelectorTab
              key="week-selector"
              value="week-selector"
              label="주차 선택"
              selected={false}
              onTabSelect={openModal}
              StartComponent={<CalendarIcon width={20} height={20} />}
              device={device}
            />,
            ...selectedWeekDates.map((dateString) => {
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
            }),
          ]}
        </StyledTabs>
      </Container>

      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        modalRef={modalRef}
        position={device === 'mobile' ? 'center' : 'center'}
        showCloseButton={false}
      >
        <WeekSelectorContainer device={device}>
          <WeekSelectorTitle device={device}>주차 선택</WeekSelectorTitle>
          <WeekList device={device}>
            {Array.from({ length: totalWeeks.length }, (_, index) => {
              return (
                <StyledChip
                  key={index}
                  text={`${index + 1}주차`}
                  selected={selectedWeekIndex === index}
                  onSelect={() => selectWeek(index)}
                  device={device}
                />
              );
            })}
          </WeekList>
        </WeekSelectorContainer>
      </Modal>
    </>
  );
};

export default DateFilter;

const Container = styled.div`
  width: 100%;
  padding-bottom: 8px;

  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.stroke};
  }
`;

const StyledTabs = styled(Tabs)<{ device: Device }>`
  display: flex;
  gap: 6px;
`;

const DateTab = (props: TabProps<string>) => <Tab {...props} />;
const StyledTab = styled(DateTab, {
  shouldForwardProp: (prop) => prop !== 'device',
})<{ device: Device }>`
  padding: 2px;
  border-radius: 6px;

  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
`;

const WeekSelectorTab = styled(StyledTab)`
  gap: 2px;
`;

const WeekSelectorContainer = styled.div<{ device: Device }>`
  max-width: ${({ device }) => (device === 'mobile' ? '80vw' : '100%')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '12px' : '16px')};
  flex-direction: column;
`;

const WeekSelectorTitle = styled.h3<{ device: Device }>`
  align-self: ${({ device }) =>
    device === 'mobile' ? 'center' : 'flex-start'};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const WeekList = styled.div<{ device: Device }>`
  width: 100%;

  display: grid;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  justify-content: center;

  grid-template-columns: repeat(4, max-content);

  @media (width <= 320px) {
    grid-template-columns: repeat(3, max-content);
  }
`;

const StyledChip = styled(Chip)<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '8px 12px' : '12px 16px')};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body2};
`;
