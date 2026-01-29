import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import Button from '@/components/Button/Button';
import Tooltip from '@/components/Tooltip/Tooltip';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
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

  const device = useDevice();

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
        device={device}
      >
        {!submittedMyComment && (
          <LockIcon width={16} height={16} color={theme.colors.primary} />
        )}
        전체 답변 보기
      </StyledButton>
      <Tooltip opened={showTooltip} position="top-right" anchorRef={buttonRef}>
        답변을 제출해야 확인할 수 있어요!
      </Tooltip>
    </Container>
  );
};

export default ViewAllCommentsButton;

const Container = styled.div`
  position: relative;
`;

const StyledButton = styled(Button)<{ device: Device }>`
  padding: 0;

  display: flex;
  gap: 4px;

  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};

  &:hover {
    background: none;
    text-decoration: underline;
  }
`;
