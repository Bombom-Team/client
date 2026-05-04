import {
  HeroSection,
  InfoBox,
  InfoWrapper,
  Layout,
  Main,
  NewsletterInfo,
  TitleWrapper,
} from './NewsletterDetailPage';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';

const NewsletterDetailPageSkeleton = () => {
  const deviceType = useDevice();
  const isMobile = deviceType === 'mobile';

  return (
    <Layout isMobile={isMobile}>
      <Main>
        <HeroSection isMobile={isMobile}>
          <InfoWrapper isMobile={isMobile}>
            <Skeleton
              width={isMobile ? '88px' : '104px'}
              height={isMobile ? '88px' : '104px'}
              borderRadius={isMobile ? '12px' : '16px'}
            />
            <InfoBox>
              <TitleWrapper isMobile={isMobile}>
                <Skeleton width="60%" height={isMobile ? '20px' : '24px'} />
              </TitleWrapper>

              <NewsletterInfo>
                <Skeleton width="60px" height={isMobile ? '16px' : '18px'} />
                <Skeleton width="80px" height={isMobile ? '16px' : '18px'} />
              </NewsletterInfo>
            </InfoBox>
          </InfoWrapper>

          <Skeleton
            width="60%"
            height={isMobile ? '28px' : '36px'}
            maxWidth="400px"
            borderRadius="12px"
            alignSelf="center"
          />
        </HeroSection>

        <Skeleton width="100%" height={isMobile ? '120px' : '160px'} />
        <Skeleton width="100%" height={isMobile ? '200px' : '280px'} />
      </Main>
    </Layout>
  );
};

export default NewsletterDetailPageSkeleton;
