import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

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
  padding: ${({ device }) => (device === 'pc' ? '100px 60px' : '60px 20px')};

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '40px' : '24px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'pc' ? theme.fonts.heading2 : theme.fonts.heading4};
  text-align: center;
`;

const Subtitle = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'pc' ? theme.fonts.body1 : theme.fonts.body3};
  text-align: center;
`;

const Ellipsis = styled.div<{ device: Device }>`
  margin: ${({ device }) => (device === 'pc' ? '24px 0' : '16px 0')};

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'pc' ? theme.fonts.body1 : theme.fonts.body3};
  letter-spacing: 4px;
`;

const SpeechBubbleWrapper = styled.div<{ device: Device }>`
  width: 100%;
  max-width: 720px;

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '32px' : '20px')};
  flex-direction: column;
  align-items: center;
`;

const SpeechBubble = styled.div<{ align: AlignType; device: Device }>`
  position: relative;
  padding: ${({ device }) => (device === 'pc' ? '24px 32px' : '20px 24px')};
  border-radius: 20px;

  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'pc' ? theme.fonts.body1 : theme.fonts.body2};
  text-align: center;

  ${({ align, device }) =>
    device === 'pc' &&
    (align === 'left'
      ? `
    align-self: flex-start;
  `
      : `
    align-self: flex-end;
  `)}

  &::before {
    position: absolute;
    top: 50%;

    border-style: solid;
    content: '';

    transform: translateY(-50%);

    ${({ align, device, theme }) =>
      device === 'pc'
        ? align === 'left'
          ? `
      left: -12px;
      border-width: 12px 16px 12px 0;
      border-color: transparent ${theme.colors.primaryLight} transparent ${theme.colors.primaryLight};
    `
          : `
      right: -12px;
      border-width: 12px 0 12px 16px;
      border-color: transparent transparent transparent ${theme.colors.primaryLight};
    `
        : 'display: none;'}
  }
`;
