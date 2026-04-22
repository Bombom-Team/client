import styled from '@emotion/styled';
import BlogOpenBanner from '../PromotionBanner/BlogOpenBanner';
import MaeilMailPromotionBanner from '../PromotionBanner/MaeilMailPromotionBanner';
import { Carousel } from '@/components/Carousel/Carousel';
import CarouselNavButtons from '@/components/Carousel/CarouselNavButtons';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const SlideCardList = () => {
  const device = useDevice();

  return (
    <>
      <Carousel.Root loop autoPlay>
        <Carousel.Slides>
          <Carousel.Slide>
            <BannerWrapper device={device}>
              <MaeilMailPromotionBanner />
            </BannerWrapper>
          </Carousel.Slide>
          <Carousel.Slide>
            <BannerWrapper device={device}>
              <BlogOpenBanner />
            </BannerWrapper>
          </Carousel.Slide>
        </Carousel.Slides>
        <CarouselNavButtons />
      </Carousel.Root>
    </>
  );
};

export default SlideCardList;

const BannerWrapper = styled.div<{ device: Device }>`
  width: 100%;
  height: ${({ device }) => (device === 'mobile' ? '210px' : '280px')};

  > * {
    height: 100%;
  }
`;
