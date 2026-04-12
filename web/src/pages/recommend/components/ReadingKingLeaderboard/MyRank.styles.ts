import styled from '@emotion/styled';

export const Container = styled.section`
  padding: 16px;
  border-radius: 16px;

  display: flex;
  gap: 12px;
  flex-direction: column;

  background-color: ${({ theme }) => `${theme.colors.primary}10`};
`;

export const MyRankInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const NameWrapper = styled.div`
  height: 36px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const MyRankLabel = styled.div`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body2};
`;

export const MyRankValue = styled.div`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

export const MyReadValue = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.heading5};
`;

export const ProgressBox = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
`;

export const ProgressLabel = styled.div`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
`;
