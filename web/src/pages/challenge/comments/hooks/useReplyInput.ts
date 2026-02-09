import { useState } from 'react';

const useReplyInput = () => {
  const [isReplyInputOpen, setIsReplyInputOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const toggleReplyInput = () => {
    setIsReplyInputOpen((prev) => !prev);
  };

  const changeReplyText = (text: string) => {
    setReplyText(text);
  };

  const toggleIsPrivate = () => {
    setIsPrivate((prev) => !prev);
  };

  const resetReplyInput = () => {
    setReplyText('');
    setIsPrivate(false);
    setIsReplyInputOpen(false);
  };

  return {
    isReplyInputOpen,
    toggleReplyInput,
    replyText,
    changeReplyText,
    isPrivate,
    toggleIsPrivate,
    resetReplyInput,
  };
};

export default useReplyInput;
