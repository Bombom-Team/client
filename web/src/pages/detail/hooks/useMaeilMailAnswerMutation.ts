import { useMutation } from '@tanstack/react-query';
import { postMaeilMailAnswer } from '@/apis/maeilMail/maeilMail.api';

export const useMaeilMailAnswerMutation = () => {
  return useMutation({
    mutationFn: postMaeilMailAnswer,
  });
};
