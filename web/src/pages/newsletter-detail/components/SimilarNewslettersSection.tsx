import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import SimilarNewsletterCard from './SimilarNewsletterCard';
import { queries } from '@/apis/queries';

interface SimilarNewslettersSectionProps {
  currentNewsletterId: number;
  currentCategory: string;
}

const SimilarNewslettersSection = ({
  currentNewsletterId,
  currentCategory,
}: SimilarNewslettersSectionProps) => {
  const { data } = useQuery(queries.newsletters());

  const similarNewsletters = useMemo(() => {
    if (!data?.newsletters) return [];
    return data.newsletters.filter(
      (newsletter) =>
        newsletter.category === currentCategory &&
        newsletter.newsletterId !== currentNewsletterId,
    );
  }, [data?.newsletters, currentCategory, currentNewsletterId]);

  if (similarNewsletters.length === 0) return null;

  return (
    <Container>
      <Header>비슷한 뉴스레터</Header>
      <List>
        {similarNewsletters.map((newsletter, index) => (
          <ListItem key={newsletter.newsletterId} isFirst={index === 0}>
            <SimilarNewsletterCard newsletter={newsletter} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default SimilarNewslettersSection;

const Container = styled.section`
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 8px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};
`;

const Header = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.li<{ isFirst: boolean }>`
  border-top: ${({ isFirst, theme }) =>
    isFirst ? 'none' : `1px solid ${theme.colors.dividers}`};
`;
