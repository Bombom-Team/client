import { useCallback, useState } from 'react';

interface UseCommentLikeParams {
  initialLiked: boolean;
}

const useCommentLike = ({ initialLiked }: UseCommentLikeParams) => {
  const [liked, setLiked] = useState(initialLiked);

  const toggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);

  return {
    liked,
    toggleLike,
  };
};

export default useCommentLike;
