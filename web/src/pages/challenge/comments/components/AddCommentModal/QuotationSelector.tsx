import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';

interface Quotation {
  id: string;
  text: string;
  memo?: string;
}

interface QuotationSelectorProps {
  quotations: Quotation[];
  selectedQuotationId: string | null;
  onQuotationSelect: (id: string, text: string) => void;
  onRemoveQuotation: () => void;
}

const QuotationSelector = ({
  quotations,
  selectedQuotationId,
  onQuotationSelect,
  onRemoveQuotation,
}: QuotationSelectorProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <Header isMobile={isMobile}>
        <TitleBox isMobile={isMobile}>
          <Title isMobile={isMobile}>내 하이라이트/메모</Title>
          <HelpText isMobile={isMobile}>클릭하여 인용하기 (선택)</HelpText>
        </TitleBox>
        {selectedQuotationId && (
          <RemoveQuotationButton
            variant="transparent"
            onClick={onRemoveQuotation}
            isMobile={isMobile}
          >
            인용 제거
          </RemoveQuotationButton>
        )}
      </Header>

      {quotations.length > 0 ? (
        <QuotationList isMobile={isMobile}>
          {quotations.map((quotation) => (
            <QuotationItem
              key={quotation.id}
              variant="outlined"
              onClick={() =>
                onQuotationSelect(quotation.id, quotation.memo ?? '')
              }
              isMobile={isMobile}
              isSelected={selectedQuotationId === quotation.id}
            >
              <Quote isMobile={isMobile}>{quotation.text}</Quote>
              {quotation.memo && (
                <Memo isMobile={isMobile}>{quotation.memo}</Memo>
              )}
            </QuotationItem>
          ))}
        </QuotationList>
      ) : (
        <EmptyState isMobile={isMobile}>
          저장된 하이라이트/메모가 없어요.
        </EmptyState>
      )}
    </Container>
  );
};

export default QuotationSelector;

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 8px;
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
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
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
  outline: ${({ isSelected, theme }) =>
    isSelected ? `2px solid ${theme.colors.primary}` : 'none'};
  outline-offset: -2px;
  border: 1px solid
    ${({ theme, isSelected }) =>
      isSelected ? theme.colors.primary : theme.colors.stroke};
  border-radius: 8px;

  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: flex-start;

  text-align: left;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme, isSelected }) =>
      isSelected ? theme.colors.primaryInfo : theme.colors.disabledBackground};
  }
`;

const Quote = styled.div<{ isMobile: boolean }>`
  overflow: hidden;
  padding: ${({ isMobile }) => (isMobile ? '4px 8px' : '4px 12px')};
  border-left: 4px solid ${({ theme }) => theme.colors.stroke};

  display: -webkit-box;
  flex: 1;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ isMobile }) => (isMobile ? 3 : 4)};
  text-overflow: ellipsis;
`;

const Memo = styled.div<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;
