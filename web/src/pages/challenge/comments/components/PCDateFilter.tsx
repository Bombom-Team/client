import styled from '@emotion/styled';
import { useMemo } from 'react';
import DateTab from './DateTab';
import { getDisplayDates } from '../utils/date';
import Button from '@/components/Button/Button';
import ChevronIcon from '@/components/icons/ChevronIcon';
import Tabs from '@/components/Tabs/Tabs';

interface PCDateFilterProps {
  today: string;
  dates: string[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const PCDateFilter = ({
  today,
  dates,
  selectedDate,
  onDateSelect,
}: PCDateFilterProps) => {
  const displayDates = useMemo(
    () => getDisplayDates(dates, today),
    [dates, today],
  );

  return (
    <Container>
      <NavButton variant="transparent">
        <ChevronIcon direction="left" width={36} height={36} />
      </NavButton>

      <DateTabsWrapper>
        <StyledTabs>
          {displayDates.map((dateString) => (
            <DateTab
              key={dateString}
              dateString={dateString}
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
            />
          ))}
        </StyledTabs>
      </DateTabsWrapper>

      <NavButton variant="transparent">
        <ChevronIcon direction="right" width={36} height={36} />
      </NavButton>
    </Container>
  );
};

export default PCDateFilter;

const Container = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavButton = styled(Button)`
  padding: 8px;

  color: ${({ theme }) => theme.colors.primaryBomBom};

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

const StyledTabs = styled(Tabs)`
  display: inline-flex;
  gap: 24px;
`;
