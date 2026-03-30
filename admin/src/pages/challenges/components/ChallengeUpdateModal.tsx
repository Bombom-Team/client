import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { useUpdateChallengeMutation } from '@/pages/challenges/hooks/useUpdateChallengeMutation';
import type { Challenge } from '@/types/challenge';

type Props = {
  challenge: Challenge;
  onClose: () => void;
};

const ChallengeUpdateModal = ({ challenge, onClose }: Props) => {
  const [nameInput, setNameInput] = useState(challenge.name);
  const [generationInput, setGenerationInput] = useState(
    challenge.generation.toString(),
  );
  const [startDateInput, setStartDateInput] = useState(challenge.startDate);
  const [endDateInput, setEndDateInput] = useState(challenge.endDate);
  const { mutate: updateChallenge, isPending: isUpdating } =
    useUpdateChallengeMutation({
      challengeId: challenge.id,
      onSuccess: onClose,
    });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleUpdateChallenge = () => {
    if (!nameInput.trim()) {
      alert('챌린지 이름을 입력해주세요.');
      return;
    }

    if (!generationInput.trim()) {
      alert('챌린지 기수를 입력해주세요.');
      return;
    }

    const generation = Number(generationInput);

    if (!Number.isInteger(generation) || generation <= 0) {
      alert('챌린지 기수는 1 이상의 정수여야 합니다.');
      return;
    }

    if (!startDateInput) {
      alert('시작일을 입력해주세요.');
      return;
    }

    if (!endDateInput) {
      alert('종료일을 입력해주세요.');
      return;
    }

    if (startDateInput > endDateInput) {
      alert('종료일은 시작일보다 빠를 수 없습니다.');
      return;
    }

    updateChallenge({
      challengeId: challenge.id,
      payload: {
        name: nameInput.trim(),
        generation,
        startDate: startDateInput,
        endDate: endDateInput,
      },
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <Container onClick={(event) => event.stopPropagation()}>
        <Title>챌린지 수정</Title>
        <FormGroup>
          <Label htmlFor="challenge-update-name">챌린지 이름</Label>
          <Input
            id="challenge-update-name"
            type="text"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="challenge-update-generation">기수</Label>
          <Input
            id="challenge-update-generation"
            type="number"
            min={1}
            step={1}
            value={generationInput}
            onChange={(event) => setGenerationInput(event.target.value)}
          />
        </FormGroup>
        <DateFieldsWrapper>
          <FormGroup>
            <Label htmlFor="challenge-update-start-date">시작일</Label>
            <Input
              id="challenge-update-start-date"
              type="date"
              value={startDateInput}
              onChange={(event) => setStartDateInput(event.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="challenge-update-end-date">종료일</Label>
            <Input
              id="challenge-update-end-date"
              type="date"
              value={endDateInput}
              onChange={(event) => setEndDateInput(event.target.value)}
            />
          </FormGroup>
        </DateFieldsWrapper>
        <Description>
          startDate 또는 endDate를 바꾸면 서버에서 평일 수를 다시 계산합니다.
        </Description>
        <ActionsWrapper>
          <Button variant="secondary" type="button" onClick={onClose}>
            취소
          </Button>
          <Button
            type="button"
            onClick={handleUpdateChallenge}
            disabled={isUpdating}
          >
            {isUpdating ? '수정 중...' : '저장'}
          </Button>
        </ActionsWrapper>
      </Container>
    </ModalOverlay>
  );
};

export default ChallengeUpdateModal;

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(15 23 42 / 45%);

  inset: 0;
`;

const Container = styled.div`
  width: min(560px, 100%);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const Title = styled.h4`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const FormGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const DateFieldsWrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};

  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (width <= 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Input = styled.input`
  min-height: 48px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ActionsWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;
