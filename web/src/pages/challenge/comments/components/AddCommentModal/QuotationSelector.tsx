import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';

interface Highlight {
  id: string;
  highlightedText: string;
  memo?: string;
}

interface HighlightSelectorProps {
  highlights: Highlight[];
  selectedQuotationId: string | null;
  onQuotationSelect: (id: string, text: string) => void;
  onRemoveQuotation: () => void;
}

const QuotationSelector = ({
  highlights,
  selectedQuotationId,
  onQuotationSelect,
  onRemoveQuotation,
}: HighlightSelectorProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const handleInsertComment = (id: string, memo: string) => {
    onQuotationSelect(id, memo);
  };

  return (
    <Container isMobile={isMobile}>
      <Header isMobile={isMobile}>
        <TitleBox isMobile={isMobile}>
          <Title isMobile={isMobile}>내 하이라이트/메모</Title>
          <HelpText isMobile={isMobile}>클릭하여 인용하기 (선택)</HelpText>
        </TitleBox>
        {highlights.length > 0 && (
          <RemoveQuotationButton
            variant="transparent"
            onClick={onRemoveQuotation}
            isMobile={isMobile}
          >
            인용 제거
          </RemoveQuotationButton>
        )}
      </Header>

      {highlights.length === 0 ? (
        <EmptyState isMobile={isMobile}>
          저장된 하이라이트/메모가 없어요.
        </EmptyState>
      ) : (
        <QuotationList isMobile={isMobile}>
          {highlights.map((highlight) => (
            <QuotationItem
              key={highlight.id}
              variant="outlined"
              onClick={() =>
                handleInsertComment(highlight.id, highlight.memo ?? '')
              }
              isMobile={isMobile}
              isSelected={selectedQuotationId === highlight.id}
            >
              <Quote isMobile={isMobile}>{highlight.highlightedText}</Quote>
              {highlight.memo && (
                <Memo isMobile={isMobile}>{highlight.memo}</Memo>
              )}
            </QuotationItem>
          ))}
        </QuotationList>
      )}
    </Container>
  );
};

export default QuotationSelector;

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  flex-direction: column;
`;

const Header = styled.div<{ isMobile: boolean }>`
  width: 100%;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '4px' : '8px')};
  align-items: flex-end;
`;

const TitleBox = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  flex-wrap: wrap;
  align-items: center;
`;

const Title = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const HelpText = styled.span<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body4 : theme.fonts.body3};
`;

const RemoveQuotationButton = styled(Button)<{ isMobile: boolean }>`
  margin-left: auto;
  padding: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body4 : theme.fonts.body3};

  &:hover {
    background-color: transparent;
    text-decoration: underline;
  }
`;

const QuotationList = styled.div<{ isMobile: boolean }>`
  max-height: ${({ isMobile }) => (isMobile ? '120px' : '240px')};

  display: flex;
  gap: 8px;
  flex-direction: column;

  overflow-y: auto;
`;

const EmptyState = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '20px' : '40px')};

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
  text-align: center;
`;

const QuotationItem = styled(Button)<{
  isMobile: boolean;
  isSelected: boolean;
}>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '8px' : '16px')};
  border: ${({ theme, isSelected }) =>
    isSelected
      ? `2px solid ${theme.colors.primary}`
      : `1px solid ${theme.colors.stroke}`};
  border-radius: 8px;

  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: flex-start;

  background-color: ${({ theme }) => theme.colors.backgroundHover};
  text-align: left;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme, isSelected }) =>
      isSelected ? theme.colors.primaryInfo : theme.colors.stroke};
  }
`;

const Quote = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '4px 8px' : '6px 12px')};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};

  flex: 1;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const Memo = styled.div<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;
