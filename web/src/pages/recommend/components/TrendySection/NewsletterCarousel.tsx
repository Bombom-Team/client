import NewsletterCardList from './NewsletterCardList';
import { Carousel } from '@/components/Carousel/Carousel';
import { chunk } from '@/utils/array';
import type { Newsletter } from '@/types/newsletter';

const ITEMS_PER_SLIDE = 5;

interface NewsletterCarouselProps {
  newsletters: Newsletter[];
  handleCardClick: (newsletter: Newsletter) => void;
}

const NewsletterCarousel = ({
  newsletters,
  handleCardClick,
}: NewsletterCarouselProps) => {
  return (
    <Carousel.Root>
      <Carousel.Slides showNextSlidePart>
        {chunk(newsletters, ITEMS_PER_SLIDE).map(
          (newslettersOfSlide, slideIndex) => (
            <Carousel.Slide key={`newsletters-${slideIndex}`}>
              <NewsletterCardList
                newsletters={newslettersOfSlide}
                handleCardClick={handleCardClick}
              />
            </Carousel.Slide>
          ),
        )}
      </Carousel.Slides>
    </Carousel.Root>
  );
};

export default NewsletterCarousel;
