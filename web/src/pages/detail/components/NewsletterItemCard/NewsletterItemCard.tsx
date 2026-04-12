import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Badge from '@/components/Badge/Badge';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import type { components } from '@/types/openapi';
import ClockIcon from '#/assets/svg/clock.svg';

interface NewsletterItemCardProps {
  data: components['schemas']['ArticleResponse'];
}

export default function NewsletterItemCard({ data }: NewsletterItemCardProps) {
  const {
    articleId,
    title,
    contentsSummary,
    thumbnailUrl,
    expectedReadTime,
    newsletter,
  } = data;

  return (
    <Container to={`/articles/${articleId}`}>
      <NewsletterImage
        src={thumbnailUrl ?? newsletter?.imageUrl ?? ''}
        alt={title ?? ''}
        height={180}
      />

      <ContentWrapper>
        <TextContent>
          <Title>{title}</Title>
          <Description>{contentsSummary}</Description>
        </TextContent>

        <MetaContent>
          <Badge text={newsletter?.category ?? ''} />
          <MetaInfo>
            <SourceText>from {newsletter?.name ?? ''}</SourceText>
            <ReadTimeBox>
              <ClockIcon width={16} height={16} />
              <SourceText>{`${expectedReadTime}분`}</SourceText>
            </ReadTimeBox>
          </MetaInfo>
        </MetaContent>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled(Link)`
  overflow: hidden;
  width: 100%;
  max-width: 320px;
  border-radius: 1.25rem;
  box-shadow:
    0 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 10%),
    0 0.125rem 0.25rem -0.0625rem rgb(0 0 0 / 6%);

  display: flex;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};

  transition: all 0.2s ease;
`;

const NewsletterImage = styled(ImageWithFallback)`
  width: 100%;

  object-fit: cover;
  object-position: center;
`;

const ContentWrapper = styled.div`
  padding: 1.25rem;

  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const TextContent = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  overflow: hidden;
  margin-bottom: 0.5rem;

  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
`;

const Description = styled.p`
  overflow: hidden;

  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
`;

const MetaContent = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const SourceText = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};
`;

const ReadTimeBox = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;

  white-space: nowrap;
`;
