export const MAEIL_MAIL_ANSWER_CHECK_BUTTON_ID =
  'maeil-mail-answer-check-button';

const MAEIL_MAIL_BASE_URL = 'https://maeilmail.bombom.news';

export const getMaeilMailAnswerUrl = (contentId: number, articleId: number) => {
  const searchParams = new URLSearchParams({
    articleId: String(articleId),
  });

  return `${MAEIL_MAIL_BASE_URL}/contents/${contentId}/answer?${searchParams.toString()}`;
};
