import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { openExternalLink } from '@/utils/externalLink';
import type { SubscribedNewsletterResponse } from '@/apis/members/members.api';

interface MySubscriptionCardProps {
  newsletter: SubscribedNewsletterResponse;
  onUnsubscribeRequest: (id: number) => void;
  onRemoveRequest: (id: number) => void;
}

const MySubscriptionCard = ({
  newsletter,
  onUnsubscribeRequest,
  onRemoveRequest,
}: MySubscriptionCardProps) => {
  const [isUrlVisited, setIsUrlVisited] = useState(false);

  const handleExternalLinkClick = () => {
    if (newsletter.unsubscribeUrl) {
      openExternalLink(newsletter.unsubscribeUrl);
      setIsUrlVisited(true);
    }
  };

  const renderActionButton = () => {
    switch (newsletter.status) {
      case 'UNSUBSCRIBING':
        return (
          <ActionButton variant="filled" disabled>
            취소 중...
          </ActionButton>
        );

      case 'UNSUBSCRIBE_FAILED':
        if (!isUrlVisited) {
          return (
            <ActionButton variant="filled" onClick={handleExternalLinkClick}>
              직접 취소하러 가기
            </ActionButton>
          );
        }
        return (
          <ActionButton
            variant="filled"
            onClick={() => onRemoveRequest(newsletter.subscriptionId)}
          >
            해지했습니다 (목록 제거)
          </ActionButton>
        );

      case 'SUBSCRIBED':
      default:
        // unsubscribeUrl이 없을 경우 (구독 취소 미지원)
        if (!newsletter.unsubscribeUrl) {
          return (
            <UnsubscribeInfoText>
              구독 취소를 지원하지 않아요
            </UnsubscribeInfoText>
          );
        }

        return (
          <ActionButton
            variant="filled"
            onClick={() => onUnsubscribeRequest(newsletter.subscriptionId)}
          >
            구독 취소
          </ActionButton>
        );
    }
  };

  return (
    <Container>
      <NewsletterContent>
        <NewsletterImage
          src={newsletter.imageUrl ?? ''}
          alt={newsletter.name}
          width={60}
          height={60}
        />
        <NewsletterInfo>
          <NewsletterName>{newsletter.name}</NewsletterName>
          <NewsletterDescription>
            {newsletter.description}
          </NewsletterDescription>
        </NewsletterInfo>
      </NewsletterContent>
      <ActionWrapper>{renderActionButton()}</ActionWrapper>
    </Container>
  );
};

export default MySubscriptionCard;

const Container = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};

  transition: all 0.2s ease-in-out;
`;

const NewsletterContent = styled.div`
  height: 72px;

  display: flex;
  gap: 12px;
  justify-content: center;
`;

const NewsletterImage = styled(ImageWithFallback)`
  width: 60px;
  height: 60px;
  border-radius: 8px;

  flex-shrink: 0;

  object-fit: cover;
`;

const NewsletterInfo = styled.div`
  overflow: hidden;

  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: column;
`;

const NewsletterName = styled.h3`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
  font-weight: 600;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const NewsletterDescription = styled.p`
  overflow: hidden;

  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const UnsubscribeInfoText = styled.p`
  padding: 6px 10px;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
  text-align: center;
`;

const ActionButton = styled(Button)`
  padding: 6px 10px;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.body3};

  &:disabled {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 1;
  }
`;
