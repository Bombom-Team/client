import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { Newsletter } from '@/types/newsletter';

interface SimilarNewsletterCardProps {
  newsletter: Newsletter;
}

const SimilarNewsletterCard = ({ newsletter }: SimilarNewsletterCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    trackEvent({
      category: 'Newsletter',
      action: '비슷한 뉴스레터 카드 클릭',
      label: newsletter.name,
    });
    navigate({
      to: '/newsletters/$newsletterId',
      params: { newsletterId: String(newsletter.newsletterId) },
    });
  };

  return (
    <Container type="button" onClick={handleClick}>
      <Thumbnail
        src={newsletter.imageUrl ?? ''}
        alt={`${newsletter.name} 뉴스레터 이미지`}
      />
      <TextBox>
        <Name>{newsletter.name}</Name>
        <Meta>{newsletter.category}</Meta>
      </TextBox>
    </Container>
  );
};

export default SimilarNewsletterCard;

const Container = styled.button`
  width: 100%;
  padding: 12px 0;
  border: none;

  display: flex;
  gap: 12px;
  align-items: center;

  background: transparent;
  text-align: left;

  cursor: pointer;

  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const Thumbnail = styled(ImageWithFallback)`
  width: 48px;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 8px;

  flex-shrink: 0;

  object-fit: cover;
`;

const TextBox = styled.div`
  min-width: 0;

  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const Name = styled.span`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.span`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
  text-overflow: ellipsis;
  white-space: nowrap;
`;
