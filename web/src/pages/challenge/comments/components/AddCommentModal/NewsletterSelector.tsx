import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import Select from '@/components/Select/Select';
import type { CandidateArticles } from '../../types/comment';

interface NewsletterSelectorProps {
  selectedArticleId: number | null;
  onArticleSelect: (articleId: number) => void;
  articles: CandidateArticles;
  showError: boolean;
}

const NewsletterSelector = ({
  selectedArticleId,
  onArticleSelect,
  articles,
  showError,
}: NewsletterSelectorProps) => {
  const options = articles.map((article) => ({
    label: `${article.newsletterName} (${article.articleTitle})`,
    value: article.articleId,
  }));

  return (
    <Container>
      <Title>읽은 아티클</Title>
      <Select
        options={options}
        selectedValue={selectedArticleId ?? null}
        onSelectOption={onArticleSelect}
        placeholder="아티클을 선택하세요"
        width="100%"
        fontSize={theme.fonts.body1}
      />
      {showError && <ErrorMessage>아티클을 선택해주세요</ErrorMessage>}
    </Container>
  );
};

export default NewsletterSelector;

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font: ${({ theme }) => theme.fonts.body3};
`;
