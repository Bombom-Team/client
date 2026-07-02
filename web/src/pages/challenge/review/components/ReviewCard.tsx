import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex/Flex';
import Text from '@/components/Text/Text';
import { useDevice } from '@/hooks/useDevice';
import type { Review } from '../types/review';
import EditIcon from '#/assets/svg/edit.svg';

type ReviewCardProps = Review & {
  isPrivate?: boolean;
  isMyReview?: boolean;
  onEdit?: () => void;
};

const DELETED_USER_NICKNAME = '탈퇴한 회원';

const ReviewCard = ({
  nickname,
  comment,
  isPrivate = false,
  isMyReview = false,
  onEdit,
}: ReviewCardProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile} isMyReview={isMyReview}>
      <Flex gap={12} align="center" justify="space-between">
        <Flex gap={4} align="center">
          <Text color="textSecondary" font="t5Regular">
            {nickname ?? DELETED_USER_NICKNAME}
          </Text>
          {isPrivate && (
            <Text color="textTertiary" font="t5Regular">
              · 비공개
            </Text>
          )}
        </Flex>
        {isMyReview && onEdit && (
          <EditButton
            variant="transparent"
            onClick={onEdit}
            isMobile={isMobile}
          >
            <EditIcon fill={theme.colors.textSecondary} />
          </EditButton>
        )}
      </Flex>
      <Text as="p">{comment}</Text>
    </Container>
  );
};

export default ReviewCard;

const Container = styled.article<{ isMobile: boolean; isMyReview: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '16px' : '20px')};
  border-bottom: ${({ theme, isMyReview }) =>
    isMyReview ? `4px solid ${theme.colors.primaryLight}` : 'none'};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  display: flex;
  gap: 8px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const EditButton = styled(Button)<{ isMobile: boolean }>`
  padding: 0;

  svg {
    width: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
    height: ${({ isMobile }) => (isMobile ? '20px' : '24px')};
  }

  &:hover {
    background: none;

    svg {
      fill: ${({ theme }) => theme.colors.primaryBomBom};
    }
  }
`;
