import { useCallback, useState } from 'react';

interface UseCommentLikeParams {
  initialCount?: number;
  initialLiked?: boolean;
}

const useCommentLike = ({
  initialCount = 0,
  initialLiked = false,
}: UseCommentLikeParams) => {
  const [likeCount, setLikeCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);

  const changeLiked = useCallback(() => {
    const nextLiked = !liked;
    setLiked((prev) => !prev);

    return nextLiked;
  }, [liked]);

  const changeLikeCount = (isLiked: boolean) => {
    if (isLiked) {
      setLikeCount((prevCount) => prevCount + 1);
    } else {
      setLikeCount((prevCount) => Math.max(prevCount - 1, 0));
    }
  };

  const toggleLike = useCallback(() => {
    const nextLiked = changeLiked();
    changeLikeCount(nextLiked);
  }, [changeLiked]);

  return {
    likeCount,
    liked,
    toggleLike,
  };
};

export default useCommentLike;
