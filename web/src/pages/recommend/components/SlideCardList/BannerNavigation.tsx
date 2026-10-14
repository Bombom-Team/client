import styled from '@emotion/styled';
import { useCarouselContext } from '@/components/Carousel/contexts/CarouselContext';

const BannerNavigation = () => {
  const { slideIndex, slideCount, loop } = useCarouselContext();

  if (slideCount < 2) return null;

  const currentSlide =
    ((((loop ? slideIndex - 1 : slideIndex) % slideCount) + slideCount) %
      slideCount) +
    1;

  return (
    <Container>
      <SlideCount aria-live="off">
        <CurrentSlide>{currentSlide}</CurrentSlide> / {slideCount}
      </SlideCount>
    </Container>
  );
};

export default BannerNavigation;

const Container = styled.div`
  position: absolute;
  right: 12px;
  bottom: 12px;

  display: flex;
  align-items: center;
`;

const SlideCount = styled.span`
  min-width: 24px;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t4Bold};
  text-align: center;
  white-space: nowrap;

  font-variant-numeric: tabular-nums;
`;

const CurrentSlide = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t4Bold};
`;
