import styled from '@emotion/styled';
import { createLink } from '@tanstack/react-router';
import ImageInfoCard from '@/components/ImageInfoCard/ImageInfoCard';
import { createSlug } from '@/utils/url';
import type { Newsletter } from '@/types/newsletter';
import type { ReactNode } from 'react';

const MAEIL_MAIL_URL = 'https://maeilmail.bombom.news';

interface NewsletterCardListProps {
  newsletters: Newsletter[];
  handleCardClick: (newsletter: Newsletter) => void;
  trailing?: ReactNode;
}

const NewsletterCardList = ({
  newsletters,
  handleCardClick,
  trailing,
}: NewsletterCardListProps) => {
  return (
    <>
      {newsletters.map((newsletter) => {
        const newsletterId = String(newsletter.newsletterId);
        const card = (
          <NewsletterCard
            imageUrl={newsletter.imageUrl ?? ''}
            title={newsletter.name}
            description={newsletter.description}
            isSubscribed={newsletter.isSubscribed}
          />
        );

        return newsletter.source === 'MAEIL_MAIL' ? (
          <CardAnchor
            key={newsletter.newsletterId}
            href={MAEIL_MAIL_URL}
            onClick={() => handleCardClick(newsletter)}
            aria-label={`${newsletter.name} 뉴스레터 상세보기`}
          >
            {card}
          </CardAnchor>
        ) : (
          <CardLink
            key={newsletter.newsletterId}
            to="/newsletters/$newsletterId/$name"
            params={{
              newsletterId,
              name: createSlug(newsletter.name, newsletterId),
            }}
            onClick={() => handleCardClick(newsletter)}
            aria-label={`${newsletter.name} 뉴스레터 상세보기`}
          >
            {card}
          </CardLink>
        );
      })}
      {trailing}
    </>
  );
};

export default NewsletterCardList;

const CardAnchor = styled.a`
  display: block;
`;

const CardLink = createLink(CardAnchor);

const NewsletterCard = styled(ImageInfoCard)`
  height: 80px;
  padding: 12px;
  border-radius: 16px;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 8px 25px -8px rgb(0 0 0 / 12%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(-1px);
  }
`;
