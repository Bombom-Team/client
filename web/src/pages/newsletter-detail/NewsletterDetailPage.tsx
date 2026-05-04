import styled from '@emotion/styled';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import NewsletterSubscribeGuide from './components/NewsletterSubscribeGuide';
import PreviousArticles from './components/PreviousArticles';
import {
  NEWSLETTER_DETAIL_MAIN_WIDTH,
  NEWSLETTER_DETAIL_SIDE_WIDTH,
} from './constants';
import { openSubscribeLink } from './utils';
import { queries } from '@/apis/queries';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import MobileDetailHeader from '@/components/Header/MobileDetailHeader';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { openExternalLink } from '@/utils/externalLink';
import HomeIcon from '#/assets/svg/home.svg';
import InfoIcon from '#/assets/svg/info-circle.svg';

interface NewsletterDetailPageProps {
  newsletterId: number;
}

const NewsletterDetailPage = ({ newsletterId }: NewsletterDetailPageProps) => {
  const deviceType = useDevice();
  const { userProfile, isLoggedIn } = useAuth();
  const navigate = useNavigate();

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
      {isMobile && (
        <MobileDetailHeader
          right={<HeaderTitle>{newsletterDetail.name}</HeaderTitle>}
        />
      )}
      <Layout isMobile={isMobile}>
        <Main>
          <VisuallyHidden aria-label={newsletterSummary}>
            뉴스레터 정보
          </VisuallyHidden>
          <HeroSection isMobile={isMobile}>
            <InfoWrapper isMobile={isMobile} aria-hidden="true">
              <NewsletterImage
                src={newsletterDetail.imageUrl}
                alt=""
                isMobile={isMobile}
              />
              <InfoBox>
                <TitleWrapper isMobile={isMobile}>
                  <NewsletterTitle>{newsletterDetail.name}</NewsletterTitle>
                  <DetailLink
                    onClick={openMainSite}
                    aria-description="클릭 시 뉴스레터 공식 페이지로 이동합니다."
                  >
                    <StyledHomeIcon isMobile={isMobile} aria-hidden="true" />
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
                <StyledInfoIcon isMobile={isMobile} />
                {newsletterDetail.subscribeMethod}
              </SubscribeMethodInfo>
            )}

            <SubscribeButton
              isMobile={isMobile}
              onClick={handleSubscribeButtonClick}
              disabled={
                !isLoggedIn || (isLoggedIn && newsletterDetail.isSubscribed)
              }
            >
              {getSubscribeButtonText()}
            </SubscribeButton>
          </HeroSection>

          <Section>
            <SectionHeading>뉴스레터 소개</SectionHeading>
            <Description>{newsletterDetail.description}</Description>
          </Section>

          <SectionDivider />

          <Section>
            <SectionHeading>지난 뉴스레터</SectionHeading>
            <PreviousArticles
              previousArticles={previousArticles}
              newsletterName={newsletterDetail.name}
              previousNewsletterUrl={newsletterDetail.previousNewsletterUrl}
              newsletterSubscribeUrl={newsletterDetail.subscribeUrl}
              isMobile={isMobile}
            />
          </Section>
        </Main>

        {!isMobile && (
          <Aside>
            <NewsletterSubscribeGuide />
          </Aside>
        )}
      </Layout>
    </>
  );
};

export default NewsletterDetailPage;

export const Layout = styled.div<{ isMobile: boolean }>`
  width: 100%;
  max-width: ${({ isMobile }) =>
    isMobile
      ? `${NEWSLETTER_DETAIL_MAIN_WIDTH}px`
      : `${NEWSLETTER_DETAIL_MAIN_WIDTH + NEWSLETTER_DETAIL_SIDE_WIDTH + 24}px`};
  margin: 0 auto;

  display: flex;
  gap: 24px;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: flex-start;
`;

export const Main = styled.div`
  width: 100%;
  max-width: ${NEWSLETTER_DETAIL_MAIN_WIDTH}px;
  min-width: 0;

  display: flex;
  gap: 24px;
  flex: 1;
  flex-direction: column;

  word-break: keep-all;
`;

const Aside = styled.aside`
  position: sticky;
  top: calc(
    ${({ theme }) => `${theme.heights.headerPC} + ${theme.safeArea.top}`} + 24px
  );
  width: ${NEWSLETTER_DETAIL_SIDE_WIDTH}px;

  flex-shrink: 0;
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

export const HeroSection = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  flex-direction: column;
`;

const Section = styled.section`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const SectionHeading = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const SectionDivider = styled.hr`
  width: 100%;
  height: 1px;
  border: 0;

  background-color: ${({ theme }) => theme.colors.dividers};
`;

export const InfoWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '16px')};
  align-items: center;
  justify-content: center;
`;

const NewsletterImage = styled(ImageWithFallback, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '88px' : '104px')};
  height: ${({ isMobile }) => (isMobile ? '88px' : '104px')};
  border-radius: ${({ isMobile }) => (isMobile ? '12px' : '16px')};

  flex-shrink: 0;

  object-fit: cover;
`;

export const InfoBox = styled.div`
  width: 100%;

  display: flex;
  gap: 8px;
  flex-direction: column;
`;

export const TitleWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '4px' : '8px')};
`;

const NewsletterTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t11Bold};
`;

const StyledHomeIcon = styled(HomeIcon)<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
  height: ${({ isMobile }) => (isMobile ? '20px' : '24px')};

  fill: ${({ theme }) => theme.colors.primary};
`;

const StyledInfoIcon = styled(InfoIcon)<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
  height: ${({ isMobile }) => (isMobile ? '20px' : '24px')};

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

const SubscribeButton = styled(Button)<{ isMobile: boolean }>`
  width: 100%;
  max-width: 400px;

  align-self: center;

  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t5Regular : theme.fonts.t6Bold};
`;
