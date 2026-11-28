import styled from '@emotion/styled';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { addWatermark } from '../utils/addWatermark';
import type { LiteracyQuestion } from '../types/literacyQuiz';
import type { PropsWithChildren, ReactNode, Ref } from 'react';

interface PaperQuestionProps {
  index: number;
  question: LiteracyQuestion;
  gradeMark?: ReactNode;
  questionRef?: Ref<HTMLElement>;
}

// 휴대폰 시험지의 한 문항(발문·지문). 보기와 해설은 children으로 받는다.
// 발문·지문 HTML은 저장소의 정적 문항 데이터(constants/questions.ts)만 넣는다.
const PaperQuestion = ({
  index,
  question,
  gradeMark,
  questionRef,
  children,
}: PropsWithChildren<PaperQuestionProps>) => {
  return (
    <Container ref={questionRef} aria-label={`${index + 1}번 문항`}>
      {gradeMark}
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
      {children}
    </Container>
  );
};

export default PaperQuestion;

const Container = styled.section`
  position: relative;

  display: grid;
  gap: 3cqw;

  scroll-margin-top: 4cqw;

  u.k {
    border-bottom: 1.5px solid currentcolor;
    text-decoration: none;
  }
`;

const Stem = styled.p`
  margin: 0;
  padding-left: 5cqw;

  font: 700 max(14px, 3.9cqw) / 1.65 ${LITERACY_FONTS.serif};
  text-indent: -5cqw;

  word-break: keep-all;
`;

const StemText = styled.span``;

const Point = styled.span`
  font: 400 3cqw ${LITERACY_FONTS.serif};
  white-space: nowrap;
`;

const MultiNote = styled.p`
  margin: -1.6cqw 0 0 5cqw;

  color: ${LITERACY_COLORS.brandDeep};
  font: 700 2.8cqw ${LITERACY_FONTS.head};
`;

const Passage = styled.div`
  .passage {
    position: relative;
    padding: 3.4cqw 3.6cqw 5.6cqw;
    border: 1.5px solid ${LITERACY_COLORS.ink};

    background: ${({ theme }) => theme.colors.white};
    font-size: max(12.5px, 3.4cqw);
    line-height: 1.85;

    word-break: keep-all;
  }

  .passage p {
    margin: 0 0 1.4cqw;
  }

  .passage p:last-child {
    margin: 0;
  }

  .passage .h {
    margin-bottom: 0.4cqw;
    font-weight: 800;
  }

  .passage ul {
    margin: 0 0 1.4cqw;
    padding-left: 4.4cqw;

    list-style: disc;
  }

  .passage .fine {
    font-size: max(11px, 2.8cqw);
    opacity: 0.75;
  }

  .passage.law p {
    padding-left: 3.4cqw;
    text-indent: -3.4cqw;
  }

  .passage.law .mid {
    padding: 0;

    font-weight: 700;
    text-align: center;
    text-indent: 0;
  }

  .wm {
    position: absolute;
    right: 2.4cqw;
    bottom: 1.4cqw;

    color: ${LITERACY_COLORS.watermark};
    font: 800 2.4cqw ${LITERACY_FONTS.head};
  }

  .bubble {
    margin: 3cqw auto 0;
    padding: 2.6cqw 3cqw;
    border: 1.5px solid ${LITERACY_COLORS.ink};

    font-size: max(12.5px, 3.4cqw);
    line-height: 1.7;
  }
`;
