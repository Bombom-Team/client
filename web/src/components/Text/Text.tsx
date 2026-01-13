import styled from '@emotion/styled';
import type { AppTheme } from '@bombom/shared/theme';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ColorKey = keyof AppTheme['colors'];
type FontKey = keyof AppTheme['fonts'];

interface TextBaseProps {
  color?: ColorKey;
  font?: FontKey;
}

type TextProps<T extends ElementType = 'span'> = TextBaseProps &
  ComponentPropsWithoutRef<T> & {
    as?: T;
  };

const Text = <T extends ElementType = 'span'>({
  as,
  color,
  font,
  children,
  ...props
}: TextProps<T>) => {
  return (
    <StyledText as={as} color={color} font={font} {...props}>
      {children}
    </StyledText>
  );
};

export default Text;

const StyledText = styled.span<TextBaseProps>`
  color: ${({ theme, color }) =>
    color ? theme.colors[color] : theme.colors.textPrimary};
  font: ${({ theme, font }) => (font ? theme.fonts[font] : theme.fonts.body1)};
`;
