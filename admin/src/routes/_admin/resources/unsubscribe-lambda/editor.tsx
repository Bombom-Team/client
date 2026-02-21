import { ApiError } from '@bombom/shared/apis';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import CodeMirror from '@uiw/react-codemirror';
import { useEffect, useState } from 'react';
import { lambdaPlaywrightQueries } from '@/apis/lambdaPlaywright/lambdaPlaywright.query';
import { Button } from '@/components/Button';

export const Route = createFileRoute(
  '/_admin/resources/unsubscribe-lambda/editor',
)({
  component: UnsubscribeLambdaEditorPage,
  validateSearch: (search: Record<string, unknown>) => ({
    mode: search.mode === 'edit' ? 'edit' : 'view',
  }),
});

function UnsubscribeLambdaEditorPage() {
  const { mode } = useSearch({ from: Route.id });
  const { data, isLoading, isError, error } = useQuery(
    lambdaPlaywrightQueries.source(),
  );
  const [code, setCode] = useState('');
  const isEditable = mode === 'edit';
  const errorMessage =
    error instanceof ApiError
      ? `조회 실패 (${error.status}): ${error.message}`
      : `조회 실패: ${(error as Error)?.message ?? '알 수 없는 오류'}`;

  useEffect(() => {
    setCode(data?.content ?? '');
  }, [data]);

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(code);
    alert('JS 소스를 복사했습니다.');
  };

  const handleResetClick = () => {
    setCode(data?.content ?? '');
  };

  return (
    <Container>
      <TopBar>
        <InfoText>
          {isEditable
            ? '수정 모드입니다. 현재 저장 API는 아직 연결되어 있지 않습니다.'
            : '읽기 전용 모드입니다.'}
        </InfoText>
        <ActionBox>
          <Link to="/resources/unsubscribe-lambda">
            <Button as="span" variant="secondary">
              닫기
            </Button>
          </Link>
          {isEditable ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleResetClick}
            >
              원본으로 되돌리기
            </Button>
          ) : null}
          <Button type="button" onClick={handleCopyClick}>
            복사
          </Button>
        </ActionBox>
      </TopBar>

      {isLoading ? <StateText>로딩 중...</StateText> : null}
      {isError ? <ErrorText>{errorMessage}</ErrorText> : null}

      {!isError && !isLoading ? (
        <EditorWrapper>
          <CodeMirror
            value={code}
            onChange={(value) => {
              setCode(value);
            }}
            editable={isEditable}
            readOnly={!isEditable}
            basicSetup={{
              foldGutter: true,
            }}
            height="calc(100vh - 72px)"
            extensions={[javascript(), EditorView.lineWrapping]}
          />
        </EditorWrapper>
      ) : null}
    </Container>
  );
}

const Container = styled.section`
  min-height: 100vh;

  display: flex;
  flex-direction: column;

  background: #f3f4f6;
`;

const TopBar = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid #d1d5db;

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: space-between;

  background: #fff;
`;

const InfoText = styled.span`
  color: #374151;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ActionBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  & a {
    text-decoration: none;
  }
`;

const EditorWrapper = styled.div`
  overflow: hidden;
  border-top: 1px solid #e5e7eb;

  flex: 1;

  & .cm-editor {
    background: #fff;
    color: #111827;
    font-family: monospace;
    font-size: ${({ theme }) => theme.fontSize.sm};
  }

  & .cm-focused {
    outline: none;
  }

  & .cm-scroller {
    font-family: monospace;
  }

  & .cm-gutters {
    border-right: 1px solid #e5e7eb;

    background: #f9fafb;
    color: #6b7280;
  }

  & .cm-content ::selection {
    background: #dbeafe;
  }
`;

const StateText = styled.span`
  padding: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ErrorText = styled.span`
  padding: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
