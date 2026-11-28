import styled from '@emotion/styled';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';

const PaperHeader = () => {
  return (
    <Container>
      <Caption>제1회 봄봄 문해력 평가 문제지</Caption>
      <Subject>읽기 영역</Subject>
      <Examinee>
        <ExamineeLabel>성명</ExamineeLabel>
        <ExamineeBlank />
        <ExamineeLabel>수험번호</ExamineeLabel>
        <ExamineeBlank />
      </Examinee>
    </Container>
  );
};

export default PaperHeader;

const Container = styled.div`
  padding-bottom: 4cqw;
  border-bottom: 3px double ${LITERACY_COLORS.ink};

  display: grid;
  gap: 2.4cqw;
  justify-items: center;

  text-align: center;
`;

const Caption = styled.small`
  font: 700 2.8cqw ${LITERACY_FONTS.head};
  letter-spacing: 0.04em;
`;

const Subject = styled.span`
  padding: 1cqw 3cqw 1.4cqw 6cqw;
  border: 2px solid ${LITERACY_COLORS.ink};

  font: 700 7.2cqw ${LITERACY_FONTS.head};
  letter-spacing: 0.3em;
`;

const Examinee = styled.div`
  width: 100%;
  border: 1.5px solid ${LITERACY_COLORS.ink};

  display: grid;

  font: 700 2.8cqw ${LITERACY_FONTS.head};

  grid-template-columns: auto 1fr auto 1fr;
`;

const ExamineeLabel = styled.span`
  padding: 1.4cqw;
  border-right: 1.5px solid ${LITERACY_COLORS.ink};

  background: ${LITERACY_COLORS.paperLabel};
`;

const ExamineeBlank = styled.span`
  padding: 1.4cqw;

  &:not(:last-child) {
    border-right: 1.5px solid ${LITERACY_COLORS.ink};
  }
`;
