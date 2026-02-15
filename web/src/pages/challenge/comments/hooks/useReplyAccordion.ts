import { useCallback, useState } from 'react';

interface UseReplyAccordionProps {
  replyCount: number;
}

const useReplyAccordion = ({ replyCount }: UseReplyAccordionProps) => {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const hasReplies = replyCount > 0;

  const toggleReplyAccordion = useCallback(() => {
    setIsReplyOpen((prev) => !prev);
  }, []);

  return {
    isReplyOpen,
    toggleReplyAccordion,
    hasReplies,
  };
};

export default useReplyAccordion;
