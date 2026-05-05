import styled from '@emotion/styled';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import NewsletterSubscribeGuide from './components/NewsletterSubscribeGuide';
import PreviousArticles from './components/PreviousArticles';
import {
  NEWSLETTER_DETAIL_MAIN_WIDTH,
  NEWSLETTER_DETAIL_SIDE_GAP,
  NEWSLETTER_DETAIL_SIDE_VISIBLE_MIN_WIDTH,
  NEWSLETTER_DETAIL_SIDE_WIDTH,
} from './constants';
import { useNewsletterHeroActions } from './hooks/useNewsletterHeroActions';
import { queries } from '@/apis/queries';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import HomeIcon from '#/assets/svg/home.svg';
import InfoIcon from '#/assets/svg/info-circle.svg';

interface NewsletterDetailDesktopProps {
  newsletterId: number;
}

const NewsletterDetailDesktop = ({
  newsletterId,
}: NewsletterDetailDesktopProps) => {
  const { data: newsletterDetail } = useSuspenseQuery(
    queries.newsletterDetail({ id: newsletterId }),
  );
  const { data: previousArticles } = useQuery({
    ...queries.previousArticles({ newsletterId, limit: 10 }),
  });

  const {
    subscribeButtonText,
    isSubscribeDisabled,
    openMainSite,
    handleSubscribeButtonClick,
    newsletterSummary,
  } = useNewsletterHeroActions(newsletterDetail);

  if (!newsletterDetail || !newsletterId) return null;

  return (
    <Layout>
      <Main>
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
            disabled={isSubscribeDisabled}
          >
            {subscribeButtonText}
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
            isMobile={false}
          />
        </Section>
      </Main>

      <Aside>
        <NewsletterSubscribeGuide />
      </Aside>
    </Layout>
  );
};

export default NewsletterDetailDesktop;

export const Layout = styled.div`
  position: relative;
  width: 100%;
  max-width: ${NEWSLETTER_DETAIL_MAIN_WIDTH}px;
  margin: 0 auto;
`;

export const Main = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  gap: 24px;
  flex-direction: column;

  word-break: keep-all;
`;

const Aside = styled.aside`
  position: fixed;
  top: calc(
    ${({ theme }) => `${theme.heights.headerPC} + ${theme.safeArea.top}`} + 90px
  );
  left: calc(
    50% + ${NEWSLETTER_DETAIL_MAIN_WIDTH / 2}px +
      ${NEWSLETTER_DETAIL_SIDE_GAP}px
  );
  width: ${NEWSLETTER_DETAIL_SIDE_WIDTH}px;
  max-height: calc(
    100dvh -
      (
        ${({ theme }) => `${theme.heights.headerPC} + ${theme.safeArea.top}`} +
          48px
      )
  );

  overflow-y: auto;

  @media (max-width: ${NEWSLETTER_DETAIL_SIDE_VISIBLE_MIN_WIDTH - 1}px) {
    display: none;
  }
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

export const HeroSection = styled.div`
  display: flex;
  gap: 24px;
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

export const InfoWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
`;

const NewsletterImage = styled(ImageWithFallback)`
  width: 104px;
  height: 104px;
  border-radius: 16px;

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
  gap: 8px;
`;

const NewsletterTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t11Bold};
`;

const StyledHomeIcon = styled(HomeIcon)`
  width: 24px;
  height: 24px;

  fill: ${({ theme }) => theme.colors.primary};
`;

const StyledInfoIcon = styled(InfoIcon)`
  width: 24px;
  height: 24px;

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

  font: ${({ theme }) => theme.fonts.t6Bold};
`;
