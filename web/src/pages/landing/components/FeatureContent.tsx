import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import type { ReactNode, ComponentType, SVGProps } from 'react';

type AlignType = 'left' | 'right';

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

  return (
    <Container device={device}>
      <ContentWrapper device={device} componentPosition={componentPosition}>
        <TextSection device={device} componentPosition={componentPosition}>
          <TitleWrapper>
            <Title device={device}>{title}</Title>
            <Icon
              width={device === 'mobile' ? 24 : 36}
              height={device === 'mobile' ? 24 : 36}
              fill={theme.colors.primary}
            />
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

const Container = styled.section<{ device: Device }>`
  width: 100%;

  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div<{
  device: Device;
  componentPosition: AlignType;
}>`
  width: 100%;
  max-width: ${({ device }) => (device === 'mobile' ? '400px' : '1000px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '40px')};
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
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '32px')};
  flex: 1;
  flex-direction: column;
  align-items: ${({ device, componentPosition }) => {
    if (device === 'mobile') return 'center';
    return componentPosition === 'left' ? 'flex-end' : 'flex-start';
  }};

  text-align: ${({ device }) => (device === 'mobile' ? 'center' : 'left')};
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const Title = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
`;

const DescriptionWrapper = styled.div<{
  device: Device;
  componentPosition: AlignType;
}>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '4px' : '8px')};
  flex-direction: column;
  align-items: ${({ device, componentPosition }) => {
    if (device === 'mobile') return 'center';
    return componentPosition === 'left' ? 'flex-end' : 'flex-start';
  }};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.bodyLarge};
`;

const ImageSection = styled.div<{ device: Device }>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  img {
    width: ${({ device }) => (device === 'mobile' ? '280px' : '400px')};
    height: auto;
  }
`;
