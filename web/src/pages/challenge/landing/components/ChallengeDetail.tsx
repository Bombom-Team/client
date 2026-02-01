import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useDevice, type Device } from '@/hooks/useDevice';
import commentCard1 from '#/assets/avif/challenge-comment1.avif';
import commentCard2 from '#/assets/avif/challenge-comment2.avif';
import commentCard3 from '#/assets/avif/challenge-comment3.avif';
import challengeDashboard from '#/assets/avif/challenge-dashboard.avif';
import dailyGuideImage from '#/assets/avif/landing-dailyguide.avif';
import CommentIcon from '#/assets/svg/comment.svg';
import RoadSignIcon from '#/assets/svg/road-sign.svg';
import SproutIcon from '#/assets/svg/sprout-stroke.svg';

const ChallengeDetail = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <Title device={device}>
        챌린지, <Highlight>이렇게</Highlight> 구성돼요
      </Title>
      <ContentWrapper device={device}>
        <FeatureItem device={device} imagePosition="left">
          <ImageSection device={device}>
            <img src={dailyGuideImage} alt="데일리 가이드" />
          </ImageSection>
          <TextSection device={device}>
            <FeatureTitleWrapper device={device}>
              <RoadSignIcon
                width={device === 'mobile' ? 18 : device === 'tablet' ? 24 : 28}
                height={
                  device === 'mobile' ? 18 : device === 'tablet' ? 24 : 28
                }
                color={theme.colors.primary}
              />
              <FeatureTitle device={device}>데일리 가이드</FeatureTitle>
            </FeatureTitleWrapper>
            <Description device={device}>
              <p>뉴스레터 읽기를 이끄는 하루 한 가지 문구,</p>
              <p>
                매일 새로운 가이드로 단순한 읽기를 깊이 있는 사색으로
                전환하세요.
              </p>
              <p>한 달 후, 작지만 확실한 변화를 만날 수 있어요.</p>
            </Description>
          </TextSection>
        </FeatureItem>

        <FeatureItem device={device} imagePosition="right">
          <ImageSection device={device}>
            <img src={challengeDashboard} alt="챌린지 현황판" />
          </ImageSection>
          <TextSection device={device}>
            <FeatureTitleWrapper device={device}>
              <SproutIcon
                width={device === 'mobile' ? 18 : device === 'tablet' ? 24 : 28}
                height={
                  device === 'mobile' ? 18 : device === 'tablet' ? 24 : 28
                }
                color={theme.colors.primary}
              />
              <FeatureTitle device={device}>챌린지 현황판</FeatureTitle>
            </FeatureTitleWrapper>
            <Description device={device}>
              <p>참여 팀들의 챌린지 현황을 한눈에 확인하고,</p>
              <p>꾸준히 이어가는 원동력을 얻어요.</p>
              <p>다른 팀과 경쟁하며 우리 팀의 달성률에 기여해보세요!</p>
            </Description>
          </TextSection>
        </FeatureItem>

        <FeatureItem device={device} imagePosition="left">
          <ImageSection device={device}>
            <CommentImageWrapper>
              <CommentImage src={commentCard1} alt="코멘트1" offset={1} />
              <CommentImage src={commentCard2} alt="코멘트2" offset={2} />
              <CommentImage src={commentCard3} alt="코멘트3" offset={3} />
            </CommentImageWrapper>
          </ImageSection>
          <TextSection device={device}>
            <FeatureTitleWrapper device={device}>
              <CommentIcon
                width={device === 'mobile' ? 18 : device === 'tablet' ? 24 : 28}
                height={
                  device === 'mobile' ? 18 : device === 'tablet' ? 24 : 28
                }
                fill={theme.colors.primary}
              />
              <FeatureTitle device={device}>한 줄 코멘트</FeatureTitle>
            </FeatureTitleWrapper>
            <Description device={device}>
              <p>다른 유저의 코멘트에서 얻는 새로운 관점,</p>
              <p>
                서로의 생각을 공유하며 같은 글도 다르게 읽는 경험을 해보세요.
              </p>
              <p>코멘트로 다양한 뉴스레터에 대한 궁금증도 해소할 수 있어요!</p>
            </Description>
          </TextSection>
        </FeatureItem>
      </ContentWrapper>
    </Container>
  );
};

export default ChallengeDetail;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => {
    if (device === 'mobile') return '400px';
    return device === 'tablet' ? '760px' : '1084px';
  }};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '84px' : '108px')};
  flex-direction: column;
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '48px' : '120px')};
  flex-direction: column;
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

const FeatureItem = styled.article<{
  device: Device;
  imagePosition: 'left' | 'right';
}>`
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '32px' : '48px')};
  flex-direction: ${({ imagePosition, device }) => {
    if (device === 'mobile') return 'column';
    return imagePosition === 'left' ? 'row' : 'row-reverse';
  }};
  align-items: center;
  justify-content: ${({ device }) =>
    device === 'mobile' ? 'center' : 'space-between'};
`;

const TextSection = styled.div<{
  device: Device;
}>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '32px')};
  flex-direction: column;
  align-items: flex-start;
`;

const FeatureTitleWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: 4px;
  flex-direction: ${({ device }) =>
    device === 'mobile' ? 'row-reverse' : 'row'};
  align-items: center;
  justify-content: ${({ device }) =>
    device === 'mobile' ? 'center' : 'flex-start'};
`;

const FeatureTitle = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) => {
    if (device === 'mobile') return theme.fonts.heading5;
    return device === 'tablet' ? theme.fonts.heading4 : theme.fonts.heading3;
  }};
`;

const Description = styled.div<{
  device: Device;
}>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '4px' : '8px')};
  flex-direction: column;
  align-items: ${({ device }) =>
    device === 'mobile' ? 'center' : 'flex-start'};

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) => {
    if (device === 'mobile') return theme.fonts.body3;
    return device === 'tablet' ? theme.fonts.body1 : theme.fonts.bodyLarge;
  }};
  text-align: ${({ device }) => (device === 'mobile' ? 'center' : 'left')};
`;

const ImageSection = styled.div<{ device: Device }>`
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: auto;
    max-width: ${({ device }) => {
      if (device === 'mobile') return '280px';
      return device === 'tablet' ? '320px' : '480px';
    }};
    border-radius: 16px;

    filter: drop-shadow(0 10px 15px rgb(0 0 0 / 10%))
      drop-shadow(0 4px 6px rgb(0 0 0 / 10%));
  }
`;

const CommentImageWrapper = styled.div`
  width: 100%;
  min-height: 250px;

  display: flex;
  flex-direction: column;
`;

const CommentImage = styled.img<{ offset: number }>`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 24px rgb(0 0 0 / 4%);

  transform: ${({ offset }) => {
    const translateY = offset * 14;
    const translateX = offset % 2 === 0 ? 20 : -20;
    return `translate(${translateX}px, ${translateY}px)`;
  }};
`;
