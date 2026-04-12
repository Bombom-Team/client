import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { type ComponentProps } from 'react';
import { useClickOutsideRef } from '@/hooks/useClickOutsideRef';
import ReadingGlassesIcon from '#/assets/svg/reading-glasses.svg';

interface SearchInputProps extends ComponentProps<'input'> {
  ref?: React.Ref<HTMLInputElement>;
  onBlur?: () => void;
}

const SearchInput = ({ ref, onBlur, ...props }: SearchInputProps) => {
  const containerRef = useClickOutsideRef<HTMLDivElement>(onBlur || null);

  return (
    <Container ref={containerRef}>
      <ReadingGlassesIconWrapper>
        <ReadingGlassesIcon
          color={theme.colors.textTertiary}
          width={16}
          height={16}
        />
      </ReadingGlassesIconWrapper>
      <StyledInput
        ref={ref}
        type="search"
        aria-label={props['aria-label'] || '검색'}
        {...props}
      />
    </Container>
  );
};

export default SearchInput;

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 2rem;
`;

const ReadingGlassesIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 0.75rem;

  transform: translateY(-50%);
`;

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0.75rem 2.625rem;
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 0.875rem;
  box-shadow:
    0 0.0625rem 0.1875rem 0 rgb(0 0 0 / 10%),
    0 0.0625rem 0.125rem -0.0625rem rgb(0 0 0 / 10%);

  background-color: ${({ theme }) => theme.colors.white};
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
