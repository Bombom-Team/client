import {
  HeroSection,
  InfoBox,
  InfoWrapper,
  Layout,
  Main,
  NewsletterInfo,
  TitleWrapper,
} from './NewsletterDetailDesktop';
import Skeleton from '@/components/Skeleton/Skeleton';

const NewsletterDetailDesktopSkeleton = () => {
  return (
    <Layout>
      <Main>
        <HeroSection>
          <InfoWrapper>
            <Skeleton width="104px" height="104px" borderRadius="16px" />
            <InfoBox>
              <TitleWrapper>
                <Skeleton width="60%" height="24px" />
              </TitleWrapper>

              <NewsletterInfo>
                <Skeleton width="60px" height="18px" />
                <Skeleton width="80px" height="18px" />
              </NewsletterInfo>
            </InfoBox>
          </InfoWrapper>

          <Skeleton
            width="60%"
            height="36px"
            maxWidth="400px"
            borderRadius="12px"
            alignSelf="center"
          />
        </HeroSection>

        <Skeleton width="100%" height="160px" />
        <Skeleton width="100%" height="280px" />
      </Main>
    </Layout>
  );
};

export default NewsletterDetailDesktopSkeleton;
