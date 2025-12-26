import { queryOptions } from '@tanstack/react-query';
import {
  getArticleBookmarkStatus,
  getBookmarks,
  getBookmarksStatisticsNewsletters,
  type GetArticleBookmarkStatusParams,
  type GetBookmarksParams,
} from './bookmark.api';

export const bookmarkQueries = {
  bookmarks: (params?: GetBookmarksParams) =>
    queryOptions({
      queryKey: ['bookmarks', params],
      queryFn: () => getBookmarks(params),
    }),

  articleBookmarkStatus: (params: GetArticleBookmarkStatusParams) =>
    queryOptions({
      queryKey: ['bookmarks', 'status', 'articles', params.articleId],
      queryFn: () => getArticleBookmarkStatus(params),
    }),

  bookmarksStatisticsNewsletters: () =>
    queryOptions({
      queryKey: ['bookmarks', 'statistics', 'newsletters'],
      queryFn: getBookmarksStatisticsNewsletters,
    }),
};
