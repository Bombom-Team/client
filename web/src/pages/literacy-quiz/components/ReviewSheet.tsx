import styled from '@emotion/styled';
import ExamLayout from './ExamLayout';
import PaperHeader from './PaperHeader';
import PaperQuestion from './PaperQuestion';
import { CHOICE_MARKS } from '../constants/exam';
import { LITERACY_QUESTIONS } from '../constants/questions';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import type { LiteracyQuizQuestionResult } from '@/apis/literacyQuiz/literacyQuiz.api';

interface ReviewSheetProps {
  picks: number[][];
  correctCount: number;
  questionResults: LiteracyQuizQuestionResult[];
  onBack: () => void;
}

const EXPLANATION_SEPARATOR = ' · ';

// 서버 해설은 '정답 ① · 설명' 형태의 일반 텍스트라 앞부분만 굵게 보여 준다.
const splitExplanation = (explanation: string) => {
  const separatorIndex = explanation.indexOf(EXPLANATION_SEPARATOR);
  if (!explanation.startsWith('정답') || separatorIndex === -1) {
    return { head: '', body: explanation };
  }
  return {
    head: explanation.slice(0, separatorIndex),
    body: explanation.slice(separatorIndex),
  };
};

// '문제와 해설 보기': 시험지 위에 빨간 채점 표시, 내 답(검은 동그라미)과 정답(파란색), 해설을 보여 준다.
const ReviewSheet = ({
  picks,
  correctCount,
  questionResults,
  onBack,
}: ReviewSheetProps) => {
  return (
    <ExamLayout
      title="문제와 해설"
      topAside={
        <Score>
          5문제 중 <ScoreNumber>{correctCount}</ScoreNumber>개 맞힘
        </Score>
      }
      topExtra={
        <Legend>
          <LegendItem>
            <LegendMine />내 답
          </LegendItem>
          <LegendItem>
            <LegendAnswer />
            정답
          </LegendItem>
          <LegendItem>
            <LegendGrade>○</LegendGrade>맞음 · <LegendGrade>／</LegendGrade>
            틀림
          </LegendItem>
        </Legend>
      }
      bottomLabel={`${correctCount} / 5 맞힘`}
      buttonLabel="결과로 돌아가기"
      onButtonClick={onBack}
    >
      <PaperHeader />
      {LITERACY_QUESTIONS.map((question, index) => {
        const result = questionResults[index];
        const mine = picks[index] ?? [];
        const answer = result?.answer ?? [];
        const isCorrect = result?.correct ?? false;
        const { head, body } = splitExplanation(result?.explanation ?? '');

        return (
          <PaperQuestion
            key={question.stemHtml}
            index={index}
            question={question}
            gradeMark={
              isCorrect ? (
                <GradeMark viewBox="0 0 40 40" role="img" aria-label="맞음">
                  <path
                    d="M21 5.5c8.6.3 14.6 6.9 14.2 15.1-.4 8.4-7.4 14.6-15.6 14.1C11.4 34.2 5 27.6 5.4 19.4 5.8 11.8 11.6 5.6 19.8 4"
                    fill="none"
                    stroke={LITERACY_COLORS.stamp}
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </GradeMark>
              ) : (
                <GradeMark viewBox="0 0 40 40" role="img" aria-label="틀림">
                  <path
                    d="M9 33.5C16 24 24 14 33 5.5"
                    fill="none"
                    stroke={LITERACY_COLORS.stamp}
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />
                </GradeMark>
              )
            }
          >
            <ChoiceList>
              {question.choices.map((choice, choiceIndex) => {
                const choiceNumber = choiceIndex + 1;
                const isMine = mine.includes(choiceNumber);
                const isAnswer = answer.includes(choiceNumber);
                return (
                  <ChoiceItem key={choice}>
                    <ReviewChoice isAnswer={isAnswer}>
                      <Mark isMine={isMine} isAnswer={isAnswer}>
                        {CHOICE_MARKS[choiceIndex]}
                      </Mark>
                      <ChoiceText>
                        {choice}
                        {isAnswer && <AnswerTag>정답</AnswerTag>}
                        {isMine && <MineTag>내 답</MineTag>}
                      </ChoiceText>
                    </ReviewChoice>
                  </ChoiceItem>
                );
              })}
            </ChoiceList>
            {mine.length === 0 && <NoAnswer>답을 고르지 않았어요</NoAnswer>}
            <Explanation>
              <ExplanationTitle>해설</ExplanationTitle>
              <ExplanationText>
                {head && <strong>{head}</strong>}
                {body}
              </ExplanationText>
            </Explanation>
          </PaperQuestion>
        );
      })}
    </ExamLayout>
  );
};

export default ReviewSheet;

const Score = styled.span`
  font: 700 3.1cqw ${LITERACY_FONTS.head};
`;

