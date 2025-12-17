import styled from '@emotion/styled';
import Button from '../Button/Button';
import { useDevice } from '@/hooks/useDevice';
import CloseIcon from '#/assets/svg/close.svg';

interface AnnounceBarProps {
  announceText: string[];
  checked: boolean;
  onChangeChecked: (checked: boolean) => void;
  onClose: () => void;
}

const AnnounceBar = ({
  announceText,
  checked,
  onChangeChecked,
  onClose,
}: AnnounceBarProps) => {
  const device = useDevice();
  const isPC = device === 'pc';
  return (
    <Container isPC={isPC} role="status" aria-live="polite">
      <ContentWrapper isPC={isPC}>
        {announceText.map((text, index) => (
          <span key={index}>{text}</span>
        ))}
      </ContentWrapper>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChangeChecked(e.target.checked)}
      />
      <CheckboxText isPC={isPC}>다시 보지 않기</CheckboxText>

      <CloseButton aria-label="공지 닫기" onClick={onClose}>
        <CloseIcon fill="black" />
      </CloseButton>
    </Container>
  );
};

const Container = styled.div<{ isPC: boolean }>`
  width: 100%;
  margin-bottom: 8px;
  padding: ${({ isPC }) => (isPC ? '12px 16px' : '8px 12px')};

  display: flex;
  gap: 8px;
  align-items: center;

  background-color: #fef3c6;
`;

const ContentWrapper = styled.div<{ isPC: boolean }>`
  padding: 8px 0;

  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: ${({ isPC }) => (isPC ? 'row' : 'column')};

  font: ${({ theme, isPC }) => (isPC ? theme.fonts.body1 : theme.fonts.body3)};
`;

const CloseButton = styled(Button)`
  min-width: 32px;
  min-height: 32px;
  padding: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;
`;

const CheckboxText = styled.div<{ isPC: boolean }>`
  font: ${({ theme, isPC }) =>
    isPC ? theme.fonts.body1 : theme.fonts.caption};
  white-space: nowrap;
`;

export default AnnounceBar;
