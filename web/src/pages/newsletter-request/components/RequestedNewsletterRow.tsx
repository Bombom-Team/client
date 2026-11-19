import styled from '@emotion/styled';
import HighlightedText from './HighlightedText';
import {
  getRequestCount,
  NEWSLETTER_REQUEST_STATUS_LABELS,
} from '../utils/newsletterRequestDisplay';
import type { NewsletterRequest } from '@/apis/newsletterRequests/newsletterRequests.api';

interface RequestedNewsletterRowProps {
  request: NewsletterRequest;
  keyword: string;
  isLikePending: boolean;
  onLike: (request: NewsletterRequest) => void;
}

// 내가 낸 신청이나 이미 공감한 신청에는 공감 버튼 대신 상태만 보여준다.
const RequestedNewsletterRow = ({
  request,
  keyword,
  isLikePending,
  onLike,
}: RequestedNewsletterRowProps) => {
  return (
    <Container>
      <Thumbnail>
        {request.imageUrl ? (
          <img src={request.imageUrl} alt="" />
        ) : (
          <span aria-hidden="true">{request.name.slice(0, 1)}</span>
        )}
      </Thumbnail>
      <InfoText>
        <Name>
          <HighlightedText text={request.name} keyword={keyword} />
        </Name>
        <Meta>
          신청 {getRequestCount(request)}명 ·{' '}
          {NEWSLETTER_REQUEST_STATUS_LABELS[request.status]}
        </Meta>
      </InfoText>
      {request.mine && <StatusLabel>내 신청</StatusLabel>}
      {!request.mine && request.liked && <StatusLabel>공감함</StatusLabel>}
      {!request.mine && !request.liked && (
        <LikeButton
          type="button"
          disabled={isLikePending}
          onClick={() => onLike(request)}
        >
          나도 원해요
        </LikeButton>
      )}
    </Container>
  );
};

export default RequestedNewsletterRow;

const Container = styled.div`
  padding: 10px 0;

  display: flex;
  gap: 12px;
  align-items: center;
`;

const Thumbnail = styled.div`
  overflow: hidden;
  width: 40px;
  height: 40px;
  border-radius: 10px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.disabledBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Bold};

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;
  }
`;

const InfoText = styled.div`
  min-width: 0;

  display: flex;
  flex: 1;
  flex-direction: column;
`;

const Name = styled.span`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Bold};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const Meta = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const LikeButton = styled.button`
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid ${({ theme }) => theme.colors.primaryBomBom};
  border-radius: 999px;

  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ theme }) => theme.fonts.t4Bold};

  &:disabled {
    opacity: 0.5;
  }
`;

const StatusLabel = styled.span`
  padding: 4px 10px;
  border-radius: 999px;

  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.disabledBackground};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;
