import styled from '@emotion/styled';
import { type ReactNode } from 'react';
import { useDevice, type Device } from '@/hooks/useDevice';
import { useScrollVisible } from '@/pages/landing/hooks/useScrollVisible';

export type ImagePosition = 'left' | 'right';
export interface DetailCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  imageContent: ReactNode | ((isVisible: boolean) => ReactNode);
  imagePosition: 'left' | 'right';
}

const DetailCard = ({
  icon,
  title,
  description,
  imageContent,
  imagePosition,
}: DetailCardProps) => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);

  const renderedImageContent =
    typeof imageContent === 'function' ? imageContent(isVisible) : imageContent;

  return (
    <FeatureItem
      ref={visibleRef}
      isVisible={isVisible}
      device={device}
      imagePosition={imagePosition}
    >
      <ImageSection device={device}>{renderedImageContent}</ImageSection>
      <TextSection device={device}>
        <FeatureTitleWrapper device={device}>
          {icon}
          <FeatureTitle device={device}>{title}</FeatureTitle>
        </FeatureTitleWrapper>
        <Description device={device}>{description}</Description>
      </TextSection>
    </FeatureItem>
  );
};

export default DetailCard;

const FeatureItem = styled.article<{
  device: Device;
  imagePosition: 'left' | 'right';
  isVisible: boolean;
}>`
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '2rem' : '4rem')};
  flex-direction: ${({ imagePosition, device }) => {
    if (device === 'mobile') return 'column';
    return imagePosition === 'left' ? 'row' : 'row-reverse';
  }};
  align-items: center;
  justify-content: ${({ device }) =>
    device === 'mobile' ? 'center' : 'space-between'};

  animation: ${({ isVisible }) =>
    isVisible ? 'fade-in-up 1s ease forwards' : 'none'};

  opacity: 0;

  transform: translate3d(0, 2.5rem, 0);

  @keyframes fade-in-up {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

const TextSection = styled.div<{
  device: Device;
}>`
  max-width: ${({ device }) => (device === 'mobile' ? '88vw' : '100%')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '1rem' : '1.5rem')};
  flex-direction: column;
  align-items: flex-start;
`;

const FeatureTitleWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: 0.25rem;
  flex-direction: ${({ device }) =>
    device === 'mobile' ? 'row-reverse' : 'row'};
  align-items: center;
  justify-content: ${({ device }) =>
    device === 'mobile' ? 'center' : 'flex-start'};
`;

const FeatureTitle = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) => {
    if (device === 'mobile') return theme.fonts.heading5;
    return device === 'tablet' ? theme.fonts.heading4 : theme.fonts.heading3;
  }};
`;

const Description = styled.p<{
  device: Device;
}>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) => {
    if (device === 'mobile') return theme.fonts.body2;
    return device === 'tablet' ? theme.fonts.body1 : theme.fonts.heading5;
  }};
  font-weight: 400;
  line-height: 2;
`;

const ImageSection = styled.div<{ device: Device }>`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    max-width: ${({ device }) => {
      if (device === 'mobile') return '17.5rem';
      return device === 'tablet' ? '20rem' : '30rem';
    }};
    border-radius: 0.25rem;

    filter: drop-shadow(0 0.625rem 0.9375rem rgb(0 0 0 / 10%))
      drop-shadow(0 0.25rem 0.375rem rgb(0 0 0 / 10%));
  }
`;
