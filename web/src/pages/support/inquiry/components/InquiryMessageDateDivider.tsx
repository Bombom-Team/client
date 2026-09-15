import styled from '@emotion/styled';
import { formatDateToKorean } from '@/utils/date';

interface InquiryMessageDateDividerProps {
  date: Date;
}

const InquiryMessageDateDivider = ({
  date,
}: InquiryMessageDateDividerProps) => {
  return <DateDivider>{formatDateToKorean(date)}</DateDivider>;
};

export default InquiryMessageDateDivider;

const DateDivider = styled.div`
  margin: 8px 0;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t2Regular};
  text-align: center;
`;
