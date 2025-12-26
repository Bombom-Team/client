import { articlesQueries } from './articles/articles.query';
import { authQueries } from './auth/auth.query';
import { bookmarkQueries } from './bookmark/bookmark.query';
import { highlightQueries } from './highlight/highlight.query';
import { membersQueries } from './members/members.query';
import { newslettersQueries } from './newsletters/newsletters.query';
import { noticeQueries } from './notice/notice.query';
import { notificationQueries } from './notification/notification.query';
import { previousArticlesQueries } from './previousArticles/previousArticles.query';

export const queries = {
  // articles
  ...articlesQueries,

  // auth
  ...authQueries,

  // bookmarks
  ...bookmarkQueries,

  // highlights
  ...highlightQueries,

  // members
  ...membersQueries,

  // newsletters
  ...newslettersQueries,

  // notices
  ...noticeQueries,

  // notification
  ...notificationQueries,

  // previous articles
  ...previousArticlesQueries,
};
