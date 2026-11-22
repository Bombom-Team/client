import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { queries } from '@/apis/queries';
import { useAddBookmarkMutation } from '@/hooks/useAddBookmarkMutation';
import { useDebounce } from '@/hooks/useDebounce';
import { useRemoveBookmarkMutation } from '@/hooks/useRemoveBookmarkMutation';

interface UseArticleBookmarkParams {
  articleId: number;
}

export const useArticleBookmark = ({ articleId }: UseArticleBookmarkParams) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data: bookmarked } = useQuery(
    queries.articleBookmarkStatus({ articleId }),
  );
  const { mutate: addBookmark } = useAddBookmarkMutation({ articleId });
  const { mutate: removeBookmark } = useRemoveBookmarkMutation({ articleId });

  const debouncedSyncBookmark = useDebounce(
    () => {
      if (isBookmarked) {
        addBookmark();
      } else {
        removeBookmark();
      }
    },
    500,
    { autoCancelOnUnmount: false },
  );

  const toggleBookmark = useCallback(() => {
    setIsBookmarked((prev) => !prev);
    debouncedSyncBookmark();
  }, [debouncedSyncBookmark]);

  useEffect(() => {
    setIsBookmarked(bookmarked?.bookmarkStatus ?? false);
  }, [bookmarked?.bookmarkStatus]);

  return {
    isBookmarked,
    toggleBookmark,
  };
};
