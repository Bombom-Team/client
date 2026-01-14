import styled from '@emotion/styled';
import CommentCard from './CommentCard';
import { useDevice } from '@/hooks/useDevice';
import type { Comment } from '../types/comment';
import type { PropsWithChildren } from 'react';

interface AllCommentsSectionProps {
  comments: Comment[];
  isLoading: boolean;
}

const AllCommentsSection = ({
  comments,
  isLoading,
  children,
}: PropsWithChildren<AllCommentsSectionProps>) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const isEmpty = !isLoading && comments.length === 0;

  return (
    <Container>
      <Title isMobile={isMobile}>전체 코멘트</Title>

      {isLoading ? (
        <EmptyState isMobile={isMobile}>로딩 중...</EmptyState>
      ) : isEmpty ? (
        <EmptyState isMobile={isMobile}>
          아직 작성한 코멘트가 없어요. 가장 먼저 한 줄 코멘트를 남겨보세요!
        </EmptyState>
      ) : (
        <>
          <CardList isMobile={isMobile}>
            {comments.map((comment, index) => (
              <CommentCard key={`comment-${index}`} {...comment} />
            ))}
          </CardList>
          {children}
        </>
      )}
    </Container>
  );
};

export default AllCommentsSection;

const Container = styled.section`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const Title = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body1 : theme.fonts.heading6};
`;

const CardList = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  flex-direction: column;
`;

const EmptyState = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '24px' : '32px')};
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
  text-align: center;
`;
