import styled from '@emotion/styled';
import type { PropsWithChildren } from 'react';

interface CarouselSlideProps {
  isCurrent?: boolean;
}

export function CarouselSlide({
  isCurrent = false,
  children,
}: PropsWithChildren<CarouselSlideProps>) {
  return (
    <Slide aria-hidden={!isCurrent} {...(!isCurrent && { inert: true })}>
      {children}
    </Slide>
  );
}

const Slide = styled.li`
  flex: 0 0 100%;
`;
