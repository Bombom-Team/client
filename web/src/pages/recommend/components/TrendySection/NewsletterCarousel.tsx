import NewsletterCardList from './NewsletterCardList';
import { Carousel } from '@/components/Carousel/Carousel';
import { chunk } from '@/utils/array';
import type { Newsletter } from '@/types/newsletter';
import type { ReactNode } from 'react';

const ITEMS_PER_SLIDE = 5;

interface NewsletterCarouselProps {
  newsletters: Newsletter[];
  handleCardClick: (newsletter: Newsletter) => void;
  trailing?: ReactNode;
}

const NewsletterCarousel = ({
  newsletters,
  handleCardClick,
  trailing,
}: NewsletterCarouselProps) => {
  const slides = chunk(newsletters, ITEMS_PER_SLIDE);
  const lastSlide = slides[slides.length - 1];

  const needsOwnSlide =
    !!trailing && (!lastSlide || lastSlide.length === ITEMS_PER_SLIDE);

  return (
    <Carousel.Root>
      <Carousel.Slides showNextSlidePart>
        {slides.map((newslettersOfSlide, slideIndex) => (
          <Carousel.Slide key={`newsletters-${slideIndex}`}>
            <NewsletterCardList
              newsletters={newslettersOfSlide}
              handleCardClick={handleCardClick}
              trailing={
                !needsOwnSlide && slideIndex === slides.length - 1
                  ? trailing
                  : undefined
              }
            />
          </Carousel.Slide>
        ))}
        {needsOwnSlide && (
          <Carousel.Slide key="request-card">{trailing}</Carousel.Slide>
        )}
      </Carousel.Slides>
    </Carousel.Root>
  );
};

export default NewsletterCarousel;
