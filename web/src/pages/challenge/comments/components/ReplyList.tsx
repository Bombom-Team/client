import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { convertRelativeTime } from '../utils/date';
import { queries } from '@/apis/queries';
import Flex from '@/components/Flex/Flex';
import Text from '@/components/Text/Text';
import { useDevice } from '@/hooks/useDevice';

const DELETED_USER_NICKNAME = '탈퇴한 회원';

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
          <Flex gap={6} align="center">
            <ReplyMetaText isMobile={isMobile}>
              {replyItem.nickname ?? DELETED_USER_NICKNAME}
            </ReplyMetaText>
            <Dot isMobile={isMobile}>·</Dot>
            <ReplyMetaText isMobile={isMobile}>
              {convertRelativeTime(replyItem.createdAt)}
            </ReplyMetaText>
            {replyItem.isPrivate && (
              <>
                <Dot isMobile={isMobile}>·</Dot>
                <ReplyMetaText isMobile={isMobile}>(비밀 답글)</ReplyMetaText>
              </>
            )}
          </Flex>
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

const ReplyMetaText = styled.span<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;

const Dot = styled.span<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};
`;

const ReplyStatus = styled.p<{ isMobile: boolean }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;
