import styled from '@emotion/styled';
import { CHOICE_MARKS } from '../constants/exam';
import { PEN_CIRCLE } from '../constants/keyframes';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';

interface ChoiceButtonsProps {
  questionNumber: number;
  choices: string[];
  picked: number[];
  onPick: (choice: number) => void;
}

const ChoiceButtons = ({
  questionNumber,
  choices,
  picked,
  onPick,
}: ChoiceButtonsProps) => {
  return (
    <Container aria-label={`${questionNumber}번 보기`}>
      {choices.map((choice, index) => {
        const choiceNumber = index + 1;
        const isPicked = picked.includes(choiceNumber);
        return (
          <ChoiceItem key={choice}>
            <ChoiceButton
              type="button"
              aria-pressed={isPicked}
              onClick={() => onPick(choiceNumber)}
            >
              <Mark isPicked={isPicked}>{CHOICE_MARKS[index]}</Mark>
              <ChoiceText>{choice}</ChoiceText>
            </ChoiceButton>
          </ChoiceItem>
        );
      })}
    </Container>
  );
};

export default ChoiceButtons;

const Container = styled.ul`
  margin: 0;
  padding: 0;

  display: grid;
  gap: 1.6cqw;

  list-style: none;
`;

const ChoiceItem = styled.li``;

const Mark = styled.span<{ isPicked: boolean }>`
  position: relative;
  width: 7cqw;
  height: 7cqw;

  display: grid;

  font: 400 4.6cqw/1 ${LITERACY_FONTS.serif};

  place-items: center;

  &::after {
    position: absolute;
    border: 0.7cqw solid ${LITERACY_COLORS.stamp};
    border-radius: 50% 46% 52% 44%;

    display: ${({ isPicked }) => (isPicked ? 'block' : 'none')};

    animation: ${PEN_CIRCLE} 0.22s ease-out;

    content: '';
    inset: -0.4cqw -0.8cqw -0.2cqw -0.4cqw;
    transform: rotate(-10deg);
  }
`;

const ChoiceText = styled.span``;

const ChoiceButton = styled.button`
  width: 100%;
  margin: 0;
  padding: 0.6cqw 0;
  border: 0;

  display: grid;
  gap: 2cqw;
  align-items: start;

  background: transparent;
  color: inherit;
  font: 400 max(13px, 3.6cqw) / 1.65 ${LITERACY_FONTS.serif};
  text-align: left;

  appearance: none;

  box-sizing: border-box;

  cursor: pointer;
  grid-template-columns: 7cqw minmax(0, 1fr);
  word-break: keep-all;

  &[aria-pressed='true'] {
    color: ${LITERACY_COLORS.stamp};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryBomBom};
    outline-offset: 2px;
    border-radius: 2cqw;
  }
`;
