import styled from '@emotion/styled';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import type { Theme } from '@emotion/react';
import mails from '#/assets/avif/mails.avif';

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
      <PainPointWrapper device={device}>
        {PAIN_POINTS.map((point, index) => (
          <SpeechBubble key={index} align={point.align} device={device}>
            {point.text}
          </SpeechBubble>
        ))}
      </PainPointWrapper>
      <PromoteWrapper device={device}>
        <MailsImage src={mails} alt="mails" device={device} />
        <PromoteTextBox device={device}>
          <Lead>메일함에 이렇게 뉴스레터가 쌓여만 있지는 않으신가요?</Lead>
          <Support>이제는 봄봄에서 한 번에 관리해요</Support>
        </PromoteTextBox>
      </PromoteWrapper>
    </Container>
  );
};

export default PainPoint;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '60px 0' : '100px 0')};

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
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.bodyLarge};
  text-align: center;
`;

const Ellipsis = styled.div<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body1};
  letter-spacing: 4px;
`;

const PainPointWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '20px' : '44px')};
  flex-direction: column;
  align-items: center;
`;

const SpeechBubble = styled.div<{ align: AlignType; device: Device }>`
  position: relative;
  width: ${({ device }) => (device === 'mobile' ? '100%' : 'fit-content')};
  padding: ${({ device }) => (device === 'mobile' ? '20px 24px' : '24px 32px')};
  border-radius: 20px;

  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body1};
  text-align: center;

  word-break: keep-all;

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

const PromoteWrapper = styled.div<{ device: Device }>`
  margin: ${({ device }) => (device === 'mobile' ? '16px 0' : '32px 0')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '48px')};
  flex-direction: column;
  align-items: center;
`;

const MailsImage = styled(ImageWithFallback)<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'mobile' ? '280px' : '560px')};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%);

  filter: drop-shadow(0 2px 8px rgb(0 0 0 / 5%));
`;

const PromoteTextBox = styled.p<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  flex-direction: column;

  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};
  text-align: center;

  word-break: keep-all;
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Support = styled.p`
  color: ${({ theme }) => theme.colors.primary};
`;
