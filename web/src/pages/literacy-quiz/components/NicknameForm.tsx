import styled from '@emotion/styled';
import { useState } from 'react';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { useRegisterNicknameMutation } from '../hooks/useRegisterNicknameMutation';
import { validateNickname } from '../utils/validateNickname';
import type { FormEvent } from 'react';

interface NicknameFormProps {
  attemptCode: string;
  onRegistered: (rank: number) => void;
}

const NicknameForm = ({ attemptCode, onRegistered }: NicknameFormProps) => {
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate: registerNickname, isPending } = useRegisterNicknameMutation({
    attemptCode,
    onSuccess: ({ rank }) => onRegistered(rank),
    onInvalid: setErrorMessage,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationMessage = validateNickname(nickname);
    setErrorMessage(validationMessage);
    if (validationMessage) return;

    registerNickname({ nickname: nickname.trim() });
  };

  return (
    <>
      <Form noValidate onSubmit={handleSubmit}>
        <Input
          type="text"
          value={nickname}
          maxLength={10}
          placeholder="닉네임 (2~10자)"
          aria-label="닉네임"
          aria-invalid={!!errorMessage}
          autoComplete="nickname"
          onChange={(event) => setNickname(event.target.value)}
        />
        <SubmitButton type="submit" disabled={isPending}>
          랭킹 등록
        </SubmitButton>
      </Form>
      <ErrorMessage role="alert">{errorMessage}</ErrorMessage>
    </>
  );
};

export default NicknameForm;

const Form = styled.form`
  display: grid;
  gap: 2cqw;

  grid-template-columns: minmax(0, 1fr) auto;
`;

const Input = styled.input`
  min-width: 0;
  padding: 1.6cqw 3cqw;
  border: 2px solid ${LITERACY_COLORS.ink};
  border-radius: 3cqw;

  background: ${({ theme }) => theme.colors.white};
  color: ${LITERACY_COLORS.ink};
  font: 500 max(14px, 3.6cqw) ${LITERACY_FONTS.head};

  user-select: text;

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primaryBomBom};
    outline-offset: 1px;
  }
`;

const SubmitButton = styled.button`
  padding: 0 5cqw;
  border: 0;
  border-radius: 3cqw;

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 800 max(13px, 3.4cqw) ${LITERACY_FONTS.body};

  cursor: pointer;

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }
`;

const ErrorMessage = styled.p`
  margin: -1.2cqw 0 0;

  color: ${LITERACY_COLORS.pen};
  font: 700 3cqw ${LITERACY_FONTS.body};
`;
