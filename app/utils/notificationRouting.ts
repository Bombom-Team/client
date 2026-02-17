export type NotificationType = 'ARTICLE' | 'EVENT';

export const getNotificationUrl = (data: Record<string, unknown>) => {
  switch (data.notificationType) {
    case 'ARTICLE':
      return `/articles/${data.articleId}`;
    case 'EVENT':
      return '/event';
    default:
      return null;
  }
};
