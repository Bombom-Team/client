import BlogComingSoonBanner from '../PromotionBanner/BlogComingSoonBanner';
import { Carousel } from '@/components/Carousel/Carousel';

const SlideCardList = () => {
  return (
    <>
      <Carousel.Root>
        <Carousel.Slides>
          <Carousel.Slide>
            <BlogComingSoonBanner />
          </Carousel.Slide>
        </Carousel.Slides>
      </Carousel.Root>
    </>
  );
};

export default SlideCardList;
