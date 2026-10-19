import styled from '@emotion/styled';
import type { AppTheme } from '../../core/theme';
import type { ChangeEvent, PropsWithChildren } from 'react';

type ColorKey = keyof AppTheme['colors'];

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  color?: ColorKey;
}

const Checkbox = ({
  id,
  checked,
  onChange,
  color = 'primaryBomBom',
  children,
}: PropsWithChildren<CheckboxProps>) => {
  return (
    <CheckboxWrapper>
      <HiddenCheckbox
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        color={color}
      />
      <CheckboxLabel htmlFor={id} checked={checked}>
        <CheckboxSquare checked={checked} color={color}>
          {checked && <CheckMark>✓</CheckMark>}
        </CheckboxSquare>
        {children}
      </CheckboxLabel>
    </CheckboxWrapper>
  );
};

export default Checkbox;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HiddenCheckbox = styled.input<{ color: ColorKey }>`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: 0;
  padding: 0;
  border: 0;

  appearance: none;
  opacity: 0;
  pointer-events: none;

  &:focus-visible + label {
    outline: 2px solid ${({ theme, color }) => theme.colors[color]};
    outline-offset: 2px;
  }
`;

const CheckboxLabel = styled.label<{ checked: boolean }>`
  display: flex;
  gap: 8px;
  align-items: center;

  cursor: pointer;
  user-select: none;
`;

const CheckboxSquare = styled.div<{ checked: boolean; color: ColorKey }>`
  width: 20px;
  height: 20px;
  border: 2px solid
    ${({ theme, checked, color }) =>
      checked ? theme.colors[color] : theme.colors.stroke};
  border-radius: 4px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme, checked, color }) =>
    checked ? theme.colors[color] : theme.colors.white};

  transition: all 0.2s ease;
`;

const CheckMark = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
