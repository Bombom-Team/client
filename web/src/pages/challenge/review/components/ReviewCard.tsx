import styled from '@emotion/styled';
import Flex from '@/components/Flex/Flex';
import Text from '@/components/Text/Text';
import { useDevice } from '@/hooks/useDevice';
import type { Review } from '../types/review';

type ReviewCardProps = Review;

const DELETED_USER_NICKNAME = '탈퇴한 회원';

const ReviewCard = ({ nickname, comment, isPrivate }: ReviewCardProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile} isPrivate={isPrivate}>
      <Flex gap={4} direction="column">
        <Text color="textSecondary" font="t5Regular">
          {nickname ?? DELETED_USER_NICKNAME}
        </Text>
      </Flex>
      <Text as="p">{comment}</Text>
    </Container>
  );
};

export default ReviewCard;

const Container = styled.article<{ isMobile: boolean; isPrivate: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '20px')};
  border-bottom: ${({ theme, isPrivate }) =>
    isPrivate ? `4px solid ${theme.colors.primaryLight}` : 'none'};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  display: flex;
  gap: 8px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;
