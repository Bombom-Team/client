import styled from '@emotion/styled';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { flywayQueries } from '@/apis/flyway/flyway.query';
import { Button } from '@/components/Button';
import type { WorkKind } from '@/apis/flyway/flyway.api';

interface WipRegisterFormProps {
  existingTables: string[];
  defaultVersion: string;
  onClose: () => void;
}

export const WipRegisterForm = ({
  existingTables,
  defaultVersion,
  onClose,
}: WipRegisterFormProps) => {
  const queryClient = useQueryClient();
  const [workKind, setWorkKind] = useState<WorkKind>('EXISTING_TABLE');
  const [targetTable, setTargetTable] = useState('');
  const [plannedVersion, setPlannedVersion] = useState(defaultVersion);
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');

  const { mutate, isPending, isError, error, data } = useMutation({
    ...flywayQueries.mutation.createWip(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flywayQueries.all });
    },
  });

  const isExistingTable = workKind === 'EXISTING_TABLE';
  const canSubmit =
    plannedVersion.trim().length > 0 &&
    description.trim().length > 0 &&
    assignee.trim().length > 0 &&
    (isExistingTable === false || targetTable.trim().length > 0);

  const handleSubmit = () => {
    mutate({
      workKind,
      targetTable: isExistingTable ? targetTable.trim() : undefined,
      plannedVersion: plannedVersion.trim(),
      description: description.trim(),
      assignee: assignee.trim(),
    });
  };

  return (
    <Panel>
      <PanelHeader>
        <strong>작업중 등록</strong>
        <span>새 마이그레이션을 미리 예약해 번호 충돌을 막아요</span>
        <CloseButton type="button" onClick={onClose}>
          ✕
        </CloseButton>
      </PanelHeader>

      <Row>
        <Field>
          <Label>작업 종류</Label>
          <Segment>
            <SegmentButton
              type="button"
              $active={isExistingTable}
              onClick={() => setWorkKind('EXISTING_TABLE')}
            >
              기존 테이블
            </SegmentButton>
            <SegmentButton
              type="button"
              $active={isExistingTable === false}
              onClick={() => setWorkKind('NEW_TABLE')}
            >
              새로운 테이블
            </SegmentButton>
          </Segment>
        </Field>

        {isExistingTable ? (
          <Field>
            <Label>대상 테이블</Label>
            <Input
              list="flyway-existing-tables"
              value={targetTable}
              placeholder="newsletter"
              onChange={(event) => setTargetTable(event.target.value)}
            />
            <datalist id="flyway-existing-tables">
              {existingTables.map((table) => (
                <option key={table} value={table} />
              ))}
            </datalist>
          </Field>
        ) : null}

        <Field>
          <Label>예정 버전</Label>
          <Input
            value={plannedVersion}
            placeholder="V36.1.0"
            onChange={(event) => setPlannedVersion(event.target.value)}
          />
        </Field>
        <Field $grow>
          <Label>설명</Label>
          <Input
            value={description}
            placeholder="add_open_rate_to_newsletter"
            onChange={(event) => setDescription(event.target.value)}
          />
        </Field>
        <Field>
          <Label>담당자</Label>
          <Input
            value={assignee}
            placeholder="github-id"
            onChange={(event) => setAssignee(event.target.value)}
          />
        </Field>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isPending || !!data}
        >
          {isPending ? '등록 중...' : '저장'}
        </Button>
      </Row>

      {isError ? (
        <Notice $error>
          등록 실패: {(error as Error)?.message ?? '알 수 없는 오류'}
        </Notice>
      ) : null}
      {data ? (
        <Notice>
          이슈 #{data.issueNumber} 생성됨 —{' '}
          <a href={data.issueUrl} target="_blank" rel="noreferrer">
            GitHub에서 보기
          </a>
        </Notice>
      ) : null}
    </Panel>
  );
};

const Panel = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: #fffdf7;
`;

const PanelHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  span {
    color: ${({ theme }) => theme.colors.gray500};
    font-size: ${({ theme }) => theme.fontSize.sm};
  }
`;

const CloseButton = styled.button`
  margin-left: auto;
  color: ${({ theme }) => theme.colors.gray500};
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;
  flex-wrap: wrap;
`;

const Field = styled.div<{ $grow?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: ${({ $grow }) => ($grow ? 1 : 'none')};
  min-width: 140px;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Segment = styled.div`
  display: inline-flex;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const SegmentButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  cursor: pointer;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.white : theme.colors.gray600};
`;

const Notice = styled.p<{ $error?: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme, $error }) =>
    $error ? theme.colors.error : theme.colors.success};
`;
