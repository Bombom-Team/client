import styled from '@emotion/styled';
import Chip from '@/components/Chip/Chip';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import Tab from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import { isToday } from '@/utils/date';
import CalendarIcon from '#/assets/svg/calendar.svg';

interface DateFilterProps {
  weekDates: string[];
  selectedDate: string | null;
  currentWeek: number;
  totalWeeks: number;
  onWeekSelect: (week: number) => void;
  onDateSelect: (date: string) => void;
}

const DateFilter = ({
  weekDates,
  selectedDate,
  currentWeek,
  totalWeeks,
  onWeekSelect,
  onDateSelect,
}: DateFilterProps) => {
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const handleDateSelect = (tabValue: string) => {
    onDateSelect(tabValue);
  };

  const handleWeekSelect = (week: number) => {
    onWeekSelect(week);
    closeModal();
  };

  return (
    <>
      <ScrollContainer>
        <StyledTabs>
          {[
            <Tab
              key="week-selector"
              value="week-selector"
              label="주차 선택"
              selected={false}
              onTabSelect={openModal}
              StartComponent={<CalendarIcon width={20} height={20} />}
            />,
            ...weekDates.map((dateString) => {
              const date = new Date(dateString);
              return (
                <Tab
                  key={dateString}
                  value={dateString}
                  label={
                    isToday(date)
                      ? '오늘'
                      : `${date.getMonth() + 1}월 ${date.getDate()}일`
                  }
                  selected={selectedDate === dateString}
                  onTabSelect={handleDateSelect}
                />
              );
            }),
          ]}
        </StyledTabs>
      </ScrollContainer>

      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        modalRef={modalRef}
        position="center"
        showCloseButton={true}
        showBackdrop={true}
      >
        <WeekSelectorContainer>
          <WeekSelectorTitle>주차 선택</WeekSelectorTitle>
          <WeekList>
            {Array.from({ length: totalWeeks }, (_, index) => {
              const week = index + 1;
              return (
                <Chip
                  key={week}
                  text={`${week}주차`}
                  selected={currentWeek === week}
                  onSelect={() => handleWeekSelect(week)}
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

const ScrollContainer = styled.div`
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

const StyledTabs = styled(Tabs)`
  width: max-content;
  min-width: 100%;
`;

const WeekSelectorContainer = styled.div`
  border-radius: 16px;

  display: flex;
  gap: 16px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const WeekSelectorTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const WeekList = styled.div`
  display: grid;
  gap: 8px;

  grid-template-columns: repeat(3, 1fr);
`;
