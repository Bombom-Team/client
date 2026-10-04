import styled from '@emotion/styled';
import { NEWSLETTER_REQUEST_STATUS_LABELS } from '@/types/newsletterRequest';
import type {
  NewsletterRequest,
  NewsletterRequestStatus,
} from '@/types/newsletterRequest';
import type { Theme } from '@emotion/react';
import HeartFilledIcon from '#/assets/svg/heart-filled.svg';
import HeartIcon from '#/assets/svg/heart.svg';

interface NewsletterRequestItemProps {
  request: NewsletterRequest;
  onSupportToggle: (request: NewsletterRequest) => void;
  isSupportPending: boolean;
}

const NewsletterRequestItem = ({
  request,
  onSupportToggle,
  isSupportPending,
}: NewsletterRequestItemProps) => {
  const canSupport =
    request.status === 'RECEIVED' || request.status === 'REVIEWING';
  const showSupportButton = canSupport && !request.mine;

  return (
    <Container>
      <Thumbnail>
        {request.imageUrl ? (
          <ThumbnailImage src={request.imageUrl} alt="" />
        ) : (
          request.name.replace(/\s/g, '').slice(0, 2)
        )}
      </Thumbnail>
      <InfoWrapper>
        <Name>{request.name}</Name>
        <Meta>
          {request.categoryName ?? '정보 수집 중'} · 신청{' '}
          {request.supporterCount}명
        </Meta>
      </InfoWrapper>
      {showSupportButton ? (
        <SupportButton
          type="button"
          supported={request.supported}
          aria-pressed={request.supported}
          disabled={isSupportPending}
          onClick={() => onSupportToggle(request)}
        >
          {request.supported ? (
            <HeartFilledIcon width={12} height={12} />
          ) : (
            <HeartIcon width={12} height={12} />
          )}
          나도
        </SupportButton>
      ) : (
        <StatusBadge status={request.status}>
          {NEWSLETTER_REQUEST_STATUS_LABELS[request.status]}
        </StatusBadge>
      )}
    </Container>
  );
};

export default NewsletterRequestItem;

const Container = styled.li`
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  display: grid;
  gap: 12px;
  align-items: center;

  grid-template-columns: 44px minmax(0, 1fr) auto;

  &:last-of-type {
    border-bottom: none;
  }
`;

const Thumbnail = styled.div`
  overflow: hidden;
  width: 44px;
  height: 44px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;
`;

const InfoWrapper = styled.div`
  min-width: 0;

  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const Name = styled.span`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const SupportButton = styled.button<{ supported: boolean }>`
  padding: 4px 12px;
  border: 1px solid
    ${({ theme, supported }) =>
      supported ? theme.colors.primaryBomBom : theme.colors.stroke};
  border-radius: 999px;

  display: flex;
  gap: 4px;
  align-items: center;

  background-color: ${({ theme, supported }) =>
    supported ? theme.colors.primaryInfo : theme.colors.white};
  color: ${({ theme, supported }) =>
    supported ? theme.colors.primaryBomBom : theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Bold};

  &:disabled {
    opacity: 0.6;
  }
`;

const getStatusColors = (theme: Theme, status: NewsletterRequestStatus) => {
  switch (status) {
    case 'REVIEWING':
      return {
        background: theme.colors.primaryInfo,
        color: theme.colors.primaryDark,
      };
    case 'APPROVED':
      return {
        background: `${theme.colors.success}1A`,
        color: theme.colors.success,
      };
    case 'REJECTED':
      return {
        background: theme.colors.dividers,
        color: theme.colors.disabledText,
      };
    default:
      return {
        background: theme.colors.dividers,
        color: theme.colors.textSecondary,
      };
  }
};

const StatusBadge = styled.span<{ status: NewsletterRequestStatus }>`
  padding: 4px 8px;
  border-radius: 8px;

  background-color: ${({ theme, status }) =>
    getStatusColors(theme, status).background};
  color: ${({ theme, status }) => getStatusColors(theme, status).color};
  font: ${({ theme }) => theme.fonts.t3Bold};
  white-space: nowrap;
`;
