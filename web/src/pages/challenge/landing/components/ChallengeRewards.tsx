import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import { useScrollVisible } from '@/pages/landing/hooks/useScrollVisible';
import certificationImage from '#/assets/avif/certification.avif';
import bronzeBadge from '#/assets/avif/challenge-bronze-medal.avif';
import goldBadge from '#/assets/avif/challenge-gold-medal.avif';
import silverBadge from '#/assets/avif/challenge-silver-medal.avif';
import readingKingBadge from '#/assets/avif/readingking-badge.avif';

const ChallengeRewards = () => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);

  return (
    <Container ref={visibleRef} isVisible={isVisible} device={device}>
      <Title device={device}>챌린지 참여 혜택</Title>
      <ContentWrapper device={device}>
        <Reward device={device}>
          <SubTitleBox>
            <SubTitle device={device}>01. 예쁜 뱃지 수집</SubTitle>
            <RewardDescription device={device}>
              꾸준히 읽을수록 더 멋진 뱃지들이 모여요.
            </RewardDescription>
          </SubTitleBox>
          <Flex gap={12} align="center">
            <BadgeBox device={device}>
              <BadgeImage device={device} src={goldBadge} alt="골드 뱃지" />
            </BadgeBox>
            <BadgeBox device={device}>
              <BadgeImage device={device} src={silverBadge} alt="실버 뱃지" />
            </BadgeBox>
            <BadgeBox device={device}>
              <BadgeImage device={device} src={bronzeBadge} alt="브론즈 뱃지" />
            </BadgeBox>
          </Flex>
          <Flex direction="column" gap={8} justify="center" align="center">
            <Text
              color="textSecondary"
              font={device === 'mobile' ? 'body2' : 'body1'}
            >
              <HighLight>*</HighLight> 획득한 뱃지는 이달의 독서왕에서도 확인할
              수 있어요!
            </Text>
            <LeaderboardPreview
              src={readingKingBadge}
              alt="이달의 독서왕 예시"
            />
          </Flex>
        </Reward>
        <Reward device={device}>
          <SubTitleBox>
            <SubTitle device={device}>02. 자랑할 수 있는 수료증</SubTitle>
            <RewardDescription device={device}>
              챌린지를 완주하면 멋진 수료증이 발급돼요.
            </RewardDescription>
          </SubTitleBox>
          <CertificationBox>
            <CertificateImage src={certificationImage} alt="수료증 예시" />
          </CertificationBox>
        </Reward>
      </ContentWrapper>
    </Container>
  );
};

export default ChallengeRewards;

const Container = styled.section<{ device: Device; isVisible: boolean }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'pc' ? '1084px' : '90%')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '1.5rem' : '2rem')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

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

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '4rem' : '4.5rem')};
  flex-direction: ${({ device }) => (device === 'mobile' ? 'column' : 'row')};
`;

const Reward = styled.article<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '1.5rem' : '3.375rem')};
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const SubTitleBox = styled.div`
  width: 100%;

  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

const SubTitle = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};
`;

const RewardDescription = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};
`;

const BadgeBox = styled.div<{ device: Device }>`
  border-radius: 50%;
  box-shadow:
    0 0.125rem 0.5rem rgb(0 0 0 / 6%),
    0 0.25rem 1rem rgb(0 0 0 / 4%);

  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const BadgeImage = styled.img<{ device: Device }>`
  width: 96%;
  height: auto;
`;

const HighLight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const LeaderboardPreview = styled.img`
  width: 80%;
  height: auto;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-bottom: none;
  border-radius: 1.5rem 1.5rem 0 0;
`;

const CertificationBox = styled.div`
  width: 80%;
  padding: 0.5rem;
  border-radius: 1rem;
  box-shadow:
    0 0.25rem 0.5rem rgb(0 0 0 / 8%),
    0 0.5rem 1rem rgb(0 0 0 / 6%);

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};

  transform: rotate(3deg);
`;

const CertificateImage = styled.img`
  width: 100%;
  border-radius: 0.5rem;
`;
