import { useTheme } from '@emotion/react';
import { Carousel } from './Carousel';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'components/common/Carousel',
  component: Carousel.Root,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Carousel.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

interface Slide {
  label: string;
  backgroundColor: 'primary' | 'primaryLight';
}
interface SlideBoxProps {
  backgroundColor: 'primary' | 'primaryLight';
  children: React.ReactNode;
}

const slides: Slide[] = [
  { label: '슬라이드1', backgroundColor: 'primary' },
  { label: '슬라이드2', backgroundColor: 'primaryLight' },
  { label: '슬라이드3', backgroundColor: 'primary' },
];

const SlideBox = ({ backgroundColor, children }: SlideBoxProps) => {
  const theme = useTheme();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        padding: '52px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors[backgroundColor],
        font: theme.fonts.heading2,
      }}
    >
      {children}
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <Carousel.Root>
      <Carousel.Slides>
        {slides.map(({ label, backgroundColor }) => (
          <Carousel.Slide key={label}>
            <SlideBox backgroundColor={backgroundColor}>{label}</SlideBox>
          </Carousel.Slide>
        ))}
      </Carousel.Slides>
    </Carousel.Root>
  ),
};

export const WithAutoPlay: Story = {
  render: () => (
    <Carousel.Root loop autoPlay>
      <Carousel.Slides>
        {slides.map(({ label, backgroundColor }) => (
          <Carousel.Slide key={label}>
            <SlideBox backgroundColor={backgroundColor}>{label}</SlideBox>
          </Carousel.Slide>
        ))}
      </Carousel.Slides>
    </Carousel.Root>
  ),
};

export const WithCustomAutoPlayDelay: Story = {
  render: () => (
    <Carousel.Root loop autoPlay={{ delay: 1000 }}>
      <Carousel.Slides>
        {slides.map(({ label, backgroundColor }) => (
          <Carousel.Slide key={label}>
            <SlideBox backgroundColor={backgroundColor}>{label}</SlideBox>
          </Carousel.Slide>
        ))}
      </Carousel.Slides>
    </Carousel.Root>
  ),
};

export const WithLoop: Story = {
  render: () => (
    <Carousel.Root loop autoPlay>
      <Carousel.Slides>
        {slides.map(({ label, backgroundColor }) => (
          <Carousel.Slide key={label}>
            <SlideBox backgroundColor={backgroundColor}>{label}</SlideBox>
          </Carousel.Slide>
        ))}
      </Carousel.Slides>
    </Carousel.Root>
  ),
};

export const WithNavButtons: Story = {
  render: () => (
    <Carousel.Root>
      <Carousel.Slides>
        {slides.map(({ label, backgroundColor }) => (
          <Carousel.Slide key={label}>
            <SlideBox backgroundColor={backgroundColor}>{label}</SlideBox>
          </Carousel.Slide>
        ))}
      </Carousel.Slides>
      <Carousel.NavButtons />
    </Carousel.Root>
  ),
};

export const WithNavButtonsBottom: Story = {
  render: () => (
    <Carousel.Root>
      <Carousel.Slides>
        {slides.map(({ label, backgroundColor }) => (
          <Carousel.Slide key={label}>
            <SlideBox backgroundColor={backgroundColor}>{label}</SlideBox>
          </Carousel.Slide>
        ))}
      </Carousel.Slides>
      <Carousel.NavButtons position="bottom" />
    </Carousel.Root>
  ),
};

export const FullFeatured: Story = {
  render: () => (
    <Carousel.Root loop autoPlay={{ delay: 2000 }}>
      <Carousel.Slides showNextSlidePart>
        {slides.map(({ label, backgroundColor }) => (
          <Carousel.Slide key={label}>
            <SlideBox backgroundColor={backgroundColor}>{label}</SlideBox>
          </Carousel.Slide>
        ))}
      </Carousel.Slides>
      <Carousel.NavButtons position="middle" />
    </Carousel.Root>
  ),
};
