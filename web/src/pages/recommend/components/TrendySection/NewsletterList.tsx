import EmptyNewsletter from './EmptyNewsletter';
import NewsletterCardList from './NewsletterCardList';
import NewsletterCarousel from './NewsletterCarousel';
import RequestNewsletterCard from './RequestNewsletterCard';
import { useDevice } from '@/hooks/useDevice';
import type { Newsletter } from '@/types/newsletter';

interface NewsletterListProps {
  newsletters: Newsletter[];
  handleCardClick: (newsletter: Newsletter) => void;
}

const NewsletterList = ({
  newsletters,
  handleCardClick,
}: NewsletterListProps) => {
  const device = useDevice();

  if (newsletters.length === 0) {
    return <EmptyNewsletter />;
  }

  return device === 'mobile' ? (
    <NewsletterCarousel
      newsletters={newsletters}
      handleCardClick={handleCardClick}
      trailing={<RequestNewsletterCard />}
    />
  ) : (
    <NewsletterCardList
      newsletters={newsletters}
      handleCardClick={handleCardClick}
      trailing={<RequestNewsletterCard />}
    />
  );
};

export default NewsletterList;
