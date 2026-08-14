import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex/Flex';
import Text from '@/components/Text/Text';
import type { ArticleFontSizePercentage } from '../../constants/articleFontSize';

interface ArticleFontSizeControlProps {
  percentage: ArticleFontSizePercentage;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}

const ArticleFontSizeControl = ({
  percentage,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
}: ArticleFontSizeControlProps) => {
  return (
    <Container
      role="group"
      aria-label="본문 글자 크기 조절"
      align="center"
      gap={16}
      justify="flex-end"
    >
      <Text color="textSecondary" font="t5Regular">
        글자 크기
      </Text>
      <Flex align="center" gap={4}>
        <SizeButton
          variant="outlined"
          aria-label="본문 글자 크기 줄이기"
          disabled={!canDecrease}
          onClick={onDecrease}
        >
          −
        </SizeButton>
        <CurrentStep
          font="t5Regular"
          aria-live="polite"
          aria-atomic="true"
          aria-label={`본문 글자 크기 ${percentage}퍼센트`}
        >
          {percentage}%
        </CurrentStep>
        <SizeButton
          variant="outlined"
          aria-label="본문 글자 크기 키우기"
          disabled={!canIncrease}
          onClick={onIncrease}
        >
          +
        </SizeButton>
      </Flex>
    </Container>
  );
};

export default ArticleFontSizeControl;

const Container = styled(Flex)`
  width: 100%;
`;

const SizeButton = styled(Button)`
  width: 24px;
  height: 24px;
  min-width: 24px;
  padding: 0;
  border-radius: 4px;

  color: ${({ theme }) => theme.colors.textPrimary};

  transition:
    border-color 0.2s ease-in-out,
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => `${theme.colors.primaryBomBom}33`};
    outline-offset: 2px;

    border-color: ${({ theme }) => theme.colors.primaryBomBom};
  }

  &:active:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryBomBom};
    color: ${({ theme }) => theme.colors.white};

    border-color: ${({ theme }) => theme.colors.primaryBomBom};
  }
`;

const CurrentStep = styled(Text)`
  min-width: 52px;

  flex-shrink: 0;

  text-align: center;
`;
