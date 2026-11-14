import styled from '@emotion/styled';
import { formatDateToKorean } from '@/utils/date';

interface InquiryMessageDateDividerProps {
  date: Date;
}

const InquiryMessageDateDivider = ({
  date,
}: InquiryMessageDateDividerProps) => {
  return (
    <Container>
      <DateLabel>{formatDateToKorean(date)}</DateLabel>
    </Container>
  );
};

export default InquiryMessageDateDivider;

const Container = styled.div`
  margin: 4px 0;

  display: flex;
  justify-content: center;
`;

const DateLabel = styled.span`
  padding: 4px 12px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 999px;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t2Regular};
`;
