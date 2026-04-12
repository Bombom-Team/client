import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { getDday } from '../../utils/date';
import Flex from '@/components/Flex/Flex';
import Text from '@/components/Text';
import type { ComponentProps } from 'react';
import PersonIcon from '#/assets/svg/person.svg';

export const Title = (props: ComponentProps<typeof Text>) => (
  <Text as="h3" font="heading5" color="textPrimary" {...props} />
);

export const Tag = styled.span`
  padding: 0.25rem 0.625rem;
  border-radius: 62.4375rem;

  align-self: flex-start;

  background-color: ${({ theme }) => `${theme.colors.primaryLight}40`};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body3};
  font-weight: 600;
`;

export const Applicant = (props: ComponentProps<typeof Text>) => (
  <ApplicantContainer gap={2} align="center">
    <PersonIcon width={14} height={14} color={theme.colors.textSecondary} />
    <Text font="body3" color="textSecondary" {...props} />
  </ApplicantContainer>
);

const ApplicantContainer = styled(Flex)`
  padding: 0.25rem 0.5rem;
  border-radius: 62.4375rem;

  background-color: ${({ theme }) => `${theme.colors.stroke}33`};
`;

interface DDayProps extends ComponentProps<typeof Text> {
  startDate: string;
}

export const DDay = ({ startDate, ...props }: DDayProps) => {
  const dday = getDday(startDate);

  return (
    <Text font="body2" color="primary" {...props}>
      D{dday}
    </Text>
  );
};

export const CardDetailButton = styled.button`
  border: none;

  align-self: flex-end;

  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;
