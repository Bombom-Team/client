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
    return <ReplyStatus>답글이 없어요.</ReplyStatus>;
  }

  return (
    <ReplyListContainer>
      {replies.map((replyItem) => (
        <Flex as="li" key={replyItem.replyId} direction="column" gap={4}>
          <Flex gap={6} align="center">
            <ReplyMetaText>
              {replyItem.nickname ?? DELETED_USER_NICKNAME}
            </ReplyMetaText>
            <Dot>·</Dot>
            <ReplyMetaText>
              {convertRelativeTime(replyItem.createdAt)}
            </ReplyMetaText>
            {replyItem.isPrivate && (
              <>
                <Dot>·</Dot>
                <ReplyMetaText>(비밀 답글)</ReplyMetaText>
              </>
            )}
          </Flex>
          <Text
            as="p"
            color="textPrimary"
            font={isMobile ? 't5Regular' : 't6Regular'}
          >
            {replyItem.reply}
          </Text>
        </Flex>
      ))}
    </ReplyListContainer>
  );
};

ReplyList.Loading = function ReplyListLoading() {
  return <ReplyStatus>로딩 중...</ReplyStatus>;
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

const ReplyMetaText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const Dot = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const ReplyStatus = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
