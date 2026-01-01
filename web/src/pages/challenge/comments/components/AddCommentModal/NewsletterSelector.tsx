import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useMemo } from 'react';
import Select from '@/components/Select/Select';
import { useDevice } from '@/hooks/useDevice';
import type { ArticleWithHighlights } from '@/mocks/datas/highlights';

interface NewsletterSelectorProps {
  selectedArticleId: string;
  onArticleSelect: (articleId: string) => void;
  articles: ArticleWithHighlights[];
}

const NewsletterSelector = ({
  selectedArticleId,
  onArticleSelect,
  articles,
}: NewsletterSelectorProps) => {
  const device = useDevice();

  const options = useMemo(
    () =>
      articles.map((article) => ({
        label: `${article.newsletterName} (${article.articleTitle})`,
        value: article.id,
      })),
    [articles],
  );

  return (
    <Container>
      <Title isMobile={device === 'mobile'}>읽은 아티클</Title>
      <Select
        options={options}
        selectedValue={selectedArticleId || null}
        onSelectOption={onArticleSelect}
        placeholder="아티클을 선택하세요"
        width="100%"
        fontSize={device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1}
      />
    </Container>
  );
};

export default NewsletterSelector;

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
`;
