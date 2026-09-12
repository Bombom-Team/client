import styled from '@emotion/styled';
import { useCarouselContext } from '@/components/Carousel/contexts/CarouselContext';
import ChevronIcon from '@/components/icons/ChevronIcon';

const BannerNavigation = () => {
  const { slideIndex, slideCount, loop } = useCarouselContext();

  if (slideCount < 2) return null;

  const currentSlide =
    ((((loop ? slideIndex - 1 : slideIndex) % slideCount) + slideCount) %
      slideCount) +
    1;

  return (
    <Container>
      {slideCount > 1 && loop && (
        <Arrow>
          <ChevronIcon direction="left" width={20} height={20} />
        </Arrow>
      )}
      <SlideCount aria-live="off">
        <CurrentSlide>{currentSlide}</CurrentSlide> / {slideCount}
      </SlideCount>
      <Arrow>
        <ChevronIcon direction="right" width={20} height={20} />
      </Arrow>
    </Container>
  );
};

export default BannerNavigation;

const Container = styled.div`
  position: absolute;
  right: 8px;
  bottom: 4px;

  display: flex;
  align-items: center;
`;

const Arrow = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};

  &[aria-disabled='true'] {
    opacity: 0.4;
  }

  &:hover:not([aria-disabled='true']) {
    background-color: ${({ theme }) => theme.colors.dividers};
  }
`;

const SlideCount = styled.span`
  min-width: 24px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Bold};
  text-align: center;
  white-space: nowrap;

  font-variant-numeric: tabular-nums;
`;

const CurrentSlide = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
`;
