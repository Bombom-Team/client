import styled from '@emotion/styled';
import Button from '../Button/Button';
import { useDevice } from '@/hooks/useDevice';
import CloseIcon from '#/assets/svg/close.svg';

interface AnnounceBarProps {
  announceText: string[];
  checked?: boolean;
  onChangeChecked?: (checked: boolean) => void;
  onClose: () => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const AnnounceBar = ({
  announceText,
  checked,
  onChangeChecked,
  onClose,
  onClick,
}: AnnounceBarProps) => {
  const device = useDevice();
  const isPC = device === 'pc';
  const isMobile = device === 'mobile';
  return (
    <Container
      isPC={isPC}
      clickable={!!onClick}
      role="status"
      aria-live="polite"
      onClick={onClick}
    >
      <Content isPC={isPC}>
        <ContentWrapper isPC={isPC}>
          {announceText.map((text, index) => (
            <span key={index}>{text}</span>
          ))}
        </ContentWrapper>
        {!isMobile && (
          <CheckboxWrapper isPC={isPC}>
            <input
              type="checkbox"
              checked={checked}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => onChangeChecked?.(e.target.checked)}
            />
            <CheckboxText isPC={isPC}>다시 보지 않기</CheckboxText>
          </CheckboxWrapper>
        )}
        <CloseButton
          aria-label="공지 닫기"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            onClose();
          }}
        >
          {' '}
          <CloseIcon
            width={isPC ? '1.5rem' : '1.125rem'}
            height={isPC ? '1.5rem' : '1.125rem'}
            fill="black"
          />
        </CloseButton>
      </Content>
    </Container>
  );
};

const Container = styled.div<{ isPC: boolean; clickable: boolean }>`
  width: 100%;
  margin-bottom: 0.5rem;
  padding: ${({ isPC }) => (isPC ? '0.75rem 1rem' : '0.5rem 0.75rem')};
  border-radius: 0.75rem;

  display: flex;
  gap: 0.25rem;
  flex-direction: column;
  align-items: center;

  background-color: #fef3c6;

  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'default')};
`;

const ContentWrapper = styled.div<{ isPC: boolean }>`
  padding: 0.25rem 0;

  display: flex;
  gap: 0.25rem;
  flex: 1;
  flex-direction: ${({ isPC }) => (isPC ? 'row' : 'column')};

  font: ${({ theme, isPC }) => (isPC ? theme.fonts.body1 : theme.fonts.body3)};
`;

const Content = styled.div<{ isPC: boolean }>`
  width: 100%;

  display: flex;
  flex-direction: row;
`;

const CheckboxWrapper = styled.div<{ isPC: boolean }>`
  display: flex;
  gap: 0.25rem;
  flex-direction: row;
  align-items: center;
`;

const CloseButton = styled(Button)`
  min-width: 32px;
  min-height: 2rem;
  padding: 0.375rem;

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
