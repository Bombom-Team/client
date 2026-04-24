import styled from '@emotion/styled';
import type { SVGProps } from 'react';

type Direction = 'up' | 'upRight' | 'right' | 'downRight' | 'down' | 'downLeft' | 'left' | 'upLeft';

interface ChevronIconProps extends SVGProps<SVGSVGElement> {
  direction?: Direction;
}

const rotationMap: Record<Direction, number> = {
  up: 180,
  upRight: -45,
  right: -90,
  downRight: -135,
  down: 0,
  downLeft: 135,
  left: 90,
  upLeft: 45,
};

const ChevronIcon = ({ direction = 'down', className, width = 16, height = 16, color = 'currentColor', ...props }: ChevronIconProps) => {
  return (
    <Wrapper className={className} rotation={rotationMap[direction]}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 16 16"
        fill="none"
        {...props}
      >
        <path
          d="M3 5.5L8 10.5L13 5.5"
          stroke={color as string}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Wrapper>
  );
};

export default ChevronIcon;

const Wrapper = styled.span<{ rotation: number }>`
  width: fit-content;
  height: fit-content;

  display: inline-flex;

  transform: rotate(${({ rotation }) => rotation}deg);
  transition: transform 0.2s ease-in-out;
`;
