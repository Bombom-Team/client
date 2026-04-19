import { ApiError } from '@bombom/shared/apis';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from '@codemirror/view';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import CodeMirror from '@uiw/react-codemirror';
import { lambdaPlaywrightQueries } from '@/apis/lambdaPlaywright/lambdaPlaywright.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';

export const Route = createFileRoute('/_admin/resources/unsubscribe-lambda/')({
  component: UnsubscribeLambdaPage,
});

function UnsubscribeLambdaPage() {
  const { data, isLoading, isError, error, isFetching } = useQuery(
    lambdaPlaywrightQueries.source(),
  );
  const sourceCode = (data?.content ?? '').replace(/\s+$/, '');
  const errorMessage =
    error instanceof ApiError
      ? `조회 실패 (${error.status}): ${error.message}`
      : `조회 실패: ${(error as Error)?.message ?? '알 수 없는 오류'}`;

  const handleCopyClick = async () => {
    await navigator.clipboard.writeText(data?.content ?? '');
    alert('JS 소스를 복사했습니다.');
  };

  return (
    <Layout title="리소스 관리">
      <Container>
        <HeaderBox>
          <Title>구독 자동 취소 Lambda</Title>
          <Description>
            Dev Lambda Playwright 스크립트(JS 코드)를 조회하고 복사합니다.
          </Description>
        </HeaderBox>

        <ActionBox>
          <Link
            to="/resources/unsubscribe-lambda/editor"
            search={{ mode: 'view' }}
          >
            <Button as="span" variant="secondary">
              읽기 모드
            </Button>
          </Link>
          <Link
            to="/resources/unsubscribe-lambda/editor"
            search={{ mode: 'edit' }}
          >
            <Button as="span">수정하기</Button>
          </Link>
          <Button
            type="button"
            onClick={handleCopyClick}
            disabled={!data || isFetching}
          >
            코드 복사
          </Button>
        </ActionBox>

        <ContentBox>
          <Label>source (index.js)</Label>
          {isLoading ? <StateText>로딩 중...</StateText> : null}
          {isError ? <ErrorText>{errorMessage}</ErrorText> : null}
          {!isError && !isLoading ? (
            <CodeViewer role="region" aria-label="javascript-source-viewer">
              <CodeMirror
                value={sourceCode}
                editable={false}
                readOnly
                basicSetup={{
                  foldGutter: false,
                  highlightActiveLine: false,
                  highlightActiveLineGutter: false,
                }}
                extensions={[javascript(), EditorView.lineWrapping]}
              />
            </CodeViewer>
          ) : null}
        </ContentBox>
      </Container>
    </Layout>
  );
}

const Container = styled.section`
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;

  background: ${({ theme }) => theme.colors.white};
`;

const HeaderBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ActionBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;

  & a {
    text-decoration: none;
  }
`;

const ContentBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const StateText = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const CodeViewer = styled.pre`
  overflow: hidden;
  margin: 0;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

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
    overflow: auto;
    max-height: 70vh;

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
