import { useCallback, useState } from 'react';
import { useAddCommentLikeMutation } from './useAddCommentLikeMutation';
import { useDeleteCommentLikeMutation } from './useDeleteCommentLikeMutation';

interface UseCommentLikeParams {
  challengeId: number;
  commentId: number;
  initialLiked: boolean;
  initialCount: number;
}

const useCommentLike = ({
  challengeId,
  commentId,
  initialLiked,
  initialCount,
}: UseCommentLikeParams) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);

  const { mutate: addLike } = useAddCommentLikeMutation({
    challengeId,
    commentId,
    onAddSuccess: ({ likeCount: likeCountResult }) => {
      setLiked(true);
      setLikeCount(likeCountResult);
    },
  });

  const { mutate: deleteLike } = useDeleteCommentLikeMutation({
    challengeId,
    commentId,
    onDeleteSuccess: ({ likeCount: likeCountResult }) => {
      setLiked(false);
      setLikeCount(likeCountResult);
    },
  });

  const toggleLike = useCallback(() => {
    if (liked) {
      deleteLike();
    } else {
      addLike();
    }
  }, [addLike, deleteLike, liked]);

  return {
    liked,
    likeCount,
    toggleLike,
  };
};

export default useCommentLike;
