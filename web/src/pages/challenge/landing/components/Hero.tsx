import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import { useDevice, type Device } from '@/hooks/useDevice';
import ArrowRightIcon from '#/assets/svg/arrow-right.svg';

interface HeroProps {
  challengeName: string;
  generation: number;
}

const Hero = ({ challengeName, generation }: HeroProps) => {
  const device = useDevice();

  return (
    <Container device={device}>
      <ContentWrapper device={device}>
        <Title device={device}>{challengeName}</Title>
        <IntroText device={device}>
          매일 뉴스레터 1편을 읽고 한 줄 감상을 남기는 30일 여정.
        </IntroText>
        <IntroText device={device}>
          혼자가 아닌, 함께 읽는 즐거움을 경험하세요.
        </IntroText>
        <PriceWrapper>
          <PriceLabel device={device}>정가 ₩24,900</PriceLabel>
          <PriceHighlight device={device}>무료</PriceHighlight>
        </PriceWrapper>
        <DiscountText
          device={device}
        >{`${generation}기 특별 할인!`}</DiscountText>
        <ApplicantButton device={device} variant="outlined">
          지금 신청하기
          <ArrowRightIcon />
        </ApplicantButton>
      </ContentWrapper>
      <WaveLine />
    </Container>
  );
};

export default Hero;

const Container = styled.section<{ device: Device }>`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: ${({ device }) =>
    device === 'mobile' ? '80px 0 160px' : '120px 0 200px'};

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
`;

const ContentWrapper = styled.div<{ device: Device }>`
  position: relative;
  width: 100%;
  max-width: 960px;
  padding: ${({ device }) => (device === 'mobile' ? '0 20px' : '0 60px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '12px' : '16px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

const Title = styled.h1<{ device: Device }>`
  margin-top: ${({ device }) => (device === 'mobile' ? '12px' : '20px')};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading2 : theme.fonts.heading1};
`;

const IntroText = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.white};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body1};
`;

const PriceWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: baseline;
  justify-content: center;
`;

const PriceLabel = styled.span<{ device: Device }>`
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};

  opacity: 0.7;
  text-decoration: line-through;
`;

const PriceHighlight = styled.span<{ device: Device }>`
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
`;

const DiscountText = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primaryLight};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body2};
`;

const ApplicantButton = styled(Button)<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
  font-weight: 600;

  svg {
    width: 24px;
    height: 24px;

    fill: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

const WaveLine = styled.div`
  position: absolute;
  bottom: -120px;
  left: 50%;
  width: 140%;
  height: 240px;
  border-radius: 50%;

  background-color: ${({ theme }) => theme.colors.white};

  transform: translateX(-50%);
`;
