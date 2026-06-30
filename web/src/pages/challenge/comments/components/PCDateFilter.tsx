import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import DateTab from './DateTab';
import useDateFilterScroll from '../hooks/useDateFilterScroll';
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
  const { scrollRef, canScrollLeft, canScrollRight, scrollDateFilter } =
    useDateFilterScroll();

  return (
    <Container>
      <NavButton
        variant="transparent"
        onClick={() => scrollDateFilter('left')}
        disabled={!canScrollLeft}
      >
        <ChevronIcon
          direction="left"
          width={36}
          height={36}
          fill={
            canScrollLeft
              ? theme.colors.primaryBomBom
              : theme.colors.disabledText
          }
        />
      </NavButton>

      <DateTabsWrapper ref={scrollRef}>
        <StyledTabs>
          {dates.map((dateString) => (
            <DateTab
              key={dateString}
              dateString={dateString}
              today={today}
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
            />
          ))}
        </StyledTabs>
      </DateTabsWrapper>

      <NavButton
        variant="transparent"
        onClick={() => scrollDateFilter('right')}
        disabled={!canScrollRight}
      >
        <ChevronIcon
          direction="right"
          width={36}
          height={36}
          fill={
            canScrollRight
              ? theme.colors.primaryBomBom
              : theme.colors.disabledText
          }
        />
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
