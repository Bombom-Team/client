import styled from '@emotion/styled';
import { useRouter } from '@tanstack/react-router';
import ChevronIcon from '@/components/icons/ChevronIcon';
import type { ReactNode } from 'react';

interface DetailPageHeaderProps {
  left?: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
}

const DetailPageHeader = ({ left, title, right }: DetailPageHeaderProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    router.history.back();
  };

  return (
    <Container>
      {left ?? (
        <BackButton
          type="button"
          onClick={handleBackClick}
          aria-label="뒤로가기"
        >
          <StyledChevronIcon direction="left" />
        </BackButton>
      )}
      {title && <Title>{title}</Title>}
      {right}
    </Container>
  );
};

export default DetailPageHeader;

const Container = styled.header`
  position: fixed;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  width: 100%;
  height: calc(
    ${({ theme }) => theme.heights.headerMobile} + env(safe-area-inset-top)
  );
  padding: calc(4px + env(safe-area-inset-top)) 8px;
  box-shadow:
    0 8px 12px -6px rgb(0 0 0 / 10%),
    0 3px 5px -4px rgb(0 0 0 / 10%);

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: ${({ theme }) => theme.colors.white};
`;

const BackButton = styled.button`
  padding: 4px;

  display: flex;
  align-items: center;

  color: ${({ theme }) => theme.colors.textPrimary};

  & > svg {
    transition: transform 0.2s ease;
  }

  &:hover > svg {
    transform: scale(1.1);
  }
`;

const Title = styled.h1`
  flex: 1;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading3};
  text-align: center;
`;

const StyledChevronIcon = styled(ChevronIcon)`
  width: 32px;
  height: 32px;
`;
