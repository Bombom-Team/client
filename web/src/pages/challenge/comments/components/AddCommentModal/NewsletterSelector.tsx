import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import Select from '@/components/Select/Select';
import { useDevice } from '@/hooks/useDevice';
import type { CandidateArticles } from '../../types/comment';
import type { Device } from '@/hooks/useDevice';

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
  const device = useDevice();

  const options = articles.map((article) => ({
    label: `${article.newsletterName} (${article.articleTitle})`,
    value: article.articleId,
  }));

  return (
    <Container>
      <Title device={device}>읽은 아티클</Title>
      <Select
        options={options}
        selectedValue={selectedArticleId ?? null}
        onSelectOption={onArticleSelect}
        placeholder="아티클을 선택하세요"
        width="100%"
        fontSize={device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1}
      />
      {showError && (
        <ErrorMessage device={device}>아티클을 선택해주세요</ErrorMessage>
      )}
    </Container>
  );
};

export default NewsletterSelector;

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const ErrorMessage = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.error};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body3};
`;
