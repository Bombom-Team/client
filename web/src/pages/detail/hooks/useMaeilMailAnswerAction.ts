import { toast } from '@bombom/shared/ui-web';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { getMaeilMailAnswerUrl } from '../constants/maeilMail';
import { queries } from '@/apis/queries';

interface UseMaeilMailAnswerActionParams {
  articleId: number;
  onAnswerNotSubmitted: () => void;
}

export const useMaeilMailAnswerAction = ({
  articleId,
  onAnswerNotSubmitted,
}: UseMaeilMailAnswerActionParams) => {
  const navigate = useNavigate();

  const { data: content } = useQuery(queries.contentByArticleId({ articleId }));
  const contentId = content?.contentId;

  const { data: submittedAnswer } = useQuery(
    queries.answerByArticleId({ articleId }),
  );
  const hasSubmittedAnswer = typeof submittedAnswer === 'string';

  const checkMaeilMailAnswer = () => {
    if (contentId === undefined) {
      toast.error('정답을 확인할 수 없어요. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (hasSubmittedAnswer) {
      navigate({ href: getMaeilMailAnswerUrl(contentId, articleId) });
      return;
    }
    onAnswerNotSubmitted();
  };

  return { checkMaeilMailAnswer, contentId };
};
