import styled from '@emotion/styled';
import type { ChangeEvent, ComponentProps, ReactNode } from 'react';

interface InputFieldProps extends ComponentProps<'input'> {
  name?: string;
  label?: string | ReactNode;
  inputValue: string;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errorString?: string | null;
  suffix?: ReactNode;
}

const InputField = ({
  name,
  label,
  inputValue,
  onInputChange,
  placeholder,
  errorString,
  suffix,
  ...props
}: InputFieldProps) => {
  const isInvalid = Boolean(errorString);
  const hasSuffix = Boolean(suffix);

  return (
    <FieldGroup>
      {typeof label === 'string' ? (
        <Label htmlFor={name}>{label}</Label>
      ) : (
        label
      )}
      <InputRow>
        <Input
          id={name}
          name={name}
          type="text"
          value={inputValue}
          onChange={onInputChange}
          placeholder={placeholder ?? ''}
          aria-invalid={isInvalid}
          hasSuffix={hasSuffix}
          {...props}
        />
        {suffix && <InputSuffixWrapper>{suffix}</InputSuffixWrapper>}
      </InputRow>
      {errorString && <Error id={`${name}-error`}>{errorString}</Error>}
    </FieldGroup>
  );
};

export default InputField;

const FieldGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body2};
`;

const Input = styled.input<{ hasSuffix: boolean }>`
  width: 100%;
  height: 3rem;
  padding: 0.75rem 0.875rem;
  padding-right: ${({ hasSuffix }) => (hasSuffix ? '9.25rem' : undefined)};
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.75rem;

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};

  transition: all 0.2s ease-in-out;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    box-shadow:
      0 0.0625rem 0.1875rem 0 rgb(0 0 0 / 10%),
      0 0.0625rem 0.125rem -0.0625rem rgb(0 0 0 / 10%),
      0 0 0 0.125rem ${({ theme }) => theme.colors.primary}20;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabledBackground};
    color: ${({ theme }) => theme.colors.textTertiary};

    cursor: not-allowed;
  }
`;

const InputRow = styled.div`
  position: relative;

  display: flex;
  align-items: stretch;
`;

const InputSuffixWrapper = styled.div`
  position: absolute;
  top: 0.375rem;
  right: 0.625rem;
  width: fit-content;
  height: calc(100% - 0.75rem);

  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Error = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font: ${({ theme }) => theme.fonts.caption};
`;
