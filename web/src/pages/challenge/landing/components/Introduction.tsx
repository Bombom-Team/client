import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import CalendarIcon from '#/assets/svg/calendar.svg';
import CheckIcon from '#/assets/svg/check-circle.svg';
import QuoteIcon from '#/assets/svg/quote.svg';

interface IntroductionProps {
  startDate: string;
  endDate: string;
}

const Introduction = ({ startDate, endDate }: IntroductionProps) => {
  const device = useDevice();

  return (
    <Flex
      as="section"
      direction="column"
      gap={device === 'mobile' ? 48 : 64}
      align="center"
      justify="center"
    >
      <QuoteWrapper device={device}>
        <QuoteItem align="flex-start">
          <OpeningQuoteIcon device={device} />
          <QuoteText device={device}>
            꾸준히 읽고 싶은데 동기부여가 부족해
          </QuoteText>
          <ClosingQuoteIcon device={device} />
        </QuoteItem>
        <QuoteItem align="flex-end">
          <OpeningQuoteIcon device={device} />
          <QuoteText device={device}>다른 사람들은 어떻게 생각할까?</QuoteText>
          <ClosingQuoteIcon device={device} />
        </QuoteItem>
      </QuoteWrapper>

      <IntroText device={device}>
        혼자 읽다 보니 이런 생각, 한 번이라도 해보셨나요?
      </IntroText>

      <Flex direction="column" gap={12} align="center" justify="center">
        <Title device={device}>
          뉴스레터 읽기 챌린지에 <Highlight>여러분을 초대합니다</Highlight>
        </Title>
        <Description device={device}>
          정해진 기간 동안 <Strong>매일 뉴스레터 1편 이상</Strong> 읽고,{'\n'}
          나의 생각을 <Strong>한 줄 코멘트</Strong>로 남기는 챌린지예요.
        </Description>
      </Flex>

      <InfoCard device={device}>
        <Overview>
          <OverviewItem device={device}>
            <CheckIcon />
            <Text
              color="primary"
              font={device === 'mobile' ? 'body2' : 'body1'}
            >
              하루 한 편과 코멘트 한 줄이면 충분해요.
            </Text>
          </OverviewItem>
          <OverviewItem device={device}>
            <CheckIcon />
            <Text
              color="primary"
              font={device === 'mobile' ? 'body2' : 'body1'}
            >
              완벽한 코멘트가 아니어도 괜찮아요! 내 마음이 남은 한 문장만
              남겨요.
            </Text>
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
              font={device === 'mobile' ? 'body2' : 'body1'}
              color="textTertiary"
            >
              진행 기간
            </Text>
          </Flex>
          <Flex direction="column" gap={4} align="center" justify="center">
            <PeriodDate device={device}>
              시작 일: <Strong>{startDate}</Strong>
            </PeriodDate>
            <PeriodDate device={device}>
              종료 일: <Strong>{endDate}</Strong>
            </PeriodDate>
          </Flex>
        </Period>
      </InfoCard>
    </Flex>
  );
};

export default Introduction;

const QuoteWrapper = styled.div<{ device: Device }>`
  width: 100%;
  max-width: 80%;
  padding: ${({ device }) => (device === 'pc' ? '24px 60px' : '24px 4px')};

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '84px' : '64px')};
  flex-direction: column;
  align-items: center;
`;

const QuoteItem = styled(Flex)`
  width: 100%;
  max-width: fit-content;

  gap: ${({ device }) => (device === 'mobile' ? '4px' : '8px')};
  align-items: center;
  justify-content: center;

  &:first-of-type {
    align-self: flex-start;
  }

  &:last-of-type {
    align-self: flex-end;
  }
`;

const QuoteText = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};
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

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
  text-align: center;
`;

const Highlight = styled.span`
  display: inline-block;
  color: ${({ theme }) => theme.colors.primary};
`;

const Strong = styled.span`
  font-weight: 700;
`;

const IntroText = styled(Text)<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
  text-align: center;
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body1};
  text-align: center;
  white-space: pre-line;
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

  svg {
    width: ${({ device }) => (device === 'mobile' ? '16px' : '18px')};
    height: ${({ device }) => (device === 'mobile' ? '16px' : '18px')};
    margin-top: 2px;

    flex-shrink: 0;

    fill: ${({ theme }) => theme.colors.primary};
  }
`;

const Period = styled.div`
  padding: 16px;
  border-radius: 12px;

  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const PeriodDate = styled.span<{ device: Device }>`
  align-self: flex-start;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};
`;
