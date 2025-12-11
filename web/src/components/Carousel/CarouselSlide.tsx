import styled from '@emotion/styled';
import { useCarouselContext } from './CarouselContext';
import { useCarouselSlideIndex } from './CarouselSlideIndexContext';
import type { PropsWithChildren } from 'react';

const CarouselSlide = ({ children }: PropsWithChildren) => {
  const { slideIndex } = useCarouselContext();
  const index = useCarouselSlideIndex();

  const isCurrent = slideIndex === index;

  return (
    <Slide aria-hidden={!isCurrent} {...(!isCurrent && { inert: true })}>
      {children}
    </Slide>
  );
};

export default CarouselSlide;

const Slide = styled.li`
  flex: 0 0 100%;
`;
