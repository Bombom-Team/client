import styled from '@emotion/styled';
import { CHOICE_MARKS } from '../constants/exam';
import { PEN_CIRCLE } from '../constants/keyframes';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { addWatermark } from '../utils/addWatermark';
import type { LiteracyQuestion } from '../types/literacyQuiz';
import type { Ref } from 'react';

interface PcPaperQuestionProps {
  index: number;
  question: LiteracyQuestion;
  picked: number[];
  questionRef?: Ref<HTMLElement>;
  onPick: (choice: number) => void;
}

// PC 2단 문제지의 한 문항. 발문·지문 HTML은 저장소의 정적 문항 데이터만 넣는다.
const PcPaperQuestion = ({
  index,
  question,
  picked,
  questionRef,
  onPick,
}: PcPaperQuestionProps) => {
  return (
    <Container ref={questionRef} aria-label={`${index + 1}번 문항`}>
      <Stem>
        <StemText
          dangerouslySetInnerHTML={{
            __html: `${index + 1}. ${question.stemHtml}`,
          }}
        />{' '}
        <Point>[1점]</Point>
      </Stem>
      {question.isMulti && <MultiNote>※ 답이 여러 개일 수 있음</MultiNote>}
      <Passage
        dangerouslySetInnerHTML={{ __html: addWatermark(question.passageHtml) }}
      />
      <ChoiceList aria-label={`${index + 1}번 보기`}>
        {question.choices.map((choice, choiceIndex) => {
          const choiceNumber = choiceIndex + 1;
          const isPicked = picked.includes(choiceNumber);
          return (
            <ChoiceItem key={choice}>
              <ChoiceButton
                type="button"
                aria-pressed={isPicked}
                onClick={() => onPick(choiceNumber)}
              >
                <Mark isPicked={isPicked}>{CHOICE_MARKS[choiceIndex]}</Mark>
                <ChoiceText>{choice}</ChoiceText>
              </ChoiceButton>
            </ChoiceItem>
          );
        })}
      </ChoiceList>
    </Container>
  );
};

export default PcPaperQuestion;

const Container = styled.section`
  margin-bottom: 28px;

  display: grid;
  gap: 10px;

  break-inside: avoid;
  scroll-margin-top: 16px;

  u.k {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

const Stem = styled.p`
  margin: 0;
  padding-left: 18px;

  font: 700 15.5px/1.65 ${LITERACY_FONTS.serif};
  text-indent: -18px;

  word-break: keep-all;
`;

const StemText = styled.span``;

const Point = styled.span`
  font: 400 12px ${LITERACY_FONTS.serif};
  white-space: nowrap;
`;

const MultiNote = styled.p`
  margin: -4px 0 0 18px;

  color: ${LITERACY_COLORS.brandDeep};
  font: 700 12px ${LITERACY_FONTS.head};
`;

const Passage = styled.div`
  .passage {
    position: relative;
    padding: 10px 14px 20px;
    border: 1.5px solid ${LITERACY_COLORS.ink};

    background: ${({ theme }) => theme.colors.white};
    font-size: 13px;
    line-height: 1.75;

    word-break: keep-all;
  }

  .passage p,
  .passage ul {
    margin: 0 0 4px;
  }

  .passage ul {
    padding-left: 18px;
    list-style: disc;
  }

  .passage .h {
    font-weight: 800;
  }

  .passage .fine {
    color: ${LITERACY_COLORS.sub};
    font-size: 11.5px;
  }

  .passage .mid {
    font-weight: 700;
    text-align: center;
  }

  .wm {
    position: absolute;
    right: 8px;
    bottom: 4px;

    color: ${LITERACY_COLORS.watermark};
    font: 800 10px ${LITERACY_FONTS.head};
  }

  .bubble {
    margin-top: 8px;
    padding: 8px 12px;
    border: 1.5px solid ${LITERACY_COLORS.ink};

    font-size: 13px;
    line-height: 1.7;
  }
`;

const ChoiceList = styled.ul`
  margin: 0;
  padding: 0;

  display: grid;
  gap: 4px;

  list-style: none;
`;

const ChoiceItem = styled.li``;

const Mark = styled.span<{ isPicked: boolean }>`
  position: relative;
  font-size: 16px;

  &::after {
    position: absolute;
    top: 1px;
    left: -3px;
    width: 21px;
    height: 21px;
    border: 2.2px solid ${LITERACY_COLORS.stamp};
    border-radius: 50% 46% 52% 44%;

    display: ${({ isPicked }) => (isPicked ? 'block' : 'none')};

    animation: ${PEN_CIRCLE} 0.22s ease-out;

    content: '';
    transform: rotate(-10deg);
  }
`;

const ChoiceText = styled.span``;

const ChoiceButton = styled.button`
  width: 100%;
  margin: 0;
  border: 0;

  display: grid;
  gap: 6px;

  background: transparent;
  color: inherit;
  font: 400 14px/1.6 ${LITERACY_FONTS.serif};
  text-align: left;

  appearance: none;

  box-sizing: border-box;

  cursor: pointer;
  grid-template-columns: 24px 1fr;
  word-break: keep-all;

  &[aria-pressed='true'] {
    color: ${LITERACY_COLORS.stamp};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryBomBom};
    outline-offset: 2px;
  }
`;
