import styled from '@emotion/styled';
import type { ChangeEvent, PropsWithChildren } from 'react';

interface CheckboxProps {
  id: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({
  id,
  checked,
  onChange,
  children,
}: PropsWithChildren<CheckboxProps>) => {
  return (
    <CheckboxWrapper>
      <HiddenCheckbox
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <CheckboxLabel htmlFor={id} checked={checked}>
        <CheckboxSquare checked={checked}>
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

const HiddenCheckbox = styled.input`
  position: absolute;
  width: 0.0625rem;
  height: 0.0625rem;
  margin: 0;
  padding: 0;
  border: 0;

  appearance: none;
  opacity: 0;
  pointer-events: none;

  &:focus-visible + label {
    outline: 0.125rem solid ${({ theme }) => theme.colors.primary};
    outline-offset: 0.125rem;
  }
`;

const CheckboxLabel = styled.label<{ checked: boolean }>`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  cursor: pointer;
  user-select: none;
`;

const CheckboxSquare = styled.div<{ checked: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  border: 0.125rem solid
    ${({ theme, checked }) =>
      checked ? theme.colors.primary : theme.colors.stroke};
  border-radius: 0.25rem;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme, checked }) =>
    checked ? theme.colors.primary : theme.colors.white};

  transition: all 0.2s ease;
`;

const CheckMark = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.body2};
`;
