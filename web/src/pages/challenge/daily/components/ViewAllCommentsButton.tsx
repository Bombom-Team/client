import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import Tooltip from '@/components/Tooltip/Tooltip';
import LockIcon from '#/assets/svg/lock.svg';

interface ViewAllCommentsButtonProps {
  submittedMyComment: boolean;
  showAllComments: () => void;
}

const ViewAllCommentsButton = ({
  submittedMyComment,
  showAllComments,
}: ViewAllCommentsButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleViewAllCommentsClick = () => {
    if (submittedMyComment) {
      showAllComments();
    }
  };

  const handleButtonMouseEnter = () => {
    if (!submittedMyComment) {
      setShowTooltip(true);
    }
  };

  const handleButtonMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleButtonTouch = () => {
    if (!submittedMyComment) {
      setShowTooltip((prev) => !prev);
    }
  };

  return (
    <Container>
      <Button
        variant="outlined"
        onClick={handleViewAllCommentsClick}
        onMouseEnter={handleButtonMouseEnter}
        onMouseLeave={handleButtonMouseLeave}
        onTouchStart={handleButtonTouch}
      >
        {!submittedMyComment && <LockIcon width={16} height={16} />}
        전체 답변 보기
      </Button>
      <Tooltip opened={showTooltip} position="top-left">
        답변을 제출해야 확인할 수 있어요!
      </Tooltip>
    </Container>
  );
};

export default ViewAllCommentsButton;

const Container = styled.div`
  position: relative;
`;
