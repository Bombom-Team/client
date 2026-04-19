import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import Button from '@/components/Button/Button';
import Tooltip from '@/components/Tooltip/Tooltip';
import LockIcon from '#/assets/svg/lock.svg';

interface ViewAllCommentsButtonProps {
  submittedMyComment: boolean;
  onViewAllComments: () => void;
}

const ViewAllCommentsButton = ({
  submittedMyComment,
  onViewAllComments,
}: ViewAllCommentsButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleViewAllCommentsClick = () => {
    if (submittedMyComment) {
      onViewAllComments();
      return;
    }

    setShowTooltip(true);
  };

  return (
    <Container>
      <StyledButton
        ref={buttonRef}
        variant="transparent"
        onClick={handleViewAllCommentsClick}
        onMouseEnter={() => !submittedMyComment && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {!submittedMyComment && (
          <LockIcon width={16} height={16} color={theme.colors.primary} />
        )}
        전체 답변 보기
      </StyledButton>
      <Tooltip opened={showTooltip} placement="top-right" anchorRef={buttonRef}>
        답변을 제출해야 확인할 수 있어요!
      </Tooltip>
    </Container>
  );
};

export default ViewAllCommentsButton;

const Container = styled.div`
  position: relative;
`;

const StyledButton = styled(Button)`
  padding: 0;

  display: flex;
  gap: 4px;

  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.t6Regular};

  &:hover {
    background: none;
    text-decoration: underline;
  }
`;
