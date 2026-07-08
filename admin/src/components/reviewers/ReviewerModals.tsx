import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { reviewersQueries } from '@/apis/reviewers/reviewers.query';
import {
  useAddReviewerMutation,
  useUpdateSettingMutation,
} from '@/hooks/useReviewerAdminMutations';
import type { ReactNode } from 'react';

const ModalBase = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) => (
  <Overlay onClick={onClose}>
    <ModalCard onClick={(e) => e.stopPropagation()}>
      <ModalTitle>{title}</ModalTitle>
      {children}
    </ModalCard>
  </Overlay>
);

export const SettingModal = ({ onClose }: { onClose: () => void }) => {
  const { data: setting } = useSuspenseQuery(reviewersQueries.setting());
  const mutation = useUpdateSettingMutation();

  const [deadlineDays, setDeadlineDays] = useState(
    Math.max(1, Math.round(setting.deadline_hours / 24)),
  );
  const [excludeLabel, setExcludeLabel] = useState(setting.exclude_label);

  const handleSave = () => {
    mutation.mutate(
      { deadlineHours: deadlineDays * 24, excludeLabel: excludeLabel.trim() },
      { onSuccess: onClose },
    );
  };

  return (
    <ModalBase title="배정 설정" onClose={onClose}>
      <Field>
        <FieldLabel>리뷰 기한 (일)</FieldLabel>
        <FieldInput
          type="number"
          min={1}
          max={30}
          value={deadlineDays}
          onChange={(e) => setDeadlineDays(Number(e.target.value))}
        />
        <FieldHelp>
          배정 후 이 기간 안에 리뷰하지 않으면 지각으로 표시되고 Discord 알림이
          발송됩니다
        </FieldHelp>
      </Field>
      <Field>
        <FieldLabel>배정 제외 라벨</FieldLabel>
        <FieldInput
          type="text"
          value={excludeLabel}
          onChange={(e) => setExcludeLabel(e.target.value)}
        />
        <FieldHelp>PR에 이 라벨이 붙어 있으면 자동 배정하지 않습니다</FieldHelp>
      </Field>
      {mutation.isError && (
        <ErrorText>설정 저장에 실패했습니다. 다시 시도해주세요.</ErrorText>
      )}
      <ModalFooter>
        <SecondaryButton onClick={onClose}>취소</SecondaryButton>
        <PrimaryButton
          onClick={handleSave}
          disabled={
            mutation.isPending || deadlineDays < 1 || !excludeLabel.trim()
          }
        >
          저장
        </PrimaryButton>
      </ModalFooter>
    </ModalBase>
  );
};

export const AddReviewerModal = ({ onClose }: { onClose: () => void }) => {
  const mutation = useAddReviewerMutation();
  const [displayName, setDisplayName] = useState('');
  const [githubUsername, setGithubUsername] = useState('');

  const handleAdd = () => {
    mutation.mutate(
      {
        displayName: displayName.trim(),
        githubUsername: githubUsername.trim(),
      },
      { onSuccess: onClose },
    );
  };

  return (
    <ModalBase title="리뷰어 추가" onClose={onClose}>
      <Field>
        <FieldLabel>이름</FieldLabel>
        <FieldInput
          type="text"
          placeholder="홍길동"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>GitHub 아이디</FieldLabel>
        <FieldInput
          type="text"
          placeholder="github-username"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
        />
        <FieldHelp>
          순환 순서는 마지막 순번 다음으로 자동 지정됩니다. Discord 멘션을
          받으려면 admin 레포의 notify_ids.json에도 추가해주세요
        </FieldHelp>
      </Field>
      {mutation.isError && (
        <ErrorText>
          추가에 실패했습니다. 이미 등록된 GitHub 아이디인지 확인해주세요.
        </ErrorText>
      )}
      <ModalFooter>
        <SecondaryButton onClick={onClose}>취소</SecondaryButton>
        <PrimaryButton
          onClick={handleAdd}
          disabled={
            mutation.isPending || !displayName.trim() || !githubUsername.trim()
          }
        >
          추가
        </PrimaryButton>
      </ModalFooter>
    </ModalBase>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(17, 24, 39, 0.4);
`;

const ModalCard = styled.div`
  width: 400px;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ModalTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const Field = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const FieldLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const FieldInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FieldHelp = styled.p`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSize.xs};
  line-height: 1.5;
`;

const ErrorText = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const ModalFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;

const PrimaryButton = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled.button`
  padding: 8px 20px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray600};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;
