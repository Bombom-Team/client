import { useFocusTrap } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { SHEET_UP } from '../constants/keyframes';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { useRestoreFocus } from '../hooks/useRestoreFocus';

type SheetSize = 'mobile' | 'pc';

interface UnansweredSheetProps {
  unansweredNumbers: number[];
  size: SheetSize;
  onBack: () => void;
  onSubmit: () => void;
}

// 빈 문항이 있을 때 제출 전에 한 번 더 묻는다. 휴대폰은 아래 시트, PC는 가운데 창으로 띄운다.
const UnansweredSheet = ({
  unansweredNumbers,
  size,
  onBack,
  onSubmit,
}: UnansweredSheetProps) => {
  // 확인창이 열린 동안 초점을 안에 가둔다(첫 초점은 '마저 풀기'). 배경 시험지는 부모가 inert로 막는다.
  useRestoreFocus();
  const sheetRef = useFocusTrap<HTMLDivElement>({});

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onBack();
  };

  return (
    <Backdrop
      size={size}
      role="presentation"
      onClick={handleBackdropClick}
      data-keep-enter
    >
      <Sheet
        ref={sheetRef}
        size={size}
        role="dialog"
        aria-modal="true"
        aria-labelledby="literacy-unanswered-title"
      >
        <Title id="literacy-unanswered-title" size={size}>
          {unansweredNumbers.join('·')}번을 아직 안 풀었어요
        </Title>
        <Description size={size}>
          비운 문제는 틀린 걸로 채점돼요. 그래도 제출할까요?
        </Description>
        <Actions size={size}>
          <ActionButton
            type="button"
            size={size}
            isPrimary={false}
            onClick={onBack}
          >
            마저 풀기
          </ActionButton>
          <ActionButton type="button" size={size} isPrimary onClick={onSubmit}>
            그래도 제출
          </ActionButton>
        </Actions>
      </Sheet>
    </Backdrop>
  );
};

export default UnansweredSheet;

const SIZE_STYLES = {
  mobile: {
    width: '100%',
    radius: '6cqw 6cqw 0 0',
    padding: '5cqw 5.5cqw 7cqw',
    gap: '3cqw',
    title: '6cqw',
    description: 'max(13px, 3.5cqw)',
    actionGap: '2.4cqw',
    buttonRadius: '3cqw',
    buttonPadding: '3.6cqw',
    button: 'max(13px, 3.7cqw)',
  },
  pc: {
    width: '420px',
    radius: '16px',
    padding: '28px 28px 24px',
    gap: '14px',
    title: '24px',
    description: '15px',
    actionGap: '10px',
    buttonRadius: '12px',
    buttonPadding: '14px',
    button: '16px',
  },
};

const Backdrop = styled.div<{ size: SheetSize }>`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.header};

  display: flex;
  align-items: ${({ size }) => (size === 'mobile' ? 'flex-end' : 'center')};
  justify-content: center;

  background: rgb(27 23 20 / 45%);

  inset: 0;
`;

const Sheet = styled.div<{ size: SheetSize }>`
  width: ${({ size }) => SIZE_STYLES[size].width};
  padding: ${({ size }) => SIZE_STYLES[size].padding};
  border-radius: ${({ size }) => SIZE_STYLES[size].radius};

  display: grid;
  gap: ${({ size }) => SIZE_STYLES[size].gap};

  background: ${({ theme }) => theme.colors.white};
  color: ${LITERACY_COLORS.ink};

  animation: ${SHEET_UP} 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
`;

const Title = styled.h3<{ size: SheetSize }>`
  margin: 0;
  font: 400 ${({ size }) => SIZE_STYLES[size].title} / 1.3
    ${LITERACY_FONTS.display};
`;

const Description = styled.p<{ size: SheetSize }>`
  margin: 0;

  color: ${LITERACY_COLORS.sub};
  font: 600 ${({ size }) => SIZE_STYLES[size].description} / 1.6
    ${LITERACY_FONTS.body};
`;

const Actions = styled.div<{ size: SheetSize }>`
  display: grid;
  gap: ${({ size }) => SIZE_STYLES[size].actionGap};

  grid-template-columns: 1fr 1fr;
`;

const ActionButton = styled.button<{ size: SheetSize; isPrimary: boolean }>`
  padding: ${({ size }) => SIZE_STYLES[size].buttonPadding};
  border: 0;
  border-radius: ${({ size }) => SIZE_STYLES[size].buttonRadius};

  background: ${({ isPrimary }) =>
    isPrimary ? LITERACY_COLORS.ink : LITERACY_COLORS.chipBackground};
  color: ${({ isPrimary, theme }) =>
    isPrimary ? theme.colors.white : LITERACY_COLORS.ink};
  font: 800 ${({ size }) => SIZE_STYLES[size].button} ${LITERACY_FONTS.body};

  cursor: pointer;
`;
