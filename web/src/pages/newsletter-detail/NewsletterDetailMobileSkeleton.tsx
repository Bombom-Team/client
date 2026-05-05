import {
  Container,
  HeroSection,
  InfoBox,
  InfoWrapper,
  NewsletterInfo,
  TitleWrapper,
} from './NewsletterDetailMobile';
import Skeleton from '@/components/Skeleton/Skeleton';

const NewsletterDetailMobileSkeleton = () => {
  return (
    <Container>
      <HeroSection>
        <InfoWrapper>
          <Skeleton width="88px" height="88px" borderRadius="12px" />
          <InfoBox>
            <TitleWrapper>
              <Skeleton width="60%" height="20px" />
            </TitleWrapper>

            <NewsletterInfo>
              <Skeleton width="60px" height="16px" />
              <Skeleton width="80px" height="16px" />
            </NewsletterInfo>
          </InfoBox>
        </InfoWrapper>

        <Skeleton
          width="60%"
          height="28px"
          maxWidth="400px"
          borderRadius="12px"
          alignSelf="center"
        />
      </HeroSection>

      <Skeleton width="100%" height="44px" />
      <Skeleton width="100%" height="200px" />
    </Container>
  );
};

export default NewsletterDetailMobileSkeleton;
