import styled from '@emotion/styled';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
type JustifyContent =
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

interface FlexBaseProps {
  direction?: FlexDirection;
  justify?: JustifyContent;
  align?: AlignItems;
  gap?: number;
  wrap?: FlexWrap;
}

type FlexProps<T extends ElementType = 'div'> = FlexBaseProps &
  ComponentPropsWithoutRef<T> & {
    as?: T;
  };

const Flex = <T extends ElementType = 'div'>({
  as,
  direction = 'row',
  justify = 'flex-start',
  align = 'stretch',
  gap = 0,
  wrap = 'nowrap',
  children,
  ...props
}: FlexProps<T>) => {
  return (
    <StyledFlex
      as={as}
      direction={direction}
      justify={justify}
      align={align}
      gap={gap}
      wrap={wrap}
      {...props}
    >
      {children}
    </StyledFlex>
  );
};

export default Flex;

const StyledFlex = styled.div<FlexBaseProps>`
  display: flex;
  gap: ${({ gap }) => gap}px;
  flex-flow: ${({ direction }) => direction} ${({ wrap }) => wrap};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
`;
