import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import DetailCard from './DetailCard';
import Flex from '@/components/Flex';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { DetailCardProps } from './DetailCard';
import commentCard1 from '#/assets/avif/challenge-comment1.avif';
import commentCard2 from '#/assets/avif/challenge-comment2.avif';
import commentCard3 from '#/assets/avif/challenge-comment3.avif';
import challengeDashboard from '#/assets/avif/challenge-dashboard.avif';
import dailyGuideImage from '#/assets/avif/landing-dailyguide.avif';
import CommentIcon from '#/assets/svg/comment.svg';
import RoadSignIcon from '#/assets/svg/road-sign.svg';
import SproutIcon from '#/assets/svg/sprout-stroke.svg';

type Detail = DetailCardProps;

const ChallengeDetail = () => {
  const device = useDevice();
  const iconSize = device === 'mobile' ? 18 : device === 'tablet' ? 24 : 28;

  const DETAILS: Detail[] = [
    {
      icon: (
        <RoadSignIcon
          width={iconSize}
          height={iconSize}
          color={theme.colors.primary}
        />
      ),
      title: '데일리 가이드',
      description:
        '뉴스레터 읽기를 이끄는 하루 한 가지 문구,\n매일 새로운 가이드로 단순한 읽기를 깊이 있는 사색으로 전환하세요.\n한 달 후, 작지만 확실한 변화를 만날 수 있어요.',
      imageContent: <img src={dailyGuideImage} alt="데일리 가이드" />,
      imagePosition: 'left',
    },
    {
      icon: (
        <SproutIcon
          width={iconSize}
          height={iconSize}
          color={theme.colors.primary}
        />
      ),
      title: '챌린지 현황판',
      description:
        '참여 팀들의 챌린지 현황을 한눈에 확인하고\n꾸준히 이어가는 원동력을 얻어요.\n다른 팀과 경쟁하며 우리 팀의 달성률에 기여해 보세요!',
      imageContent: <img src={challengeDashboard} alt="챌린지 현황판" />,
      imagePosition: 'right',
    },
    {
      icon: (
        <CommentIcon
          width={iconSize}
          height={iconSize}
          fill={theme.colors.primary}
        />
      ),
      title: '한 줄 코멘트',
      description:
        '다른 유저의 코멘트에서 얻는 새로운 관점을 얻어요.\n서로의 생각을 공유하며 같은 글도 다르게 읽히는 경험을 해보세요.\n코멘트로 다양한 뉴스레터에 대한 궁금증도 해소해 보세요!',
      imageContent: (isVisible) => (
        <CommentImageWrapper>
          <CommentImage
            isVisible={isVisible}
            src={commentCard1}
            alt="코멘트1"
            offset={1}
          />
          <CommentImage
            isVisible={isVisible}
            src={commentCard2}
            alt="코멘트2"
            offset={2}
          />
          <CommentImage
            isVisible={isVisible}
            src={commentCard3}
            alt="코멘트3"
            offset={3}
          />
        </CommentImageWrapper>
      ),
      imagePosition: 'left',
    },
  ];

  return (
    <Container device={device}>
      <Title device={device}>
        챌린지, <Highlight>이렇게</Highlight> 구성돼요
      </Title>
      <ContentWrapper
        device={device}
        gap={device === 'mobile' ? 84 : 210}
        direction="column"
      >
        {DETAILS.map((feature) => (
          <DetailCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            imageContent={feature.imageContent}
            imagePosition={feature.imagePosition}
          />
        ))}
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
  gap: ${({ device }) => (device === 'mobile' ? '64px' : '84px')};
  flex-direction: column;
`;

const ContentWrapper = styled(Flex)<{ device: Device }>`
  width: 100%;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading2};
  text-align: center;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const CommentImageWrapper = styled.div`
  width: 100%;
  min-height: 210px;
  max-width: 80%;
  padding-top: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CommentImage = styled.img<{ offset: number; isVisible: boolean }>`
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 10px 24px rgb(0 0 0 / 4%);

  animation: ${({ isVisible }) =>
    isVisible ? 'fade-in 0.4s ease forwards' : 'none'};

  animation-delay: ${({ offset }) => offset * 0.2}s;

  opacity: 0;

  transform: ${({ offset }) => {
    const translateY = offset * 14;
    const translateX = offset % 2 === 0 ? 20 : -20;
    return `translate(${translateX}px, ${translateY}px)`;
  }};

  @keyframes fade-in {
    to {
      opacity: 1;
    }
  }
`;
