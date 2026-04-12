import styled from '@emotion/styled';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import DetailTab from './DetailTab';
import { openSubscribeLink } from './NewsletterDetail.utils';
import NewsletterTabs from './NewsletterTabs';
import PreviousTab from './PreviousTab';
import { queries } from '@/apis/queries';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import { useSearchParamState } from '@/hooks/useSearchParamState';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { openExternalLink } from '@/utils/externalLink';
import type { NewsletterTab } from './NewsletterDetail.types';
import HomeIcon from '#/assets/svg/home.svg';
import InfoIcon from '#/assets/svg/info-circle.svg';

interface NewsletterDetailProps {
  newsletterId: number;
}

const NewsletterDetail = ({ newsletterId }: NewsletterDetailProps) => {
  const deviceType = useDevice();
  const { userProfile, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useSearchParamState<NewsletterTab>('tab', {
    defaultValue: 'detail',
  });

  const { data: newsletterDetail } = useSuspenseQuery(
    queries.newsletterDetail({ id: newsletterId }),
  );
  const { data: previousArticles } = useQuery({
    ...queries.previousArticles({ newsletterId, limit: 10 }),
  });

  const isMobile = deviceType === 'mobile';

  if (!newsletterDetail || !newsletterId) return null;

  const openMainSite = () => {
    openExternalLink(newsletterDetail.mainPageUrl);
  };

  const getSubscribeButtonText = () => {
    if (!isLoggedIn) return '로그인 후 구독할 수 있어요';
    if (newsletterDetail.isSubscribed) {
      return '구독 중';
    } else {
      return '구독 하기';
    }
  };

  const handleSubscribeButtonClick = () => {
    trackEvent({
      category: 'Newsletter',
      action: '구독하기 버튼 클릭',
      label: newsletterDetail.name,
    });
    openSubscribeLink(
      newsletterDetail.subscribeUrl,
      newsletterDetail.name,
      userProfile,
    );
  };

  const newsletterSummary = `${newsletterDetail.name}, ${newsletterDetail.category} 카테고리, ${newsletterDetail.issueCycle} 발행. ${newsletterDetail.description}`;

  return (
    <Container isMobile={isMobile}>
      <VisuallyHidden aria-label={newsletterSummary}>
        뉴스레터 정보
      </VisuallyHidden>
      <FixedWrapper isMobile={isMobile}>
        <InfoWrapper isMobile={isMobile} aria-hidden="true">
          <NewsletterImage
            src={newsletterDetail.imageUrl}
            alt=""
            isMobile={isMobile}
          />
          <InfoBox>
            <TitleWrapper isMobile={isMobile}>
              <NewsletterTitle isMobile={isMobile}>
                {newsletterDetail.name}
              </NewsletterTitle>
              <DetailLink
                onClick={openMainSite}
                isMobile={isMobile}
                aria-description="클릭 시 뉴스레터 공식 페이지로 이동합니다."
              >
                <StyledHomeIcon isMobile={isMobile} aria-hidden="true" />
              </DetailLink>
            </TitleWrapper>

            <NewsletterInfo isMobile={isMobile}>
              <StyledBadge
                text={newsletterDetail.category}
                isMobile={isMobile}
              />
              <IssueCycle>{`${newsletterDetail.issueCycle} 발행`}</IssueCycle>
            </NewsletterInfo>
          </InfoBox>
        </InfoWrapper>

        {newsletterDetail.subscribeMethod && (
          <SubscribeMethodInfo isMobile={isMobile}>
            <StyledInfoIcon isMobile={isMobile} />
            {newsletterDetail.subscribeMethod}
          </SubscribeMethodInfo>
        )}

        <SubscribeButton
          onClick={handleSubscribeButtonClick}
          disabled={
            !isLoggedIn || (isLoggedIn && newsletterDetail.isSubscribed)
          }
          isMobile={isMobile}
        >
          {getSubscribeButtonText()}
        </SubscribeButton>
      </FixedWrapper>

      <NewsletterTabs
        activeTab={activeTab as NewsletterTab}
        onTabChange={(newTab) => setActiveTab(newTab)}
      />

      <ScrollableWrapper isMobile={isMobile}>
        {activeTab === 'detail' && (
          <DetailTab
            newsletterDescription={newsletterDetail.description}
            newsletterId={newsletterId}
            isSubscribed={newsletterDetail.isSubscribed}
            isMobile={isMobile}
          />
        )}

        {activeTab === 'previous' && (
          <PreviousTab
            previousArticles={previousArticles}
            newsletterName={newsletterDetail.name}
            previousNewsletterUrl={newsletterDetail.previousNewsletterUrl}
            newsletterSubscribeUrl={newsletterDetail.subscribeUrl}
            isMobile={isMobile}
          />
        )}
      </ScrollableWrapper>
    </Container>
  );
};

export default NewsletterDetail;

export const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '100%' : '45rem')};
  height: 100%;

  display: flex;
  flex-direction: column;

  word-break: keep-all;
