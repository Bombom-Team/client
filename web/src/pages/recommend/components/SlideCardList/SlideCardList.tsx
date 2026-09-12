import styled from '@emotion/styled';
import BannerNavigation from './BannerNavigation';
import LandingIntroBanner from '../LandingIntroBanner/LandingIntroBanner';
import BlogOpenBanner from '../PromotionBanner/BlogOpenBanner';
import InstagramPromotionBanner from '../PromotionBanner/InstagramPromotionBanner';
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
              <InstagramPromotionBanner />
            </BannerWrapper>
          </Carousel.Slide>
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
          <Carousel.Slide>
            <BannerWrapper device={device}>
              <LandingIntroBanner />
            </BannerWrapper>
          </Carousel.Slide>
        </Carousel.Slides>
        {device === 'pc' ? <CarouselNavButtons /> : <BannerNavigation />}
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
