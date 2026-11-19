import { Button } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import HighlightedText from './HighlightedText';
import { queries } from '@/apis/queries';
import { openExternalLink } from '@/utils/externalLink';

export type RegisteredCardVariant = 'card' | 'tinted' | 'row';

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
  const { data: detail } = useQuery(
    queries.newsletterDetail({ id: newsletterId }),
  );

  const displayName = detail?.name ?? name ?? '';
  const thumbnailUrl = detail?.imageUrl ?? imageUrl ?? null;
  const meta = [detail?.category, detail?.issueCycle]
    .filter(Boolean)
    .join(' · ');
  const subscribeUrl = detail?.subscribeUrl;
  const isRow = variant === 'row';

  const goToDetail = () => {
    navigate({
      to: '/newsletters/$newsletterId',
      params: { newsletterId: String(newsletterId) },
    });
  };

  const openSubscribePage = () => {
    if (subscribeUrl) openExternalLink(subscribeUrl);
  };

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
              {[meta, detail?.description].filter(Boolean).join(' · ')}
            </Meta>
          ) : (
            meta && <Meta>{meta}</Meta>
          )}
        </InfoText>
        {isRow && (
          <RowActions>
            <ActionButton variant="outlined" onClick={goToDetail}>
              자세히
            </ActionButton>
            {subscribeUrl && (
              <ActionButton onClick={openSubscribePage}>구독하기</ActionButton>
            )}
          </RowActions>
        )}
      </InfoRow>
      {!isRow && detail?.description && (
        <Description>{detail.description}</Description>
      )}
      {!isRow && (
        <ActionGrid hasSubscribe={Boolean(subscribeUrl)}>
          <ActionButton variant="outlined" onClick={goToDetail}>
            자세히 보기
          </ActionButton>
          {subscribeUrl && (
            <ActionButton onClick={openSubscribePage}>
              구독하러 가기
            </ActionButton>
          )}
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
