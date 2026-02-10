import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convertRelativeTime } from '../utils/date';
import { queries } from '@/apis/queries';
import Flex from '@/components/Flex/Flex';
import Text from '@/components/Text/Text';
import { useDevice } from '@/hooks/useDevice';

interface ReplyListProps {
  challengeId: number;
  commentId: number;
  replyCount: number;
}

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
        <Flex as="li" key={replyItem.replyId} direction="column" gap={4}>
          <ReplyMeta isMobile={isMobile}>
            <Text color="textSecondary">{replyItem.nickname ?? '익명'}</Text>
            <Text color="textTertiary">·</Text>
            <Text color="textSecondary">
              {convertRelativeTime(replyItem.createdAt)}
            </Text>
            {replyItem.isPrivate && (
              <>
                <Text color="textTertiary">·</Text>
                <Text color="textSecondary">(비밀 답글)</Text>
              </>
            )}
          </ReplyMeta>
          <Text as="p" color="textPrimary" font={isMobile ? 'body2' : 'body1'}>
            {replyItem.reply}
          </Text>
        </Flex>
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

const ReplyMeta = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 6px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

const ReplyStatus = styled.p<{ isMobile: boolean }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;
