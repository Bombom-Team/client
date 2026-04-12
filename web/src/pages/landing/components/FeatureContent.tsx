import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useScrollVisible } from '../hooks/useScrollVisible';
import { useDevice } from '@/hooks/useDevice';
import type { AlignType } from '../types/position';
import type { Device } from '@/hooks/useDevice';
import type { ReactNode, ComponentType, SVGProps } from 'react';

interface FeatureContentProps {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: ReactNode;
  previewComponent: ReactNode;
  componentPosition: AlignType;
}

const FeatureContent = ({
  Icon,
  title,
  description,
  previewComponent,
  componentPosition = 'right',
}: FeatureContentProps) => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.4);

  return (
    <Container ref={visibleRef} isVisible={isVisible} device={device}>
      <ContentWrapper device={device} componentPosition={componentPosition}>
        <TextSection device={device} componentPosition={componentPosition}>
          <TitleWrapper>
            <Title device={device}>{title}</Title>
            <IconWrapper device={device}>
              <Icon fill={theme.colors.primary} />
            </IconWrapper>
          </TitleWrapper>
          <DescriptionWrapper
            device={device}
            componentPosition={componentPosition}
          >
            {description}
          </DescriptionWrapper>
        </TextSection>
        <ImageSection device={device}>{previewComponent}</ImageSection>
      </ContentWrapper>
    </Container>
  );
};

export default FeatureContent;

const Container = styled.article<{ device: Device; isVisible: boolean }>`
  width: 100%;

  display: flex;
  justify-content: center;

  opacity: 0;

  transform: translate3d(0, 2.5rem, 0);

  ${({ isVisible }) => isVisible && `animation: fade-in-up 1s ease forwards;`}

  @keyframes fade-in-up {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

const ContentWrapper = styled.div<{
  device: Device;
  componentPosition: AlignType;
}>`
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '1.5rem' : '0.5rem')};
  flex-direction: ${({ device, componentPosition }) => {
    if (device === 'mobile') return 'column';
    return componentPosition === 'left' ? 'row-reverse' : 'row';
  }};
  align-items: center;
  justify-content: center;
`;

const TextSection = styled.div<{
  device: Device;
  componentPosition: AlignType;
}>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '1rem' : '2rem')};
  flex: 1;
  flex-direction: column;
  align-items: ${({ device, componentPosition }) => {
    if (device === 'mobile') return 'center';
    return componentPosition === 'left' ? 'flex-end' : 'flex-start';
  }};

  text-align: ${({ device, componentPosition }) => {
    if (device === 'mobile') return 'center';
    return componentPosition === 'left' ? 'flex-end' : 'flex-start';
  }};
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const Title = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ device, theme }) => {
    if (device === 'mobile') return theme.fonts.heading5;
    return device === 'tablet' ? theme.fonts.heading4 : theme.fonts.heading3;
  }};
`;

const IconWrapper = styled.div<{ device: Device }>`
  width: ${({ device }) => {
    if (device === 'mobile') return '1.125rem';
    return device === 'tablet' ? '1.5rem' : '1.75rem';
  }};
  height: ${({ device }) => {
    if (device === 'mobile') return '1.125rem';
    return device === 'tablet' ? '1.5rem' : '1.75rem';
  }};

  fill: ${({ theme }) => theme.colors.primary};
`;

const DescriptionWrapper = styled.div<{
  device: Device;
  componentPosition: AlignType;
}>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '0.25rem' : '0.5rem')};
  flex-direction: column;
  align-items: ${({ device, componentPosition }) => {
    if (device === 'mobile') return 'center';
    return componentPosition === 'left' ? 'flex-end' : 'flex-start';
  }};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) => {
    if (device === 'mobile') return theme.fonts.body3;
    return device === 'tablet' ? theme.fonts.body1 : theme.fonts.bodyLarge;
  }};
`;

const ImageSection = styled.div<{ device: Device }>`
  display: flex;
  flex: ${({ device }) => (device === 'tablet' ? 'none' : 1)};
  align-items: center;
  justify-content: center;

  img {
    width: ${({ device }) => {
      if (device === 'mobile') return '15rem';
      return device === 'tablet' ? '17.5rem' : '23.75rem';
    }};
    height: auto;
    border-radius: 1rem;

    filter: drop-shadow(0 0.625rem 0.9375rem rgb(0 0 0 / 10%))
      drop-shadow(0 0.25rem 0.375rem rgb(0 0 0 / 10%));
  }
`;
