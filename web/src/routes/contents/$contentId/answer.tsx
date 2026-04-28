import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { queries } from '@/apis/queries';

export const Route = createFileRoute('/contents/$contentId/answer')({
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
      {
        title: '매일메일 | 정답 조회',
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { contentId } = Route.useParams();
  const { data, isError, isLoading } = useQuery(
    queries.maeilMailAnswer({ contentId }),
  );
  const {
    data: myAnswer,
    isError: isMyAnswerError,
    isLoading: isMyAnswerLoading,
  } = useQuery(queries.maeilMailMyAnswer({ contentId }));

  return (
    <Container>
      <Header>
        <LogoBox aria-hidden />
        <LogoText>매일메일</LogoText>
      </Header>

      <ContentWrapper>
        {data?.title && <QuestionTitle>{data.title}</QuestionTitle>}

        <AnswerGrid>
          <ModelAnswerSection>
            <SectionTitle status="success">모범 답안</SectionTitle>
            {isLoading && <StateText>답안을 불러오고 있어요.</StateText>}
            {isError && (
              <StateText>
                답안을 불러오지 못했어요. 다시 시도해 주세요.
              </StateText>
            )}
            {data?.answer && (
              <AnswerContent
                dangerouslySetInnerHTML={{
                  __html: data.answer,
                }}
              />
            )}
          </ModelAnswerSection>

          <MyAnswerSection>
            <SectionTitle status="muted">내 답변</SectionTitle>
            <MyAnswerBox>
              {isMyAnswerLoading && (
                <MyAnswerText>제출한 답변을 불러오고 있어요.</MyAnswerText>
              )}
              {isMyAnswerError && (
                <MyAnswerText>
                  제출한 답변을 불러오지 못했어요. 다시 시도해 주세요.
                </MyAnswerText>
              )}
              {myAnswer?.answer && (
                <MyAnswerText>{myAnswer.answer}</MyAnswerText>
              )}
              {!isMyAnswerLoading && !isMyAnswerError && !myAnswer?.answer && (
                <MyAnswerText>제출한 답변이 없어요.</MyAnswerText>
              )}
            </MyAnswerBox>
          </MyAnswerSection>
        </AnswerGrid>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.main`
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.header`
  height: 72px;
  padding: 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  gap: 10px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const LogoBox = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.primary};
`;

const LogoText = styled.span`
  color: ${({ theme }) => theme.colors.navy};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
  padding: 72px 24px 48px;

  @media (width <= 768px) {
    padding: 40px 20px;
  }
`;

const QuestionTitle = styled.h1`
  max-width: 1240px;
  margin-top: 24px;

  color: ${({ theme }) => theme.colors.navy};
  font: ${({ theme }) => theme.fonts.t15Bold};

  word-break: keep-all;

  @media (width <= 768px) {
    margin-top: 16px;
    font: ${({ theme }) => theme.fonts.t11Bold};
  }
`;

const AnswerGrid = styled.div`
  margin-top: 76px;

  display: grid;

  grid-template-columns: minmax(0, 1fr) minmax(360px, 504px);

  @media (width <= 960px) {
    margin-top: 48px;
    grid-template-columns: 1fr;
  }
`;

const ModelAnswerSection = styled.section`
  min-width: 0;
  padding-right: 56px;

  @media (width <= 960px) {
    padding-right: 0;
  }
`;

const MyAnswerSection = styled.aside`
  min-width: 0;
  padding-left: 56px;
  border-left: 1px solid ${({ theme }) => theme.colors.dividers};

  @media (width <= 960px) {
    margin-top: 40px;
    padding-top: 40px;
    padding-left: 0;
    border-top: 1px solid ${({ theme }) => theme.colors.dividers};
    border-left: 0;
  }
`;

const SectionTitle = styled.h2<{ status: 'muted' | 'success' }>`
  color: ${({ status, theme }) =>
    status === 'success' ? theme.colors.primary : '#98a2b3'};
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const StateText = styled.p`
  margin-top: 48px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const AnswerContent = styled.article`
  margin-top: 48px;

  color: #344054;
  font: ${({ theme }) => theme.fonts.t8Regular};

  word-break: keep-all;

  h2 {
    margin: 42px 0 18px;

    color: ${({ theme }) => theme.colors.navy};
    font: ${({ theme }) => theme.fonts.t11Bold};
  }

  h2:first-of-type {
    margin-top: 0;
  }

  h3 {
    margin: 32px 0 12px;

    color: ${({ theme }) => theme.colors.navy};
    font: ${({ theme }) => theme.fonts.t8Bold};
  }

  p {
    margin: 0 0 22px;
  }

  strong {
    color: ${({ theme }) => theme.colors.navy};
    font-weight: 700;
  }

  pre {
    margin: 20px 0 28px;
    padding: 20px;
    border-radius: 8px;

    background-color: #f6f8fa;

    overflow-x: auto;
  }

  code {
    border-radius: 4px;

    background-color: #f6f8fa;
    color: ${({ theme }) => theme.colors.navy};
    font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
  }

  p code,
  li code {
    padding: 2px 4px;
  }

  pre code {
    padding: 0;

    font-size: 0.9375rem;
    line-height: 1.7;
    white-space: pre;
  }

  ul {
    margin: 12px 0 0;
    padding-left: 24px;
  }

  li {
    margin-top: 8px;
  }

  a {
    color: ${({ theme }) => theme.colors.info};
    text-decoration: underline;
  }

  @media (width <= 768px) {
    margin-top: 32px;
    font: ${({ theme }) => theme.fonts.t6Regular};

    h2 {
      font: ${({ theme }) => theme.fonts.t10Bold};
    }

    h3 {
      font: ${({ theme }) => theme.fonts.t7Bold};
    }
  }
`;

const MyAnswerBox = styled.div`
  min-height: 234px;
  margin-top: 28px;
  padding: 46px 38px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 8px;

  background-color: #f8fafc;
`;

const MyAnswerText = styled.p`
  color: ${({ theme }) => theme.colors.navy};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;
