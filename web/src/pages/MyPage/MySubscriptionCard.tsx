import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { openExternalLink } from '@/utils/externalLink';
import type { SubscribedNewsletterResponse } from '@/apis/members/members.api';
import type { Device } from '@/hooks/useDevice';

interface MySubscriptionCardProps {
  newsletter: SubscribedNewsletterResponse;
  device: Device;
  onUnsubscribeClick: (id: number) => void;
  onUnsubscribeConfirm: (id: number) => void;
}

const MySubscriptionCard = ({
  newsletter,
  device,
  onUnsubscribeClick,
  onUnsubscribeConfirm,
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
          <ActionButton device={device} variant="filled" disabled>
            취소 중...
          </ActionButton>
        );

      case 'UNSUBSCRIBE_FAILED':
        if (!isUrlVisited) {
          return (
            <ActionButton
              device={device}
              variant="filled"
              onClick={handleExternalLinkClick}
            >
              직접 취소하러 가기
            </ActionButton>
          );
        }
        return (
          <ActionButton
            device={device}
            variant="filled"
            onClick={() => onUnsubscribeConfirm(newsletter.subscriptionId)}
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
            device={device}
            variant="filled"
            onClick={() => onUnsubscribeClick(newsletter.subscriptionId)}
          >
            구독 취소
          </ActionButton>
        );
    }
  };

  return (
    <Card device={device}>
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
    </Card>
  );
};

export default MySubscriptionCard;

const Card = styled.div<{ device: Device }>`
  padding: 16px;
  border: 1px solid ${theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  background: ${theme.colors.white};

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

  color: ${theme.colors.textPrimary};
  font: ${theme.fonts.body1};
  font-weight: 600;
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const NewsletterDescription = styled.p`
  overflow: hidden;

  display: -webkit-box;

  color: ${theme.colors.textSecondary};
  font: ${theme.fonts.body2};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const UnsubscribeInfoText = styled.p`
  padding: 6px 10px;

  color: ${theme.colors.textTertiary};
  font: ${theme.fonts.body3};
  text-align: center;
`;

const ActionButton = styled(Button)<{ device: Device }>`
  padding: 6px 10px;
  border-radius: 8px;

  font: ${theme.fonts.body3};

  &:disabled {
    color: ${theme.colors.textSecondary};
    opacity: 1;
  }
`;
