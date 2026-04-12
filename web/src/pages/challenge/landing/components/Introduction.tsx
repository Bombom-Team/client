import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import { useScrollVisible } from '@/pages/landing/hooks/useScrollVisible';
import type { RefObject } from 'react';
import CalendarIcon from '#/assets/svg/calendar.svg';
import CheckIcon from '#/assets/svg/check-circle.svg';
import QuoteIcon from '#/assets/svg/quote.svg';

interface IntroductionProps {
  startDate: string;
  endDate: string;
}

const Introduction = ({ startDate, endDate }: IntroductionProps) => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);

  return (
    <Container
      as="section"
      direction="column"
      gap={device === 'mobile' ? 72 : 132}
      align="center"
      justify="center"
    >
      <IntroWrapper
        device={device}
        ref={visibleRef as RefObject<HTMLDivElement>}
      >
        <QuoteItem align="flex-start" isVisible={isVisible}>
          <OpeningQuoteIcon device={device} />
          <QuoteText device={device}>
            꾸준히 읽고 싶은데 동기부여가 부족해
          </QuoteText>
          <ClosingQuoteIcon device={device} />
        </QuoteItem>
        <QuoteItem align="flex-end" isVisible={isVisible}>
          <OpeningQuoteIcon device={device} />
          <QuoteText device={device}>다른 사람들은 어떻게 생각할까?</QuoteText>
          <ClosingQuoteIcon device={device} />
        </QuoteItem>
        <IntroText device={device} isVisible={isVisible}>
          혼자 읽다 보니 이런 생각, 한 번이라도 해보셨나요?
        </IntroText>
      </IntroWrapper>

      <DescriptionWrapper
        direction="column"
        gap={device === 'mobile' ? 12 : 20}
        align="center"
        justify="center"
        isVisible={isVisible}
      >
        <Title device={device}>
          뉴스레터 읽기 챌린지에 <Highlight>여러분을 초대합니다</Highlight>
        </Title>
        <Description device={device}>
          정해진 기간 동안 <Strong>매일 뉴스레터 1편 이상</Strong> 읽고,{'\n'}
          나의 생각을 <Strong>한 줄 코멘트</Strong>로 남기는 챌린지예요.
        </Description>
      </DescriptionWrapper>

      <InfoCard device={device}>
        <Overview>
          <OverviewItem device={device}>
            <CheckIcon
              width={device === 'mobile' ? 16 : 20}
              height={device === 'mobile' ? 16 : 20}
            />
            <OverViewText>하루 한 편과 코멘트 한 줄이면 충분해요.</OverViewText>
          </OverviewItem>
          <OverviewItem device={device}>
            <CheckIcon
              width={device === 'mobile' ? 16 : 20}
              height={device === 'mobile' ? 16 : 20}
            />
            <OverViewText>
              완벽한 코멘트가 아니어도 괜찮아요! 내 마음이 남은 한 문장만
              남겨요.
            </OverViewText>
          </OverviewItem>
        </Overview>
        <Period>
          <Flex gap={4} align="center">
            <CalendarIcon
              width={device === 'mobile' ? 16 : 20}
              height={device === 'mobile' ? 16 : 20}
              color={theme.colors.textTertiary}
            />
            <Text
              font={device === 'mobile' ? 'body1' : 'bodyLarge'}
              color="textTertiary"
            >
              진행 기간
            </Text>
          </Flex>
          <Flex direction="column" gap={4} align="center" justify="center">
            {startDate && endDate ? (
              <>
                <PeriodDate device={device}>
                  <Strong>{startDate}</Strong>
                </PeriodDate>
                ~
                <PeriodDate device={device}>
                  <Strong>{endDate}</Strong>
                </PeriodDate>
              </>
            ) : (
              <ComingSoonText>Coming Soon</ComingSoonText>
            )}
          </Flex>
        </Period>
      </InfoCard>
    </Container>
  );
};

export default Introduction;

const Container = styled(Flex)`
  width: 100%;
  max-width: 1084px;
`;

const IntroWrapper = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'pc' ? '24px 60px' : '0 4px')};

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '84px' : '64px')};
  flex-direction: column;
  align-items: center;
`;

const QuoteItem = styled(Flex)<{ isVisible: boolean }>`
  width: 100%;
  max-width: fit-content;

  gap: ${({ device }) => (device === 'mobile' ? '4px' : '8px')};
  align-items: center;
  justify-content: center;

  animation: ${({ isVisible }) =>
    isVisible ? 'fade-in-up 0.8s ease forwards' : 'none'};

  opacity: 0;

  transform: translate3d(0, 20px, 0);

  &:first-of-type {
    align-self: flex-start;
    animation-delay: 0.2s;
  }

  &:last-of-type {
    align-self: flex-end;
    animation-delay: 0.4s;
  }

  @keyframes fade-in-up {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

const QuoteText = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading3};
  font-weight: 400;
  text-align: center;
`;

const OpeningQuoteIcon = styled(QuoteIcon)<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  height: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  margin-top: ${({ device }) => (device === 'mobile' ? '-12px' : '-24px')};

  color: ${({ theme }) => theme.colors.primary};
`;

const ClosingQuoteIcon = styled(QuoteIcon)<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  height: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  margin-bottom: ${({ device }) => (device === 'mobile' ? '-12px' : '-24px')};

  color: ${({ theme }) => theme.colors.primary};

  transform: rotate(180deg);
`;

const IntroText = styled(Text)<{ device: Device; isVisible: boolean }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};
  font-weight: 400;
  text-align: center;

  animation: ${({ isVisible }) =>
    isVisible ? 'fade-in-up 1s ease forwards' : 'none'};

  animation-delay: 0.4s;
  opacity: 0;

  transform: translate3d(0, 40px, 0);

  @keyframes fade-in-up {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

const DescriptionWrapper = styled(Flex)`
  animation: ${({ isVisible }) =>
    isVisible ? 'fade-in-up 1s ease forwards' : 'none'};

  animation-delay: 0.6s;
  opacity: 0;

  transform: translate3d(0, 20px, 0);

  @keyframes fade-in-up {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading3 : theme.fonts.heading2};
  text-align: center;
`;

const Highlight = styled.span`
  display: inline-block;
  color: ${({ theme }) => theme.colors.primary};
`;

const Strong = styled.span`
  font-weight: 700;
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};
  font-weight: 400;
  line-height: 1.8;
  text-align: center;
`;

const InfoCard = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '20px' : '24px 28px')};
  border-radius: 16px;

  display: flex;
  gap: 32px;
  flex-flow: ${({ device }) => (device === 'mobile' ? 'column' : 'row')} wrap;
  align-items: ${({ device }) => (device === 'mobile' ? 'stretch' : 'center')};
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
`;

const Overview = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`;

const OverviewItem = styled.p<{ device: Device }>`
  display: flex;
  gap: 4px;
  align-items: flex-start;
  justify-content: center;

  svg {
    width: ${({ device }) => (device === 'mobile' ? '18px' : '24px')};
    height: ${({ device }) => (device === 'mobile' ? '18px' : '24px')};
    margin-top: 2px;

    flex-shrink: 0;

    fill: ${({ theme }) => theme.colors.primary};
  }
`;

const OverViewText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.heading5};
  font-weight: 400;
`;

const Period = styled.div`
  padding: 16px 32px;
  border-radius: 12px;

  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const PeriodDate = styled.span<{ device: Device }>`
  align-self: flex-start;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};
  font-weight: 400;
`;

const ComingSoonText = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body1};
  font-weight: 400;
`;
