import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import type { Theme } from '@emotion/react';

const PAIN_POINTS = [
  {
    text: '메일함에 섞여있어서 찾기가 불편해요',
    align: 'left' as const,
  },
  {
    text: '뉴스레터를 구독해놔도 자꾸 안 읽게 돼요',
    align: 'right' as const,
  },
  {
    text: '읽고는 싶은데 한번 쌓이니까 계속 쌓아두게 돼요',
    align: 'left' as const,
  },
];

type AlignType = 'left' | 'right';

const PainPoint = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <Title device={device}>왜 봄봄일까요?</Title>
      <Subtitle device={device}>
        복잡한 메일함 속에서 놓쳐버리는 가치 있는 글들
        <br />꼭 읽고 싶은 뉴스레터조차 흘려보내는 우리의 바쁜 일상
      </Subtitle>
      <Ellipsis device={device}>...</Ellipsis>
      <SpeechBubbleWrapper device={device}>
        {PAIN_POINTS.map((point, index) => (
          <SpeechBubble key={index} align={point.align} device={device}>
            {point.text}
          </SpeechBubble>
        ))}
      </SpeechBubbleWrapper>
    </Container>
  );
};

export default PainPoint;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) =>
    device === 'mobile' ? '60px 20px' : '100px 60px'};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '40px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
  text-align: center;
`;

const Subtitle = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body1};
  text-align: center;
`;

const Ellipsis = styled.div<{ device: Device }>`
  margin: ${({ device }) => (device === 'mobile' ? '16px 0' : '24px 0')};

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body1};
  letter-spacing: 4px;
`;

const SpeechBubbleWrapper = styled.div<{ device: Device }>`
  width: 100%;
  max-width: 720px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '20px' : '32px')};
  flex-direction: column;
  align-items: center;
`;

const SpeechBubble = styled.div<{ align: AlignType; device: Device }>`
  position: relative;
  padding: ${({ device }) => (device === 'mobile' ? '20px 24px' : '24px 32px')};
  border-radius: 20px;

  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
  text-align: center;

  ${({ align, device, theme }) =>
    addSpeechBubbleTailStyle(align, device, theme)}
`;

const addSpeechBubbleTailStyle = (
  align: AlignType,
  device: Device,
  theme: Theme,
) => {
  if (device === 'mobile') return '';

  const isLeft = align === 'left';
  return `
    align-self: ${isLeft ? 'flex-start' : 'flex-end'};

    &::before {
      content: '';
      position: absolute;
      bottom: 12px;
      border-style: solid;

      ${isLeft ? 'left' : 'right'}: -36px;
      border-width: ${isLeft ? '18px 48px 4px 0' : '18px 0 4px 48px'};
      border-color: ${
        isLeft
          ? `transparent ${theme.colors.primaryLight} transparent transparent`
          : `transparent transparent transparent ${theme.colors.primaryLight}`
      };
    }
  `;
};
