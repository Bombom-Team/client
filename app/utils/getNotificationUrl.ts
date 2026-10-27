export const getNotificationUrl = (data?: Record<string, unknown> | null) => {
  if (!data) return null;

  switch (data.notificationType) {
    case 'ARTICLE':
      return `/articles/${data.articleId}`;
    case 'EVENT':
      return '/event';
    case 'INQUIRY_MESSAGE_ARRIVAL': {
      const roomId = Number(data.roomId);
      if (Number.isNaN(roomId)) return null;
      return `/support/inquiry/${roomId}`;
    }
    default:
      return null;
  }
};
