import styled from '@emotion/styled';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import NewsletterTabs from './components/NewsletterTabs';
import PreviousArticles from './components/PreviousArticles';
import { openSubscribeLink } from './utils';
import { queries } from '@/apis/queries';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import MobileDetailHeader from '@/components/Header/MobileDetailHeader';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParamState } from '@/hooks/useSearchParamState';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { openExternalLink } from '@/utils/externalLink';
import type { NewsletterTab } from './types';
import HomeIcon from '#/assets/svg/home.svg';
import InfoIcon from '#/assets/svg/info-circle.svg';

interface NewsletterDetailMobileProps {
  newsletterId: number;
}

const NewsletterDetailMobile = ({
  newsletterId,
}: NewsletterDetailMobileProps) => {
  const { userProfile, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useSearchParamState<NewsletterTab>('tab', {
    defaultValue: 'detail',
  });

  const { data: newsletterDetail } = useSuspenseQuery(
    queries.newsletterDetail({ id: newsletterId }),
  );
  const { data: previousArticles } = useQuery({
    ...queries.previousArticles({ newsletterId, limit: 10 }),
  });

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

    if (newsletterDetail.source === 'MAEIL_MAIL') {
      navigate({ href: 'https://maeilmail.bombom.news' });
      return;
    }

    openSubscribeLink(
      newsletterDetail.subscribeUrl,
      newsletterDetail.name,
      userProfile,
    );
  };

  const newsletterSummary = `${newsletterDetail.name}, ${newsletterDetail.category} 카테고리, ${newsletterDetail.issueCycle} 발행. ${newsletterDetail.description}`;

  return (
    <>
      <MobileDetailHeader
        right={<HeaderTitle>{newsletterDetail.name}</HeaderTitle>}
      />
      <Container>
        <VisuallyHidden aria-label={newsletterSummary}>
          뉴스레터 정보
        </VisuallyHidden>
        <HeroSection>
          <InfoWrapper aria-hidden="true">
            <NewsletterImage src={newsletterDetail.imageUrl} alt="" />
            <InfoBox>
              <TitleWrapper>
                <NewsletterTitle>{newsletterDetail.name}</NewsletterTitle>
                <DetailLink
                  onClick={openMainSite}
                  aria-description="클릭 시 뉴스레터 공식 페이지로 이동합니다."
                >
                  <StyledHomeIcon aria-hidden="true" />
                </DetailLink>
              </TitleWrapper>

              <NewsletterInfo>
                <StyledBadge text={newsletterDetail.category} />
                <IssueCycle>{`${newsletterDetail.issueCycle} 발행`}</IssueCycle>
              </NewsletterInfo>
            </InfoBox>
          </InfoWrapper>

          {newsletterDetail.subscribeMethod && (
            <SubscribeMethodInfo>
              <StyledInfoIcon />
              {newsletterDetail.subscribeMethod}
            </SubscribeMethodInfo>
          )}

          <SubscribeButton
            onClick={handleSubscribeButtonClick}
            disabled={
              !isLoggedIn || (isLoggedIn && newsletterDetail.isSubscribed)
            }
          >
            {getSubscribeButtonText()}
          </SubscribeButton>
        </HeroSection>

        <NewsletterTabs
          activeTab={activeTab as NewsletterTab}
          onTabChange={(newTab) => setActiveTab(newTab)}
        />

        <TabContent>
          {activeTab === 'detail' && (
            <Description>{newsletterDetail.description}</Description>
          )}

          {activeTab === 'previous' && (
            <PreviousArticles
              previousArticles={previousArticles}
              newsletterName={newsletterDetail.name}
              previousNewsletterUrl={newsletterDetail.previousNewsletterUrl}
              newsletterSubscribeUrl={newsletterDetail.subscribeUrl}
              isMobile
            />
          )}
        </TabContent>
      </Container>
    </>
  );
};

export default NewsletterDetailMobile;

export const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  word-break: keep-all;
`;

const VisuallyHidden = styled.button`
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
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

const HeaderTitle = styled.h1`
  overflow: hidden;
  flex: 1;
  margin-right: 32px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HeroSection = styled.div`
  padding-bottom: 20px;

  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const TabContent = styled.div`
  padding: 16px 0;

  display: flex;
  flex-direction: column;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

export const InfoWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
`;

const NewsletterImage = styled(ImageWithFallback)`
  width: 88px;
  height: 88px;
  border-radius: 12px;

  flex-shrink: 0;

  object-fit: cover;
`;

export const InfoBox = styled.div`
  width: 100%;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

export const TitleWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const NewsletterTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t11Bold};
`;

const StyledHomeIcon = styled(HomeIcon)`
  width: 20px;
  height: 20px;

  fill: ${({ theme }) => theme.colors.primary};
`;

const StyledInfoIcon = styled(InfoIcon)`
  width: 20px;
  height: 20px;

  fill: ${({ theme }) => theme.colors.primary};
`;

const SubscribeMethodInfo = styled.div`
  padding: 12.8px 16px;
  border-radius: 16px;

  display: flex;
  gap: 12px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

export const NewsletterInfo = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;

  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const StyledBadge = styled(Badge)`
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const IssueCycle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
`;

const DetailLink = styled.button`
  display: flex;
  gap: 4px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
`;

const SubscribeButton = styled(Button)`
  width: 100%;
  max-width: 400px;

  align-self: center;

  font: ${({ theme }) => theme.fonts.t5Regular};
`;
