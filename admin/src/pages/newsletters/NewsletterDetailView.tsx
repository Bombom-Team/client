import styled from '@emotion/styled';
import {
  NEWSLETTER_PREVIOUS_STRATEGY_LABELS,
  type NewsletterDetail,
} from '@/types/newsletter';

interface NewsletterDetailViewProps {
  newsletter: NewsletterDetail;
  children?: React.ReactNode;
}

const NewsletterDetailView = ({
  newsletter,
  children,
}: NewsletterDetailViewProps) => {
  const detailItems: Array<{
    label: string;
    value: string | number | boolean | null | undefined;
  }> = [
    { label: '카테고리', value: newsletter.categoryName },
    { label: '발행 주기', value: newsletter.issueCycle },
    { label: '구독자 수', value: newsletter.subscriptionCount },
    { label: '발신자', value: newsletter.sender },
    { label: '이메일', value: newsletter.email },
    { label: '메인 페이지', value: newsletter.mainPageUrl },
    { label: '구독 URL', value: newsletter.subscribeUrl },
    { label: '구독 방법', value: newsletter.subscribeMethod },
    { label: '지난호 URL', value: newsletter.previousNewsletterUrl },
    {
      label: '지난호 노출 여부',
      value: newsletter.previousAllowed,
    },
    {
      label: '지난호 전략',
      value: newsletter.previousStrategy
        ? NEWSLETTER_PREVIOUS_STRATEGY_LABELS[newsletter.previousStrategy]
        : undefined,
    },
    { label: '지난호 고정 노출 수', value: newsletter.previousFixedCount },
    { label: '지난호 최근 노출 수', value: newsletter.previousRecentCount },
    {
      label: '지난호 노출 비율(%)',
      value: newsletter.previousExposureRatio,
    },
  ];

  const renderValue = (
    value: string | number | boolean | null | undefined,
  ) => {
    if (value === undefined || value === null || value === '') {
      return '-';
    }
    if (typeof value === 'boolean') {
      return value ? '예' : '아니오';
    }
    return value.toString();
  };

  return (
    <Container>
      <Header>
        {newsletter.imageUrl ? (
          <Thumbnail
            src={newsletter.imageUrl}
            alt={`${newsletter.name ?? '뉴스레터'} 이미지`}
          />
        ) : (
          <ThumbnailFallback>이미지</ThumbnailFallback>
        )}
        <HeaderInfo>
          <Title>{newsletter.name ?? '뉴스레터 이름 없음'}</Title>
          <Subtitle>{newsletter.categoryName ?? '-'}</Subtitle>
        </HeaderInfo>
      </Header>

      <Section>
        <SectionTitle>설명</SectionTitle>
        <Description>{newsletter.description ?? '-'}</Description>
      </Section>

      <InfoGrid>
        {detailItems.map((item) => {
          const displayValue = renderValue(item.value);
          const isLink =
            typeof item.value === 'string' && item.value.startsWith('http');

          return (
            <InfoItem key={item.label}>
              <InfoLabel>{item.label}</InfoLabel>
              {isLink ? (
                <InfoLink
                  href={item.value as string}
                  target="_blank"
                  rel="noreferrer"
                >
                  {displayValue}
                </InfoLink>
              ) : (
                <InfoValue>{displayValue}</InfoValue>
              )}
            </InfoItem>
          );
        })}
      </InfoGrid>

      {children}
    </Container>
  );
};

export default NewsletterDetailView;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const Thumbnail = styled.img`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  object-fit: cover;
`;

const ThumbnailFallback = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const HeaderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Title = styled.h1`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
`;

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray800};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const Description = styled.p`
  margin: 0;
  white-space: pre-wrap;

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.6;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};

  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const InfoItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.fontSize.sm};
  word-break: break-all;
`;

const InfoLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  word-break: break-all;
  text-decoration: underline;
`;
