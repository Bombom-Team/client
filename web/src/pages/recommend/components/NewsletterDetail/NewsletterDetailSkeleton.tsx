import {
  Container,
  FixedWrapper,
  InfoBox,
  InfoWrapper,
  NewsletterInfo,
  ScrollableWrapper,
  TitleWrapper,
} from './NewsletterDetail';
import NewsletterTabs from './NewsletterTabs';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';

const NewsletterDetailSkeleton = () => {
  const deviceType = useDevice();
  const isMobile = deviceType === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <FixedWrapper isMobile={isMobile}>
        <InfoWrapper isMobile={isMobile}>
          <Skeleton
            width={isMobile ? '5.5rem' : '6.5rem'}
            height={isMobile ? '5.5rem' : '6.5rem'}
            borderRadius={isMobile ? '0.75rem' : '1rem'}
          />
          <InfoBox>
            <TitleWrapper isMobile={isMobile}>
              <Skeleton width="60%" height={isMobile ? '1.25rem' : '1.5rem'} />
            </TitleWrapper>

            <NewsletterInfo isMobile={isMobile}>
              <Skeleton
                width="3.75rem"
                height={isMobile ? '1rem' : '1.125rem'}
              />
              <Skeleton width="5rem" height={isMobile ? '1rem' : '1.125rem'} />
            </NewsletterInfo>
          </InfoBox>
        </InfoWrapper>

        <Skeleton
          width="60%"
          height={isMobile ? '1.75rem' : '2.25rem'}
          maxWidth="25rem"
          borderRadius="0.75rem"
          alignSelf="center"
        />
      </FixedWrapper>

      <NewsletterTabs activeTab="detail" onTabChange={() => {}} />

      <ScrollableWrapper isMobile={isMobile}>
        <Skeleton width="100%" height={isMobile ? '15rem' : '100%'} />
      </ScrollableWrapper>
    </Container>
  );
};

export default NewsletterDetailSkeleton;
