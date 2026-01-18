import { useCallback, useState } from 'react';
import { useAddCommentLikeMutation } from './useAddCommentLikeMutation';
import { useDeleteCommentLikeMutation } from './useDeleteCommentLikeMutation';

interface UseCommentLikeParams {
  challengeId: number;
  commentId: number;
  initialLiked: boolean;
}

const useCommentLike = ({
  challengeId,
  commentId,
  initialLiked,
}: UseCommentLikeParams) => {
  const [liked, setLiked] = useState(initialLiked);

  const { mutate: addLike } = useAddCommentLikeMutation({
    challengeId,
    commentId,
    onAddSuccess: () => setLiked(true),
  });

  const { mutate: deleteLike } = useDeleteCommentLikeMutation({
    challengeId,
    commentId,
    onDeleteSuccess: () => setLiked(false),
  });

  const toggleLike = useCallback(() => {
    if (liked) {
      addLike();
    } else {
      deleteLike();
    }
  }, [addLike, deleteLike, liked]);

  return {
    liked,
    toggleLike,
  };
};

export default useCommentLike;
