import styled from '@emotion/styled';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import { useScrollVisible } from '@/pages/landing/hooks/useScrollVisible';
import BookIcon from '#/assets/svg/book.svg';
import FlagIcon from '#/assets/svg/flag.svg';
import LampIcon from '#/assets/svg/lamp.svg';

export const BENEFITS = [
  {
    title: '작은 성취감',
    description: '오늘도 읽었다는 뿌듯함이 쌓여요.',
    Icon: FlagIcon,
  },
  {
    title: '새로운 관점',
    description: '타인의 코멘트에서 영감을 얻어요.',
    Icon: LampIcon,
  },
  {
    title: '읽기 루틴',
    description: '의지가 아닌 습관으로 만들어요.',
    Icon: BookIcon,
  },
];

const ChallengeBenefits = () => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);

  return (
    <Container ref={visibleRef} device={device}>
      <Title device={device}>
        참여하면 <Highlight>이런게</Highlight> 좋아요
      </Title>
      <CardWrapper device={device}>
        {BENEFITS.map((benefit, index) => {
          return (
            <BenefitCard
              key={index}
              device={device}
              isVisible={isVisible}
              index={index}
            >
              <IconBox>
                <benefit.Icon />
              </IconBox>
              <BenefitTitle device={device}>{benefit.title}</BenefitTitle>
              <Text
                font={device === 'mobile' ? 'body1' : 'bodyLarge'}
                color={device === 'mobile' ? 'textSecondary' : 'textSecondary'}
              >
                {benefit.description}
              </Text>
              <CardNumber>{index + 1}</CardNumber>
            </BenefitCard>
          );
        })}
      </CardWrapper>
      <SubDescription device={device}>
        한 달 뒤, 뉴스레터가 더 잘 읽히는 내가 되어 있을 거예요.
      </SubDescription>
    </Container>
  );
};

export default ChallengeBenefits;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: ${({ device }) =>
    device === 'mobile' ? '80px 20px 0' : '80px 60px 0'};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
  text-align: center;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const CardWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: grid;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '20px')};

  grid-template-columns: ${({ device }) =>
    device === 'mobile' ? '1fr' : 'repeat(3, 1fr)'};
`;

const BenefitCard = styled.article<{
  device: Device;
  isVisible: boolean;
  index: number;
}>`
  position: relative;
  width: 100%;
  max-width: ${({ device }) => (device === 'mobile' ? '400px' : 'none')};
  margin: ${({ device }) => (device === 'mobile' ? '0 auto' : '0')};
  padding: ${({ device }) => (device === 'mobile' ? '20px' : '28px')};
  border-radius: 20px;
  box-shadow: 0 10px 24px rgb(0 0 0 / 6%);

  display: flex;
  gap: 8px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  animation: ${({ isVisible }) =>
    isVisible ? 'fade-in-up 0.8s ease forwards' : 'none'};

  animation-delay: ${({ index }) => index * 0.15}s;

  opacity: 0;

  transform: translate3d(0, 40px, 0);

  @keyframes fade-in-up {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

const IconBox = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const BenefitTitle = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};
`;

const CardNumber = styled.span`
  position: absolute;
  top: 12px;
  right: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.heading1};

  opacity: 0.6;
`;

const SubDescription = styled.p<{ device: Device }>`
  margin-top: 32px;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};
  text-align: center;
`;
