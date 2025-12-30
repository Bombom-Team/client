import styled from '@emotion/styled';
import Chip from '@/components/Chip/Chip';
import Modal from '@/components/Modal/Modal';
import useModal from '@/components/Modal/useModal';
import Tab from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import CalendarIcon from '#/assets/svg/calendar.svg';

export interface DateTab {
  label: string;
  value: string;
}

export interface WeekOption {
  label: string;
  startDate: string;
  endDate: string;
}

interface DateTabsProps {
  dateTabs: DateTab[];
  weekOptions: WeekOption[];
  currentWeek: WeekOption | null;
  value: string;
  onDateSelect: (value: string) => void;
  onWeekSelect: (weekOption: WeekOption) => void;
}

const DateTabs = ({
  dateTabs,
  weekOptions,
  currentWeek,
  value,
  onDateSelect,
  onWeekSelect,
}: DateTabsProps) => {
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const handleDateSelect = (tabValue: string) => {
    onDateSelect(tabValue);
  };

  const handleWeekSelect = (weekOption: WeekOption) => {
    onWeekSelect(weekOption);
    closeModal();
  };

  return (
    <>
      <ScrollContainer>
        <StyledTabs>
          {[
            <StyledDateTab<string>
              key="week-selector"
              value="week-selector"
              label="주차 선택"
              selected={false}
              onTabSelect={openModal}
              StartComponent={<CalendarIcon width={20} height={20} />}
            />,
            ...dateTabs.map((tab) => (
              <StyledDateTab<string>
                key={tab.value}
                value={tab.value}
                label={tab.label}
                selected={tab.value === value}
                onTabSelect={handleDateSelect}
              />
            )),
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
            {weekOptions.map((week) => (
              <Chip
                key={week.label}
                text={week.label}
                selected={currentWeek?.startDate === week.startDate}
                onSelect={() => handleWeekSelect(week)}
              />
            ))}
          </WeekList>
        </WeekSelectorContainer>
      </Modal>
    </>
  );
};

export default DateTabs;

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

const StyledDateTab = styled(Tab)`
  padding: 4px 8px;
  border-radius: 16px;

  flex-shrink: 0;

  white-space: nowrap;
` as typeof Tab;

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
