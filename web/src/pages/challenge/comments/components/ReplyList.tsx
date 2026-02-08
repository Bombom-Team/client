import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convertRelativeTime } from '../utils/date';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';

interface ReplyListProps {
  challengeId: number;
  commentId: number;
  replyCount: number;
}

const DELETED_USER_NICKNAME = '탈퇴한 회원';

const ReplyList = ({ challengeId, commentId, replyCount }: ReplyListProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const { data: repliesData } = useSuspenseQuery({
    ...queries.comments.replies({
      challengeId,
      commentId,
      page: 0,
      size: replyCount,
    }),
  });

  const replies = repliesData?.content ?? [];

  if (replies.length === 0) {
    return <ReplyStatus isMobile={isMobile}>답글이 없어요.</ReplyStatus>;
  }

  return (
    <ReplyListContainer>
      {replies.map((replyItem) => (
        <ReplyItem key={replyItem.replyId}>
          <ReplyMeta isMobile={isMobile}>
            <ReplyNickname>
              {replyItem.nickname ?? DELETED_USER_NICKNAME}
            </ReplyNickname>
            <ReplyDot>·</ReplyDot>
            <span>{convertRelativeTime(replyItem.createdAt)}</span>
          </ReplyMeta>
          <ReplyContent isMobile={isMobile}>{replyItem.reply}</ReplyContent>
        </ReplyItem>
      ))}
    </ReplyListContainer>
  );
};

ReplyList.Loading = function ReplyListLoading({
  isMobile,
}: {
  isMobile: boolean;
}) {
  return <ReplyStatus isMobile={isMobile}>로딩 중...</ReplyStatus>;
};

export default ReplyList;

const ReplyListContainer = styled.ul`
  margin: 0;
  padding: 0 0 0 12px;
  border-left: 2px solid ${({ theme }) => theme.colors.stroke};

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const ReplyItem = styled.li`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const ReplyMeta = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 6px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const ReplyNickname = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReplyDot = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
`;

const ReplyContent = styled.p<{ isMobile: boolean }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;

const ReplyStatus = styled.p<{ isMobile: boolean }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;