const ScoreNumber = styled.b`
  margin: 0 0.4cqw;

  color: ${LITERACY_COLORS.stamp};
  font: 400 4.8cqw/1 ${LITERACY_FONTS.display};
`;

const Legend = styled.div`
  display: flex;
  gap: 1.4cqw 4cqw;
  flex-wrap: wrap;

  color: ${LITERACY_COLORS.sub};
  font: 700 2.7cqw ${LITERACY_FONTS.head};
`;

const LegendItem = styled.span`
  display: inline-flex;
  gap: 1.2cqw;
  align-items: center;
`;

const LegendMine = styled.i`
  width: 3.2cqw;
  height: 3.2cqw;
  border: 0.55cqw solid ${LITERACY_COLORS.ink};
  border-radius: 50%;

  display: inline-block;
`;

const LegendAnswer = styled.i`
  width: 3.2cqw;
  height: 3.2cqw;
  border-radius: 50%;

  display: inline-block;

  background: ${LITERACY_COLORS.answerBlue};
`;

const LegendGrade = styled.i`
  color: ${LITERACY_COLORS.stamp};
  font-style: normal;
  font-weight: 800;
`;

const GradeMark = styled.svg`
  position: absolute;
  top: -2.8cqw;
  left: -3.6cqw;
  width: 12cqw;
  height: 12cqw;

  pointer-events: none;
`;

const ChoiceList = styled.ul`
  margin: 0;
  padding: 0;

  display: grid;
  gap: 1.6cqw;

  list-style: none;
`;

const ChoiceItem = styled.li``;

const ReviewChoice = styled.div<{ isAnswer: boolean }>`
  padding: 0.6cqw 0;

  display: grid;
  gap: 2cqw;
  align-items: start;

  color: ${({ isAnswer }) =>
    isAnswer ? LITERACY_COLORS.answerBlue : LITERACY_COLORS.sub};
  font: ${({ isAnswer }) => (isAnswer ? 700 : 400)} max(13px, 3.6cqw) / 1.65
    ${LITERACY_FONTS.serif};

  grid-template-columns: 7cqw minmax(0, 1fr);

  word-break: keep-all;
`;

const Mark = styled.span<{ isMine: boolean; isAnswer: boolean }>`
  position: relative;
  width: 7cqw;
  height: 7cqw;

  display: grid;

  font: 400 4.6cqw/1 ${LITERACY_FONTS.serif};

  place-items: center;

  &::after {
    position: absolute;
    border: 0.6cqw solid
      ${({ isAnswer }) =>
        isAnswer ? LITERACY_COLORS.answerBlue : LITERACY_COLORS.ink};
    border-radius: 50% 46% 52% 44%;

    display: ${({ isMine }) => (isMine ? 'block' : 'none')};

    content: '';
    inset: -0.4cqw -0.8cqw -0.2cqw -0.4cqw;

    transform: rotate(-10deg);
  }
`;

const ChoiceText = styled.span``;

const AnswerTag = styled.em`
  margin-left: 1.6cqw;
  padding: 0.3cqw 1.4cqw;

  background: ${LITERACY_COLORS.answerBlue};
  color: ${({ theme }) => theme.colors.white};
  font: 700 2.5cqw ${LITERACY_FONTS.head};
  font-style: normal;
  vertical-align: 0.3cqw;
  white-space: nowrap;
`;

const MineTag = styled.em`
  margin-left: 1.6cqw;
  padding: 0.3cqw 1.4cqw;
  border: 1px solid ${LITERACY_COLORS.ink};

  color: ${LITERACY_COLORS.ink};
  font: 700 2.5cqw ${LITERACY_FONTS.head};
  font-style: normal;
  vertical-align: 0.3cqw;
  white-space: nowrap;
`;

const NoAnswer = styled.p`
  margin: -1cqw 0 0 9cqw;

  color: ${LITERACY_COLORS.stamp};
  font: 700 2.9cqw ${LITERACY_FONTS.head};
`;

const Explanation = styled.div`
  padding: 2.6cqw 3.4cqw;
  border-left: 1cqw solid ${LITERACY_COLORS.answerBlue};

  background: ${LITERACY_COLORS.answerBlueLight};
  color: ${LITERACY_COLORS.ink};
  font: 500 max(12.5px, 3.3cqw) / 1.75 ${LITERACY_FONTS.head};

  word-break: keep-all;
`;

const ExplanationTitle = styled.b`
  margin-bottom: 0.6cqw;

  display: block;

  color: ${LITERACY_COLORS.answerBlue};
  font: 800 3cqw ${LITERACY_FONTS.head};
`;

const ExplanationText = styled.p`
  margin: 0;

  strong {
    color: ${LITERACY_COLORS.answerBlue};
    font-weight: 800;
  }
`;
