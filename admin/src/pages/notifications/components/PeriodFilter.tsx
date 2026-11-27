import styled from '@emotion/styled';
import { useState } from 'react';
import { getRangeError, getSeoulDateRange } from '../utils/dateRange';
import type { DateRange } from '../utils/dateRange';
import type { ChangeEvent } from 'react';

const PRESET_DAYS = [7, 30, 90] as const;

interface PeriodFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

// 빠른 선택 버튼과 날짜 입력을 함께 두고, 조회할 수 있는 범위일 때만 부모에 알린다.
const PeriodFilter = ({ value, onChange }: PeriodFilterProps) => {
  const [draft, setDraft] = useState<DateRange>(value);
  const rangeError = getRangeError(draft);
  const today = getSeoulDateRange(1).to;

  const applyRange = (range: DateRange) => {
    setDraft(range);
    if (getRangeError(range) === null) onChange(range);
  };

  const handleFromChange = (event: ChangeEvent<HTMLInputElement>) => {
    applyRange({ ...draft, from: event.target.value });
  };

  const handleToChange = (event: ChangeEvent<HTMLInputElement>) => {
    applyRange({ ...draft, to: event.target.value });
  };

  return (
    <Container>
      <ControlRow>
        <PresetWrapper role="group" aria-label="빠른 기간 선택">
          {PRESET_DAYS.map((days) => {
            const presetRange = getSeoulDateRange(days);
            const isSelected =
              presetRange.from === draft.from && presetRange.to === draft.to;

            return (
              <PresetButton
                key={days}
                type="button"
                aria-pressed={isSelected}
                onClick={() => applyRange(presetRange)}
              >
                {days}일
              </PresetButton>
            );
          })}
        </PresetWrapper>
        <DateFieldset>
          <legend>직접 선택</legend>
          <DateInput
            type="date"
            aria-label="시작일"
            value={draft.from}
            max={draft.to || today}
            aria-invalid={rangeError !== null}
            onChange={handleFromChange}
          />
          <RangeDivider aria-hidden="true">~</RangeDivider>
          <DateInput
            type="date"
            aria-label="종료일"
            value={draft.to}
            min={draft.from}
            max={today}
            aria-invalid={rangeError !== null}
            onChange={handleToChange}
          />
        </DateFieldset>
      </ControlRow>
      {rangeError && <ErrorText role="alert">{rangeError}</ErrorText>}
    </Container>
  );
};

export default PeriodFilter;

const Container = styled.div`
  display: grid;
  gap: var(--seed-dimension-x2);
  justify-items: end;
`;
const ControlRow = styled.div`
  display: flex;
  gap: var(--seed-dimension-x3);
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
`;
const PresetWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x1);
`;
const PresetButton = styled.button`
  min-width: 56px;
  min-height: 44px;
  padding: var(--seed-dimension-x2) var(--seed-dimension-x3);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r2);

  background-color: var(--seed-color-bg-layer-default);
  color: var(--seed-color-fg-neutral-muted);

  &[aria-pressed='true'] {
    background-color: var(--seed-color-bg-brand-weak);
    color: var(--seed-color-palette-carrot-800);
    font-weight: var(--seed-font-weight-bold);
  }
`;
const DateFieldset = styled.fieldset`
  border: none;

  display: flex;
  gap: var(--seed-dimension-x2);
  align-items: center;

  legend {
    overflow: hidden;
    position: absolute;
    width: 1px;
    height: 1px;

    white-space: nowrap;

    clip-path: inset(50%);
  }
`;
const DateInput = styled.input`
  min-height: 44px;
  padding: var(--seed-dimension-x2) var(--seed-dimension-x3);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r2);

  background-color: var(--seed-color-bg-layer-default);
  color: var(--seed-color-fg-neutral);
  font-family: inherit;

  font-variant-numeric: tabular-nums;

  &[aria-invalid='true'] {
    border-color: var(--seed-color-stroke-critical-solid);
  }
`;
const RangeDivider = styled.span`
  color: var(--seed-color-fg-neutral-muted);
`;
const ErrorText = styled.p`
  color: var(--seed-color-fg-critical);
  font-size: var(--seed-font-size-t3);
`;
