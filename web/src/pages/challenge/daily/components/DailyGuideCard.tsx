import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import { useDevice } from '@/hooks/useDevice';

const FIRST_DAY_INDEX = 1;

interface DailyGuideCardProps {
  imageUrl: string;
  challengeId: number;
  isRemindEnabled: boolean;
}

const DailyGuideCard = ({
  imageUrl,
  challengeId,
  isRemindEnabled,
}: DailyGuideCardProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const [isRemindView, setIsRemindView] = useState(false);

  const { data: firstDailyGuideComment } = useQuery({
    ...queries.myDailyGuideComment(challengeId, FIRST_DAY_INDEX),
    enabled: isRemindEnabled,
  });

  const handleFlip = () => {
    setIsRemindView((prev) => !prev);
  };

  const canFlip =
    isRemindEnabled &&
    !!firstDailyGuideComment &&
    !!firstDailyGuideComment.comment;

  return (
    <Flex direction="column" gap={12} align="center">
      {canFlip && (
        <RemindButton variant="outlined" onClick={handleFlip}>
          {isRemindView ? '🔁 데일리 가이드 보기' : '🔁 첫날 각오 다시보기'}
        </RemindButton>
      )}
      <FlipCard>
        <FlipCardInner isRemindView={isRemindView}>
          <FlipCardFront>
            <GuideImage src={imageUrl} alt={`Day guide image`} />
          </FlipCardFront>
          {canFlip && (
            <FlipCardBack isMobile={isMobile}>
              <RemindTitle>첫날, 내가 남긴 말</RemindTitle>
              <RemindContent isMobile={isMobile}>
                {firstDailyGuideComment.comment}
              </RemindContent>
              <RemindMotivation>
                {`처음 다짐했던 마음을 다시 떠올려보세요.\n 오늘의 한 걸음도 그 연장선에 있어요.`}
              </RemindMotivation>
            </FlipCardBack>
          )}
        </FlipCardInner>
      </FlipCard>
    </Flex>
  );
};

export default DailyGuideCard;

const RemindButton = styled(Button)`
  width: 100%;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const FlipCard = styled.div`
  width: fit-content;
  perspective: 1000px;
`;

const FlipCardInner = styled.div<{ isRemindView: boolean }>`
  position: relative;

  transform: ${({ isRemindView }) =>
    isRemindView ? 'rotateY(180deg)' : 'rotateY(0deg)'};

  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const FlipCardFront = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;

  backface-visibility: hidden;
`;

const FlipCardBack = styled.div<{ isMobile: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: ${({ isMobile }) => (isMobile ? '24px 16px' : '32px 24px')};
  border-radius: 8px;

  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.disabledBackground};
  text-align: center;

  backface-visibility: hidden;

  overflow-y: auto;
  transform: rotateY(180deg);
`;

const GuideImage = styled.img`
  width: 100%;
  max-height: 600px;

  object-fit: contain;
`;

const RemindTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;

const RemindContent = styled.p<{ isMobile: boolean }>`
  width: 100%;
  max-width: 400px;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '20px')};
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  text-align: left;
`;

const RemindMotivation = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
