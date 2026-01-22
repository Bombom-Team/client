import styled from '@emotion/styled';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import { useDevice } from '@/hooks/useDevice';

interface DailyGuideCardProps {
  imageUrl: string;
  dayIndex: number;
}

const DailyGuideCard = ({ imageUrl, dayIndex }: DailyGuideCardProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <Flex direction="column" gap={12} align="center">
      <RemindButton variant="outlined" onClick={handleFlip}>
        {isFlipped ? '🔁 데일리 가이드 보기' : '🔁 첫날 각오 다시보기'}
      </RemindButton>
      <FlipCard>
        <FlipCardInner isFlipped={isFlipped}>
          <FlipCardFront>
            <GuideImage src={imageUrl} alt={`Day ${dayIndex} guide`} />
          </FlipCardFront>
          <FlipCardBack isMobile={isMobile}>
            <RemindTitle>Day 1의 내가 남긴 각오</RemindTitle>
            <RemindContent isMobile={isMobile}>
              첫날 각오 컨텐트 영역입니다.
            </RemindContent>
            <RemindMotivation isMobile={isMobile}>
              처음의 마음을 떠올리며 오늘도 화이팅!
            </RemindMotivation>
          </FlipCardBack>
        </FlipCardInner>
      </FlipCard>
    </Flex>
  );
};

export default DailyGuideCard;

const RemindButton = styled(Button)`
  width: 100%;
  border-radius: 8px;

  font: ${({ theme }) => theme.fonts.body2};
`;

const FlipCard = styled.div`
  width: fit-content;
  perspective: 1000px;
`;

const FlipCardInner = styled.div<{ isFlipped: boolean }>`
  position: relative;

  transform: ${({ isFlipped }) =>
    isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};

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
  border-radius: 12px;

  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryLight};
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
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.heading4};
`;

const RemindContent = styled.p<{ isMobile: boolean }>`
  max-width: 400px;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '20px')};
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
  text-align: left;
  white-space: pre-wrap;
`;

const RemindMotivation = styled.p<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;
