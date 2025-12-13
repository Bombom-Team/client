import { createContext, useContext } from 'react';

const INVALID_INDEX = -1;

export const CarouselSlideIndexContext = createContext<number>(INVALID_INDEX);

export const useCarouselSlideIndex = () => {
  const index = useContext(CarouselSlideIndexContext);
  if (index === INVALID_INDEX) {
    throw new Error(
      'CarouselSlide는 반드시 <Carousel.Slides> 내부에서만 사용해야 합니다.',
    );
  }
  return index;
};
