import styled from '@emotion/styled';
import ImageInfoCard from '@/components/ImageInfoCard/ImageInfoCard';
import type { Newsletter } from '@/types/newsletter';

interface NewsletterCardListProps {
  newsletters: Newsletter[];
  handleCardClick: (newsletter: Newsletter) => void;
}

const NewsletterCardList = ({
  newsletters,
  handleCardClick,
}: NewsletterCardListProps) => {
  return (
    <>
      {newsletters.map((newsletter) => (
        <NewsletterCard
          key={newsletter.newsletterId}
          imageUrl={newsletter.imageUrl ?? ''}
          title={newsletter.name}
          description={newsletter.description}
          isSubscribed={newsletter.isSubscribed}
          onClick={() => handleCardClick(newsletter)}
          as="button"
          aria-label={`${newsletter.name} 뉴스레터 상세보기`}
        />
      ))}
    </>
  );
};

export default NewsletterCardList;

const NewsletterCard = styled(ImageInfoCard)`
  height: 5rem;
  padding: 0.75rem;
  border-radius: 1rem;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0.5rem 1.5625rem -0.5rem rgb(0 0 0 / 12%);
    transform: translateY(-0.125rem);
  }

  &:active {
    transform: translateY(-0.0625rem);
  }
`;