`;

const VisuallyHidden = styled.button`
  overflow: hidden;
  position: absolute;
  width: 0.0625rem;
  height: 0.0625rem;
  margin: -0.0625rem;
  padding: 0;
  border: none;
  border-width: 0;

  background: none;
  white-space: nowrap;

  clip: rect(0, 0, 0, 0);

  &:focus {
    outline: none;
  }
`;

export const FixedWrapper = styled.div<{ isMobile: boolean }>`
  padding-bottom: ${({ isMobile }) => (isMobile ? '1rem' : '1.5rem')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '1rem' : '1.5rem')};
  flex-direction: column;
`;

export const ScrollableWrapper = styled.div<{ isMobile: boolean }>`
  height: ${({ isMobile }) => (isMobile ? 'auto' : '28.125rem')};
  margin-right: -1rem;
  padding: 0.5rem;

  overflow-y: auto;
  scrollbar-gutter: stable;
`;

export const InfoWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '0.75rem' : '1rem')};
  align-items: center;
  justify-content: center;
`;

const NewsletterImage = styled(ImageWithFallback, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '5.5rem' : '6.5rem')};
  height: ${({ isMobile }) => (isMobile ? '5.5rem' : '6.5rem')};
  border-radius: ${({ isMobile }) => (isMobile ? '0.75rem' : '1rem')};

  flex-shrink: 0;

  object-fit: cover;
`;

export const InfoBox = styled.div`
  width: 100%;

  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

export const TitleWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '0.25rem' : '0.5rem')};
`;

const NewsletterTitle = styled.h2<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading4 : theme.fonts.heading3};
`;

const StyledHomeIcon = styled(HomeIcon)<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '1.25rem' : '1.5rem')};
  height: ${({ isMobile }) => (isMobile ? '1.25rem' : '1.5rem')};

  fill: ${({ theme }) => theme.colors.primary};
`;

const StyledInfoIcon = styled(InfoIcon)<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '1.25rem' : '1.5rem')};
  height: ${({ isMobile }) => (isMobile ? '1.25rem' : '1.5rem')};

  fill: ${({ theme }) => theme.colors.primary};
`;

const SubscribeMethodInfo = styled.div<{ isMobile: boolean }>`
  padding: 0.8rem 1rem;
  border-radius: 1rem;

  display: flex;
  gap: 0.75rem;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

export const NewsletterInfo = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: center;

  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const StyledBadge = styled(Badge)<{ isMobile: boolean }>`
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const IssueCycle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const DetailLink = styled.button<{ isMobile: boolean }>`
  display: flex;
  gap: 0.25rem;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};

  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

const SubscribeButton = styled(Button)<{ isMobile: boolean }>`
  width: 100%;
  max-width: 400px;

  align-self: center;

  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.heading6};
`;
