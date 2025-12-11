import { createContext, useContext } from 'react';

export const CarouselSlideIndexContext = createContext<number | null>(null);

export const useCarouselSlideIndex = () => {
  const index = useContext(CarouselSlideIndexContext);
  if (index === null) {
    throw new Error(
      'CarouselSlide must be used within CarouselSlides (no index in context)',
    );
  }
  return index;
};
