import { Button } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import HighlightedText from './HighlightedText';
import { queries } from '@/apis/queries';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { openSubscribeLink } from '@/pages/newsletter-detail/utils';

export type RegisteredCardVariant = 'card' | 'tinted' | 'row';

const MAEIL_MAIL_URL = 'https://maeilmail.bombom.news';

interface RegisteredNewsletterCardProps {
  newsletterId: number;
  name?: string;
  imageUrl?: string | null;
  keyword?: string;
  variant?: RegisteredCardVariant;
}

// 이미 봄봄에 있는 뉴스레터를 신청 흐름 안에서 보여주고, 상세 이동이나 구독까지 바로 할 수 있게 한다.
const RegisteredNewsletterCard = ({
  newsletterId,
  name,
  imageUrl,
  keyword = '',
  variant = 'card',
}: RegisteredNewsletterCardProps) => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const {
    data: detail,
    isPending,
    isError,
  } = useQuery(queries.newsletterDetail({ id: newsletterId }));

  const displayName = detail?.name ?? name ?? '';
  const thumbnailUrl = detail?.imageUrl ?? imageUrl ?? null;
  const meta = [detail?.category, detail?.issueCycle]
    .filter(Boolean)
    .join(' · ');
  const isRow = variant === 'row';
  const isMaeilMail = detail?.source === 'MAEIL_MAIL';
  const canSubscribe = Boolean(
    detail && !detail.isSubscribed && (isMaeilMail || detail.subscribeUrl),
  );
  const hasSubscribeAction = Boolean(detail?.isSubscribed) || canSubscribe;

  const goToDetail = () => {
    navigate({
      to: '/newsletters/$newsletterId',
      params: { newsletterId: String(newsletterId) },
    });
  };

  // 상세 화면의 구독 버튼과 같은 경로로 연다. 봄봄 이메일로 구독해야 뉴스레터가 봄봄에 도착한다.
  const subscribe = () => {
    if (!detail) return;
    trackEvent({
      category: 'Newsletter',
      action: '구독하기 버튼 클릭',
      label: detail.name,
    });
    if (isMaeilMail) {
      navigate({ href: MAEIL_MAIL_URL });
      return;
    }
    openSubscribeLink(detail.subscribeUrl, detail.name, userProfile);
  };

  const detailLabel = displayName
    ? `${displayName} 자세히 보기`
    : '뉴스레터 자세히 보기';

  if (isPending) {
    return (
      <Container variant={variant} aria-busy="true">
        <InfoRow>
          <Skeleton
            width={isRow ? '52px' : '48px'}
            height={isRow ? '52px' : '48px'}
            borderRadius="12px"
          />
          <InfoText>
            <Skeleton width="60%" height="18px" />
            <Skeleton width="40%" height="14px" />
          </InfoText>
        </InfoRow>
        {!isRow && <Skeleton width="100%" height="44px" borderRadius="8px" />}
      </Container>
    );
  }

  // 상세를 못 불러와도 이미 있다는 사실과 상세 이동은 남긴다.
  if (isError || !detail) {
    return (
      <Container variant={variant}>
        <Name>{displayName || '이미 봄봄에 있는 뉴스레터예요'}</Name>
        <ActionButton
          variant="outlined"
          onClick={goToDetail}
          aria-label={detailLabel}
        >
          자세히 보기
        </ActionButton>
      </Container>
    );
  }

  const subscribeButton = detail.isSubscribed ? (
    <ActionButton disabled>구독 중</ActionButton>
  ) : (
    canSubscribe && (
      <ActionButton
        onClick={subscribe}
        aria-label={`${detail.name} 구독하러 가기`}
      >
        {isRow ? '구독하기' : '구독하러 가기'}
      </ActionButton>
    )
  );

  return (
    <Container variant={variant}>
      <InfoRow>
        <Thumbnail isRow={isRow}>
          {thumbnailUrl ? (
            <img src={thumbnailUrl} alt="" />
          ) : (
            <span aria-hidden="true">{displayName.slice(0, 1)}</span>
          )}
        </Thumbnail>
        <InfoText>
          <Name>
            <HighlightedText text={displayName} keyword={keyword} />
          </Name>
          {isRow ? (
            <Meta isEllipsis>
              {[meta, detail.description].filter(Boolean).join(' · ')}
            </Meta>
          ) : (
            meta && <Meta>{meta}</Meta>
          )}
        </InfoText>
        {isRow && (
          <RowActions>
            <ActionButton
              variant="outlined"
              onClick={goToDetail}
              aria-label={detailLabel}
            >
              자세히
            </ActionButton>
            {subscribeButton}
          </RowActions>
        )}
      </InfoRow>
      {!isRow && detail.description && (
        <Description>{detail.description}</Description>
      )}
      {!isRow && (
        <ActionGrid hasSubscribe={hasSubscribeAction}>
          <ActionButton
            variant="outlined"
            onClick={goToDetail}
            aria-label={detailLabel}
          >
            자세히 보기
          </ActionButton>
          {subscribeButton}
        </ActionGrid>
      )}
    </Container>
  );
};

export default RegisteredNewsletterCard;

const Container = styled.div<{ variant: RegisteredCardVariant }>`
  padding: ${({ variant }) => (variant === 'row' ? '12px' : '14px')};
  border: 1px solid
    ${({ theme, variant }) =>
      variant === 'card' ? theme.colors.dividers : theme.colors.primaryLight};
  border-radius: ${({ variant }) => (variant === 'row' ? '12px' : '16px')};

  display: flex;
  gap: 12px;
  flex-direction: column;

  background-color: ${({ theme, variant }) =>
    variant === 'card' ? theme.colors.white : theme.colors.primaryInfo};
`;

const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Thumbnail = styled.div<{ isRow: boolean }>`
  overflow: hidden;
  width: ${({ isRow }) => (isRow ? '52px' : '48px')};
  height: ${({ isRow }) => (isRow ? '52px' : '48px')};
  border-radius: 12px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ theme }) => theme.fonts.t7Bold};

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }
`;

const InfoText = styled.div`
  min-width: 0;

  display: flex;
  gap: 2px;
  flex: 1;
  flex-direction: column;
`;

const Name = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};

  overflow-wrap: anywhere;
`;

const Meta = styled.span<{ isEllipsis?: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};

  ${({ isEllipsis }) =>
    isEllipsis &&
    `
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `}
`;

const Description = styled.p`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const ActionGrid = styled.div<{ hasSubscribe: boolean }>`
  display: grid;
  gap: 8px;

  grid-template-columns: ${({ hasSubscribe }) =>
    hasSubscribe ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)'};
`;

const RowActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const ActionButton = styled(Button)`
  min-height: 44px;
  padding: 0 14px;

  font: ${({ theme }) => theme.fonts.t5Bold};
`;
