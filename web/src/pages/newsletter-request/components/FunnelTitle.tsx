import styled from '@emotion/styled';
import type { ReactNode } from 'react';
import ClockIcon from '#/assets/svg/clock.svg';

interface FunnelTitleProps {
  title: ReactNode;
  description?: ReactNode;
  showTimePromise?: boolean;
}

const FunnelTitle = ({
  title,
  description,
  showTimePromise = false,
}: FunnelTitleProps) => {
  return (
    <Container>
      {showTimePromise && (
        <TimePromiseBox>
          <ClockIcon width={14} height={14} />
          질문 3개, 1분이면 끝나요
        </TimePromiseBox>
      )}
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
    </Container>
  );
};

export default FunnelTitle;

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const TimePromiseBox = styled.span`
  padding: 4px 8px;
  border-radius: 8px;

  display: inline-flex;
  gap: 4px;
  align-items: center;
  align-self: flex-start;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ theme }) => theme.fonts.t3Bold};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};

  text-wrap: balance;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
